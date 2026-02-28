import { getAllPosts } from "@/lib/content/loader";
import { PostCard } from "@/components/cards/PostCard";
import { CategoryGrid } from "@/components/taxonomy/CategoryGrid";
import { MessageForm } from "@/components/MessageForm";

export default function HomePage() {
  const posts = getAllPosts().slice(0, 9);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <section className="mb-16 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          梓郡的Digital Garden
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          静心耕耘，缓慢生长。数字化、本草、玄学、硬核理工与行路思考的汇集之地。感谢你的光临。
        </p>
      </section>

      <CategoryGrid />

      <MessageForm />

      <section className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <h2 className="text-2xl font-semibold mb-8 text-foreground">最近更新</h2>
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
