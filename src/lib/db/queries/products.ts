/**
 * @nhom        : Database / Queries
 * @chucnang    : CRUD query functions cho bảng products + product_categories
 * @input       : Dữ liệu sản phẩm/danh mục
 * @output      : Product[] / ProductCategory[] — kết quả truy vấn
 * @lienquan    : src/lib/db/schema.ts, src/types/database.ts
 * @alias       : products-queries, products-crud
 */
import { eq, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, productCategories } from "@/lib/db/schema";
import type { NewProduct, NewProductCategory } from "@/types/database";

// ============================================================
// PRODUCT CATEGORIES
// ============================================================

/** Lấy tất cả danh mục — sắp xếp theo sortOrder */
export async function getAllCategories() {
  return db.select().from(productCategories).orderBy(asc(productCategories.sortOrder));
}

/** Lấy danh mục theo ID */
export async function getCategoryById(id: string) {
  const results = await db.select().from(productCategories).where(eq(productCategories.id, id)).limit(1);
  return results[0] ?? null;
}

/** Tạo danh mục mới */
export async function createCategory(data: NewProductCategory) {
  const results = await db.insert(productCategories).values({ ...data, updatedAt: new Date() }).returning();
  return results[0];
}

/** Cập nhật danh mục */
export async function updateCategory(id: string, data: Partial<NewProductCategory>) {
  const results = await db.update(productCategories).set({ ...data, updatedAt: new Date() }).where(eq(productCategories.id, id)).returning();
  return results[0];
}

/** Xóa danh mục */
export async function deleteCategory(id: string) {
  const results = await db.delete(productCategories).where(eq(productCategories.id, id)).returning();
  return results[0];
}

// ============================================================
// PRODUCTS
// ============================================================

/** Lấy tất cả sản phẩm — sắp xếp theo sortOrder */
export async function getAllProducts() {
  return db.select().from(products).orderBy(asc(products.sortOrder));
}

/** Lấy sản phẩm theo ID */
export async function getProductById(id: string) {
  const results = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return results[0] ?? null;
}

/** Lấy sản phẩm theo slug */
export async function getProductBySlug(slug: string) {
  const results = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return results[0] ?? null;
}

/** Lấy sản phẩm theo danh mục */
export async function getProductsByCategory(categoryId: string) {
  return db.select().from(products).where(eq(products.categoryId, categoryId)).orderBy(asc(products.sortOrder));
}

/** Lấy sản phẩm đang published */
export async function getPublishedProducts() {
  return db.select().from(products).where(eq(products.isPublished, true)).orderBy(asc(products.sortOrder));
}

/** Lấy sản phẩm featured */
export async function getFeaturedProducts() {
  return db.select().from(products).where(eq(products.isFeatured, true)).orderBy(asc(products.sortOrder));
}

/** Tạo sản phẩm mới */
export async function createProduct(data: NewProduct) {
  const results = await db.insert(products).values({ ...data, updatedAt: new Date() }).returning();
  return results[0];
}

/** Cập nhật sản phẩm */
export async function updateProduct(id: string, data: Partial<NewProduct>) {
  const results = await db.update(products).set({ ...data, updatedAt: new Date() }).where(eq(products.id, id)).returning();
  return results[0];
}

/** Xóa sản phẩm */
export async function deleteProduct(id: string) {
  const results = await db.delete(products).where(eq(products.id, id)).returning();
  return results[0];
}

/** Đếm sản phẩm */
export async function countProducts() {
  const results = await db.select({ value: count() }).from(products);
  return results[0]?.value ?? 0;
}
