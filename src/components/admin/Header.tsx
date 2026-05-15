/**
 * @nhom        : Admin
 * @chucnang    : Header — thanh trên cùng với user info và actions
 * @lienquan    : src/app/(admin)/layout.tsx
 * @alias       : admin-header, top-bar
 */
"use client";

import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

/**
 * Header component
 * Hiển thị breadcrumb / title + nút đăng xuất
 */
export function Header() {
  const router = useRouter();

  /** Xử lý đăng xuất */
  const handleLogout = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="h-16 border-b border-[var(--border)] bg-[var(--card)] flex items-center justify-between px-6">
      {/* Bên trái — Title / Breadcrumb */}
      <div>
        <h2 className="text-sm font-medium text-[var(--muted-foreground)]">
          Hệ thống quản lý nội dung
        </h2>
      </div>

      {/* Bên phải — User actions */}
      <div className="flex items-center gap-4">
        {/* Nút đăng xuất */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Đăng xuất
        </Button>
      </div>
    </header>
  );
}
