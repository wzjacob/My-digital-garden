import { getAllPostsIncludingDrafts } from "@/lib/content/loader";
import { ManageClient } from "./ManageClient";
import { CATEGORIES } from "@/lib/constants";

export const metadata = {
  title: "内容管理",
  description: "在线管理文章：上传、编辑、删除",
};

export const dynamic = "force-dynamic";

export default function ManagePage() {
  const posts = getAllPostsIncludingDrafts();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">内容管理</h1>
          <p className="mt-2 text-muted-foreground">上传、编辑、删除文章，一站式在线管理</p>
        </div>
      </header>

      <ManageClient posts={posts} categories={CATEGORIES} />
    </div>
  );
}
