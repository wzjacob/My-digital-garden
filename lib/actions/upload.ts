"use server";

import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import matter from "gray-matter";
import type { CategorySlug } from "@/lib/constants";
const POSTS_DIR = path.join(process.cwd(), "content/posts");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const MEDIA_DIR = "media";

const ARTICLE_EXT = [".md", ".mdx"];
const IMAGE_EXT = [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"];
const VIDEO_EXT = [".mp4", ".webm", ".ogg", ".mov", ".avi"];

function getCategoryFromFrontmatter(data: Record<string, unknown>): CategorySlug | null {
  const cat = data?.category;
  const valid: CategorySlug[] = ["digital", "herb", "metaphysics", "hardware", "journey"];
  return typeof cat === "string" && valid.includes(cat as CategorySlug)
    ? (cat as CategorySlug)
    : null;
}

function slugify(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "untitled";
}

function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*]/g, "-");
}

/** 移除 undefined，避免 gray-matter / js-yaml 序列化时报错 */
function sanitizeFrontmatter<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Record<string, unknown>;
}

/** 判断是否为需要替换的本地路径（Windows/Mac 绝对路径、file://） */
function isLocalImagePath(src: string): boolean {
  if (!src?.trim()) return false;
  const s = src.trim();
  if (/^https?:\/\//i.test(s)) return false;
  if (/^\//.test(s) && s.startsWith("/media/")) return false;
  return /[:\\]/.test(s) || /^file:\/\//i.test(s) || /^\/Users\//.test(s);
}

/** 从 Markdown 内容中提取图片的 src，返回 [{alt, src, full}] */
function extractImageRefs(content: string): { alt: string; src: string; full: string }[] {
  const re = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const out: { alt: string; src: string; full: string }[] = [];
  let m;
  while ((m = re.exec(content)) !== null) {
    out.push({ alt: m[1], src: m[2].trim(), full: m[0] });
  }
  return out;
}

/** 将内容中的本地图片路径替换为上传后的 Web URL */
async function rewriteLocalImages(
  content: string,
  imageFiles: File[]
): Promise<{ content: string; pathMap: Record<string, string> }> {
  const pathMap: Record<string, string> = {};
  const byBasename = new Map<string, File>();
  for (const f of imageFiles) {
    const base = path.basename(f.name);
    if (!byBasename.has(base)) byBasename.set(base, f);
  }

  const refs = extractImageRefs(content);
  let result = content;

  for (const ref of refs) {
    if (!isLocalImagePath(ref.src)) continue;
    const base = path.basename(ref.src.replace(/\\/g, "/"));
    const file = byBasename.get(base);
    if (!file) continue;

    const yearMonth = new Date().toISOString().slice(0, 7);
    const dir = path.join(PUBLIC_DIR, MEDIA_DIR, yearMonth);
    await mkdir(dir, { recursive: true });
    const ext = path.extname(file.name).toLowerCase();
    const safeName = path.basename(file.name, ext).replace(/[<>:"/\\|?*]/g, "-") + ext;
    let fullPath = path.join(dir, safeName);
    let counter = 0;
    while (existsSync(fullPath)) {
      counter++;
      fullPath = path.join(dir, `${path.basename(safeName, ext)}-${counter}${ext}`);
    }
    const bytes = await file.arrayBuffer();
    await writeFile(fullPath, Buffer.from(bytes));
    const url = `/${path.relative(PUBLIC_DIR, fullPath).replace(/\\/g, "/")}`;
    pathMap[ref.src] = url;
  }

  for (const [oldPath, url] of Object.entries(pathMap)) {
    result = result.split(oldPath).join(url);
  }
  return { content: result, pathMap };
}

export type UploadResult = {
  ok: boolean;
  message: string;
  path?: string;
};

/** 手动指定的 frontmatter，用于上传时表单填写，优先级高于文件内容 */
export interface ArticleFrontmatterForm {
  title: string;
  category: CategorySlug;
  slug: string;
  date: string;
  description?: string;
  tags?: string;
  draft?: boolean;
}

/** 一键上传：仅需文件和分类，后台自动解析并填充 frontmatter */
export async function uploadArticleSimple(
  formData: FormData,
  category: CategorySlug
): Promise<UploadResult> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) return { ok: false, message: "未选择文件" };

    const ext = path.extname(file.name).toLowerCase();
    if (!ARTICLE_EXT.includes(ext)) {
      return { ok: false, message: `仅支持 .md / .mdx 文件` };
    }

    const bytes = await file.arrayBuffer();
    const raw = Buffer.from(bytes).toString("utf-8");
    const { data, content: bodyRaw } = matter(raw);
    let body = bodyRaw;
    const imageFiles = (formData.getAll("images") as File[]).filter((f) => f && f.size > 0);
    if (imageFiles.length > 0) {
      const { content: rewritten } = await rewriteLocalImages(body, imageFiles);
      body = rewritten;
    }

    const cat = getCategoryFromFrontmatter(data as Record<string, unknown>) ?? category;
    const titleFromFile = (data?.title as string)?.trim();
    const slugFromFile = (data?.slug as string)?.trim();
    const dateFromFile = (data?.date as string)?.toString().slice(0, 10);
    const descFromFile = (data?.description as string)?.trim();
    const tagsFromFile = data?.tags as string[] | undefined;

    const baseName = path.basename(file.name, ext);
    const title = titleFromFile || baseName;
    const slugVal = slugFromFile || slugify(title || baseName);
    const slug = slugify(slugVal);
    const date = dateFromFile || new Date().toISOString().slice(0, 10);

    const frontmatter = {
      ...data,
      title,
      description: descFromFile || (data?.description as string),
      date,
      category: cat,
      slug,
      tags: tagsFromFile?.length ? tagsFromFile : undefined,
      draft: (data?.draft as boolean) ?? false,
    };

    const dir = path.join(POSTS_DIR, cat);
    await mkdir(dir, { recursive: true });

    let finalSlug = slug;
    let fullPath = path.join(dir, `${slug}.mdx`);
    let counter = 0;
    while (existsSync(fullPath)) {
      counter++;
      finalSlug = `${slug}-${counter}`;
      fullPath = path.join(dir, `${finalSlug}.mdx`);
    }

    frontmatter.slug = finalSlug;
    const output = matter.stringify(body, sanitizeFrontmatter(frontmatter));
    await writeFile(fullPath, output, "utf-8");
    return { ok: true, message: "文章已保存", path: path.relative(process.cwd(), fullPath) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, message: `上传失败: ${msg}` };
  }
}

export async function uploadArticle(
  formData: FormData,
  meta: ArticleFrontmatterForm
): Promise<UploadResult> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) return { ok: false, message: "未选择文件" };

    const ext = path.extname(file.name).toLowerCase();
    if (!ARTICLE_EXT.includes(ext)) {
      return { ok: false, message: `仅支持 .md / .mdx 文件，当前: ${ext}` };
    }

    const bytes = await file.arrayBuffer();
    const raw = Buffer.from(bytes).toString("utf-8");
    const { data, content: bodyRaw } = matter(raw);
    let body = bodyRaw;
    const imageFiles = (formData.getAll("images") as File[]).filter((f) => f && f.size > 0);
    if (imageFiles.length > 0) {
      const { content: rewritten } = await rewriteLocalImages(body, imageFiles);
      body = rewritten;
    }

    const category = meta.category;
    const slugVal = meta.slug?.trim() || slugify(meta.title || file.name);
    const slug = slugify(slugVal);
    const date = meta.date || new Date().toISOString().slice(0, 10);
    const title = meta.title?.trim() || slug;
    const tags = meta.tags
      ? meta.tags.split(/[,，、\s]+/).map((t) => t.trim()).filter(Boolean)
      : (data?.tags as string[] | undefined);

    const frontmatter = {
      ...data,
      title,
      description: meta.description?.trim() || (data?.description as string),
      date,
      category,
      slug,
      tags: tags?.length ? tags : undefined,
      draft: meta.draft ?? false,
    };

    const dir = path.join(POSTS_DIR, category);
    await mkdir(dir, { recursive: true });

    let finalSlug = slug;
    let fileName = `${slug}.mdx`;
    let fullPath = path.join(dir, fileName);
    let counter = 0;
    while (existsSync(fullPath)) {
      counter++;
      finalSlug = `${slug}-${counter}`;
      fileName = `${finalSlug}.mdx`;
      fullPath = path.join(dir, fileName);
    }

    frontmatter.slug = finalSlug;
    const output = matter.stringify(body, sanitizeFrontmatter(frontmatter));

    await writeFile(fullPath, output, "utf-8");
    const relativePath = path.relative(process.cwd(), fullPath);
    return { ok: true, message: "文章上传成功", path: relativePath };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, message: `上传失败: ${msg}` };
  }
}

export async function uploadMedia(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get("file") as File | null;
    if (!file) return { ok: false, message: "未选择文件" };

    const ext = path.extname(file.name).toLowerCase();
    const isImage = IMAGE_EXT.includes(ext);
    const isVideo = VIDEO_EXT.includes(ext);
    if (!isImage && !isVideo) {
      return {
        ok: false,
        message: `支持的媒体: 图片 ${IMAGE_EXT.join(",")} / 视频 ${VIDEO_EXT.join(",")}`,
      };
    }

    const yearMonth = new Date().toISOString().slice(0, 7);
    const dir = path.join(PUBLIC_DIR, MEDIA_DIR, yearMonth);
    await mkdir(dir, { recursive: true });

    const safeName = sanitizeFilename(file.name);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fullPath = path.join(dir, safeName);

    let finalPath = fullPath;
    let counter = 0;
    const base = path.join(dir, path.basename(safeName, ext));
    while (existsSync(finalPath)) {
      counter++;
      finalPath = path.join(dir, `${path.basename(safeName, ext)}-${counter}${ext}`);
    }

    await writeFile(finalPath, buffer);
    const relative = path.relative(PUBLIC_DIR, finalPath).replace(/\\/g, "/");
    const url = `/${relative}`;
    return { ok: true, message: "媒体上传成功", path: url };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, message: `上传失败: ${msg}` };
  }
}

export async function createLinkPost(
  url: string,
  title: string,
  category: CategorySlug,
  description?: string
): Promise<UploadResult> {
  try {
    if (!url?.trim()) return { ok: false, message: "请输入链接地址" };
    const href = url.startsWith("http") ? url : `https://${url}`;

    let slugBase = title;
    if (!slugBase) {
      try {
        slugBase = new URL(href).hostname;
      } catch {
        slugBase = "link";
      }
    }
    const slug = slugify(slugBase);
    const date = new Date().toISOString().slice(0, 10);
    const dir = path.join(POSTS_DIR, category);
    await mkdir(dir, { recursive: true });

    const frontmatter = {
      title: title || href,
      description: description || `收藏链接: ${href}`,
      date,
      category,
      slug,
      tags: ["链接收藏"],
    };

    const body = `
收藏的链接。

🔗 [${title || href}](${href})

${description ? `\n${description}\n` : ""}
`;

    const output = matter.stringify(body, sanitizeFrontmatter(frontmatter));
    const fileName = `${slug}.mdx`;
    const fullPath = path.join(dir, fileName);

    let finalPath = fullPath;
    let counter = 0;
    while (existsSync(finalPath)) {
      counter++;
      finalPath = path.join(dir, `${slug}-${counter}.mdx`);
    }

    await writeFile(finalPath, output, "utf-8");
    const relativePath = path.relative(process.cwd(), finalPath);
    return { ok: true, message: "链接收藏已创建", path: relativePath };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, message: `创建失败: ${msg}` };
  }
}

/** 更新文章 */
export async function updateArticle(
  fileSlug: string,
  meta: ArticleFrontmatterForm,
  content: string
): Promise<UploadResult> {
  try {
    const normalized = fileSlug.replace(/\\/g, "/").trim();
    const segments = normalized.split("/").filter(Boolean);
    const fullPath = path.join(POSTS_DIR, ...segments) + ".mdx";
    if (!existsSync(fullPath)) {
      return { ok: false, message: "文章不存在" };
    }

    const tags = meta.tags
      ? meta.tags.split(/[,，、\s]+/).map((t) => t.trim()).filter(Boolean)
      : undefined;
    const slugVal = meta.slug?.trim() || slugify(meta.title || "untitled");
    const slug = slugify(slugVal);
    const date = meta.date || new Date().toISOString().slice(0, 10);
    const title = meta.title?.trim() || slug;

    const frontmatter = {
      title,
      description: meta.description?.trim() || undefined,
      date,
      category: meta.category,
      slug,
      tags: tags?.length ? tags : undefined,
      draft: meta.draft ?? false,
    };

    const output = matter.stringify(content, sanitizeFrontmatter(frontmatter));

    const dir = path.join(POSTS_DIR, meta.category);
    await mkdir(dir, { recursive: true });

    const newPath = path.join(dir, `${slug}.mdx`);
    if (newPath !== fullPath && existsSync(newPath)) {
      return { ok: false, message: `目标路径已存在: ${meta.category}/${slug}` };
    }

    if (newPath !== fullPath) {
      await writeFile(newPath, output, "utf-8");
      await unlink(fullPath);
    } else {
      await writeFile(fullPath, output, "utf-8");
    }

    const relativePath = path.relative(process.cwd(), newPath);
    return { ok: true, message: "文章已更新", path: relativePath };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, message: `更新失败: ${msg}` };
  }
}

/** 上传图片并替换内容中的本地路径（用于编辑时修复图片） */
export async function replaceLocalImagesWithUpload(
  content: string,
  formData: FormData
): Promise<{ ok: boolean; message: string; content?: string }> {
  try {
    const imageFiles = (formData.getAll("images") as File[]).filter((f) => f && f.size > 0);
    if (imageFiles.length === 0) {
      return { ok: false, message: "请选择要上传的图片" };
    }
    const { content: rewritten } = await rewriteLocalImages(content, imageFiles);
    return { ok: true, message: "图片已替换", content: rewritten };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, message: `替换失败: ${msg}` };
  }
}

/** 删除文章 */
export async function deleteArticle(fileSlug: string): Promise<UploadResult> {
  try {
    const normalized = fileSlug.replace(/\\/g, "/").trim();
    const segments = normalized.split("/").filter(Boolean);
    const fullPath = path.join(POSTS_DIR, ...segments) + ".mdx";
    if (!existsSync(fullPath)) {
      return { ok: false, message: "文章不存在" };
    }
    await unlink(fullPath);
    return { ok: true, message: "文章已删除" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, message: `删除失败: ${msg}` };
  }
}
