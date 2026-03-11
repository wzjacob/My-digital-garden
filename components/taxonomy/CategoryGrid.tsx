import Link from "next/link";
import { getPostCountByCategory } from "@/lib/content/taxonomy";
import { CATEGORIES } from "@/lib/constants";

const CATEGORY_ICONS: Record<string, string> = {
  digital: "📊",
  herb: "🌿",
  metaphysics: "☯",
  hardware: "⚙",
  journey: "🚗",
};

export function CategoryGrid() {
  const counts = getPostCountByCategory();

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {Object.values(CATEGORIES).map((cat) => (
        <div
          key={cat.slug}
          className="animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <Link
            href={`/category/${cat.slug}/`}
            className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 ease-out hover:border-zinc-300 hover:shadow-md hover:-translate-y-0.5 dark:hover:border-zinc-600"
          >
            <span className="text-2xl mb-2">{CATEGORY_ICONS[cat.slug] ?? "📄"}</span>
            <h3 className="font-semibold text-foreground">{cat.name}</h3>
            <p className="mt-1 min-h-[2.5rem] flex-1 text-sm text-muted-foreground line-clamp-2">
              {cat.description}
            </p>
            <span className="mt-3 text-xs text-muted-foreground">
              {counts[cat.slug as keyof typeof counts] ?? 0} 篇
            </span>
          </Link>
        </div>
      ))}
    </section>
  );
}
