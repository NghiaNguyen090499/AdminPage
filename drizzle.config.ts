/**
 * @nhom        : Cấu hình
 * @chucnang    : Cấu hình Drizzle Kit — quản lý migration và schema
 * @lienquan    : src/lib/db/schema.ts, src/lib/db/index.ts
 */
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Đường dẫn file schema
  schema: "./src/lib/db/schema.ts",

  // Thư mục chứa migration files
  out: "./drizzle",

  // Dialect (phương ngữ) database
  dialect: "postgresql",

  // Thông tin kết nối database
  // Dùng DIRECT_URL cho migrations (không qua pgbouncer)
  // Fallback về DATABASE_URL nếu không có DIRECT_URL
  dbCredentials: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL!,
  },

  // Verbose mode — hiển thị chi tiết khi chạy migration
  verbose: true,

  // Strict mode — yêu cầu xác nhận trước khi thay đổi
  strict: true,
});
