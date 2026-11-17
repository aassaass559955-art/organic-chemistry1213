import type { MetadataRoute } from "next";
import { listArticles, listTopics } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticPaths = [
    "",
    "/researches",
    "/studies",
    "/theses",
    "/articles",
    "/topics",
    "/reactions",
    "/structures",
    "/library",
    "/news",
    "/about",
    "/researcher",
    "/contact",
    "/assistant",
  ];
  const articles = await listArticles({}).catch(() => []);
  const topicList = await listTopics().catch(() => []);

  return [
    ...staticPaths.map((p) => ({
      url: `${base}${p}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...articles.map((a) => ({
      url: `${base}/articles/${a.slug}`,
      lastModified: new Date(a.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...topicList.map((tp) => ({
      url: `${base}/topics/${tp.slug}`,
      lastModified: new Date(tp.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
