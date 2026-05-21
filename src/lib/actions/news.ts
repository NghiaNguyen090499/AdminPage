"use server";

import {
  createNewsArticle,
  updateNewsArticle,
  deleteNewsArticle,
} from "@/lib/db/queries/news";
import { revalidatePath } from "next/cache";

export type ActionResult = {
  success: boolean;
  message: string;
  error?: string;
};

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

export async function createNewsArticleAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const title = formData.get("title") as string;
    const slug = (formData.get("slug") as string) || generateSlug(title);
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const coverImageUrl = formData.get("coverImageUrl") as string;
    const imageFit = (formData.get("imageFit") as string) || "cover";
    const publishedAtRaw = formData.get("publishedAt") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isPublished = formData.get("isPublished") === "true";

    if (!title || !slug) {
      return {
        success: false,
        message: "Thiếu thông tin",
        error: "Tiêu đề và Slug là bắt buộc",
      };
    }

    const seoMeta = {
      metaTitle: (formData.get("seoMetaTitle") as string) || undefined,
      metaDescription:
        (formData.get("seoMetaDescription") as string) || undefined,
      ogImage: (formData.get("seoOgImage") as string) || undefined,
    };

    await createNewsArticle({
      title,
      slug,
      excerpt: excerpt || null,
      content: content || null,
      coverImageUrl: coverImageUrl || null,
      imageFit,
      publishedAt: publishedAtRaw ? new Date(publishedAtRaw) : null,
      sortOrder,
      isPublished,
      seoMeta:
        seoMeta.metaTitle || seoMeta.metaDescription || seoMeta.ogImage
          ? seoMeta
          : null,
    });

    revalidatePath("/news");
    return { success: true, message: `Đã tạo bài viết "${title}"` };
  } catch (error) {
    console.error("[createNewsArticleAction] Lỗi:", error);
    const isUnique = error instanceof Error && error.message.includes("unique");
    return {
      success: false,
      message: isUnique ? "Slug đã tồn tại" : "Không thể tạo bài viết",
      error:
        error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

export async function updateNewsArticleAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const coverImageUrl = formData.get("coverImageUrl") as string;
    const imageFit = (formData.get("imageFit") as string) || "cover";
    const publishedAtRaw = formData.get("publishedAt") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isPublished = formData.get("isPublished") === "true";

    if (!title || !slug) {
      return {
        success: false,
        message: "Thiếu thông tin",
        error: "Tiêu đề và Slug là bắt buộc",
      };
    }

    const seoMeta = {
      metaTitle: (formData.get("seoMetaTitle") as string) || undefined,
      metaDescription:
        (formData.get("seoMetaDescription") as string) || undefined,
      ogImage: (formData.get("seoOgImage") as string) || undefined,
    };

    await updateNewsArticle(id, {
      title,
      slug,
      excerpt: excerpt || null,
      content: content || null,
      coverImageUrl: coverImageUrl || null,
      imageFit,
      publishedAt: publishedAtRaw ? new Date(publishedAtRaw) : null,
      sortOrder,
      isPublished,
      seoMeta:
        seoMeta.metaTitle || seoMeta.metaDescription || seoMeta.ogImage
          ? seoMeta
          : null,
    });

    revalidatePath("/news");
    revalidatePath(`/news/${id}/edit`);
    return { success: true, message: `Đã cập nhật "${title}"` };
  } catch (error) {
    console.error("[updateNewsArticleAction] Lỗi:", error);
    return {
      success: false,
      message: "Không thể cập nhật bài viết",
      error:
        error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

export async function deleteNewsArticleAction(
  id: string
): Promise<ActionResult> {
  try {
    const deleted = await deleteNewsArticle(id);
    if (!deleted) {
      return {
        success: false,
        message: "Không tìm thấy bài viết",
        error: `ID: ${id} không tồn tại`,
      };
    }
    revalidatePath("/news");
    return { success: true, message: `Đã xóa "${deleted.title}"` };
  } catch (error) {
    console.error("[deleteNewsArticleAction] Lỗi:", error);
    return {
      success: false,
      message: "Không thể xóa bài viết",
      error:
        error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}
