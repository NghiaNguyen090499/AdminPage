/**
 * @nhom        : Database / Queries
 * @chucnang    : CRUD query functions cho bảng services
 * @input       : Dữ liệu dịch vụ (name, slug, descriptions, ...)
 * @output      : Service[] hoặc Service — kết quả truy vấn
 * @lienquan    : src/lib/db/schema.ts, src/lib/db/index.ts, src/types/database.ts
 * @alias       : services-queries, services-crud
 */
import { eq, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import type { NewService } from "@/types/database";

/**
 * Lấy tất cả dịch vụ — sắp xếp theo sortOrder tăng dần
 * @output : Service[] — danh sách dịch vụ
 */
export async function getAllServices() {
  return db
    .select()
    .from(services)
    .orderBy(asc(services.sortOrder));
}

/**
 * Lấy 1 dịch vụ theo ID
 * @input  : id (string) — UUID
 * @output : Service | null
 */
export async function getServiceById(id: string) {
  const results = await db
    .select()
    .from(services)
    .where(eq(services.id, id))
    .limit(1);
  return results[0] ?? null;
}

/**
 * Lấy 1 dịch vụ theo slug
 * @input  : slug (string) — URL-friendly identifier
 * @output : Service | null
 */
export async function getServiceBySlug(slug: string) {
  const results = await db
    .select()
    .from(services)
    .where(eq(services.slug, slug))
    .limit(1);
  return results[0] ?? null;
}

/**
 * Lấy danh sách dịch vụ đang hiển thị (published)
 * @output : Service[] — chỉ lấy isPublished = true
 */
export async function getPublishedServices() {
  return db
    .select()
    .from(services)
    .where(eq(services.isPublished, true))
    .orderBy(asc(services.sortOrder));
}

/**
 * Tạo dịch vụ mới
 * @input  : data (NewService) — dữ liệu dịch vụ
 * @output : Service — dịch vụ vừa tạo
 */
export async function createService(data: NewService) {
  const results = await db
    .insert(services)
    .values({
      ...data,
      updatedAt: new Date(),
    })
    .returning();
  return results[0];
}

/**
 * Cập nhật dịch vụ theo ID
 * @input  : id (string), data (Partial<NewService>)
 * @output : Service — dịch vụ sau cập nhật
 */
export async function updateService(id: string, data: Partial<NewService>) {
  const results = await db
    .update(services)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(services.id, id))
    .returning();
  return results[0];
}

/**
 * Xóa dịch vụ theo ID
 * @input  : id (string) — UUID
 * @output : Service — dịch vụ đã xóa
 */
export async function deleteService(id: string) {
  const results = await db
    .delete(services)
    .where(eq(services.id, id))
    .returning();
  return results[0];
}

/**
 * Đếm tổng số dịch vụ
 * @output : number
 */
export async function countServices() {
  const results = await db.select({ value: count() }).from(services);
  return results[0]?.value ?? 0;
}
