import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Post, PostFrontmatter } from "./types";
import type { CategorySlug } from "@/lib/constants";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

function getAllMdxPaths(dir: string, basePath = ""): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const paths: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== "_drafts") {
        paths.push(...getAllMdxPaths(fullPath, relativePath));
      }
    } else if (entry.name.endsWith(".mdx")) {
      paths.push(relativePath.replace(/\.mdx$/, ""));
    }
  }

  return paths;
}

function getCategoryFromPath(slug: string): CategorySlug | null {
  const parts = slug.split("/");
  const first = parts[0];
  const valid: CategorySlug[] = ["digital", "herb", "metaphysics", "hardware", "journey"];
  return valid.includes(first as CategorySlug) ? (first as CategorySlug) : null;
}

export function getAllPostSlugs(): string[] {
  const fullDir = path.join(POSTS_DIR);
  if (!fs.existsSync(fullDir)) return [];
  return getAllMdxPaths(fullDir);
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (fs.existsSync(fullPath)) {
    const post = loadPostFromFile(slug, fullPath);
    if (post && post.slug === slug) return post;
  }
  const all = getAllPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

function loadPostFromFile(fileSlug: string, fullPath: string): Post | null {
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as PostFrontmatter;

  if (frontmatter.draft) return null;

  const date = frontmatter.date ? String(frontmatter.date).trim() : new Date().toISOString().slice(0, 10);
  const urlSlug = frontmatter.slug
    ? `${frontmatter.category}/${String(frontmatter.slug).trim()}`.replace(/\/+/g, "/")
    : fileSlug;

  return {
    ...frontmatter,
    date,
    slug: urlSlug,
    content,
  };
}

export function getAllPosts(): Post[] {
  const slugs = getAllPostSlugs();
  const posts: Post[] = [];

  for (const fileSlug of slugs) {
    const fullPath = path.join(POSTS_DIR, `${fileSlug}.mdx`);
    const post = loadPostFromFile(fileSlug, fullPath);
    if (post) posts.push(post);
  }

  return posts.sort((a, b) => {
    const ta = new Date(a.date || 0).getTime();
    const tb = new Date(b.date || 0).getTime();
    return tb - ta;
  });
}

export function getPostsByCategory(category: CategorySlug): Post[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => p.tags?.includes(tag));
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const set = new Set<string>();
  posts.forEach((p) => p.tags?.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}
