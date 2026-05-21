/**
 * @nhom        : Server Actions
 * @chucnang    : Xử lý form submission cho module Services
 * @input       : FormData — dữ liệu từ form tạo/sửa dịch vụ
 * @output      : ActionResult — kết quả thao tác (success/error)
 * @lienquan    : src/lib/db/queries/services.ts, src/app/(admin)/services/
 * @alias       : services-actions, services-form-handler
 */
"use server";

import {
  createService,
  updateService,
  deleteService,
} from "@/lib/db/queries/services";
import { revalidatePath } from "next/cache";

/** Kiểu kết quả trả về cho Server Action */
export type ActionResult = {
  success: boolean;
  message: string;
  error?: string;
};

/**
 * Tạo slug từ tên dịch vụ
 * @input  : text (string) — "Phát triển Web" → "phat-trien-web"
 * @output : string — slug
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parsePillars(value: string): Array<{ title: string; text: string }> {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split(":");
      return {
        title: title?.trim() || "",
        text: rest.join(":").trim(),
      };
    })
    .filter((item) => item.title && item.text);
}

/**
 * Tạo dịch vụ mới
 * @input  : formData (FormData)
 * @output : ActionResult
 */
export async function createServiceAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const name = formData.get("name") as string;
    const slug = (formData.get("slug") as string) || generateSlug(name);
    const shortDescription = formData.get("shortDescription") as string;
    const fullDescription = formData.get("fullDescription") as string;
    const icon = formData.get("icon") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const imageFit = (formData.get("imageFit") as string) || "cover";
    const pillars = parsePillars((formData.get("pillars") as string) || "");
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isPublished = formData.get("isPublished") === "true";

    // Validate dữ liệu bắt buộc
    if (!name || !slug) {
      return {
        success: false,
        message: "Thiếu thông tin bắt buộc",
        error: "Tên dịch vụ và Slug là bắt buộc",
      };
    }

    // SEO metadata
    const seoMeta = {
      metaTitle: (formData.get("seoMetaTitle") as string) || undefined,
      metaDescription: (formData.get("seoMetaDescription") as string) || undefined,
      ogImage: (formData.get("seoOgImage") as string) || undefined,
    };

    await createService({
      name,
      slug,
      shortDescription: shortDescription || null,
      fullDescription: fullDescription || null,
      icon: icon || null,
      imageUrl: imageUrl || null,
      imageFit,
      pillars,
      sortOrder,
      isPublished,
      seoMeta: seoMeta.metaTitle || seoMeta.metaDescription ? seoMeta : null,
    });

    revalidatePath("/services");

    return {
      success: true,
      message: `Đã tạo dịch vụ "${name}" thành công`,
    };
  } catch (error) {
    console.error("[createServiceAction] Lỗi:", error);

    // Kiểm tra lỗi unique constraint (slug trùng)
    const isUnique = error instanceof Error && error.message.includes("unique");
    return {
      success: false,
      message: isUnique ? "Slug đã tồn tại" : "Không thể tạo dịch vụ",
      error: isUnique
        ? "Slug đã được sử dụng — vui lòng chọn slug khác"
        : error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

/**
 * Cập nhật dịch vụ
 * @input  : id (string), formData (FormData)
 * @output : ActionResult
 */
export async function updateServiceAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const fullDescription = formData.get("fullDescription") as string;
    const icon = formData.get("icon") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const imageFit = (formData.get("imageFit") as string) || "cover";
    const pillars = parsePillars((formData.get("pillars") as string) || "");
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isPublished = formData.get("isPublished") === "true";

    if (!name || !slug) {
      return {
        success: false,
        message: "Thiếu thông tin bắt buộc",
        error: "Tên dịch vụ và Slug là bắt buộc",
      };
    }

    const seoMeta = {
      metaTitle: (formData.get("seoMetaTitle") as string) || undefined,
      metaDescription: (formData.get("seoMetaDescription") as string) || undefined,
      ogImage: (formData.get("seoOgImage") as string) || undefined,
    };

    await updateService(id, {
      name,
      slug,
      shortDescription: shortDescription || null,
      fullDescription: fullDescription || null,
      icon: icon || null,
      imageUrl: imageUrl || null,
      imageFit,
      pillars,
      sortOrder,
      isPublished,
      seoMeta: seoMeta.metaTitle || seoMeta.metaDescription ? seoMeta : null,
    });

    revalidatePath("/services");
    revalidatePath(`/services/${id}/edit`);

    return {
      success: true,
      message: `Đã cập nhật "${name}" thành công`,
    };
  } catch (error) {
    console.error("[updateServiceAction] Lỗi:", error);
    return {
      success: false,
      message: "Không thể cập nhật dịch vụ",
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

/**
 * Xóa dịch vụ
 * @input  : id (string) — UUID
 * @output : ActionResult
 */
export async function deleteServiceAction(id: string): Promise<ActionResult> {
  try {
    const deleted = await deleteService(id);

    if (!deleted) {
      return {
        success: false,
        message: "Không tìm thấy dịch vụ",
        error: `Dịch vụ ID: ${id} không tồn tại`,
      };
    }

    revalidatePath("/services");

    return {
      success: true,
      message: `Đã xóa dịch vụ "${deleted.name}" thành công`,
    };
  } catch (error) {
    console.error("[deleteServiceAction] Lỗi:", error);
    return {
      success: false,
      message: "Không thể xóa dịch vụ",
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}
