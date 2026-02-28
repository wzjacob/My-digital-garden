import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types/content";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  variant?: "default" | "compact";
  className?: string;
}

export function PostCard({ post, variant = "default", className }: PostCardProps) {
  return (
    <Link
      href={`/post/${post.slug.split("/").map(encodeURIComponent).join("/")}/`}
      className={cn(
        "block rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md dark:hover:border-zinc-600",
        className
      )}
    >
      <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-accent">
        {post.title}
      </h3>
      {post.description && (
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {post.description}
        </p>
      )}
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        {post.tags?.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-muted px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
