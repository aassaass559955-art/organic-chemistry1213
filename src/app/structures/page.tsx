import type { Metadata } from "next";
import { listTopics } from "@/lib/data";
import { PageHeader } from "@/components/cards";
import { StructuresClient } from "@/components/structures-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "التراكيب الكيميائية — Chemical Structures",
  description: "بنية أهم الجزيئات العضوية مع نماذج ثلاثية الأبعاد تفاعلية: البنزين، الميثان، الإيثانول.",
};

export default async function StructuresPage() {
  const structures = await listTopics("STRUCTURE");
  return (
    <>
      <PageHeader titleKey="structuresTitle" subKey="structuresSub" icon="orbit" />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <StructuresClient structures={structures} />
      </section>
    </>
  );
}
