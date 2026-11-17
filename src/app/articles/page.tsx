import type { Metadata } from "next";
import { getFilters, listArticles, listCategories } from "@/lib/data";
import { ArticleBrowser } from "@/components/article-browser";
import { PageHeader } from "@/components/cards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "المقالات التعليمية — Educational Articles",
  description: "مقالات تعليمية مبسطة في أساسيات الكيمياء العضوية: التهجين، الأروماتية، الستيريوكيمياء، والتحليل الطيفي.",
};

export default async function ArticlesPage() {
  const [articles, categories, meta] = await Promise.all([
    listArticles({ type: "ARTICLE" }),
    listCategories(),
    getFilters(),
  ]);
  return (
    <>
      <PageHeader titleKey="navArticles" icon="file" subKey="taglineShort" />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <ArticleBrowser initialArticles={articles} categories={categories} meta={meta} />
      </section>
    </>
  );
}
