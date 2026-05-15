/**
 * @nhom        : Admin / Products / Categories
 * @chucnang    : Trang chỉnh sửa danh mục sản phẩm — load dữ liệu từ DB
 * @input       : params.id (string) — ID danh mục cần sửa
 * @lienquan    : src/lib/db/queries/products.ts, category-form.tsx
 * @alias       : category-edit
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryById } from "@/lib/db/queries/products";
import { CategoryForm } from "../../category-form";
import type { ProductCategory } from "@/types/database";

export const metadata: Metadata = {
  title: "Sửa danh mục",
};

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Lấy dữ liệu danh mục từ DB
  let category: ProductCategory | null = null;
  try {
    category = (await getCategoryById(id)) as ProductCategory | null;
  } catch (error) {
    console.error("[EditCategoryPage] Lỗi:", error);
  }

  // Không tìm thấy → 404
  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Sửa danh mục
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Cập nhật thông tin danh mục &quot;{category.name}&quot;
        </p>
      </div>
      <CategoryForm initialData={category} />
    </div>
  );
}
