import type { Metadata } from "next";
import { ContactsTable } from "./contacts-table";
import { getAllContactSubmissions } from "@/lib/db/queries/contact-submissions";
import type { ContactSubmission } from "@/types/database";

export const metadata: Metadata = {
  title: "Liên hệ từ website",
};

async function getData(): Promise<ContactSubmission[]> {
  try {
    return (await getAllContactSubmissions()) as ContactSubmission[];
  } catch (error) {
    console.error("[ContactsPage] Lỗi truy vấn DB:", error);
    return [];
  }
}

export default async function ContactsPage() {
  const data = await getData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Liên hệ từ website
        </h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Theo dõi lead được gửi từ form công khai trên frontend
        </p>
      </div>

      <ContactsTable data={data} />
    </div>
  );
}
