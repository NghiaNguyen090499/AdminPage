/**
 * @nhom        : Proxy
 * @chucnang    : Next.js Proxy (thay thế Middleware) — bảo vệ routes, refresh session
 * @lienquan    : src/lib/supabase/middleware.ts
 * @alias       : auth-proxy, route-guard
 */
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Proxy chính — chạy trước mọi request (Next.js 16 convention)
 * Gọi updateSession() để:
 * 1. Refresh Supabase session token
 * 2. Redirect nếu chưa đăng nhập
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

/**
 * Config matcher — chỉ chạy middleware cho các routes cần thiết
 * Loại trừ: static files, images, favicon
 */
export const config = {
  matcher: [
    /*
     * Match tất cả request paths TRỪ:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - Các file có extension (ảnh, fonts, v.v.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
