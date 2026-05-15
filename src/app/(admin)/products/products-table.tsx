"use client";
/**
 * @nhom        : Admin / Products
 * @chucnang    : Bảng dữ liệu sản phẩm (client) — có search/filter
 * @lienquan    : src/app/(admin)/products/page.tsx
 * @alias       : products-table
 */
import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Product, ProductCategory } from "@/types/database";

interface ProductsTableProps {
  data: Product[];
  categories: ProductCategory[];
}

export function ProductsTable({ data, categories }: ProductsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  // State cho search & filter
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  /** Map categoryId sang tên */
  const categoryName = (catId: string | null) => {
    if (!catId) return null;
    return categories.find((c) => c.id === catId)?.name ?? null;
  };

  /** Dữ liệu đã lọc */
  const filtered = useMemo(() => {
    return data.filter((p) => {
      // Lọc theo search
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.shortDescription?.toLowerCase().includes(q) ?? false);

      // Lọc theo danh mục
      const matchCat =
        filterCategory === "all" || p.categoryId === filterCategory;

      // Lọc theo trạng thái
      const matchStatus =
        filterStatus === "all" ||
        (filterStatus === "published" && p.isPublished) ||
        (filterStatus === "draft" && !p.isPublished) ||
        (filterStatus === "featured" && p.isFeatured);

      return matchSearch && matchCat && matchStatus;
    });
  }, [data, search, filterCategory, filterStatus]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const { deleteProductAction } = await import("@/lib/actions/products");
      const result = await deleteProductAction(id);
      if (result.success) {
        startTransition(() => router.refresh());
      } else {
        alert(result.error || result.message);
      }
    } catch {
      alert("Lỗi khi xóa");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  if (!data.length) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-12 text-center">
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">Chưa có sản phẩm</h3>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">Thêm sản phẩm đầu tiên</p>
        <Link href="/products/new" className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 text-sm font-medium">
          Thêm sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      {/* Search & Filter bar */}
      <div className="px-6 py-4 border-b border-[var(--border)] space-y-3">
        {/* Thanh tìm kiếm */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="pl-10"
            />
          </div>

          {/* Filter danh mục */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-sm px-3 outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Filter trạng thái */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-sm px-3 outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Hiển thị</option>
            <option value="draft">Ẩn</option>
            <option value="featured">Nổi bật</option>
          </select>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            <span className="font-medium text-[var(--foreground)]">{filtered.length}</span>
            {filtered.length !== data.length ? ` / ${data.length}` : ""} sản phẩm
          </p>
          <span className="text-[var(--border)]">•</span>
          <p className="text-sm text-[var(--muted-foreground)]">
            <span className="font-medium text-[var(--foreground)]">{data.filter(d => d.isFeatured).length}</span> nổi bật
          </p>
          <span className="text-[var(--border)]">•</span>
          <p className="text-sm text-[var(--muted-foreground)]">
            <span className="font-medium text-[var(--foreground)]">{categories.length}</span> danh mục
          </p>
          {/* Nút reset filter */}
          {(search || filterCategory !== "all" || filterStatus !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setFilterCategory("all");
                setFilterStatus("all");
              }}
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
          <p className="text-sm text-[var(--muted-foreground)]">
            Không tìm thấy sản phẩm phù hợp
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {["#", "Sản phẩm", "Danh mục", "Slug", "Trạng thái", ""].map((h, i) => (
                  <th key={i} className={`text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider px-6 py-3 ${i === 5 ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {filtered.map((product) => (
                <tr key={product.id} className="group transition-colors hover:bg-[var(--muted)]/30">
                  {/* Thứ tự */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-[var(--muted)] text-xs font-medium">{product.sortOrder}</span>
                  </td>

                  {/* Tên + mô tả + badges */}
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-[var(--border)] flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-emerald-400">{product.name[0]}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-[var(--foreground)]">{product.name}</p>
                          {product.isFeatured && (
                            <Badge variant="default" className="text-[10px] px-1.5 py-0">★ Nổi bật</Badge>
                          )}
                        </div>
                        {product.shortDescription && (
                          <p className="text-xs text-[var(--muted-foreground)] line-clamp-1 max-w-[280px] mt-0.5">{product.shortDescription}</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Danh mục */}
                  <td className="px-6 py-4">
                    {categoryName(product.categoryId) ? (
                      <Badge variant="outline">{categoryName(product.categoryId)}</Badge>
                    ) : (
                      <span className="text-xs text-[var(--muted-foreground)]/50">—</span>
                    )}
                  </td>

                  {/* Slug */}
                  <td className="px-6 py-4">
                    <code className="text-xs px-2 py-1 rounded-md bg-[var(--muted)] font-mono">{product.slug}</code>
                  </td>

                  {/* Trạng thái */}
                  <td className="px-6 py-4">
                    <Badge variant={product.isPublished ? "success" : "warning"}>{product.isPublished ? "Hiển thị" : "Ẩn"}</Badge>
                  </td>

                  {/* Hành động */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/products/${product.id}/edit`}>
                        <Button variant="ghost" size="icon-sm" className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </Button>
                      </Link>
                      {confirmId === product.id ? (
                        <div className="flex items-center gap-1">
                          <Button variant="destructive" size="xs" className="cursor-pointer" onClick={() => handleDelete(product.id)} disabled={deletingId === product.id || isPending}>
                            {deletingId === product.id ? "..." : "Xóa"}
                          </Button>
                          <Button variant="ghost" size="xs" className="cursor-pointer" onClick={() => setConfirmId(null)}>Hủy</Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="icon-sm" className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400" onClick={() => setConfirmId(product.id)}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
