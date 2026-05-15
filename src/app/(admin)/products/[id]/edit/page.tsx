/**
 * @nhom        : Admin / Products
 * @chucnang    : Trang chỉnh sửa sản phẩm — kết nối DB thực
 * @lienquan    : src/app/(admin)/products/products-form.tsx
 * @alias       : products-edit
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductForm } from "../../products-form";
import { getProductById, getAllCategories } from "@/lib/db/queries/products";
import type { ProductCategory } from "@/types/database";

export const metadata: Metadata = { title: "Chỉnh sửa sản phẩm" };

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getAllCategories() as Promise<ProductCategory[]>,
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Chỉnh sửa sản phẩm</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Cập nhật <span className="font-medium text-[var(--foreground)]">{product.name}</span>
        </p>
      </div>
      <ProductForm initialData={product} categories={categories} />
    </div>
  );
}
