import type { Metadata } from "next";
import { getFilters, listArticles, listCategories } from "@/lib/data";
import { ArticleBrowser } from "@/components/article-browser";
import { PageHeader } from "@/components/cards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "الأبحاث العلمية — Scientific Research",
  description: "أبحاث علمية محكّمة في الكيمياء العضوية: الاصطناع، الحفز، الحلقات غير المتجانسة، مع إمكانية البحث والتصفية.",
};

export default async function ResearchesPage() {
  const [articles, categories, meta] = await Promise.all([
    listArticles({ type: "RESEARCH" }),
    listCategories(),
    getFilters(),
  ]);
  return (
    <>
      <PageHeader titleKey="navResearches" icon="flask" subKey="taglineShort" />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <ArticleBrowser initialArticles={articles} categories={categories} meta={meta} />
      </section>
    </>
  );
}
