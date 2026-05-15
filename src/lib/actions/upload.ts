/**
 * @nhom        : Server Actions
 * @chucnang    : Xử lý upload/xóa file qua Supabase Storage
 * @input       : FormData chứa file + folder | fileUrl cần xóa
 * @output      : ActionResult với url hoặc error
 * @lienquan    : src/lib/supabase/storage.ts
 * @alias       : upload-action, file-upload-action
 */
"use server";

import { uploadFile, deleteFile } from "@/lib/supabase/storage";

/** Kiểu kết quả trả về */
export type UploadResult = {
  success: boolean;
  url?: string;
  error?: string;
};

/**
 * Upload file lên Supabase Storage
 * @input  : formData (FormData) — chứa "file" (File) và "folder" (string)
 * @output : UploadResult — { success, url?, error? }
 */
export async function uploadFileAction(
  formData: FormData
): Promise<UploadResult> {
  try {
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "general";

    // Validate file tồn tại
    if (!file || file.size === 0) {
      return { success: false, error: "Chưa chọn file" };
    }

    // Validate kích thước (tối đa 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { success: false, error: "File quá lớn (tối đa 5MB)" };
    }

    // Validate loại file (chỉ cho phép ảnh)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Định dạng không hỗ trợ. Chỉ chấp nhận: JPG, PNG, WebP, GIF, SVG",
      };
    }

    // Upload qua storage helper
    const result = await uploadFile(file, folder);

    if (result.error) {
      return { success: false, error: result.error };
    }

    return { success: true, url: result.url };
  } catch (error) {
    console.error("[uploadFileAction] Lỗi:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

/**
 * Xóa file khỏi Supabase Storage
 * @input  : fileUrl (string) — URL đầy đủ của file cần xóa
 * @output : { success: boolean, error?: string }
 */
export async function deleteFileAction(
  fileUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!fileUrl) {
      return { success: false, error: "URL rỗng" };
    }

    const result = await deleteFile(fileUrl);
    return result;
  } catch (error) {
    console.error("[deleteFileAction] Lỗi:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}
