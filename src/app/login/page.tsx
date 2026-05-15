/**
 * @nhom        : Auth
 * @chucnang    : Trang đăng nhập — form login Supabase Auth
 * @lienquan    : src/lib/supabase/client.ts, src/middleware.ts
 * @alias       : login-page, auth-page
 */
"use client";

import { useState } from "react";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

/**
 * Trang đăng nhập
 * Sử dụng Server Action để set cookies bảo mật trên server
 */
export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Xử lý đăng nhập
   * Gọi Server Action loginAction
   */
  const handleLogin = async (formData: FormData) => {
    setLoading(true);
    setError(null);

    const result = await loginAction(formData);

    // Nếu có lỗi, Server Action sẽ trả về object chứa { error }. 
    // Nếu thành công, Server Action sẽ tự redirect (quăng throw redirect).
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
      {/* Container chính */}
      <div className="w-full max-w-md px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            ADMINMANAGER
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Đăng nhập để quản lý nội dung
          </p>
        </div>

        {/* Form đăng nhập */}
        <form action={handleLogin} className="space-y-4">
          {/* Thông báo lỗi */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--foreground)] mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="admin@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--foreground)] mb-1.5"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--input)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
            />
          </div>

          {/* Nút đăng nhập */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 cursor-pointer"
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
                Đang đăng nhập...
              </span>
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-[var(--muted-foreground)] mt-8">
          © 2026 ADMINMANAGER. Powered by Supabase.
        </p>
      </div>
    </div>
  );
}
