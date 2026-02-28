import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/content/loader";
import { getAllCategorySlugs } from "@/lib/content/taxonomy";
import { getAllTags } from "@/lib/content/loader";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL.replace(/\/$/, "");
  const routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/about/`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  getAllCategorySlugs().forEach((slug) => {
    routes.push({
      url: `${base}/category/${slug}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  getAllTags().forEach((tag) => {
    routes.push({
      url: `${base}/tag/${encodeURIComponent(tag)}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  });

  getAllPosts().forEach((post) => {
    if (post.draft) return;
    const encodedSlug = post.slug.split("/").map(encodeURIComponent).join("/");
    routes.push({
      url: `${base}/post/${encodedSlug}/`,
      lastModified: new Date(post.date ?? Date.now()),
      changeFrequency: "monthly",
      priority: 0.9,
    });
  });

  return routes;
}
