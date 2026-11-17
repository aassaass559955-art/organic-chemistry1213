import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { approvedComments, getArticle } from "@/lib/data";
import { ArticleDetailClient } from "@/components/article-detail";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) return { title: "Not Found" };
  return {
    title: article.titleAr,
    description: article.abstractAr.slice(0, 160),
    keywords: article.keywords,
    openGraph: {
      title: article.titleAr,
      description: article.abstractAr.slice(0, 160),
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();
  const comments = await approvedComments(article.id);
  return (
    <ArticleDetailClient
      article={article}
      initialComments={comments.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      }))}
    />
  );
}
