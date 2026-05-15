/**
 * @nhom        : Admin / Products / Categories
 * @chucnang    : Trang tạo danh mục mới
 * @alias       : category-new
 */
import type { Metadata } from "next";
import { CategoryForm } from "../category-form";

export const metadata: Metadata = { title: "Thêm danh mục" };

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Thêm danh mục mới</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Tạo danh mục để phân loại sản phẩm</p>
      </div>
      <CategoryForm />
    </div>
  );
}
