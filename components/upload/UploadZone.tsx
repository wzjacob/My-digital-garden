"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, FileText, Image, Video } from "lucide-react";

type UploadMode = "article" | "media";

interface UploadZoneProps {
  mode: UploadMode;
  category: string;
  onUpload: (formData: FormData) => Promise<{ ok: boolean; message: string; path?: string }>;
  onSuccess?: (result: { ok: boolean; message: string; path?: string }) => void;
  className?: string;
}

const ACCEPT = {
  article: ".md,.mdx",
  media: "image/png,image/jpeg,image/gif,image/webp,image/svg+xml,video/mp4,video/webm,video/ogg",
};

export function UploadZone({
  mode,
  category,
  onUpload,
  onSuccess,
  className,
}: UploadZoneProps) {
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      setLoading(true);
      setMessage(null);
      let lastResult = { ok: false, message: "" };
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData();
        fd.set("file", files[i]);
        lastResult = await onUpload(fd);
        if (!lastResult.ok) {
          setMessage({ type: "err", text: `${files[i].name}: ${lastResult.message}` });
          setLoading(false);
          return;
        }
      }
      setMessage({
        type: "ok",
        text: files.length > 1 ? `成功上传 ${files.length} 个文件` : lastResult.message,
      });
      onSuccess?.(lastResult);
      setLoading(false);
    },
    [onUpload, onSuccess]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDrag(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDrag(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDrag(false);
    handleFiles(e.dataTransfer.files);
  };
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const Icon = mode === "article" ? FileText : mode === "media" ? Image : Upload;
  const label =
    mode === "article"
      ? "拖拽或点击上传 .md / .mdx 文章"
      : "拖拽或点击上传图片、视频";

  return (
    <div className={cn("space-y-2", className)}>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all",
          drag ? "border-foreground/50 bg-accent scale-[1.01]" : "border-muted-foreground/30 hover:border-foreground/30",
          loading && "pointer-events-none opacity-70"
        )}
      >
        <input
          type="file"
          accept={ACCEPT[mode]}
          multiple
          onChange={onInputChange}
          disabled={loading}
          className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
        />
        <div className="flex flex-col items-center justify-center gap-3 py-10 px-6">
          {loading ? (
            <div className="h-12 w-12 rounded-full border-2 border-foreground/30 border-t-foreground animate-spin" />
          ) : (
            <Icon className="h-12 w-12 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground text-center max-w-xs">{label}</p>
          <p className="text-xs text-muted-foreground/70">
            支持批量上传 · 分类: {category}
          </p>
        </div>
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
    </div>
  );
}
