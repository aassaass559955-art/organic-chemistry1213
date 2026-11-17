import type { Metadata } from "next";
import { getFilters, listArticles, listCategories } from "@/lib/data";
import { ArticleBrowser } from "@/components/article-browser";
import { PageHeader } from "@/components/cards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "الأخبار والاكتشافات العلمية — Science News",
  description: "آخر أخبار واكتشافات الكيمياء العضوية: الحفز الضوئي، الكيمياء النقرية، وذكاء الاصطناع.",
};

export default async function NewsPage() {
  const [articles, categories, meta] = await Promise.all([
    listArticles({ type: "NEWS" }),
    listCategories(),
    getFilters(),
  ]);
  return (
    <>
      <PageHeader titleKey="navNews" icon="newspaper" subKey="taglineShort" />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <ArticleBrowser initialArticles={articles} categories={categories} meta={meta} />
      </section>
    </>
  );
}
