/**
 * @nhom        : Server Actions / Settings
 * @chucnang    : Xử lý đổi mật khẩu qua Supabase Auth
 * @input       : newPassword (string) — mật khẩu mới
 * @output      : ActionResult — kết quả thao tác
 * @lienquan    : src/lib/supabase/server.ts
 * @alias       : settings-actions, change-password
 */
"use server";

import { createServerClient } from "@/lib/supabase/server";

export type ActionResult = {
  success: boolean;
  message: string;
  error?: string;
};

/**
 * Đổi mật khẩu user hiện tại
 * Sử dụng Supabase Auth updateUser API
 */
export async function changePasswordAction(
  newPassword: string
): Promise<ActionResult> {
  try {
    // Validate phía server
    if (!newPassword || newPassword.length < 8) {
      return {
        success: false,
        message: "Mật khẩu không hợp lệ",
        error: "Mật khẩu phải có ít nhất 8 ký tự",
      };
    }

    const supabase = await createServerClient();

    // Kiểm tra user đã đăng nhập
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        message: "Chưa đăng nhập",
        error: "Phiên đăng nhập đã hết hạn",
      };
    }

    // Đổi mật khẩu qua Supabase Auth
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        success: false,
        message: "Không thể đổi mật khẩu",
        error: error.message,
      };
    }

    return {
      success: true,
      message: "Đã đổi mật khẩu thành công",
    };
  } catch (error) {
    console.error("[changePasswordAction] Lỗi:", error);
    return {
      success: false,
      message: "Lỗi hệ thống",
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}
