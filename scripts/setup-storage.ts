/**
 * @nhom        : Scripts
 * @chucnang    : Tạo bucket "media" trên Supabase Storage nếu chưa tồn tại
 * @lienquan    : src/lib/supabase/storage.ts
 * @alias       : setup-storage, create-bucket
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function setupStorage() {
  console.log("🪣 Thiết lập Supabase Storage...\n");

  // Dùng service role key để có full quyền
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const BUCKET_NAME = "media";

  // Kiểm tra bucket đã tồn tại chưa
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    console.error("❌ Lỗi liệt kê buckets:", listError.message);
    process.exit(1);
  }

  const exists = buckets?.some((b) => b.name === BUCKET_NAME);

  if (exists) {
    console.log(`✅ Bucket "${BUCKET_NAME}" đã tồn tại.`);
  } else {
    // Tạo bucket mới — public để ảnh có thể truy cập trực tiếp
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg+xml",
      ],
    });

    if (createError) {
      console.error("❌ Lỗi tạo bucket:", createError.message);
      process.exit(1);
    }

    console.log(`✅ Đã tạo bucket "${BUCKET_NAME}" (public, max 5MB, chỉ ảnh)`);
  }

  // Tạo các folder con
  const folders = ["company", "team", "services", "products", "general"];
  for (const folder of folders) {
    // Upload file trống để tạo folder (Supabase Storage convention)
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(`${folder}/.keep`, new Blob([""]), {
        upsert: true,
      });

    if (error && !error.message.includes("already exists")) {
      console.warn(`  ⚠️ Folder "${folder}": ${error.message}`);
    } else {
      console.log(`  📁 Folder "${folder}" — OK`);
    }
  }

  console.log("\n✅ Thiết lập Storage hoàn tất!");
  console.log(`   URL: ${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/`);
  process.exit(0);
}

setupStorage();
