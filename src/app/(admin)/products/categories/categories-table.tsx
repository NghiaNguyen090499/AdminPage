"use client";
/**
 * @nhom        : Admin / Products / Categories
 * @chucnang    : Bảng dữ liệu danh mục sản phẩm (client component) — có search
 * @input       : data (ProductCategory[]) — danh sách danh mục, products (Product[]) — đếm sản phẩm
 * @lienquan    : src/app/(admin)/products/categories/page.tsx
 * @alias       : categories-table
 */
import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProductCategory, Product } from "@/types/database";

interface CategoriesTableProps {
  data: ProductCategory[];
  products: Product[];
}

export function CategoriesTable({ data, products }: CategoriesTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // State cho search
  const [search, setSearch] = useState("");

  /** Dữ liệu đã lọc theo từ khóa */
  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.slug.toLowerCase().includes(q) ||
        (cat.description?.toLowerCase().includes(q) ?? false)
    );
  }, [data, search]);

  /** Đếm số sản phẩm thuộc danh mục */
  const countByCat = (catId: string) =>
    products.filter((p) => p.categoryId === catId).length;

  /** Xóa danh mục */
  const handleDelete = async (id: string) => {
    // Kiểm tra có sản phẩm thuộc danh mục không
    const productCount = countByCat(id);
    if (productCount > 0) {
      alert(
        `Không thể xóa — danh mục này có ${productCount} sản phẩm. Hãy chuyển sản phẩm sang danh mục khác trước.`
      );
      setConfirmId(null);
      return;
    }

    setDeletingId(id);
    try {
      const { deleteCategoryAction } = await import(
        "@/lib/actions/products"
      );
      const result = await deleteCategoryAction(id);
      if (result.success) {
        startTransition(() => router.refresh());
      } else {
        alert(result.error || result.message);
      }
    } catch {
      alert("Lỗi khi xóa danh mục");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  /** Format ngày */
  const fmtDate = (d: Date) =>
    new Date(d).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  // Hiển thị empty state
  if (!data.length) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--muted)] flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-[var(--muted-foreground)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">
          Chưa có danh mục
        </h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          Tạo danh mục đầu tiên để phân loại sản phẩm
        </p>
        <Link
          href="/products/categories/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 text-sm font-medium"
        >
          Thêm danh mục
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      {/* Search & Stats bar */}
      <div className="px-6 py-4 border-b border-[var(--border)] space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm danh mục..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            <span className="font-medium text-[var(--foreground)]">{filtered.length}</span>
            {filtered.length !== data.length ? ` / ${data.length}` : ""} danh mục
          </p>
          <span className="text-[var(--border)]">•</span>
          <p className="text-sm text-[var(--muted-foreground)]">
            <span className="font-medium text-[var(--foreground)]">{products.length}</span> sản phẩm
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs text-[var(--primary)] hover:underline cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Bảng */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">Không tìm thấy danh mục phù hợp</p>
        </div>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {["#", "Tên danh mục", "Slug", "Sản phẩm", "Cập nhật", ""].map(
                (h, i) => (
                  <th
                    key={i}
                    className={`text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider px-6 py-3 ${
                      i === 5 ? "text-right" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {filtered.map((cat) => (
              <tr
                key={cat.id}
                className="group transition-colors hover:bg-[var(--muted)]/30"
              >
                {/* Thứ tự */}
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[var(--muted)] text-xs font-medium">
                    {cat.sortOrder}
                  </span>
                </td>

                {/* Tên + mô tả */}
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {cat.name}
                  </p>
                  {cat.description && (
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5 line-clamp-1 max-w-[300px]">
                      {cat.description}
                    </p>
                  )}
                </td>

                {/* Slug */}
                <td className="px-6 py-4">
                  <code className="text-xs px-2 py-1 rounded-md bg-[var(--muted)] font-mono">
                    {cat.slug}
                  </code>
                </td>

                {/* Số sản phẩm */}
                <td className="px-6 py-4">
                  <Badge variant={countByCat(cat.id) > 0 ? "default" : "outline"}>
                    {countByCat(cat.id)} sản phẩm
                  </Badge>
                </td>

                {/* Ngày cập nhật */}
                <td className="px-6 py-4 text-sm text-[var(--muted-foreground)]">
                  {fmtDate(cat.updatedAt)}
                </td>

                {/* Hành động */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    {/* Nút sửa */}
                    <Link href={`/products/categories/${cat.id}/edit`}>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Button>
                    </Link>

                    {/* Nút xóa — xác nhận 2 bước */}
                    {confirmId === cat.id ? (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="destructive"
                          size="xs"
                          className="cursor-pointer"
                          onClick={() => handleDelete(cat.id)}
                          disabled={deletingId === cat.id || isPending}
                        >
                          {deletingId === cat.id ? "..." : "Xóa"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="cursor-pointer"
                          onClick={() => setConfirmId(null)}
                        >
                          Hủy
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                        onClick={() => setConfirmId(cat.id)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
