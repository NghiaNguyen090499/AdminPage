/**
 * @nhom        : Admin / Products
 * @chucnang    : Trang quản lý sản phẩm — kết nối DB thực
 * @lienquan    : src/lib/db/queries/products.ts
 * @alias       : products-page, products-list
 */
import type { Metadata } from "next";
import Link from "next/link";
import { ProductsTable } from "./products-table";
import { getAllProducts, getAllCategories } from "@/lib/db/queries/products";
import type { Product, ProductCategory } from "@/types/database";

export const metadata: Metadata = {
  title: "Quản lý sản phẩm",
};

async function getProducts(): Promise<Product[]> {
  try {
    return (await getAllProducts()) as Product[];
  } catch (error) {
    console.error("[ProductsPage] Lỗi truy vấn products:", error);
    return [];
  }
}

async function getCategories(): Promise<ProductCategory[]> {
  try {
    return (await getAllCategories()) as ProductCategory[];
  } catch (error) {
    console.error("[ProductsPage] Lỗi truy vấn categories:", error);
    return [];
  }
}

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Quản lý sản phẩm</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Sản phẩm và danh mục sản phẩm công ty
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/products/categories"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] px-4 py-2.5 text-sm font-medium transition-all hover:bg-[var(--muted)] active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Danh mục
          </Link>
          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2.5 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* Bảng */}
      <ProductsTable data={products} categories={categories} />
    </div>
  );
}
