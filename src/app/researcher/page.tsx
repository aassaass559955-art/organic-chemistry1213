import type { Metadata } from "next";
import { getResearcher, listArticles } from "@/lib/data";
import { ResearcherClient } from "@/components/researcher-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "الباحث مرتضى عوض — Researcher Murtada Awad",
  description:
    "الصفحة الرسمية للباحث مرتضى عوض: النبذة التعريفية، التخصص، الإنجازات، والأبحاث والمقالات المنشورة في الكيمياء العضوية.",
};

export default async function ResearcherPage() {
  const [researcher, works] = await Promise.all([
    getResearcher(),
    listArticles({ author: "مرتضى عوض" }),
  ]);
  return <ResearcherClient researcher={researcher} works={works} />;
}
