/**
 * @nhom        : Scripts
 * @chucnang    : Nạp dữ liệu mẫu ban đầu cho tất cả module
 * @input       : Biến môi trường DATABASE_URL
 * @output      : Dữ liệu mẫu trong DB (company, team, services, categories, products)
 * @lienquan    : src/lib/db/schema.ts
 * @alias       : seed-data, init-data
 *
 * Chạy: npx tsx scripts/seed-data.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  companyInfo,
  teamMembers,
  services,
  productCategories,
  products,
} from "../src/lib/db/schema";

// Kết nối DB
const client = postgres(process.env.DATABASE_URL!, { prepare: false, max: 1 });
const db = drizzle(client);

async function seed() {
  console.log("🌱 Bắt đầu nạp dữ liệu mẫu...\n");

  // ============================================================
  // 1. COMPANY INFO — Thông tin giới thiệu
  // ============================================================
  console.log("📝 Nạp company_info...");
  const companyData = [
    {
      key: "about",
      title: "Giới thiệu công ty",
      content:
        "Chúng tôi là công ty công nghệ hàng đầu chuyên cung cấp giải pháp phần mềm và dịch vụ IT cho doanh nghiệp. Với hơn 10 năm kinh nghiệm, đội ngũ hơn 50 kỹ sư, chúng tôi tự hào mang đến những sản phẩm chất lượng cao, đáp ứng mọi nhu cầu chuyển đổi số.",
      sortOrder: 0,
      isPublished: true,
      seoMeta: {
        metaTitle: "Giới thiệu - TechCorp Việt Nam",
        metaDescription:
          "Tìm hiểu về TechCorp - công ty công nghệ hàng đầu Việt Nam",
      },
    },
    {
      key: "vision",
      title: "Tầm nhìn",
      content:
        "Trở thành công ty công nghệ hàng đầu Đông Nam Á vào năm 2030, dẫn dắt xu hướng chuyển đổi số và đổi mới sáng tạo trong khu vực.",
      sortOrder: 1,
      isPublished: true,
      seoMeta: null,
    },
    {
      key: "mission",
      title: "Sứ mệnh",
      content:
        "Mang công nghệ tiên tiến đến mọi doanh nghiệp, giúp khách hàng tối ưu hóa quy trình, nâng cao hiệu suất và tạo giá trị bền vững.",
      sortOrder: 2,
      isPublished: true,
      seoMeta: null,
    },
    {
      key: "history",
      title: "Lịch sử hình thành",
      content:
        "2015 - Thành lập với 5 thành viên\n2017 - Đạt 100 khách hàng đầu tiên\n2019 - Mở rộng đội ngũ lên 30 người\n2022 - Đạt doanh thu 10 tỷ VNĐ\n2024 - Ra mắt sản phẩm SaaS đầu tiên\n2025 - Mở văn phòng tại Singapore",
      sortOrder: 3,
      isPublished: true,
      seoMeta: null,
    },
  ];

  await db.insert(companyInfo).values(companyData);
  console.log(`   ✅ ${companyData.length} sections`);

  // ============================================================
  // 2. TEAM MEMBERS — Đội ngũ
  // ============================================================
  console.log("👥 Nạp team_members...");
  const teamData = [
    {
      fullName: "Nguyễn Văn An",
      position: "CEO & Founder",
      bio: "Hơn 15 năm kinh nghiệm trong ngành IT. Từng làm việc tại Google và Microsoft trước khi sáng lập TechCorp.",
      email: "an.nguyen@techcorp.vn",
      sortOrder: 0,
      isPublished: true,
      socialLinks: {
        linkedin: "https://linkedin.com/in/nguyenvanan",
        twitter: "https://twitter.com/nguyenvanan",
      },
    },
    {
      fullName: "Trần Thị Bình",
      position: "CTO",
      bio: "Chuyên gia kiến trúc hệ thống với kinh nghiệm xây dựng hơn 50 dự án enterprise. Tiến sĩ CNTT tại ĐH Bách Khoa.",
      email: "binh.tran@techcorp.vn",
      sortOrder: 1,
      isPublished: true,
      socialLinks: {
        linkedin: "https://linkedin.com/in/tranthibinh",
        github: "https://github.com/binhtt",
      },
    },
    {
      fullName: "Lê Minh Cường",
      position: "Lead Developer",
      bio: "Full-stack developer với expertise về React, Node.js, và Cloud Architecture. 8 năm kinh nghiệm phát triển phần mềm.",
      email: "cuong.le@techcorp.vn",
      sortOrder: 2,
      isPublished: true,
      socialLinks: {
        github: "https://github.com/cuonglm",
        website: "https://cuongle.dev",
      },
    },
    {
      fullName: "Phạm Hồng Đào",
      position: "UX/UI Designer",
      bio: "Thiết kế trải nghiệm người dùng cho hơn 100 sản phẩm số. Đam mê tạo ra giao diện đẹp và dễ sử dụng.",
      email: "dao.pham@techcorp.vn",
      sortOrder: 3,
      isPublished: true,
      socialLinks: null,
    },
  ];

  await db.insert(teamMembers).values(teamData);
  console.log(`   ✅ ${teamData.length} thành viên`);

  // ============================================================
  // 3. SERVICES — Dịch vụ
  // ============================================================
  console.log("🔧 Nạp services...");
  const servicesData = [
    {
      name: "Phát triển Web Application",
      slug: "phat-trien-web",
      shortDescription:
        "Xây dựng ứng dụng web hiện đại với React, Next.js, Node.js",
      fullDescription:
        "Chúng tôi cung cấp dịch vụ phát triển web toàn diện từ thiết kế UI/UX, xây dựng frontend/backend, đến triển khai và bảo trì. Sử dụng công nghệ tiên tiến nhất: React, Next.js, TypeScript, PostgreSQL.",
      icon: "Globe",
      sortOrder: 0,
      isPublished: true,
      seoMeta: {
        metaTitle: "Dịch vụ phát triển Web - TechCorp",
        metaDescription: "Phát triển ứng dụng web chuyên nghiệp với công nghệ mới nhất",
      },
    },
    {
      name: "Phát triển Mobile App",
      slug: "phat-trien-mobile",
      shortDescription:
        "Ứng dụng iOS/Android đa nền tảng với React Native & Flutter",
      fullDescription:
        "Thiết kế và phát triển ứng dụng di động cho iOS và Android. Hỗ trợ cả native và cross-platform, tối ưu hiệu suất và trải nghiệm người dùng.",
      icon: "Smartphone",
      sortOrder: 1,
      isPublished: true,
      seoMeta: null,
    },
    {
      name: "Tư vấn Cloud & DevOps",
      slug: "tu-van-cloud-devops",
      shortDescription:
        "Thiết kế hạ tầng cloud, CI/CD, containerization",
      fullDescription:
        "Tư vấn và triển khai hạ tầng cloud (AWS, GCP, Azure), xây dựng pipeline CI/CD, Docker, Kubernetes. Giúp doanh nghiệp tối ưu chi phí và tăng tốc phát triển.",
      icon: "Cloud",
      sortOrder: 2,
      isPublished: true,
      seoMeta: null,
    },
    {
      name: "AI & Machine Learning",
      slug: "ai-machine-learning",
      shortDescription:
        "Giải pháp AI/ML tùy chỉnh cho doanh nghiệp",
      fullDescription:
        "Xây dựng mô hình AI/ML phục vụ phân tích dữ liệu, dự đoán, chatbot thông minh, xử lý ngôn ngữ tự nhiên. Ứng dụng thực tế cho mọi ngành.",
      icon: "Brain",
      sortOrder: 3,
      isPublished: true,
      seoMeta: null,
    },
  ];

  await db.insert(services).values(servicesData);
  console.log(`   ✅ ${servicesData.length} dịch vụ`);

  // ============================================================
  // 4. PRODUCT CATEGORIES — Danh mục sản phẩm
  // ============================================================
  console.log("📂 Nạp product_categories...");
  const categoriesData = [
    {
      name: "Phần mềm quản lý",
      slug: "phan-mem-quan-ly",
      description: "Các sản phẩm phần mềm quản lý doanh nghiệp",
      sortOrder: 0,
    },
    {
      name: "Giải pháp SaaS",
      slug: "giai-phap-saas",
      description: "Phần mềm dạng dịch vụ (Software as a Service)",
      sortOrder: 1,
    },
    {
      name: "Công cụ nội bộ",
      slug: "cong-cu-noi-bo",
      description: "Công cụ dùng nội bộ cho đội ngũ phát triển",
      sortOrder: 2,
    },
  ];

  const insertedCategories = await db
    .insert(productCategories)
    .values(categoriesData)
    .returning();
  console.log(`   ✅ ${categoriesData.length} danh mục`);

  // ============================================================
  // 5. PRODUCTS — Sản phẩm
  // ============================================================
  console.log("📦 Nạp products...");
  const productsData = [
    {
      name: "TechCRM Pro",
      slug: "techcrm-pro",
      shortDescription:
        "Hệ thống quản lý quan hệ khách hàng chuyên nghiệp",
      fullDescription:
        "TechCRM Pro giúp doanh nghiệp quản lý toàn bộ vòng đời khách hàng: từ tiếp cận, tư vấn, chốt deal đến chăm sóc sau bán. Tích hợp email, chat, báo cáo thống kê.",
      categoryId: insertedCategories[0].id,
      isPublished: true,
      isFeatured: true,
      sortOrder: 0,
      images: [],
      seoMeta: {
        metaTitle: "TechCRM Pro - Phần mềm CRM hàng đầu",
        metaDescription: "Quản lý khách hàng hiệu quả với TechCRM Pro",
      },
    },
    {
      name: "CloudDeploy",
      slug: "cloud-deploy",
      shortDescription:
        "Nền tảng triển khai ứng dụng tự động lên cloud",
      fullDescription:
        "CloudDeploy đơn giản hóa việc deploy (triển khai) ứng dụng lên AWS, GCP, Azure. Hỗ trợ Docker, Kubernetes, auto-scaling và monitoring.",
      categoryId: insertedCategories[1].id,
      isPublished: true,
      isFeatured: true,
      sortOrder: 1,
      images: [],
      seoMeta: null,
    },
    {
      name: "DataSync Hub",
      slug: "datasync-hub",
      shortDescription:
        "Đồng bộ dữ liệu real-time giữa các hệ thống",
      fullDescription:
        "DataSync Hub cung cấp giải pháp đồng bộ dữ liệu thời gian thực giữa các database, API, và dịch vụ bên thứ 3. Hỗ trợ ETL pipeline và data transformation.",
      categoryId: insertedCategories[1].id,
      isPublished: true,
      isFeatured: false,
      sortOrder: 2,
      images: [],
      seoMeta: null,
    },
    {
      name: "DevKit Internal",
      slug: "devkit-internal",
      shortDescription:
        "Bộ công cụ phát triển nội bộ cho đội ngũ kỹ sư",
      fullDescription:
        "DevKit bao gồm code generator, testing framework, và documentation tools. Tăng năng suất phát triển lên 40% theo đo lường nội bộ.",
      categoryId: insertedCategories[2].id,
      isPublished: false,
      isFeatured: false,
      sortOrder: 3,
      images: [],
      seoMeta: null,
    },
  ];

  await db.insert(products).values(productsData);
  console.log(`   ✅ ${productsData.length} sản phẩm`);

  console.log("\n🎉 Nạp dữ liệu mẫu hoàn tất!");
  console.log("   - 4 company sections");
  console.log("   - 4 team members");
  console.log("   - 4 services");
  console.log("   - 3 product categories");
  console.log("   - 4 products");

  await client.end();
}

seed().catch((err) => {
  console.error("❌ Lỗi seed:", err);
  process.exit(1);
});
