"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { uploadArticle, type ArticleFrontmatterForm } from "@/lib/actions/upload";
import type { CategorySlug } from "@/lib/constants";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type Categories = typeof import("@/lib/constants").CATEGORIES;

function slugify(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "untitled";
}

/** 简单的 YAML frontmatter 解析，避免在客户端使用 gray-matter */
function parseFrontmatter(text: string): { data: Record<string, unknown>; content: string } {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: text };
  const [, yaml, content] = match;
  const data: Record<string, unknown> = {};
  if (yaml) {
    for (const line of yaml.split(/\r?\n/)) {
      const m = line.match(/^([^:#]+):\s*(.*)$/);
      if (m) {
        const key = m[1].trim();
        let val: unknown = m[2].trim();
        if (val === "true") val = true;
        else if (val === "false") val = false;
        else if (typeof val === "string" && val.startsWith("[") && val.endsWith("]")) {
          val = val.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, ""));
        }
        data[key] = val;
      }
    }
  }
  return { data, content: content || "" };
}

export function ArticleUploadFlow({
  categories,
  category: selectedCategory,
}: {
  categories: Categories;
  category: CategorySlug;
}) {
  const [step, setStep] = useState<"drop" | "form">("drop");
  const [file, setFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [meta, setMeta] = useState<ArticleFrontmatterForm>({
    title: "",
    category: selectedCategory,
    slug: "",
    date: new Date().toISOString().slice(0, 10),
    description: "",
    tags: "",
    draft: false,
  });

  const handleFileSelected = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      const arr = Array.from(files);
      const mdFile = arr.find((f) => {
        const n = f.name.toLowerCase();
        return n.endsWith(".md") || n.endsWith(".mdx");
      });
      const imgs = arr.filter((f) => {
        const n = f.name.toLowerCase();
        return /\.(png|jpg|jpeg|gif|webp|svg)$/.test(n);
      });
      if (!mdFile) {
        setMessage({ type: "err", text: "请选择 .md / .mdx 文章文件" });
        return;
      }
      setMessage(null);
      setFile(mdFile);
      setImageFiles(imgs);
      try {
        const text = await mdFile.text();
        const { data } = parseFrontmatter(text);
        const d = data;
        const cat = ["digital", "herb", "metaphysics", "hardware", "journey"].includes(
          String(d?.category ?? "")
        )
          ? (d.category as CategorySlug)
          : selectedCategory;
        const title = String(d?.title ?? "").trim() || slugify(mdFile.name.replace(/\.[^.]+$/, ""));
        const slugVal = String(d?.slug ?? "").trim() || slugify(title);
        setMeta({
          title,
          category: cat,
          slug: slugVal,
          date: String(d?.date ?? new Date().toISOString().slice(0, 10)).slice(0, 10),
          description: String(d?.description ?? "").trim(),
          tags: Array.isArray(d?.tags) ? (d.tags as string[]).join(", ") : String(d?.tags ?? ""),
          draft: Boolean(d?.draft),
        });
        setStep("form");
      } catch {
        setMeta((m) => ({
          ...m,
          title: slugify(mdFile.name.replace(/\.[^.]+$/, "")),
          slug: slugify(mdFile.name.replace(/\.[^.]+$/, "")),
          category: selectedCategory,
          date: new Date().toISOString().slice(0, 10),
        }));
        setStep("form");
      }
    },
    [selectedCategory]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelected(e.dataTransfer.files);
  };
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelected(e.target.files);
    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setMessage(null);
    const formData = new FormData();
    formData.set("file", file);
    imageFiles.forEach((img) => formData.append("images", img));
    const result = await uploadArticle(formData, meta);
    setMessage({ type: result.ok ? "ok" : "err", text: result.message });
    if (result.ok) {
      setFile(null);
      setImageFiles([]);
      setStep("drop");
      setMeta({
        title: "",
        category: selectedCategory,
        slug: "",
        date: new Date().toISOString().slice(0, 10),
        description: "",
        tags: "",
        draft: false,
      });
    }
    setLoading(false);
  };

  const syncSlugFromTitle = () => {
    setMeta((m) => ({ ...m, slug: slugify(m.title) || "untitled" }));
  };

  const addMoreImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fl = e.target.files;
    if (fl?.length) setImageFiles((prev) => [...prev, ...Array.from(fl)]);
    e.target.value = "";
  };

  if (step === "form" && file) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-xl border border-border bg-muted/30">
        <p className="text-sm text-muted-foreground">已选择文章: {file.name}</p>
        {imageFiles.length > 0 && (
          <p className="text-sm text-green-600 dark:text-green-400">
            已选 {imageFiles.length} 张图片，将自动替换文章中的本地路径
          </p>
        )}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">标题 *</label>
          <input
            type="text"
            value={meta.title}
            onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
            placeholder="文章标题"
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-1.5">URL 短名（slug）*</label>
            <input
              type="text"
              value={meta.slug}
              onChange={(e) => setMeta((m) => ({ ...m, slug: e.target.value }))}
              placeholder="用于 /post/分类/slug/ 的路径"
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={syncSlugFromTitle} className="mt-7">
            从标题生成
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">分类 *</label>
            <select
              value={meta.category}
              onChange={(e) => setMeta((m) => ({ ...m, category: e.target.value as CategorySlug }))}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {(Object.keys(categories) as CategorySlug[]).map((k) => (
                <option key={k} value={k}>
                  {categories[k].name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">日期</label>
            <input
              type="date"
              value={meta.date}
              onChange={(e) => setMeta((m) => ({ ...m, date: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">描述（可选）</label>
          <input
            type="text"
            value={meta.description}
            onChange={(e) => setMeta((m) => ({ ...m, description: e.target.value }))}
            placeholder="简短摘要"
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="block text-sm font-medium text-foreground w-full">
            文章内嵌图片（如有本地路径 C:\\... 请同时选择对应图片）
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={addMoreImages}
            className="text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded file:border file:border-input file:bg-muted"
          />
          {imageFiles.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {imageFiles.map((f) => f.name).join(", ")}
            </span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">标签（逗号分隔）</label>
          <input
            type="text"
            value={meta.tags}
            onChange={(e) => setMeta((m) => ({ ...m, tags: e.target.value }))}
            placeholder="MDM, RPA, 信息化"
            className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="draft"
            checked={meta.draft}
            onChange={(e) => setMeta((m) => ({ ...m, draft: e.target.checked }))}
            className="rounded border-input"
          />
          <label htmlFor="draft" className="text-sm text-muted-foreground">
            保存为草稿（不在列表中显示）
          </label>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={() => { setStep("drop"); setFile(null); setImageFiles([]); }}>
            取消
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "上传中…" : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                确认并保存
              </>
            )}
          </Button>
        </div>
        {message && (
          <p className={cn("text-sm", message.type === "ok" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
            {message.text}
          </p>
        )}
      </form>
    );
  }

  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="relative rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-foreground/30 transition-all"
    >
      <input
        type="file"
        accept=".md,.mdx,image/*"
        multiple
        onChange={onInputChange}
        className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
      />
      <div className="flex flex-col items-center justify-center gap-3 py-10 px-6">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center">选择 .md / .mdx 文件，填写 YAML 元数据后保存</p>
        <p className="text-xs text-muted-foreground/70">支持 Typora 导出 · 可同时选择文章和图片，自动替换本地路径</p>
      </div>
    </div>
  );
}
