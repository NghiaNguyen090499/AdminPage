/**
 * @nhom        : Database
 * @chucnang    : Tạo Drizzle client kết nối Supabase PostgreSQL
 * @output      : db (DrizzleInstance) — client truy vấn database
 * @lienquan    : drizzle.config.ts, src/lib/db/schema.ts
 * @alias       : drizzle-client, database-connection
 */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

/**
 * Tạo connection string từ biến môi trường
 * Lưu ý: Supabase Connection Pooler yêu cầu prepare: false
 */
const connectionString = process.env.DATABASE_URL!;

/**
 * Tạo PostgreSQL client
 * - prepare: false — bắt buộc khi dùng Supabase Connection Pooler (Transaction mode)
 * - max: 5 — cho phép chạy song song nhiều queries (dashboard cần 4 cùng lúc)
 * - idle_timeout: 20s — đóng connection idle sau 20 giây
 * - connect_timeout: 15s — timeout nếu không kết nối được trong 15 giây
 */
const client = postgres(connectionString, {
  prepare: false,
  max: 5,
  idle_timeout: 20,
  connect_timeout: 15,
});

/**
 * Drizzle ORM instance — dùng để truy vấn database
 * Import schema để có type inference (suy luận kiểu) tự động
 */
export const db = drizzle(client, { schema });
