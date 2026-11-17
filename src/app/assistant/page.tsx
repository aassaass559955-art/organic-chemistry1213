import type { Metadata } from "next";
import { AssistantClient } from "@/components/assistant-client";

export const metadata: Metadata = {
  title: "مساعد الكيمياء العضوية الذكي — Organic Chemistry Assistant",
  description: "مساعد ذكي يشرح مفاهيم الكيمياء العضوية ويفسر التفاعلات والآليات ويقترح المراجع — بالعربية والإنجليزية.",
};

export default function AssistantPage() {
  return <AssistantClient />;
}
