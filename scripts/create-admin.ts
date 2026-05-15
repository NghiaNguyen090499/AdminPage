/**
 * @nhom        : Scripts
 * @chucnang    : Tạo tài khoản admin đầu tiên trên Supabase Auth
 * @input       : Biến môi trường SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL
 * @output      : Thông tin user admin vừa tạo (in ra console)
 * @lienquan    : .env.local
 * @alias       : create-admin, seed-admin
 *
 * Chạy: npx tsx scripts/create-admin.ts
 */
import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

// Đọc biến môi trường từ .env.local
config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Kiểm tra biến môi trường
if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Tạo Supabase Admin client (dùng service role key)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Thông tin admin mặc định
const ADMIN_EMAIL = "admin@adminmanager.com";
const ADMIN_PASSWORD = "Admin@2026!";

async function createAdmin() {
  console.log("🔑 Đang tạo tài khoản admin...\n");

  // Kiểm tra user đã tồn tại chưa
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers?.users?.find((u) => u.email === ADMIN_EMAIL);

  if (existing) {
    console.log("⚠️  User admin đã tồn tại:");
    console.log(`   ID:    ${existing.id}`);
    console.log(`   Email: ${existing.email}`);
    console.log(`   Tạo:   ${existing.created_at}`);
    console.log("\n✅ Không cần tạo thêm.");
    return;
  }

  // Tạo user mới với service role (bypass email confirm)
  const { data, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true, // Tự động confirm email
    user_metadata: {
      full_name: "Admin",
      role: "admin",
    },
  });

  if (error) {
    console.error("❌ Lỗi tạo admin:", error.message);
    process.exit(1);
  }

  console.log("✅ Tạo admin thành công!\n");
  console.log("   ┌─────────────────────────────────────────┐");
  console.log(`   │ Email:    ${ADMIN_EMAIL}          │`);
  console.log(`   │ Password: ${ADMIN_PASSWORD}              │`);
  console.log(`   │ ID:       ${data.user.id}   │`);
  console.log("   └─────────────────────────────────────────┘");
  console.log("\n📌 Dùng thông tin trên để đăng nhập tại /login");
}

createAdmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Lỗi:", err);
    process.exit(1);
  });
