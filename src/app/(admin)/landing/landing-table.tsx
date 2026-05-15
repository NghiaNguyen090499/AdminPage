/**
 * @nhom        : Admin / Landing
 * @chucnang    : Bảng hiển thị danh sách landing pages với thao tác CRUD
 * @input       : data (LandingPage[]) — dữ liệu từ DB
 * @lienquan    : src/lib/actions/landing.ts
 * @alias       : landing-table
 */
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteLandingPageAction } from "@/lib/actions/landing";
import type { LandingPage } from "@/types/database";

/** Map trạng thái sang hiển thị */
const statusMap: Record<string, { label: string; color: string }> = {
  draft: { label: "Nháp", color: "bg-yellow-100 text-yellow-800" },
  published: { label: "Đã xuất bản", color: "bg-green-100 text-green-800" },
  archived: { label: "Lưu trữ", color: "bg-gray-100 text-gray-600" },
};

export function LandingTable({ data }: { data: LandingPage[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  /** Xóa landing page */
  async function handleDelete(id: string, title: string) {
    if (!confirm(`Xóa landing page "${title}"? Toàn bộ sections và items sẽ bị xóa.`)) return;
    setDeleting(id);
    try {
      const result = await deleteLandingPageAction(id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error || result.message);
      }
    } finally {
      setDeleting(null);
    }
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-12 text-center">
        <svg className="w-12 h-12 mx-auto text-[var(--muted-foreground)] mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
        <p className="text-[var(--muted-foreground)] mb-4">Chưa có landing page nào</p>
        <Link
          href="/landing/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 text-sm font-medium"
        >
          Tạo landing page đầu tiên
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
            <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase">Tên</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase">Slug</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase">Trạng thái</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase">Ngày tạo</th>
            <th className="text-right px-4 py-3 text-xs font-medium text-[var(--muted-foreground)] uppercase">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.map((page) => {
            const status = statusMap[page.status] || statusMap.draft;
            return (
              <tr key={page.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--accent)] transition-colors">
                {/* Tên */}
                <td className="px-4 py-3">
                  <Link href={`/landing/${page.id}`} className="font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
                    {page.title}
                  </Link>
                  {page.description && (
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5 line-clamp-1">{page.description}</p>
                  )}
                </td>

                {/* Slug */}
                <td className="px-4 py-3">
                  <code className="text-xs bg-[var(--muted)] px-2 py-1 rounded">{page.slug}</code>
                </td>

                {/* Trạng thái */}
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                </td>

                {/* Ngày tạo */}
                <td className="px-4 py-3 text-sm text-[var(--muted-foreground)]">
                  {new Date(page.createdAt).toLocaleDateString("vi-VN")}
                </td>

                {/* Thao tác */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {/* Chỉnh sửa */}
                    <Link
                      href={`/landing/${page.id}`}
                      className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                      title="Chỉnh sửa"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>

                    {/* Xem API */}
                    <a
                      href={`/api/v1/landing/${page.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-blue-500 hover:bg-[var(--muted)] transition-colors"
                      title="Xem API"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>

                    {/* Xóa */}
                    <button
                      onClick={() => handleDelete(page.id, page.title)}
                      disabled={deleting === page.id}
                      className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Xóa"
                    >
                      {deleting === page.id ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
