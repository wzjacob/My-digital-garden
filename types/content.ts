import type { CategorySlug } from "@/lib/constants";

export interface PostFrontmatter {
  title: string;
  description?: string;
  date: string;
  category: CategorySlug;
  slug?: string;
  tags?: string[];
  draft?: boolean;
  image?: string;
  authors?: string[];
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
}

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  description: string;
  tags: string[];
}
