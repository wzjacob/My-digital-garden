import { notFound } from "next/navigation";
import { getPostsByCategory } from "@/lib/content/loader";
import { getCategoryInfo, getAllCategorySlugs } from "@/lib/content/taxonomy";
import { PostCard } from "@/components/cards/PostCard";
import { Breadcrumb } from "@/components/taxonomy/Breadcrumb";
import type { CategorySlug } from "@/lib/constants";

export async function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const info = getCategoryInfo(slug as CategorySlug);
  if (!info) return {};
  return {
    title: info.name,
    description: info.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const info = getCategoryInfo(slug as CategorySlug);
  if (!info) notFound();

  const posts = getPostsByCategory(slug as CategorySlug);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Breadcrumb
          items={[
            { href: "/", label: "首页" },
            { href: `/category/${slug}/`, label: info.name },
          ]}
        />

        <header className="mb-12 mt-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {info.name}
          </h1>
          <p className="mt-2 text-muted-foreground">{info.description}</p>
          <p className="mt-2 text-sm text-muted-foreground">{posts.length} 篇</p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.slug} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <PostCard post={post} />
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-muted-foreground py-12 text-center">
            该分类下暂无文章
          </p>
        )}
      </div>
    </div>
  );
}
