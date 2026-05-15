/**
 * @nhom        : Supabase
 * @chucnang    : Helper cho Next.js middleware — refresh session và bảo vệ routes
 * @input       : request (NextRequest) — request từ client
 * @output      : NextResponse — response với cookies đã cập nhật
 * @lienquan    : src/middleware.ts, src/lib/supabase/server.ts
 * @alias       : supabase-middleware, auth-guard
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Xử lý middleware cho Supabase Auth:
 * 1. Refresh session token (nếu hết hạn)
 * 2. Kiểm tra quyền truy cập admin routes
 * 3. Redirect về /login nếu chưa đăng nhập
 */
export async function updateSession(request: NextRequest) {
  // Tạo response mặc định — sẽ được bổ sung cookies
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Tạo Supabase client với cookie management
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Cập nhật cookies trên request (cho Server Components downstream)
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          // Tạo response mới với cookies đã cập nhật
          supabaseResponse = NextResponse.next({
            request,
          });

          // Cập nhật cookies trên response (gửi về browser)
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Lấy thông tin user hiện tại (đồng thời refresh session nếu cần)
  // QUAN TRỌNG: Không dùng getSession() — có thể bị giả mạo
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Danh sách path không cần đăng nhập
  const publicPaths = ["/login", "/api/v1"];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Redirect về /login nếu chưa đăng nhập và đang truy cập route được bảo vệ
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect về /dashboard nếu đã đăng nhập và đang ở /login
  if (user && request.nextUrl.pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
