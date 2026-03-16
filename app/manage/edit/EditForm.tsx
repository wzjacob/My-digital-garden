"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateArticle, replaceLocalImagesWithUpload, type ArticleFrontmatterForm } from "@/lib/actions/upload";
import type { Post } from "@/lib/content/types";
import type { CategorySlug } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Categories = typeof import("@/lib/constants").CATEGORIES;

function slugify(s: string): string {
  return s
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "untitled";
}

export function EditForm({
  post,
  fileSlug,
  categories,
}: {
  post: Post;
  fileSlug: string;
  categories: Categories;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [meta, setMeta] = useState<ArticleFrontmatterForm>({
    title: post.title,
    category: post.category as CategorySlug,
    slug: post.slug.split("/").slice(1).join("/") || slugify(post.title),
    date: post.date || new Date().toISOString().slice(0, 10),
    description: post.description || "",
    tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
    draft: post.draft ?? false,
  });
  const [content, setContent] = useState(post.content);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const hasLocalPaths = /!\[([^\]]*)\]\([^)]*[:\\]/.test(content);

  const handleReplaceImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append("images", f));
    const res = await replaceLocalImagesWithUpload(content, fd);
    if (res.ok && res.content) {
      setContent(res.content);
    }
    e.target.value = "";
  };

  const syncSlugFromTitle = () => {
    setMeta((m) => ({ ...m, slug: slugify(m.title) || "untitled" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const result = await updateArticle(fileSlug, meta, content);
    setMessage({ type: result.ok ? "ok" : "err", text: result.message });
    setLoading(false);
    if (result.ok) {
      router.refresh();
      router.push("/manage");
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">标题 *</label>
        <input
          type="text"
          value={meta.title}
          onChange={(e) => setMeta((m) => ({ ...m, title: e.target.value }))}
          className={inputClass}
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
            className={inputClass}
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
            className={inputClass}
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
            className={inputClass}
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
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">标签（逗号分隔）</label>
        <input
          type="text"
          value={meta.tags}
          onChange={(e) => setMeta((m) => ({ ...m, tags: e.target.value }))}
          placeholder="MDM, RPA"
          className={inputClass}
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
          草稿（不在列表中显示）
        </label>
      </div>
      {hasLocalPaths && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">
            检测到本地图片路径（如 C:\\...），请上传对应图片并自动替换：
          </p>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleReplaceImages}
            className="hidden"
          />
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => imageInputRef.current?.click()}
          >
            上传图片并替换本地路径
          </Button>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">正文内容 *</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          className={cn(inputClass, "font-mono text-sm resize-y")}
          placeholder="Markdown / MDX 正文"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "保存中…" : "保存修改"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          取消
        </Button>
      </div>
      {message && (
        <p
          className={cn(
            "text-sm",
            message.type === "ok" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
