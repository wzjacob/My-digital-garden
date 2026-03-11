import { getAllPosts } from "@/lib/content/loader";
import { PostCard } from "@/components/cards/PostCard";
import { CategoryGrid } from "@/components/taxonomy/CategoryGrid";
import { MessageForm } from "@/components/MessageForm";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 9);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <section className="mb-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl md:tracking-[-0.02em]">
          梓郡的Digital Garden
        </h1>
        <p className="mt-5 text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed md:text-lg">
          静心耕耘，缓慢生长——感谢您光临小花园
        </p>
      </section>

      <CategoryGrid />

      <section className="mt-20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
        <h2 className="text-2xl font-semibold mb-6 text-foreground tracking-tight">留言板</h2>
        <MessageForm />
      </section>

      <section className="mt-20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="text-2xl font-semibold mb-8 text-foreground tracking-tight">最近更新</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.slug} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <PostCard post={post} />
            </div>
          ))}
        </div>
        {posts.length === 0 && (
          <p className="text-muted-foreground py-12 text-center">
            暂无文章，请在 <code className="bg-muted px-2 py-1 rounded">content/posts/</code> 下添加 MDX 文件。
          </p>
        )}
      </section>
    </div>
  );
}
