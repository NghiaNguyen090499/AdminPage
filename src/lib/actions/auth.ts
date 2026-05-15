/**
 * @nhom        : Server Actions / Auth
 * @chucnang    : Xử lý đăng xuất — xóa session Supabase
 * @output      : Redirect về /login
 * @lienquan    : src/lib/supabase/server.ts, src/middleware.ts
 * @alias       : logout-action, signout
 */
"use server";

import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/**
 * Đăng xuất user — xóa session và redirect về trang login
 */
export async function logoutAction() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/**
 * Đăng nhập user — xác thực và tạo session
 */
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Vui lòng nhập đầy đủ email và mật khẩu" };
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}
