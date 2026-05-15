/**
 * @nhom        : Admin / Products / Categories
 * @chucnang    : Trang danh sách danh mục sản phẩm — kết nối DB thực
 * @lienquan    : src/lib/db/queries/products.ts, categories-table.tsx
 * @alias       : categories-page, categories-list
 */
import type { Metadata } from "next";
import Link from "next/link";
import { CategoriesTable } from "./categories-table";
import { getAllCategories, getAllProducts } from "@/lib/db/queries/products";
import type { ProductCategory, Product } from "@/types/database";

export const metadata: Metadata = {
  title: "Quản lý danh mục",
};

/** Lấy danh sách danh mục */
async function getCategories(): Promise<ProductCategory[]> {
  try {
    return (await getAllCategories()) as ProductCategory[];
  } catch (error) {
    console.error("[CategoriesPage] Lỗi truy vấn categories:", error);
    return [];
  }
}

/** Lấy danh sách sản phẩm để đếm theo danh mục */
async function getProducts(): Promise<Product[]> {
  try {
    return (await getAllProducts()) as Product[];
  } catch (error) {
    console.error("[CategoriesPage] Lỗi truy vấn products:", error);
    return [];
  }
}

export default async function CategoriesPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Quản lý danh mục
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Danh mục phân loại sản phẩm công ty
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] px-4 py-2.5 text-sm font-medium transition-all hover:bg-[var(--muted)] active:scale-[0.98]"
          >
            ← Sản phẩm
          </Link>
          <Link
            href="/products/categories/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2.5 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
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
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Thêm danh mục
          </Link>
        </div>
      </div>

      {/* Bảng danh mục */}
      <CategoriesTable data={categories} products={products} />
    </div>
  );
}
