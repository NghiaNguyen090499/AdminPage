/**
 * @nhom        : Supabase
 * @chucnang    : Tạo Supabase client cho browser (Client Components)
 * @output      : createBrowserClient() — Supabase client instance
 * @lienquan    : src/lib/supabase/server.ts, src/lib/supabase/middleware.ts
 * @alias       : supabase-browser, client-supabase
 */
import { createBrowserClient as createClient } from "@supabase/ssr";

/**
 * Tạo Supabase client dùng trong browser (Client Components)
 * Sử dụng NEXT_PUBLIC_ env vars (công khai, an toàn cho client)
 */
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
