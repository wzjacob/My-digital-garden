import { getAllPosts } from "./loader";
import { CATEGORIES, type CategorySlug } from "@/lib/constants";

export function getAllCategorySlugs(): CategorySlug[] {
  return Object.keys(CATEGORIES) as CategorySlug[];
}

export function getCategoryInfo(slug: CategorySlug) {
  return CATEGORIES[slug] ?? null;
}

export function getPostCountByCategory(): Record<CategorySlug, number> {
  const posts = getAllPosts();
  const counts: Record<string, number> = {};

  for (const slug of Object.keys(CATEGORIES)) {
    counts[slug] = posts.filter((p) => p.category === slug).length;
  }

  return counts as Record<CategorySlug, number>;
}
