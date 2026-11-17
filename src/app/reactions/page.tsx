import type { Metadata } from "next";
import { listReactions } from "@/lib/data";
import { PageHeader } from "@/components/cards";
import { ReactionsClient } from "@/components/reactions-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "قاعدة بيانات التفاعلات العضوية — Organic Reactions Database",
  description: "تفاعلات مسماة وآليات وخطط اصطناع عضوي موثقة بالمعادلات والكواشف والظروف: فريدل-كرافت، ألدول، ديلز-ألدر، غرينيارد، فيتيغ.",
};

export default async function ReactionsPage() {
  const reactions = await listReactions();
  return (
    <>
      <PageHeader titleKey="reactionsTitle" subKey="reactionsSub" icon="workflow" />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <ReactionsClient reactions={reactions} />
      </section>
    </>
  );
}
