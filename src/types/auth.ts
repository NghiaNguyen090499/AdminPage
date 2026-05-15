/**
 * @nhom        : Types
 * @chucnang    : Định nghĩa types cho Auth và RBAC
 * @lienquan    : src/lib/supabase/server.ts
 * @alias       : auth-types, role-types
 */

/** Vai trò người dùng trong hệ thống RBAC */
export type UserRole = "super_admin" | "editor" | "viewer";

/** Thông tin user đã đăng nhập */
export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  avatarUrl?: string;
}

/** Custom claims trong JWT — lưu role */
export interface CustomClaims {
  user_role: UserRole;
}
