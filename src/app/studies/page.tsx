import type { Metadata } from "next";
import { getFilters, listArticles, listCategories } from "@/lib/data";
import { ArticleBrowser } from "@/components/article-browser";
import { PageHeader } from "@/components/cards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "الدراسات — Studies",
  description: "دراسات نظرية وتطبيقية في الكيمياء العضوية: DFT، حركية، طيفية، ومضادات أكسدة.",
};

export default async function StudiesPage() {
  const [articles, categories, meta] = await Promise.all([
    listArticles({ type: "STUDY" }),
    listCategories(),
    getFilters(),
  ]);
  return (
    <>
      <PageHeader titleKey="navStudies" icon="book" subKey="taglineShort" />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <ArticleBrowser initialArticles={articles} categories={categories} meta={meta} />
      </section>
    </>
  );
}
