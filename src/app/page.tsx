import { getPublicStats, listArticles, listCategories } from "@/lib/data";
import { HomeClient } from "@/components/home-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [stats, featured, latest, categories] = await Promise.all([
    getPublicStats(),
    listArticles({ featured: true, limit: 6 }),
    listArticles({ limit: 6 }),
    listCategories(),
  ]);

  return (
    <HomeClient stats={stats} featured={featured} latest={latest} categories={categories} />
  );
}
