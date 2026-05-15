/**
 * @nhom        : Scripts
 * @chucnang    : Test kết nối Supabase (Auth + DB + Storage)
 * @lienquan    : .env.local, src/lib/supabase/client.ts
 * @alias       : test-supabase, supabase-test
 *
 * Chạy: npx tsx scripts/test-supabase.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Đọc biến môi trường
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("🔍 Kiểm tra biến môi trường Supabase...");
console.log(`   SUPABASE_URL:      ${SUPABASE_URL ? "✅ " + SUPABASE_URL : "❌ Thiếu"}`);
console.log(`   ANON_KEY:          ${ANON_KEY ? "✅ Có (" + ANON_KEY.length + " ký tự)" : "❌ Thiếu"}`);
console.log(`   SERVICE_ROLE_KEY:  ${SERVICE_KEY ? "✅ Có (" + SERVICE_KEY.length + " ký tự)" : "❌ Thiếu"}`);

if (!SUPABASE_URL || !ANON_KEY) {
  console.error("\n❌ Thiếu SUPABASE_URL hoặc ANON_KEY");
  process.exit(1);
}

async function testSupabase() {
  // Test 1: Anon client
  console.log("\n📡 Test Supabase Anon Client...");
  try {
    const anonClient = createClient(SUPABASE_URL!, ANON_KEY!);

    // Test query — đếm bảng company_info
    const { data, error } = await anonClient.from("company_info").select("id", { count: "exact", head: true });

    if (error) {
      console.log(`   ⚠️  Query lỗi: ${error.message}`);
      console.log(`   (Có thể do RLS — Row Level Security chặn anon access, đây là bình thường)`);
    } else {
      console.log(`   ✅ Anon client hoạt động!`);
    }
  } catch (err: unknown) {
    const e = err as Error;
    console.error(`   ❌ Lỗi: ${e.message}`);
  }

  // Test 2: Service role client (bypass RLS)
  if (SERVICE_KEY) {
    console.log("\n📡 Test Supabase Service Role Client...");
    try {
      const serviceClient = createClient(SUPABASE_URL!, SERVICE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      // Query đếm records trong mỗi bảng
      const tables = ["company_info", "team_members", "services", "product_categories", "products"];

      for (const table of tables) {
        const { count, error } = await serviceClient.from(table).select("*", { count: "exact", head: true });
        if (error) {
          console.log(`   ❌ ${table}: ${error.message}`);
        } else {
          console.log(`   ✅ ${table}: ${count ?? 0} records`);
        }
      }

      console.log("\n   ✅ Service Role client hoạt động!");
    } catch (err: unknown) {
      const e = err as Error;
      console.error(`   ❌ Lỗi: ${e.message}`);
    }
  }

  // Test 3: Storage
  console.log("\n📡 Test Supabase Storage...");
  try {
    const client = createClient(SUPABASE_URL!, SERVICE_KEY || ANON_KEY!);
    const { data, error } = await client.storage.listBuckets();
    if (error) {
      console.log(`   ⚠️  Storage: ${error.message}`);
    } else {
      console.log(`   ✅ Storage hoạt động! Buckets: ${data.length}`);
      data.forEach((b) => console.log(`      - ${b.name} (${b.public ? "public" : "private"})`));
    }
  } catch (err: unknown) {
    const e = err as Error;
    console.error(`   ❌ Lỗi: ${e.message}`);
  }

  console.log("\n🎉 Hoàn tất test Supabase.");
}

testSupabase();
