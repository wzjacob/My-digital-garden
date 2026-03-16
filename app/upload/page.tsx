import { UploadPageClient } from "./UploadPageClient";
import { CATEGORIES } from "@/lib/constants";

export const metadata = {
  title: "上传内容",
  description: "上传文章、媒体或收藏链接到数字花园",
};

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <header className="mb-10 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">上传内容</h1>
          <p className="mt-2 text-muted-foreground">
            支持 Typora 导出的 .md/.mdx，以及图片、视频和链接收藏
          </p>
        </div>
      </header>

      <UploadPageClient categories={CATEGORIES} />
    </div>
  );
}
