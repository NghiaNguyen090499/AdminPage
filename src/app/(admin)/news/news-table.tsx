"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { NewsArticle } from "@/types/database";

export function NewsTable({ data }: { data: NewsArticle[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.filter((item) => {
      return (
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        (item.excerpt?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [data, search]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { deleteNewsArticleAction } = await import("@/lib/actions/news");
      const result = await deleteNewsArticleAction(id);
      if (result.success) {
        startTransition(() => router.refresh());
      } else {
        alert(result.error || result.message);
      }
    } catch {
      alert("Lỗi khi xóa bài viết");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  if (!data.length) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-12 text-center">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">Chưa có bài viết nào</h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">Tạo bài viết đầu tiên cho mục tin tức</p>
        <Link href="/news/new" className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 text-sm font-medium">
          Thêm bài viết
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--border)] space-y-3">
        <div className="max-w-md">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm bài viết..." />
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">
          <span className="font-medium text-[var(--foreground)]">{filtered.length}</span>
          {filtered.length !== data.length ? ` / ${data.length}` : ""} bài viết
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {["#", "Tiêu đề", "Slug", "Ngày xuất bản", "Trạng thái", ""].map((h, i) => (
                <th key={i} className={`text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider px-6 py-3 ${i === 5 ? "text-right" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.map((item) => (
              <tr key={item.id} className="group transition-colors hover:bg-[var(--muted)]/30">
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[var(--muted)] text-xs font-medium">{item.sortOrder}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">{item.title}</p>
                    {item.excerpt && <p className="text-xs text-[var(--muted-foreground)] line-clamp-1 max-w-[320px]">{item.excerpt}</p>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <code className="text-xs px-2 py-1 rounded-md bg-[var(--muted)] font-mono">{item.slug}</code>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString("vi-VN") : "—"}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={item.isPublished ? "success" : "warning"}>{item.isPublished ? "Hiển thị" : "Ẩn"}</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/news/${item.id}/edit`}>
                      <Button variant="ghost" size="icon-sm" className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">Sửa</Button>
                    </Link>
                    {confirmId === item.id ? (
                      <div className="flex items-center gap-1">
                        <Button variant="destructive" size="xs" className="cursor-pointer" onClick={() => handleDelete(item.id)} disabled={deletingId === item.id || isPending}>
                          {deletingId === item.id ? "..." : "Xóa"}
                        </Button>
                        <Button variant="ghost" size="xs" className="cursor-pointer" onClick={() => setConfirmId(null)}>Hủy</Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="icon-sm" className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400" onClick={() => setConfirmId(item.id)}>
                        Xóa
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
