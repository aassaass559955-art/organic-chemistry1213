import type { Metadata } from "next";
import { listTopics } from "@/lib/data";
import { PageHeader } from "@/components/cards";
import { TopicsClient } from "@/components/topics-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "شرح المواضيع الكيميائية — Chemistry Topics Explained",
  description: "شروحات تعليمية معمقة في الكيمياء العضوية: التهجين، الآليات، الاستبدال الأروماتي، مع صور ومعادلات وتفاعلات.",
};

export default async function TopicsPage() {
  const topics = await listTopics("EXPLANATION");
  return (
    <>
      <PageHeader titleKey="topicsTitle" subKey="topicsSub" icon="atom" />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <TopicsClient topics={topics} />
      </section>
    </>
  );
}
