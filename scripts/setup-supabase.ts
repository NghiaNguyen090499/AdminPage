/**
 * @nhom        : Scripts
 * @chucnang    : Khởi tạo Supabase — tạo Storage bucket + admin user
 * @lienquan    : .env.local
 * @alias       : setup-supabase, init-admin
 *
 * Chạy: npx tsx scripts/setup-supabase.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Đọc biến môi trường
dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Thiếu SUPABASE_URL hoặc SERVICE_ROLE_KEY");
  process.exit(1);
}

// Tạo admin client (bypass RLS)
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function setupStorage() {
  console.log("\n📦 Thiết lập Storage bucket...");

  // Tạo bucket "media" — public (cho hiển thị ảnh)
  const { data, error } = await supabase.storage.createBucket("media", {
    public: true, // Ảnh có thể truy cập công khai qua URL
    fileSizeLimit: 5242880, // Giới hạn 5MB
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"],
  });

  if (error) {
    if (error.message.includes("already exists")) {
      console.log("   ✅ Bucket 'media' đã tồn tại");
    } else {
      console.error(`   ❌ Lỗi tạo bucket: ${error.message}`);
    }
  } else {
    console.log(`   ✅ Bucket '${data.name}' đã tạo thành công`);
  }

  // Kiểm tra bucket
  const { data: buckets } = await supabase.storage.listBuckets();
  console.log(`   📋 Buckets hiện có: ${buckets?.map((b) => b.name).join(", ")}`);
}

async function setupAdminUser() {
  console.log("\n👤 Thiết lập tài khoản admin...");

  const adminEmail = "admin@adminmanager.vn";
  const adminPassword = "Admin@2026!";

  // Kiểm tra user đã tồn tại chưa
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === adminEmail);

  if (existing) {
    console.log(`   ✅ Admin user đã tồn tại: ${adminEmail}`);
    console.log(`   📋 ID: ${existing.id}`);
    return;
  }

  // Tạo admin user mới
  const { data, error } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true, // Tự động xác nhận email
    user_metadata: {
      full_name: "Admin",
      role: "admin",
    },
  });

  if (error) {
    console.error(`   ❌ Lỗi tạo admin: ${error.message}`);
    return;
  }

  console.log(`   ✅ Admin user đã tạo:`);
  console.log(`   📧 Email: ${adminEmail}`);
  console.log(`   🔑 Password: ${adminPassword}`);
  console.log(`   📋 ID: ${data.user.id}`);
  console.log(`\n   ⚠️  GHI NHỚ: Đổi mật khẩu sau khi đăng nhập lần đầu!`);
}

async function main() {
  console.log("🚀 Khởi tạo Supabase cho ADMINMANAGER...");
  console.log(`   URL: ${SUPABASE_URL}`);

  await setupStorage();
  await setupAdminUser();

  console.log("\n🎉 Hoàn tất setup Supabase!");
}

main();
