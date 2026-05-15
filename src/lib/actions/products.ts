/**
 * @nhom        : Server Actions
 * @chucnang    : Xử lý form submission cho module Products
 * @input       : FormData — dữ liệu từ form sản phẩm/danh mục
 * @output      : ActionResult
 * @lienquan    : src/lib/db/queries/products.ts
 * @alias       : products-actions
 */
"use server";

import {
  createProduct, updateProduct, deleteProduct,
  createCategory, updateCategory, deleteCategory,
} from "@/lib/db/queries/products";
import { revalidatePath } from "next/cache";

export type ActionResult = {
  success: boolean;
  message: string;
  error?: string;
};

/** Tạo slug từ text */
function generateSlug(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// ============================================================
// PRODUCT ACTIONS
// ============================================================

export async function createProductAction(formData: FormData): Promise<ActionResult> {
  try {
    const name = formData.get("name") as string;
    const slug = (formData.get("slug") as string) || generateSlug(name);
    const shortDescription = formData.get("shortDescription") as string;
    const fullDescription = formData.get("fullDescription") as string;
    const categoryId = formData.get("categoryId") as string;
    const thumbnailUrl = formData.get("thumbnailUrl") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isPublished = formData.get("isPublished") === "true";
    const isFeatured = formData.get("isFeatured") === "true";

    if (!name || !slug) {
      return { success: false, message: "Thiếu thông tin", error: "Tên và Slug là bắt buộc" };
    }

    const seoMeta = {
      metaTitle: (formData.get("seoMetaTitle") as string) || undefined,
      metaDescription: (formData.get("seoMetaDescription") as string) || undefined,
    };

    await createProduct({
      name, slug,
      shortDescription: shortDescription || null,
      fullDescription: fullDescription || null,
      categoryId: categoryId || null,
      thumbnailUrl: thumbnailUrl || null,
      images: [],
      sortOrder, isPublished, isFeatured,
      seoMeta: seoMeta.metaTitle || seoMeta.metaDescription ? seoMeta : null,
    });

    revalidatePath("/products");
    return { success: true, message: `Đã tạo sản phẩm "${name}"` };
  } catch (error) {
    console.error("[createProductAction] Lỗi:", error);
    const isUnique = error instanceof Error && error.message.includes("unique");
    return { success: false, message: isUnique ? "Slug đã tồn tại" : "Không thể tạo sản phẩm", error: error instanceof Error ? error.message : "Lỗi không xác định" };
  }
}

export async function updateProductAction(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const shortDescription = formData.get("shortDescription") as string;
    const fullDescription = formData.get("fullDescription") as string;
    const categoryId = formData.get("categoryId") as string;
    const thumbnailUrl = formData.get("thumbnailUrl") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isPublished = formData.get("isPublished") === "true";
    const isFeatured = formData.get("isFeatured") === "true";

    if (!name || !slug) {
      return { success: false, message: "Thiếu thông tin", error: "Tên và Slug là bắt buộc" };
    }

    const seoMeta = {
      metaTitle: (formData.get("seoMetaTitle") as string) || undefined,
      metaDescription: (formData.get("seoMetaDescription") as string) || undefined,
    };

    await updateProduct(id, {
      name, slug,
      shortDescription: shortDescription || null,
      fullDescription: fullDescription || null,
      categoryId: categoryId || null,
      thumbnailUrl: thumbnailUrl || null,
      sortOrder, isPublished, isFeatured,
      seoMeta: seoMeta.metaTitle || seoMeta.metaDescription ? seoMeta : null,
    });

    revalidatePath("/products");
    revalidatePath(`/products/${id}/edit`);
    return { success: true, message: `Đã cập nhật "${name}"` };
  } catch (error) {
    console.error("[updateProductAction] Lỗi:", error);
    return { success: false, message: "Không thể cập nhật", error: error instanceof Error ? error.message : "Lỗi không xác định" };
  }
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  try {
    const deleted = await deleteProduct(id);
    if (!deleted) return { success: false, message: "Không tìm thấy sản phẩm", error: `ID: ${id} không tồn tại` };
    revalidatePath("/products");
    return { success: true, message: `Đã xóa "${deleted.name}"` };
  } catch (error) {
    console.error("[deleteProductAction] Lỗi:", error);
    return { success: false, message: "Không thể xóa", error: error instanceof Error ? error.message : "Lỗi không xác định" };
  }
}

// ============================================================
// CATEGORY ACTIONS
// ============================================================

export async function createCategoryAction(formData: FormData): Promise<ActionResult> {
  try {
    const name = formData.get("name") as string;
    const slug = (formData.get("slug") as string) || generateSlug(name);
    const description = formData.get("description") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

    if (!name || !slug) {
      return { success: false, message: "Thiếu thông tin", error: "Tên và Slug là bắt buộc" };
    }

    await createCategory({ name, slug, description: description || null, sortOrder });
    revalidatePath("/products");
    return { success: true, message: `Đã tạo danh mục "${name}"` };
  } catch (error) {
    console.error("[createCategoryAction] Lỗi:", error);
    const isUnique = error instanceof Error && error.message.includes("unique");
    return { success: false, message: isUnique ? "Slug đã tồn tại" : "Không thể tạo danh mục", error: error instanceof Error ? error.message : "Lỗi" };
  }
}

export async function updateCategoryAction(id: string, formData: FormData): Promise<ActionResult> {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

    if (!name || !slug) {
      return { success: false, message: "Thiếu thông tin", error: "Tên và Slug là bắt buộc" };
    }

    await updateCategory(id, { name, slug, description: description || null, sortOrder });
    revalidatePath("/products");
    return { success: true, message: `Đã cập nhật danh mục "${name}"` };
  } catch (error) {
    console.error("[updateCategoryAction] Lỗi:", error);
    return { success: false, message: "Không thể cập nhật", error: error instanceof Error ? error.message : "Lỗi" };
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    const deleted = await deleteCategory(id);
    if (!deleted) return { success: false, message: "Không tìm thấy danh mục", error: `ID: ${id} không tồn tại` };
    revalidatePath("/products");
    return { success: true, message: `Đã xóa danh mục "${deleted.name}"` };
  } catch (error) {
    console.error("[deleteCategoryAction] Lỗi:", error);
    return { success: false, message: "Không thể xóa", error: error instanceof Error ? error.message : "Lỗi" };
  }
}
