/**
 * @nhom        : Scripts
 * @chucnang    : Test kết nối database Supabase PostgreSQL
 * @lienquan    : .env.local, src/lib/db/index.ts
 * @alias       : test-connection, db-test
 * 
 * Chạy: npx tsx scripts/test-db.ts
 */

import postgres from "postgres";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Đọc biến môi trường từ .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const DATABASE_URL = process.env.DATABASE_URL;
const DIRECT_URL = process.env.DIRECT_URL;

console.log("🔍 Kiểm tra biến môi trường...");
console.log(`   DATABASE_URL: ${DATABASE_URL ? "✅ Có" : "❌ Thiếu"}`);
console.log(`   DIRECT_URL:   ${DIRECT_URL ? "✅ Có" : "❌ Thiếu"}`);

if (!DATABASE_URL) {
  console.error("❌ Thiếu DATABASE_URL trong .env.local");
  process.exit(1);
}

async function testConnection() {
  console.log("\n📡 Test kết nối DATABASE_URL (pooler)...");

  try {
    // Test pooler connection
    const poolerClient = postgres(DATABASE_URL!, {
      prepare: false,
      max: 1,
      idle_timeout: 5,
      connect_timeout: 10,
    });

    const result = await poolerClient`SELECT NOW() as current_time, current_database() as db_name, version() as pg_version`;
    console.log(`   ✅ Kết nối thành công!`);
    console.log(`   📅 Thời gian server: ${result[0].current_time}`);
    console.log(`   🗄️  Database: ${result[0].db_name}`);
    console.log(`   🐘 PostgreSQL: ${(result[0].pg_version as string).split(",")[0]}`);

    // Kiểm tra bảng hiện có
    const tables = await poolerClient`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    console.log(`\n📋 Bảng trong schema 'public': ${tables.length} bảng`);
    tables.forEach((t) => {
      console.log(`   - ${t.table_name}`);
    });

    await poolerClient.end();
    console.log("\n✅ Test pooler connection hoàn tất.");
  } catch (error: unknown) {
    const err = error as Error;
    console.error(`   ❌ Lỗi kết nối pooler: ${err.message}`);
    process.exit(1);
  }

  // Test direct connection nếu có
  if (DIRECT_URL) {
    console.log("\n📡 Test kết nối DIRECT_URL (direct)...");
    try {
      const directClient = postgres(DIRECT_URL, {
        max: 1,
        idle_timeout: 5,
        connect_timeout: 10,
      });

      const result = await directClient`SELECT 1 as test`;
      console.log(`   ✅ Direct connection thành công! (test=${result[0].test})`);
      await directClient.end();
    } catch (error: unknown) {
      const err = error as Error;
      console.error(`   ⚠️  Lỗi direct connection: ${err.message}`);
      console.log("   (Direct connection có thể bị chặn bởi firewall, pooler vẫn hoạt động)");
    }
  }

  console.log("\n🎉 Hoàn tất test kết nối database.");
}

testConnection();
