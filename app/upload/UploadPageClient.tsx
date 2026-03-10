"use client";

import { useState } from "react";
import { UploadZone } from "@/components/upload/UploadZone";
import { ArticleUploadFlow } from "@/components/upload/ArticleUploadFlow";
import { Button } from "@/components/ui/button";
import { uploadMedia, createLinkPost } from "@/lib/actions/upload";
import type { CategorySlug } from "@/lib/constants";
import { Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Categories = typeof import("@/lib/constants").CATEGORIES;

export function UploadPageClient({ categories }: { categories: Categories }) {
  const [category, setCategory] = useState<CategorySlug>("digital");
  const [activeTab, setActiveTab] = useState<"article" | "media" | "link">("article");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkDesc, setLinkDesc] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkMessage, setLinkMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const handleMediaUpload = async (formData: FormData) => {
    return uploadMedia(formData);
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkLoading(true);
    setLinkMessage(null);
    const result = await createLinkPost(linkUrl, linkTitle, category, linkDesc || undefined);
    setLinkMessage({ type: result.ok ? "ok" : "err", text: result.message });
    if (result.ok) {
      setLinkUrl("");
      setLinkTitle("");
      setLinkDesc("");
    }
    setLinkLoading(false);
  };

  const tabs = [
    { id: "article" as const, label: "文章 (.md/.mdx)" },
    { id: "media" as const, label: "图片/视频" },
    { id: "link" as const, label: "收藏链接" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
      {/* 分类选择 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">分类：</span>
        <div className="flex flex-wrap gap-1">
          {(Object.keys(categories) as CategorySlug[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setCategory(k)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm transition-colors",
                category === k
                  ? "bg-accent text-foreground"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
              )}
            >
              {categories[k].name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-1 p-1 rounded-lg bg-muted/50">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors",
              activeTab === t.id
                ? "bg-background shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 文章上传 */}
      {activeTab === "article" && (
        <ArticleUploadFlow categories={categories} category={category} />
      )}

      {/* 媒体上传 */}
      {activeTab === "media" && (
        <UploadZone
          mode="media"
          category="媒体将保存到 public/media/"
          onUpload={handleMediaUpload}
        />
      )}

      {/* 链接收藏 */}
      {activeTab === "link" && (
        <form onSubmit={handleCreateLink} className="space-y-4 p-4 rounded-xl border border-border bg-muted/30">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">链接地址 *</label>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">标题</label>
            <input
              type="text"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              placeholder="留空则使用链接域名"
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">备注（可选）</label>
            <textarea
              value={linkDesc}
              onChange={(e) => setLinkDesc(e.target.value)}
              placeholder="简要描述或感想"
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
          <Button type="submit" disabled={linkLoading} className="w-full">
            {linkLoading ? "创建中…" : (
              <>
                <Link2 className="h-4 w-4 mr-2" />
                保存链接
              </>
            )}
          </Button>
          {linkMessage && (
            <p
              className={cn(
                "text-sm",
                linkMessage.type === "ok" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}
            >
              {linkMessage.text}
            </p>
          )}
        </form>
      )}

      <p className="text-xs text-muted-foreground text-center">
        💡 上传文章时可手动填写 YAML 元数据（标题、slug、分类等），避免 404；媒体保存到 <code className="bg-muted px-1 rounded">public/media/年月/</code>，可用 <code className="bg-muted px-1 rounded">/media/2025-02/xxx.png</code> 引用。
      </p>
    </div>
  );
}
