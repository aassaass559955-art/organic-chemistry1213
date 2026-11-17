import type { Metadata } from "next";
import { AboutClient } from "@/components/about-client";

export const metadata: Metadata = {
  title: "من نحن — About Us",
  description: "تعرف على منصة الكيمياء العضوية: رسالتنا ورؤيتنا وقيمنا في نشر المعرفة الكيميائية بالعربية والإنجليزية.",
};

export default function AboutPage() {
  return <AboutClient />;
}
