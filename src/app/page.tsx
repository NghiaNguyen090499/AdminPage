/**
 * @nhom        : App
 * @chucnang    : Trang gốc — redirect về /dashboard hoặc /login
 * @lienquan    : src/middleware.ts
 * @alias       : root-page, home-redirect
 */
import { redirect } from "next/navigation";

/**
 * Trang "/" — redirect tự động về /dashboard
 * Middleware sẽ kiểm tra auth và redirect về /login nếu cần
 */
export default function RootPage() {
  redirect("/dashboard");
}
