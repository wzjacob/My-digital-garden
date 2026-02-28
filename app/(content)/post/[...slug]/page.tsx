import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug, getAllPosts } from "@/lib/content/loader";
import { getCategoryInfo } from "@/lib/content/taxonomy";
import { MDXRenderer } from "@/components/mdx/MDXRenderer";
import { formatDate } from "@/lib/utils";
import { Breadcrumb } from "@/components/taxonomy/Breadcrumb";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((p) => ({ slug: p.slug.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const fullSlug = slug.join("/");
  const post = getPostBySlug(fullSlug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description ?? undefined,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const fullSlug = slug.join("/");
  const post = getPostBySlug(fullSlug);

  if (!post) notFound();

  const categoryInfo = getCategoryInfo(post.category);

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>

        <Breadcrumb
          items={[
            { href: "/", label: "首页" },
            { href: `/category/${post.category}/`, label: categoryInfo?.name ?? post.category },
            { href: `/post/${post.slug.split("/").map(encodeURIComponent).join("/")}/`, label: post.title },
          ]}
        />

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <Link
              href={`/category/${post.category}/`}
              className="rounded-full bg-muted px-3 py-1 hover:bg-accent"
            >
              {categoryInfo?.name ?? post.category}
            </Link>
            {post.tags?.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}/`}
                className="rounded-full bg-muted px-3 py-1 hover:bg-accent"
              >
                {tag}
              </Link>
            ))}
          </div>
        </header>

        <div className="prose prose-cn dark:prose-invert [&_h2]:mt-10 [&_h2]:text-xl [&_h3]:mt-6 [&_h3]:text-lg [&_img]:rounded-lg [&_img]:shadow-md">
          <MDXRenderer source={post.content} />
        </div>
      </div>
    </article>
  );
}
