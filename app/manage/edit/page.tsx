import { notFound } from "next/navigation";
import { getPostByFileKey } from "@/lib/content/loader";
import { EditForm } from "./EditForm";
import { CATEGORIES } from "@/lib/constants";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "编辑文章",
  description: "编辑文章内容与元数据",
};

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  searchParams,
}: {
  searchParams: Promise<{ f?: string }>;
}) {
  const { f: fileKey } = await searchParams;
  if (!fileKey) notFound();

  const postWithSlug = getPostByFileKey(fileKey);
  if (!postWithSlug) notFound();

  const { fileSlug, ...post } = postWithSlug;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <Link
        href="/manage"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        返回管理
      </Link>

      <h1 className="text-2xl font-bold mb-6">编辑：{post.title}</h1>

      <EditForm post={post} fileSlug={fileSlug} categories={CATEGORIES} />
    </div>
  );
}
