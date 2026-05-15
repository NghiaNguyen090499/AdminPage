"use client";
/**
 * @nhom        : Admin / Settings
 * @chucnang    : Form cài đặt — hiển thị thông tin tài khoản + đổi mật khẩu
 * @input       : email, userId, createdAt, lastSignIn — thông tin user
 * @lienquan    : src/app/(admin)/settings/page.tsx
 * @alias       : settings-form, account-form
 */
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SettingsFormProps {
  email: string;
  userId: string;
  createdAt: string;
  lastSignIn: string;
}

export function SettingsForm({
  email,
  userId,
  createdAt,
  lastSignIn,
}: SettingsFormProps) {
  // State cho đổi mật khẩu
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  /** Format ngày tháng */
  const fmtDate = (d: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /** Xử lý đổi mật khẩu */
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validate
    if (newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Mật khẩu mới phải có ít nhất 8 ký tự",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Mật khẩu xác nhận không khớp",
      });
      return;
    }

    setLoading(true);
    try {
      const { changePasswordAction } = await import(
        "@/lib/actions/settings"
      );
      const result = await changePasswordAction(newPassword);

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: result.error || result.message });
      }
    } catch {
      setMessage({ type: "error", text: "Lỗi khi đổi mật khẩu" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Thông tin tài khoản */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Thông tin tài khoản
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="flex items-center gap-2">
              <Input value={email} disabled className="opacity-60" />
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Đã xác thực
              </span>
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-3 rounded-lg bg-[var(--muted)]/50 space-y-1">
              <p className="text-xs text-[var(--muted-foreground)]">
                User ID
              </p>
              <p className="text-xs font-mono text-[var(--foreground)] break-all">
                {userId || "—"}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--muted)]/50 space-y-1">
              <p className="text-xs text-[var(--muted-foreground)]">Vai trò</p>
              <p className="text-sm font-medium text-[var(--foreground)]">
                Super Admin
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--muted)]/50 space-y-1">
              <p className="text-xs text-[var(--muted-foreground)]">
                Ngày tạo
              </p>
              <p className="text-sm text-[var(--foreground)]">
                {fmtDate(createdAt)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--muted)]/50 space-y-1">
              <p className="text-xs text-[var(--muted-foreground)]">
                Đăng nhập gần nhất
              </p>
              <p className="text-sm text-[var(--foreground)]">
                {fmtDate(lastSignIn)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Đổi mật khẩu */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Đổi mật khẩu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Thông báo */}
            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.type === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                    : "bg-red-500/10 border border-red-500/20 text-red-400"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="newPassword">
                Mật khẩu mới <span className="text-red-400">*</span>
              </Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ít nhất 8 ký tự"
                required
                minLength={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Xác nhận mật khẩu <span className="text-red-400">*</span>
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                required
                minLength={8}
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              className="cursor-pointer min-w-[160px]"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                "Đổi mật khẩu"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Thông tin hệ thống */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Thông tin hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-[var(--muted)]/50 space-y-1">
              <p className="text-xs text-[var(--muted-foreground)]">Phiên bản</p>
              <p className="text-sm font-medium text-[var(--foreground)]">
                v0.1.0 — MVP
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--muted)]/50 space-y-1">
              <p className="text-xs text-[var(--muted-foreground)]">
                Framework
              </p>
              <p className="text-sm font-medium text-[var(--foreground)]">
                Next.js 16 + Turbopack
              </p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--muted)]/50 space-y-1">
              <p className="text-xs text-[var(--muted-foreground)]">Database</p>
              <p className="text-sm font-medium text-[var(--foreground)]">
                Supabase PostgreSQL
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
