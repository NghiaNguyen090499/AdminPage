import type { Metadata } from "next";
import Link from "next/link";
import { NewsTable } from "./news-table";
import { getAllNewsArticles } from "@/lib/db/queries/news";
import type { NewsArticle } from "@/types/database";

export const metadata: Metadata = {
  title: "Quản lý tin tức",
};

async function getData(): Promise<NewsArticle[]> {
  try {
    return (await getAllNewsArticles()) as NewsArticle[];
  } catch (error) {
    console.error("[NewsPage] Lỗi truy vấn DB:", error);
    return [];
  }
}

export default async function NewsPage() {
  const data = await getData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Quản lý tin tức
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Quản lý các bài viết, cover, ngày xuất bản và SEO
          </p>
        </div>
        <Link
          href="/news/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        >
          Thêm bài viết
        </Link>
      </div>

      <NewsTable data={data} />
    </div>
  );
}
