/**
 * @nhom        : Server Actions
 * @chucnang    : Xử lý form submission cho module Company
 * @input       : FormData — dữ liệu từ form tạo/sửa company section
 * @output      : ActionResult — kết quả thao tác (success/error)
 * @lienquan    : src/lib/db/queries/company.ts, src/app/(admin)/company/
 * @alias       : company-actions, company-form-handler
 */
"use server";

import {
  createCompanyInfo,
  updateCompanyInfo,
  deleteCompanyInfo,
} from "@/lib/db/queries/company";
import { revalidatePath } from "next/cache";

/** Kiểu kết quả trả về cho Server Action */
export type ActionResult = {
  success: boolean;
  message: string;
  error?: string;
};

/**
 * Tạo company section mới
 * @input  : formData (FormData) — dữ liệu từ form
 * @output : ActionResult
 */
export async function createCompanyAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const key = formData.get("key") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isPublished = formData.get("isPublished") === "true";

    // Validate (kiểm tra) dữ liệu bắt buộc
    if (!key || !title) {
      return {
        success: false,
        message: "Thiếu thông tin bắt buộc",
        error: "Key và Title là bắt buộc",
      };
    }

    // SEO metadata
    const seoMeta = {
      metaTitle: (formData.get("seoMetaTitle") as string) || undefined,
      metaDescription:
        (formData.get("seoMetaDescription") as string) || undefined,
      ogImage: (formData.get("seoOgImage") as string) || undefined,
    };

    await createCompanyInfo({
      key,
      title,
      content: content || null,
      imageUrl: imageUrl || null,
      sortOrder,
      isPublished,
      seoMeta:
        seoMeta.metaTitle || seoMeta.metaDescription ? seoMeta : null,
    });

    // Xóa cache (revalidate) trang danh sách
    revalidatePath("/company");

    return {
      success: true,
      message: `Đã tạo section "${title}" thành công`,
    };
  } catch (error) {
    console.error("[createCompanyAction] Lỗi:", error);
    return {
      success: false,
      message: "Không thể tạo section",
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

/**
 * Cập nhật company section
 * @input  : id (string), formData (FormData)
 * @output : ActionResult
 */
export async function updateCompanyAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isPublished = formData.get("isPublished") === "true";

    if (!title) {
      return {
        success: false,
        message: "Thiếu thông tin bắt buộc",
        error: "Title là bắt buộc",
      };
    }

    const seoMeta = {
      metaTitle: (formData.get("seoMetaTitle") as string) || undefined,
      metaDescription:
        (formData.get("seoMetaDescription") as string) || undefined,
      ogImage: (formData.get("seoOgImage") as string) || undefined,
    };

    await updateCompanyInfo(id, {
      title,
      content: content || null,
      imageUrl: imageUrl || null,
      sortOrder,
      isPublished,
      seoMeta:
        seoMeta.metaTitle || seoMeta.metaDescription ? seoMeta : null,
    });

    revalidatePath("/company");
    revalidatePath(`/company/${id}/edit`);

    return {
      success: true,
      message: `Đã cập nhật "${title}" thành công`,
    };
  } catch (error) {
    console.error("[updateCompanyAction] Lỗi:", error);
    return {
      success: false,
      message: "Không thể cập nhật section",
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

/**
 * Xóa company section
 * @input  : id (string) — UUID section cần xóa
 * @output : ActionResult
 */
export async function deleteCompanyAction(id: string): Promise<ActionResult> {
  try {
    const deleted = await deleteCompanyInfo(id);

    if (!deleted) {
      return {
        success: false,
        message: "Không tìm thấy section",
        error: `Section ID: ${id} không tồn tại`,
      };
    }

    revalidatePath("/company");

    return {
      success: true,
      message: `Đã xóa section "${deleted.title}" thành công`,
    };
  } catch (error) {
    console.error("[deleteCompanyAction] Lỗi:", error);
    return {
      success: false,
      message: "Không thể xóa section",
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}
