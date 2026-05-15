/**
 * @nhom        : Admin / Settings
 * @chucnang    : Trang cài đặt — thông tin tài khoản + đổi mật khẩu
 * @lienquan    : src/lib/supabase/server.ts, src/lib/actions/auth.ts
 * @alias       : settings-page, account-settings
 */
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase/server";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = {
  title: "Cài đặt",
};

export default async function SettingsPage() {
  // Lấy thông tin user hiện tại
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Cài đặt</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Quản lý tài khoản và cấu hình hệ thống
        </p>
      </div>

      {/* Thông tin tài khoản */}
      <SettingsForm
        email={user?.email ?? ""}
        userId={user?.id ?? ""}
        createdAt={user?.created_at ?? ""}
        lastSignIn={user?.last_sign_in_at ?? ""}
      />
    </div>
  );
}
