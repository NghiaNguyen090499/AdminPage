/**
 * @nhom        : Supabase / Storage
 * @chucnang    : Helper functions cho Supabase Storage — upload, delete, get URL
 * @output      : URL ảnh public hoặc lỗi
 * @lienquan    : src/lib/supabase/server.ts
 * @alias       : storage-helper, file-upload
 */

import { createServerClient } from "@/lib/supabase/server";

/** Tên bucket lưu trữ media — tạo trên Supabase Dashboard */
const BUCKET_NAME = "media";

/**
 * Upload file lên Supabase Storage
 * @input  : file (File) — file cần upload
 * @input  : folder (string) — thư mục con (company, team, services, products)
 * @output : { url: string } | { error: string }
 */
export async function uploadFile(
  file: File,
  folder: string
): Promise<{ url?: string; error?: string }> {
  try {
    const supabase = await createServerClient();

    // Tạo tên file duy nhất — timestamp + tên gốc
    const timestamp = Date.now();
    const safeName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "-")
      .replace(/-+/g, "-");
    const filePath = `${folder}/${timestamp}-${safeName}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: "3600", // Cache 1 giờ
        upsert: false, // Không ghi đè file trùng
      });

    if (uploadError) {
      console.error("[uploadFile] Lỗi upload:", uploadError);
      return { error: uploadError.message };
    }

    // Lấy public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return { url: urlData.publicUrl };
  } catch (error) {
    console.error("[uploadFile] Lỗi:", error);
    return { error: error instanceof Error ? error.message : "Lỗi không xác định" };
  }
}

/**
 * Xóa file khỏi Supabase Storage
 * @input  : fileUrl (string) — URL đầy đủ của file
 * @output : { success: boolean, error?: string }
 */
export async function deleteFile(
  fileUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerClient();

    // Trích xuất path từ URL
    // URL format: https://<project>.supabase.co/storage/v1/object/public/media/<path>
    const urlObj = new URL(fileUrl);
    const pathParts = urlObj.pathname.split(`/storage/v1/object/public/${BUCKET_NAME}/`);
    if (pathParts.length < 2) {
      return { success: false, error: "URL không hợp lệ" };
    }
    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

/**
 * Lấy danh sách files trong folder
 * @input  : folder (string) — tên folder
 * @output : FileObject[] | error
 */
export async function listFiles(folder: string) {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folder, {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      return { files: [], error: error.message };
    }

    return { files: data };
  } catch (error) {
    return {
      files: [],
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}
