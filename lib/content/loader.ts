import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileSlugToKey, keyToFileSlug } from "./keys";
import type { Post, PostFrontmatter } from "./types";
import type { CategorySlug } from "@/lib/constants";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

function getAllMdxPaths(dir: string, basePath = ""): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const paths: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== "_drafts") {
        paths.push(...getAllMdxPaths(fullPath, relativePath));
      }
    } else if (entry.name.endsWith(".mdx")) {
      const slug = relativePath.replace(/\.mdx$/, "").replace(/\\/g, "/");
      paths.push(slug);
    }
  }

  return paths;
}

function getCategoryFromPath(slug: string): CategorySlug | null {
  const parts = slug.split("/");
  const first = parts[0];
  const valid: CategorySlug[] = ["digital", "herb", "metaphysics", "hardware", "journey"];
  return valid.includes(first as CategorySlug) ? (first as CategorySlug) : null;
}

export function getAllPostSlugs(): string[] {
  const fullDir = path.join(POSTS_DIR);
  if (!fs.existsSync(fullDir)) return [];
  return getAllMdxPaths(fullDir);
}

export function getPostBySlug(slug: string): Post | null {
  const segments = slug.replace(/\\/g, "/").split("/").filter(Boolean);
  const fullPath = path.join(POSTS_DIR, ...segments) + ".mdx";
  if (fs.existsSync(fullPath)) {
    const post = loadPostFromFile(slug, fullPath);
    if (post && post.slug === slug) return post;
  }
  const all = getAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

function loadPostFromFile(fileSlug: string, fullPath: string, includeDrafts = false): Post | null {
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as PostFrontmatter;

  if (frontmatter.draft && !includeDrafts) return null;

  const date = frontmatter.date ? String(frontmatter.date).trim() : new Date().toISOString().slice(0, 10);
  const urlSlug = frontmatter.slug
    ? `${frontmatter.category}/${String(frontmatter.slug).trim()}`.replace(/\/+/g, "/")
    : fileSlug;

  return {
    ...frontmatter,
    date,
    slug: urlSlug,
    content,
  };
}

export function getAllPosts(): Post[] {
  const slugs = getAllPostSlugs();
  const posts: Post[] = [];

  for (const fileSlug of slugs) {
    const segments = fileSlug.split("/").filter(Boolean);
    const fullPath = path.join(POSTS_DIR, ...segments) + ".mdx";
    const post = loadPostFromFile(fileSlug, fullPath);
    if (post) posts.push(post);
  }

  return posts.sort((a, b) => {
    const ta = new Date(a.date || 0).getTime();
    const tb = new Date(b.date || 0).getTime();
    return tb - ta;
  });
}

/** 管理后台用：文章 + 文件路径 + Base64 键（用于编辑链接，避免 URL 编码问题） */
export interface ManagedPost extends Post {
  fileSlug: string;
  fileKey: string;
}

/** 获取所有文章（含草稿），用于管理后台 */
export function getAllPostsIncludingDrafts(): ManagedPost[] {
  const slugs = getAllPostSlugs();
  const posts: ManagedPost[] = [];

  for (const fileSlug of slugs) {
    const segments = fileSlug.split("/").filter(Boolean);
    const fullPath = path.join(POSTS_DIR, ...segments) + ".mdx";
    const post = loadPostFromFile(fileSlug, fullPath, true);
    if (post) posts.push({ ...post, fileSlug, fileKey: fileSlugToKey(fileSlug) });
  }

  return posts.sort((a, b) => {
    const ta = new Date(a.date || 0).getTime();
    const tb = new Date(b.date || 0).getTime();
    return tb - ta;
  });
}

/** 按文件路径获取文章（含草稿），用于编辑 */
export function getPostByFileSlug(fileSlug: string): Post | null {
  const normalized = fileSlug.replace(/\\/g, "/").trim();
  if (!normalized) return null;
  const segments = normalized.split("/").filter(Boolean);
  const fullPath = path.join(POSTS_DIR, ...segments) + ".mdx";
  if (!fs.existsSync(fullPath)) return null;
  return loadPostFromFile(normalized, fullPath, true);
}

/** 按 Base64 文件键获取文章，用于编辑页（避免 URL 编码问题） */
export function getPostByFileKey(key: string): (Post & { fileSlug: string }) | null {
  const fileSlug = keyToFileSlug(key);
  if (!fileSlug) return null;
  const post = getPostByFileSlug(fileSlug);
  if (!post) return null;
  return { ...post, fileSlug };
}

export function getPostsByCategory(category: CategorySlug): Post[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => p.tags?.includes(tag));
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const set = new Set<string>();
  posts.forEach((p) => p.tags?.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}
