/**
 * @nhom        : Database / Queries
 * @chucnang    : CRUD query functions cho bảng team_members
 * @input       : Dữ liệu thành viên (fullName, position, bio, ...)
 * @output      : TeamMember[] hoặc TeamMember — kết quả truy vấn
 * @lienquan    : src/lib/db/schema.ts, src/lib/db/index.ts, src/types/database.ts
 * @alias       : team-queries, team-crud
 */
import { eq, asc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { teamMembers } from "@/lib/db/schema";
import type { NewTeamMember } from "@/types/database";

/**
 * Lấy tất cả thành viên — sắp xếp theo sortOrder tăng dần
 * @output : TeamMember[] — danh sách thành viên
 */
export async function getAllTeamMembers() {
  return db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.sortOrder));
}

/**
 * Lấy 1 thành viên theo ID
 * @input  : id (string) — UUID của thành viên
 * @output : TeamMember | null
 */
export async function getTeamMemberById(id: string) {
  const results = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.id, id))
    .limit(1);
  return results[0] ?? null;
}

/**
 * Lấy danh sách thành viên đang hiển thị (published)
 * @output : TeamMember[] — chỉ lấy isPublished = true
 */
export async function getPublishedTeamMembers() {
  return db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.isPublished, true))
    .orderBy(asc(teamMembers.sortOrder));
}

/**
 * Tạo thành viên mới
 * @input  : data (NewTeamMember) — dữ liệu thành viên
 * @output : TeamMember — thành viên vừa tạo
 */
export async function createTeamMember(data: NewTeamMember) {
  const results = await db
    .insert(teamMembers)
    .values({
      ...data,
      updatedAt: new Date(),
    })
    .returning();
  return results[0];
}

/**
 * Cập nhật thành viên theo ID
 * @input  : id (string), data (Partial<NewTeamMember>) — dữ liệu cần cập nhật
 * @output : TeamMember — thành viên sau cập nhật
 */
export async function updateTeamMember(
  id: string,
  data: Partial<NewTeamMember>
) {
  const results = await db
    .update(teamMembers)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(teamMembers.id, id))
    .returning();
  return results[0];
}

/**
 * Xóa thành viên theo ID
 * @input  : id (string) — UUID
 * @output : TeamMember — thành viên đã xóa
 */
export async function deleteTeamMember(id: string) {
  const results = await db
    .delete(teamMembers)
    .where(eq(teamMembers.id, id))
    .returning();
  return results[0];
}

/**
 * Đếm tổng số thành viên
 * @output : number — tổng thành viên
 */
export async function countTeamMembers() {
  const results = await db.select({ value: count() }).from(teamMembers);
  return results[0]?.value ?? 0;
}
