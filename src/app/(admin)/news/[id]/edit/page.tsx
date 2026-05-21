import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsForm } from "../../news-form";
import { getNewsArticleById } from "@/lib/db/queries/news";

export const metadata: Metadata = {
  title: "Chỉnh sửa bài viết",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditNewsPage({ params }: PageProps) {
  const { id } = await params;
  const article = await getNewsArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Chỉnh sửa bài viết</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Cập nhật thông tin cho <span className="font-medium text-[var(--foreground)]">{article.title}</span>
        </p>
      </div>
      <NewsForm initialData={article} />
    </div>
  );
}
