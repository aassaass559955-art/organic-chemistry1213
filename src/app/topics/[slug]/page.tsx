import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTopic } from "@/lib/data";
import { TopicDetailClient } from "@/components/topic-detail";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = await getTopic(slug);
  if (!topic) return { title: "Not Found" };
  return {
    title: topic.titleAr,
    description: topic.summaryAr.slice(0, 160),
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = await getTopic(slug);
  if (!topic) notFound();
  return <TopicDetailClient topic={topic} />;
}
