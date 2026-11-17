import type { Metadata } from "next";
import { ContactClient } from "@/components/contact-client";

export const metadata: Metadata = {
  title: "تواصل معنا — Contact Us",
  description: "تواصل مع منصة الكيمياء العضوية للاستفسارات العلمية واقتراحات التعاون والنشر.",
};

export default function ContactPage() {
  return <ContactClient />;
}
