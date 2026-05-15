/**
 * @nhom        : Database / Queries
 * @chucnang    : CRUD query functions cho landing_pages, landing_sections, landing_items
 * @input       : Dữ liệu landing page / section / item
 * @output      : LandingPage[] / LandingSection[] / LandingItem[]
 * @lienquan    : src/lib/db/schema.ts, src/types/database.ts
 * @alias       : landing-queries, landing-crud
 */
import { eq, asc, count, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { landingPages, landingSections, landingItems } from "@/lib/db/schema";
import type { NewLandingPage, NewLandingSection, NewLandingItem } from "@/types/database";

// ============================================================
// LANDING PAGES — Quản lý trang landing
// ============================================================

/** Lấy tất cả landing pages — sắp xếp theo ngày tạo mới nhất */
export async function getAllLandingPages() {
  return db.select().from(landingPages).orderBy(asc(landingPages.createdAt));
}

/** Lấy landing page theo ID */
export async function getLandingPageById(id: string) {
  const results = await db
    .select()
    .from(landingPages)
    .where(eq(landingPages.id, id))
    .limit(1);
  return results[0] ?? null;
}

/** Lấy landing page theo slug */
export async function getLandingPageBySlug(slug: string) {
  const results = await db
    .select()
    .from(landingPages)
    .where(eq(landingPages.slug, slug))
    .limit(1);
  return results[0] ?? null;
}

/**
 * Lấy landing page đầy đủ (kèm sections + items) theo slug
 * Dùng cho API public — trả về dữ liệu nested
 * Chỉ lấy sections/items visible + landing page đã published
 */
export async function getFullLandingPageBySlug(slug: string) {
  // Lấy landing page
  const page = await getLandingPageBySlug(slug);
  if (!page || page.status !== "published") return null;

  // Lấy tất cả sections của page (visible, sorted)
  const sections = await db
    .select()
    .from(landingSections)
    .where(
      and(
        eq(landingSections.landingPageId, page.id),
        eq(landingSections.isVisible, true)
      )
    )
    .orderBy(asc(landingSections.sortOrder));

  // Lấy items cho từng section (visible, sorted)
  const sectionsWithItems = await Promise.all(
    sections.map(async (section) => {
      const items = await db
        .select()
        .from(landingItems)
        .where(
          and(
            eq(landingItems.sectionId, section.id),
            eq(landingItems.isVisible, true)
          )
        )
        .orderBy(asc(landingItems.sortOrder));

      return { ...section, items };
    })
  );

  return { ...page, sections: sectionsWithItems };
}

/** Tạo landing page mới */
export async function createLandingPage(data: NewLandingPage) {
  const results = await db
    .insert(landingPages)
    .values({ ...data, updatedAt: new Date() })
    .returning();
  return results[0];
}

/** Cập nhật landing page */
export async function updateLandingPage(id: string, data: Partial<NewLandingPage>) {
  const results = await db
    .update(landingPages)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(landingPages.id, id))
    .returning();
  return results[0];
}

/** Xóa landing page (cascade xóa sections + items) */
export async function deleteLandingPage(id: string) {
  const results = await db
    .delete(landingPages)
    .where(eq(landingPages.id, id))
    .returning();
  return results[0];
}

/** Đếm landing pages */
export async function countLandingPages() {
  const results = await db.select({ value: count() }).from(landingPages);
  return results[0]?.value ?? 0;
}

// ============================================================
// LANDING SECTIONS — Quản lý sections trong page
// ============================================================

/** Lấy tất cả sections của một landing page */
export async function getSectionsByPageId(pageId: string) {
  return db
    .select()
    .from(landingSections)
    .where(eq(landingSections.landingPageId, pageId))
    .orderBy(asc(landingSections.sortOrder));
}

/** Lấy section theo ID */
export async function getSectionById(id: string) {
  const results = await db
    .select()
    .from(landingSections)
    .where(eq(landingSections.id, id))
    .limit(1);
  return results[0] ?? null;
}

/** Tạo section mới */
export async function createSection(data: NewLandingSection) {
  const results = await db
    .insert(landingSections)
    .values({ ...data, updatedAt: new Date() })
    .returning();
  return results[0];
}

/** Cập nhật section */
export async function updateSection(id: string, data: Partial<NewLandingSection>) {
  const results = await db
    .update(landingSections)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(landingSections.id, id))
    .returning();
  return results[0];
}

/** Xóa section (cascade xóa items) */
export async function deleteSection(id: string) {
  const results = await db
    .delete(landingSections)
    .where(eq(landingSections.id, id))
    .returning();
  return results[0];
}

// ============================================================
// LANDING ITEMS — Quản lý items trong section
// ============================================================

/** Lấy tất cả items của một section */
export async function getItemsBySectionId(sectionId: string) {
  return db
    .select()
    .from(landingItems)
    .where(eq(landingItems.sectionId, sectionId))
    .orderBy(asc(landingItems.sortOrder));
}

/** Lấy item theo ID */
export async function getItemById(id: string) {
  const results = await db
    .select()
    .from(landingItems)
    .where(eq(landingItems.id, id))
    .limit(1);
  return results[0] ?? null;
}

/** Tạo item mới */
export async function createItem(data: NewLandingItem) {
  const results = await db
    .insert(landingItems)
    .values({ ...data, updatedAt: new Date() })
    .returning();
  return results[0];
}

/** Cập nhật item */
export async function updateItem(id: string, data: Partial<NewLandingItem>) {
  const results = await db
    .update(landingItems)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(landingItems.id, id))
    .returning();
  return results[0];
}

/** Xóa item */
export async function deleteItem(id: string) {
  const results = await db
    .delete(landingItems)
    .where(eq(landingItems.id, id))
    .returning();
  return results[0];
}
