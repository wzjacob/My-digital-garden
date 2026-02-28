import { notFound } from "next/navigation";
import { getPostsByTag, getAllPosts } from "@/lib/content/loader";
import { PostCard } from "@/components/cards/PostCard";
import { Breadcrumb } from "@/components/taxonomy/Breadcrumb";

export async function generateStaticParams() {
  const posts = getAllPosts();
  const tags = new Set<string>();
  posts.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
  return Array.from(tags).map((slug) => ({ slug }));
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = decodeURIComponent(slug);
  const posts = getPostsByTag(tag);

  if (posts.length === 0) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Breadcrumb
          items={[
            { href: "/", label: "首页" },
            { href: `/tag/${slug}/`, label: `#${tag}` },
          ]}
        />

        <header className="mb-12 mt-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            # {tag}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{posts.length} 篇</p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.slug} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
