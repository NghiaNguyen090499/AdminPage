/**
 * @nhom        : Server Actions
 * @chucnang    : Xử lý form submission cho module Landing Pages
 * @input       : FormData — dữ liệu từ form landing page / section / item
 * @output      : ActionResult
 * @lienquan    : src/lib/db/queries/landing.ts
 * @alias       : landing-actions
 */
"use server";

import {
  createLandingPage, updateLandingPage, deleteLandingPage,
  createSection, updateSection, deleteSection,
  createItem, updateItem, deleteItem,
} from "@/lib/db/queries/landing";
import { revalidatePath } from "next/cache";

export type ActionResult = {
  success: boolean;
  message: string;
  error?: string;
  /** ID của record vừa tạo (dùng để redirect) */
  id?: string;
};

/** Tạo slug từ text — loại bỏ dấu tiếng Việt */
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

// ============================================================
// LANDING PAGE ACTIONS
// ============================================================

/** Tạo landing page mới */
export async function createLandingPageAction(formData: FormData): Promise<ActionResult> {
  try {
    const title = formData.get("title") as string;
    const slug = (formData.get("slug") as string) || generateSlug(title);
    const description = formData.get("description") as string;
    const status = (formData.get("status") as string) || "draft";
    const seoTitle = formData.get("seoTitle") as string;
    const seoDescription = formData.get("seoDescription") as string;
    const ogImage = formData.get("ogImage") as string;

    if (!title || !slug) {
      return { success: false, message: "Thiếu thông tin", error: "Tên và Slug là bắt buộc" };
    }

    const result = await createLandingPage({
      title,
      slug,
      description: description || null,
      status,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      ogImage: ogImage || null,
      publishedAt: status === "published" ? new Date() : null,
    });

    revalidatePath("/landing");
    return { success: true, message: `Đã tạo landing page "${title}"`, id: result.id };
  } catch (error) {
    console.error("[createLandingPageAction] Lỗi:", error);
    const isUnique = error instanceof Error && error.message.includes("unique");
    return {
      success: false,
      message: isUnique ? "Slug đã tồn tại" : "Không thể tạo landing page",
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

/** Cập nhật landing page */
export async function updateLandingPageAction(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const status = formData.get("status") as string;
    const seoTitle = formData.get("seoTitle") as string;
    const seoDescription = formData.get("seoDescription") as string;
    const ogImage = formData.get("ogImage") as string;

    if (!title || !slug) {
      return { success: false, message: "Thiếu thông tin", error: "Tên và Slug là bắt buộc" };
    }

    await updateLandingPage(id, {
      title,
      slug,
      description: description || null,
      status,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      ogImage: ogImage || null,
      publishedAt: status === "published" ? new Date() : undefined,
    });

    revalidatePath("/landing");
    revalidatePath(`/landing/${id}`);
    return { success: true, message: `Đã cập nhật "${title}"` };
  } catch (error) {
    console.error("[updateLandingPageAction] Lỗi:", error);
    return {
      success: false,
      message: "Không thể cập nhật",
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

/** Xóa landing page */
export async function deleteLandingPageAction(id: string): Promise<ActionResult> {
  try {
    const deleted = await deleteLandingPage(id);
    if (!deleted) {
      return { success: false, message: "Không tìm thấy", error: `ID: ${id} không tồn tại` };
    }
    revalidatePath("/landing");
    return { success: true, message: `Đã xóa "${deleted.title}"` };
  } catch (error) {
    console.error("[deleteLandingPageAction] Lỗi:", error);
    return {
      success: false,
      message: "Không thể xóa",
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

// ============================================================
// SECTION ACTIONS
// ============================================================

/** Tạo section mới cho landing page */
export async function createSectionAction(formData: FormData): Promise<ActionResult> {
  try {
    const landingPageId = formData.get("landingPageId") as string;
    const sectionType = formData.get("sectionType") as string;
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const description = formData.get("description") as string;
    const backgroundType = (formData.get("backgroundType") as string) || "none";
    const backgroundValue = formData.get("backgroundValue") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isVisible = formData.get("isVisible") !== "false";

    if (!landingPageId || !sectionType) {
      return { success: false, message: "Thiếu thông tin", error: "Landing page ID và loại section là bắt buộc" };
    }

    const result = await createSection({
      landingPageId,
      sectionType,
      title: title || null,
      subtitle: subtitle || null,
      description: description || null,
      backgroundType,
      backgroundValue: backgroundValue || null,
      sortOrder,
      isVisible,
    });

    revalidatePath(`/landing/${landingPageId}`);
    return { success: true, message: `Đã tạo section "${sectionType}"`, id: result.id };
  } catch (error) {
    console.error("[createSectionAction] Lỗi:", error);
    return {
      success: false,
      message: "Không thể tạo section",
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

/** Cập nhật section */
export async function updateSectionAction(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const landingPageId = formData.get("landingPageId") as string;
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const description = formData.get("description") as string;
    const backgroundType = formData.get("backgroundType") as string;
    const backgroundValue = formData.get("backgroundValue") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isVisible = formData.get("isVisible") !== "false";

    await updateSection(id, {
      title: title || null,
      subtitle: subtitle || null,
      description: description || null,
      backgroundType: backgroundType || "none",
      backgroundValue: backgroundValue || null,
      sortOrder,
      isVisible,
    });

    revalidatePath(`/landing/${landingPageId}`);
    return { success: true, message: "Đã cập nhật section" };
  } catch (error) {
    console.error("[updateSectionAction] Lỗi:", error);
    return {
      success: false,
      message: "Không thể cập nhật",
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

/** Xóa section */
export async function deleteSectionAction(id: string, landingPageId: string): Promise<ActionResult> {
  try {
    const deleted = await deleteSection(id);
    if (!deleted) {
      return { success: false, message: "Không tìm thấy section" };
    }
    revalidatePath(`/landing/${landingPageId}`);
    return { success: true, message: "Đã xóa section" };
  } catch (error) {
    console.error("[deleteSectionAction] Lỗi:", error);
    return {
      success: false,
      message: "Không thể xóa",
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

// ============================================================
// ITEM ACTIONS
// ============================================================

/** Tạo item mới cho section */
export async function createItemAction(formData: FormData): Promise<ActionResult> {
  try {
    const sectionId = formData.get("sectionId") as string;
    const landingPageId = formData.get("landingPageId") as string;
    const itemType = formData.get("itemType") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const icon = formData.get("icon") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const linkUrl = formData.get("linkUrl") as string;
    const linkText = formData.get("linkText") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isVisible = formData.get("isVisible") !== "false";

    // Parse metadata từ JSON string
    const metadataStr = formData.get("metadata") as string;
    let metadata: Record<string, unknown> | null = null;
    if (metadataStr) {
      try {
        metadata = JSON.parse(metadataStr);
      } catch {
        // Bỏ qua nếu không parse được
      }
    }

    if (!sectionId || !itemType) {
      return { success: false, message: "Thiếu thông tin", error: "Section ID và loại item là bắt buộc" };
    }

    const result = await createItem({
      sectionId,
      itemType,
      title: title || null,
      description: description || null,
      icon: icon || null,
      imageUrl: imageUrl || null,
      linkUrl: linkUrl || null,
      linkText: linkText || null,
      metadata,
      sortOrder,
      isVisible,
    });

    revalidatePath(`/landing/${landingPageId}`);
    return { success: true, message: `Đã tạo item "${title || itemType}"`, id: result.id };
  } catch (error) {
    console.error("[createItemAction] Lỗi:", error);
    return {
      success: false,
      message: "Không thể tạo item",
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

/** Cập nhật item */
export async function updateItemAction(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const landingPageId = formData.get("landingPageId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const icon = formData.get("icon") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const linkUrl = formData.get("linkUrl") as string;
    const linkText = formData.get("linkText") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isVisible = formData.get("isVisible") !== "false";

    // Parse metadata
    const metadataStr = formData.get("metadata") as string;
    let metadata: Record<string, unknown> | undefined;
    if (metadataStr) {
      try {
        metadata = JSON.parse(metadataStr);
      } catch {
        // Bỏ qua
      }
    }

    await updateItem(id, {
      title: title || null,
      description: description || null,
      icon: icon || null,
      imageUrl: imageUrl || null,
      linkUrl: linkUrl || null,
      linkText: linkText || null,
      metadata: metadata ?? undefined,
      sortOrder,
      isVisible,
    });

    revalidatePath(`/landing/${landingPageId}`);
    return { success: true, message: `Đã cập nhật item` };
  } catch (error) {
    console.error("[updateItemAction] Lỗi:", error);
    return {
      success: false,
      message: "Không thể cập nhật",
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

/** Xóa item */
export async function deleteItemAction(id: string, landingPageId: string): Promise<ActionResult> {
  try {
    const deleted = await deleteItem(id);
    if (!deleted) {
      return { success: false, message: "Không tìm thấy item" };
    }
    revalidatePath(`/landing/${landingPageId}`);
    return { success: true, message: "Đã xóa item" };
  } catch (error) {
    console.error("[deleteItemAction] Lỗi:", error);
    return {
      success: false,
      message: "Không thể xóa",
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}
