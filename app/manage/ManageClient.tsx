"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteArticle, uploadArticleSimple } from "@/lib/actions/upload";
import type { ManagedPost } from "@/lib/content/loader";
import type { CategorySlug } from "@/lib/constants";
import { Pencil, Trash2, ExternalLink, Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type Categories = typeof import("@/lib/constants").CATEGORIES;

function toEditPath(fileKey: string): string {
  return `/manage/edit?f=${encodeURIComponent(fileKey)}`;
}

export function ManageClient({
  posts,
  categories,
}: {
  posts: ManagedPost[];
  categories: Categories;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [uploadCategory, setUploadCategory] = useState<CategorySlug>("digital");
  const [uploading, setUploading] = useState(false);
  const [uploadDrag, setUploadDrag] = useState(false);

  const handleDelete = async (fileSlug: string) => {
    if (!confirm("确定要删除这篇文章吗？")) return;
    setDeleting(fileSlug);
    setMessage(null);
    const result = await deleteArticle(fileSlug);
    setMessage({ type: result.ok ? "ok" : "err", text: result.message });
    setDeleting(null);
    if (result.ok) router.refresh();
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files?.[0]) return;
    const f = files[0];
    if (!f.name.toLowerCase().endsWith(".md") && !f.name.toLowerCase().endsWith(".mdx")) {
      setMessage({ type: "err", text: "仅支持 .md / .mdx 文件" });
      return;
    }
    setUploading(true);
    setMessage(null);
    const formData = new FormData();
    formData.set("file", f);
    const result = await uploadArticleSimple(formData, uploadCategory);
    setMessage({ type: result.ok ? "ok" : "err", text: result.message });
    setUploading(false);
    if (result.ok) router.refresh();
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="space-y-8">
      {/* 一键上传 */}
      <section className="rounded-xl border border-border bg-muted/20 p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload className="h-5 w-5" />
          一键上传
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          选择分类后拖入或点击上传 .md / .mdx，系统自动解析 frontmatter 并保存
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-sm mb-1.5">分类</label>
            <select
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value as CategorySlug)}
              className={inputClass + " w-48"}
            >
              {(Object.keys(categories) as CategorySlug[]).map((k) => (
                <option key={k} value={k}>{categories[k].name}</option>
              ))}
            </select>
          </div>
          <label
            htmlFor="manage-upload-input"
            className={cn(
              "flex-1 min-w-[200px] rounded-xl border-2 border-dashed py-8 px-6 text-center transition-all cursor-pointer block",
              uploadDrag ? "border-foreground/50 bg-accent" : "border-muted-foreground/30 hover:border-foreground/30",
              uploading && "pointer-events-none opacity-70"
            )}
            onDragOver={(e) => { e.preventDefault(); setUploadDrag(true); }}
            onDragLeave={() => setUploadDrag(false)}
            onDrop={(e) => { e.preventDefault(); setUploadDrag(false); handleUpload(e.dataTransfer.files); }}
          >
            <input
              id="manage-upload-input"
              type="file"
              accept=".md,.mdx"
              className="sr-only"
              onChange={(e) => { handleUpload(e.target.files); e.target.value = ""; }}
              disabled={uploading}
            />
            {uploading ? (
              <div className="h-10 w-10 mx-auto rounded-full border-2 border-foreground/30 border-t-foreground animate-spin" />
            ) : (
              <FileText className="h-10 w-10 mx-auto text-muted-foreground" />
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              {uploading ? "保存中…" : "拖拽或点击选择文件"}
            </p>
          </label>
        </div>
      </section>

      {/* 文章列表 */}
      <section>
        <h2 className="text-lg font-semibold mb-4">文章列表</h2>
        {message && (
          <p
            className={cn(
              "text-sm mb-4",
              message.type === "ok" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}
          >
            {message.text}
          </p>
        )}
        {posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-muted-foreground/30 p-12 text-center text-muted-foreground">
            <p>暂无文章，请在上方上传</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium">标题</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">分类</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">日期</th>
                  <th className="text-left px-4 py-3 font-medium">状态</th>
                  <th className="text-right px-4 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.slug} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <span className="font-medium">{post.title}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                      {categories[post.category as CategorySlug]?.name ?? post.category}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">
                      {post.date}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-xs",
                          post.draft
                            ? "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                            : "bg-green-500/20 text-green-700 dark:text-green-400"
                        )}
                      >
                        {post.draft ? "草稿" : "已发布"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/post/${post.slug.split("/").map(encodeURIComponent).join("/")}/`}
                          target="_blank"
                          rel="noopener"
                          className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="预览"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <Link
                          href={toEditPath(post.fileKey)}
                          className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="编辑"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(post.fileSlug)}
                          disabled={deleting === post.fileSlug}
                          className="p-2 rounded hover:bg-red-500/20 text-muted-foreground hover:text-red-600 disabled:opacity-50"
                          title="删除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-xs text-muted-foreground">
        💡 更多功能（媒体上传、链接收藏、自定义 frontmatter）请前往 <Link href="/upload" className="underline hover:text-foreground">上传页</Link>
      </p>
    </div>
  );
}
