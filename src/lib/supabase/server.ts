/**
 * @nhom        : Supabase
 * @chucnang    : Tạo Supabase client cho server (Server Components, Route Handlers, Server Actions)
 * @output      : createServerClient() — Supabase client instance (server-side)
 * @lienquan    : src/lib/supabase/client.ts, src/lib/supabase/middleware.ts
 * @alias       : supabase-server, server-supabase
 */
import { createServerClient as createClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Tạo Supabase client dùng trong server
 * Quản lý session qua cookies — cần thiết cho Auth
 *
 * Lưu ý: Hàm này là async vì cookies() trong Next.js 16 là async
 */
export async function createServerClient() {
  const cookieStore = await cookies();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Lấy tất cả cookies
        getAll() {
          return cookieStore.getAll();
        },
        // Đặt cookies — dùng try/catch vì Server Components không thể set cookies
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Bỏ qua lỗi — xảy ra khi gọi từ Server Component (read-only)
            // Middleware sẽ refresh session thay thế
          }
        },
      },
    }
  );
}
