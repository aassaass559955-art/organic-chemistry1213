import type { Metadata } from "next";
import { listBooks } from "@/lib/data";
import { BookCard, PageHeader } from "@/components/cards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "المكتبة العلمية — Scientific Library",
  description: "مكتبة رقمية لأهم الكتب والمراجع في الكيمياء العضوية مع المعاينة والتحميل المباشر.",
};

export default async function LibraryPage() {
  const books = await listBooks();
  return (
    <>
      <PageHeader titleKey="libraryTitle" subKey="librarySub" icon="library" />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.map((b, i) => (
            <BookCard key={b.id} book={b} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
