/**
 * @nhom        : Server Actions
 * @chucnang    : Xử lý form submission cho module Team Members
 * @input       : FormData — dữ liệu từ form tạo/sửa thành viên
 * @output      : ActionResult — kết quả thao tác (success/error)
 * @lienquan    : src/lib/db/queries/team.ts, src/app/(admin)/team/
 * @alias       : team-actions, team-form-handler
 */
"use server";

import {
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "@/lib/db/queries/team";
import { revalidatePath } from "next/cache";

/** Kiểu kết quả trả về cho Server Action */
export type ActionResult = {
  success: boolean;
  message: string;
  error?: string;
};

/**
 * Trích xuất social links từ FormData
 * @input  : formData (FormData) — dữ liệu form
 * @output : object | null — social links hoặc null nếu tất cả rỗng
 */
function extractSocialLinks(formData: FormData) {
  const linkedin = (formData.get("socialLinkedin") as string) || undefined;
  const twitter = (formData.get("socialTwitter") as string) || undefined;
  const github = (formData.get("socialGithub") as string) || undefined;
  const website = (formData.get("socialWebsite") as string) || undefined;

  // Nếu tất cả rỗng → trả về null
  if (!linkedin && !twitter && !github && !website) return null;
  return { linkedin, twitter, github, website };
}

/**
 * Tạo thành viên mới
 * @input  : formData (FormData) — dữ liệu từ form
 * @output : ActionResult
 */
export async function createTeamAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const fullName = formData.get("fullName") as string;
    const position = formData.get("position") as string;
    const bio = formData.get("bio") as string;
    const avatarUrl = formData.get("avatarUrl") as string;
    const email = formData.get("email") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isPublished = formData.get("isPublished") === "true";

    // Validate (kiểm tra) dữ liệu bắt buộc
    if (!fullName || !position) {
      return {
        success: false,
        message: "Thiếu thông tin bắt buộc",
        error: "Họ tên và Chức vụ là bắt buộc",
      };
    }

    const socialLinks = extractSocialLinks(formData);

    await createTeamMember({
      fullName,
      position,
      bio: bio || null,
      avatarUrl: avatarUrl || null,
      email: email || null,
      socialLinks,
      sortOrder,
      isPublished,
    });

    // Xóa cache (revalidate) trang danh sách
    revalidatePath("/team");

    return {
      success: true,
      message: `Đã thêm thành viên "${fullName}" thành công`,
    };
  } catch (error) {
    console.error("[createTeamAction] Lỗi:", error);
    return {
      success: false,
      message: "Không thể tạo thành viên",
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

/**
 * Cập nhật thành viên
 * @input  : id (string), formData (FormData)
 * @output : ActionResult
 */
export async function updateTeamAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const fullName = formData.get("fullName") as string;
    const position = formData.get("position") as string;
    const bio = formData.get("bio") as string;
    const avatarUrl = formData.get("avatarUrl") as string;
    const email = formData.get("email") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isPublished = formData.get("isPublished") === "true";

    if (!fullName || !position) {
      return {
        success: false,
        message: "Thiếu thông tin bắt buộc",
        error: "Họ tên và Chức vụ là bắt buộc",
      };
    }

    const socialLinks = extractSocialLinks(formData);

    await updateTeamMember(id, {
      fullName,
      position,
      bio: bio || null,
      avatarUrl: avatarUrl || null,
      email: email || null,
      socialLinks,
      sortOrder,
      isPublished,
    });

    revalidatePath("/team");
    revalidatePath(`/team/${id}/edit`);

    return {
      success: true,
      message: `Đã cập nhật "${fullName}" thành công`,
    };
  } catch (error) {
    console.error("[updateTeamAction] Lỗi:", error);
    return {
      success: false,
      message: "Không thể cập nhật thành viên",
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

/**
 * Xóa thành viên
 * @input  : id (string) — UUID thành viên cần xóa
 * @output : ActionResult
 */
export async function deleteTeamAction(id: string): Promise<ActionResult> {
  try {
    const deleted = await deleteTeamMember(id);

    if (!deleted) {
      return {
        success: false,
        message: "Không tìm thấy thành viên",
        error: `Thành viên ID: ${id} không tồn tại`,
      };
    }

    revalidatePath("/team");

    return {
      success: true,
      message: `Đã xóa thành viên "${deleted.fullName}" thành công`,
    };
  } catch (error) {
    console.error("[deleteTeamAction] Lỗi:", error);
    return {
      success: false,
      message: "Không thể xóa thành viên",
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}
