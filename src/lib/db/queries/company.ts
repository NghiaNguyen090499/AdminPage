/**
 * @nhom        : Database / Queries
 * @chucnang    : CRUD query functions cho bảng company_info
 * @input       : Dữ liệu company section (key, title, content, ...)
 * @output      : CompanyInfo[] hoặc CompanyInfo — kết quả truy vấn
 * @lienquan    : src/lib/db/schema.ts, src/lib/db/index.ts, src/types/database.ts
 * @alias       : company-queries, company-crud
 */
import { eq, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { companyInfo } from "@/lib/db/schema";
import type { NewCompanyInfo } from "@/types/database";

/**
 * Lấy tất cả sections — sắp xếp theo sortOrder tăng dần
 * @output : CompanyInfo[] — danh sách sections
 */
export async function getAllCompanyInfo() {
  return db
    .select()
    .from(companyInfo)
    .orderBy(asc(companyInfo.sortOrder));
}

/**
 * Lấy 1 section theo ID
 * @input  : id (string) — UUID của section
 * @output : CompanyInfo | undefined
 */
export async function getCompanyInfoById(id: string) {
  const results = await db
    .select()
    .from(companyInfo)
    .where(eq(companyInfo.id, id))
    .limit(1);
  return results[0] ?? null;
}

/**
 * Lấy 1 section theo key (ví dụ: "about", "vision")
 * @input  : key (string) — khóa duy nhất
 * @output : CompanyInfo | undefined
 */
export async function getCompanyInfoByKey(key: string) {
  const results = await db
    .select()
    .from(companyInfo)
    .where(eq(companyInfo.key, key))
    .limit(1);
  return results[0] ?? null;
}

/**
 * Tạo section mới
 * @input  : data (NewCompanyInfo) — dữ liệu section
 * @output : CompanyInfo — section vừa tạo
 */
export async function createCompanyInfo(data: NewCompanyInfo) {
  const results = await db
    .insert(companyInfo)
    .values({
      ...data,
      updatedAt: new Date(),
    })
    .returning();
  return results[0];
}

/**
 * Cập nhật section theo ID
 * @input  : id (string), data (Partial<NewCompanyInfo>) — dữ liệu cần cập nhật
 * @output : CompanyInfo — section sau cập nhật
 */
export async function updateCompanyInfo(
  id: string,
  data: Partial<NewCompanyInfo>
) {
  const results = await db
    .update(companyInfo)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(companyInfo.id, id))
    .returning();
  return results[0];
}

/**
 * Xóa section theo ID
 * @input  : id (string) — UUID
 * @output : CompanyInfo — section đã xóa
 */
export async function deleteCompanyInfo(id: string) {
  const results = await db
    .delete(companyInfo)
    .where(eq(companyInfo.id, id))
    .returning();
  return results[0];
}

/**
 * Đếm tổng số sections
 * @output : number — tổng sections
 */
export async function countCompanyInfo() {
  const results = await db.select({ value: count() }).from(companyInfo);
  return results[0]?.value ?? 0;
}
