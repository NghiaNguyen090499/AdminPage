/**
 * @nhom        : Admin / Products
 * @chucnang    : Trang tạo sản phẩm mới
 * @lienquan    : src/app/(admin)/products/products-form.tsx
 * @alias       : products-new
 */
import type { Metadata } from "next";
import { ProductForm } from "../products-form";
import type { ProductCategory } from "@/types/database";

export const metadata: Metadata = { title: "Thêm sản phẩm mới" };

const mockCategories: ProductCategory[] = [
  { id: "cat-1", name: "Phần mềm", slug: "phan-mem", description: "Các sản phẩm phần mềm", sortOrder: 1, createdAt: new Date(), updatedAt: new Date() },
  { id: "cat-2", name: "Phần cứng", slug: "phan-cung", description: "Thiết bị và phần cứng", sortOrder: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: "cat-3", name: "Dịch vụ Cloud", slug: "dich-vu-cloud", description: "Giải pháp cloud", sortOrder: 3, createdAt: new Date(), updatedAt: new Date() },
];

async function getCategories(): Promise<ProductCategory[]> {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl || dbUrl === "your_database_url_here") return mockCategories;
    const { getAllCategories } = await import("@/lib/db/queries/products");
    return (await getAllCategories()) as ProductCategory[];
  } catch { return mockCategories; }
}

export default async function NewProductPage() {
  const categories = await getCategories();
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Thêm sản phẩm mới</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Điền thông tin sản phẩm công ty</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
