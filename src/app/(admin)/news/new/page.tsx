import type { Metadata } from "next";
import { NewsForm } from "../news-form";

export const metadata: Metadata = {
  title: "Thêm bài viết mới",
};

export default function NewNewsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Thêm bài viết mới</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Điền thông tin cho bài viết tin tức</p>
      </div>
      <NewsForm />
    </div>
  );
}
