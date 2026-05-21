import { config } from "dotenv";
config({ path: ".env.local" });

import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import {
  productCategories,
  products,
  services,
  newsArticles,
} from "../src/lib/db/schema";

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  max: 1,
});
const db = drizzle(client);

const categorySeeds = [
  {
    name: "Hành chính công",
    slug: "hanh-chinh-cong",
    description: "Giải pháp tiếp dân, kiosk và hạ tầng cho cơ quan hành chính công",
    sortOrder: 0,
  },
  {
    name: "Chuyển đổi số",
    slug: "chuyen-doi-so",
    description: "Giải pháp số hóa quy trình và vận hành",
    sortOrder: 1,
  },
  {
    name: "Mobile Robot",
    slug: "mobile-robot",
    description: "Các giải pháp robot di động phục vụ vận hành",
    sortOrder: 2,
  },
  {
    name: "AI",
    slug: "ai",
    description: "Sản phẩm và giải pháp ứng dụng trí tuệ nhân tạo",
    sortOrder: 3,
  },
] as const;

const productSeeds = [
  {
    name: "KIOSK Tiếp Dân Thông Minh",
    slug: "kiosk-tiep-dan-thong-minh",
    categorySlug: "hanh-chinh-cong",
    shortDescription:
      "Kiosk ứng dụng AI hỗ trợ tiếp nhận, hướng dẫn và rút ngắn thời gian phục vụ người dân.",
    fullDescription:
      "Giải pháp tự động hóa tiếp dân cho cơ quan hành chính công, tích hợp xác thực, tra cứu thông tin, giao tiếp đa ngôn ngữ và kết nối hệ thống nghiệp vụ.",
    thumbnailUrl: "/images/arar/products/kiosk.jpg",
    imageFit: "contain",
    benefits: [
      "Giảm tải cho cán bộ tại quầy tiếp nhận.",
      "Nâng cao trải nghiệm người dân khi tra cứu và chuẩn bị hồ sơ.",
      "Tạo dữ liệu thống kê phục vụ quản lý chất lượng dịch vụ.",
    ],
    features: [
      "Nhận diện khuôn mặt và xác thực sinh trắc học",
      "Tra cứu thủ tục hành chính",
      "Giao tiếp tiếng Việt và tiếng Anh",
      "Báo cáo thống kê tự động",
    ],
    specs: [
      { label: "Màn hình", value: "15.6 inch Full HD cảm ứng" },
      { label: "Camera", value: "1080p hỗ trợ AI Face Recognition" },
      { label: "Kết nối", value: "Wi-Fi, Bluetooth, USB, Ethernet" },
    ],
    isFeatured: true,
    sortOrder: 0,
  },
  {
    name: "KIOSK Tiếp Dân Thông Minh v2",
    slug: "kiosk-thong-minh-v2",
    categorySlug: "hanh-chinh-cong",
    shortDescription:
      "Phiên bản nâng cấp với trải nghiệm tương tác tốt hơn và năng lực tích hợp sâu hơn.",
    fullDescription:
      "Kiosk v2 được tối ưu cho các điểm phục vụ có lưu lượng cao, hỗ trợ mở rộng module xác thực, thanh toán, lấy số và đánh giá hài lòng.",
    thumbnailUrl: "/images/arar/products/kiosk-v2.jpg",
    imageFit: "contain",
    benefits: [
      "Phù hợp trung tâm hành chính công nhiều quầy.",
      "Mở rộng linh hoạt theo quy trình địa phương.",
      "Dễ bảo trì và cập nhật nội dung hướng dẫn.",
    ],
    features: [
      "Module lấy số tự động",
      "Tích hợp đánh giá hài lòng",
      "Giao diện cảm ứng tối ưu",
      "Quản trị nội dung tập trung",
    ],
    specs: [
      { label: "Thiết kế", value: "Kiosk đứng, tùy chọn nhận diện và in ấn" },
      { label: "Triển khai", value: "Tại sảnh, bộ phận một cửa, trung tâm dịch vụ" },
    ],
    isFeatured: true,
    sortOrder: 1,
  },
  {
    name: "SMARTBUS",
    slug: "smartbus",
    categorySlug: "chuyen-doi-so",
    shortDescription:
      "Giải pháp giám sát và nâng cao an toàn cho dịch vụ đưa đón học sinh.",
    fullDescription:
      "SMARTBUS kết hợp thiết bị, dữ liệu hành trình và công cụ giám sát để nhà trường, đơn vị vận hành và phụ huynh theo dõi dịch vụ đưa đón minh bạch hơn.",
    thumbnailUrl: "/images/arar/products/smartbus.jpg",
    imageFit: "cover",
    benefits: [
      "Tăng an toàn cho học sinh trong suốt hành trình.",
      "Minh bạch trạng thái xe và điểm đón trả.",
      "Hỗ trợ vận hành đội xe hiệu quả hơn.",
    ],
    features: [
      "Theo dõi hành trình",
      "Cảnh báo sự kiện",
      "Báo cáo vận hành",
      "Kênh thông tin phụ huynh",
    ],
    specs: [
      { label: "Đối tượng", value: "Trường học, doanh nghiệp vận tải, khu đô thị" },
      { label: "Mô hình", value: "Thiết bị trên xe + nền tảng quản trị" },
    ],
    isFeatured: true,
    sortOrder: 2,
  },
  {
    name: "Robot Giám Sát",
    slug: "robot-giam-sat",
    categorySlug: "mobile-robot",
    shortDescription:
      "Robot tự động tuần tra, hỗ trợ giám sát an ninh tại nhà máy và khu vực rộng.",
    fullDescription:
      "Robot giám sát giúp tuần tra theo tuyến, ghi nhận hình ảnh, cảnh báo bất thường và hỗ trợ đội vận hành ra quyết định kịp thời.",
    thumbnailUrl: "/images/arar/products/robot-giam-sat.jpg",
    imageFit: "cover",
    benefits: [
      "Giảm rủi ro bỏ sót trong tuần tra thủ công.",
      "Hoạt động ổn định theo lịch định sẵn.",
      "Tăng khả năng phản ứng với sự cố.",
    ],
    features: [
      "Tự động điều hướng",
      "Camera giám sát",
      "Cảnh báo bất thường",
      "Quản lý tuyến tuần tra",
    ],
    specs: [
      { label: "Không gian", value: "Nhà máy, kho bãi, khuôn viên lớn" },
      { label: "Vận hành", value: "Theo tuyến và lịch tuần tra" },
    ],
    isFeatured: true,
    sortOrder: 3,
  },
  {
    name: "Robot Giao Hàng",
    slug: "robot-giao-hang",
    categorySlug: "mobile-robot",
    shortDescription:
      "Robot vận chuyển tự động trong kho, cơ sở thương mại, y tế và dịch vụ.",
    fullDescription:
      "Giải pháp hỗ trợ luân chuyển hàng hóa, vật tư hoặc tài liệu theo tuyến cố định, giảm thao tác lặp lại và tăng tính nhất quán trong vận hành.",
    thumbnailUrl: "/images/arar/products/robot-giao-hang.jpg",
    imageFit: "contain",
    benefits: [
      "Tối ưu vận chuyển nội bộ.",
      "Giảm tải công việc lặp lại.",
      "Theo dõi trạng thái giao nhận rõ ràng.",
    ],
    features: [
      "Điều hướng tự động",
      "Khoang chứa linh hoạt",
      "Giao nhận theo tuyến",
      "Báo cáo lượt vận chuyển",
    ],
    specs: [
      { label: "Ứng dụng", value: "Kho hàng, bệnh viện, văn phòng, nhà hàng" },
      { label: "Triển khai", value: "Theo bản đồ mặt bằng" },
    ],
    isFeatured: false,
    sortOrder: 4,
  },
  {
    name: "Robot Khử Khuẩn",
    slug: "robot-khu-khuan",
    categorySlug: "mobile-robot",
    shortDescription:
      "Robot tự động khử khuẩn cho khu vực công cộng, y tế và thương mại.",
    fullDescription:
      "Robot hỗ trợ làm sạch theo lịch, giảm tiếp xúc trực tiếp tại khu vực cần kiểm soát vệ sinh và tăng tính ổn định của quy trình khử khuẩn.",
    thumbnailUrl: "/images/arar/products/robot-khu-khuan.jpg",
    imageFit: "cover",
    benefits: [
      "Tăng cường kiểm soát vệ sinh.",
      "Tự động hóa quy trình lặp lại.",
      "Phù hợp khu vực có lưu lượng người cao.",
    ],
    features: [
      "Khử khuẩn theo lịch",
      "Điều hướng tránh vật cản",
      "Quản lý khu vực làm sạch",
      "Báo cáo hoạt động",
    ],
    specs: [
      { label: "Không gian", value: "Bệnh viện, trường học, sảnh dịch vụ, nhà máy" },
      { label: "Vận hành", value: "Tự động theo lịch" },
    ],
    isFeatured: false,
    sortOrder: 5,
  },
  {
    name: "AI Sales Assistant",
    slug: "ai-sales-assistant",
    categorySlug: "ai",
    shortDescription:
      "Trợ lý bán hàng AI hỗ trợ tư vấn, chăm sóc khách hàng và tự động hóa hội thoại.",
    fullDescription:
      "Giải pháp landing chuyên biệt của ARAR cho doanh nghiệp muốn tự động hóa tương tác khách hàng đa kênh và nâng cao hiệu quả đội bán hàng.",
    thumbnailUrl: "/images/landing/chatdash-conversation-optimized.png",
    imageFit: "contain",
    benefits: [
      "Tư vấn khách hàng liên tục 24/7.",
      "Chuẩn hóa kịch bản tư vấn.",
      "Tăng tốc phản hồi và phân loại nhu cầu.",
    ],
    features: [
      "Chatbot đa kênh",
      "Kịch bản tư vấn tùy chỉnh",
      "Thu thập lead",
      "Báo cáo hội thoại",
    ],
    specs: [
      { label: "Kênh", value: "Website, fanpage, nền tảng chat" },
      { label: "Trang landing", value: "/ai-sales-assistant" },
    ],
    isFeatured: true,
    sortOrder: 6,
  },
] as const;

const serviceSeeds = [
  {
    name: "Tự động hóa với Mobile Robot",
    slug: "mobile-robot",
    shortDescription:
      "Tự động hóa tuần tra, giao nhận, khử khuẩn và vận chuyển nội bộ bằng robot di động.",
    fullDescription:
      "ARAR tư vấn, tích hợp và vận hành các dòng robot di động phù hợp từng mặt bằng, giúp doanh nghiệp giảm công việc lặp lại và nâng chuẩn an toàn.",
    icon: "settings",
    imageUrl: "/images/arar/products/robot-giam-sat.jpg",
    imageFit: "cover",
    pillars: [
      {
        title: "Khảo sát mặt bằng",
        text: "Đánh giá tuyến di chuyển, điểm sạc, vùng rủi ro và quy trình vận hành.",
      },
      {
        title: "Tích hợp hệ thống",
        text: "Kết nối robot với phần mềm quản trị, cảnh báo và báo cáo.",
      },
      {
        title: "Vận hành bền vững",
        text: "Đào tạo, bảo trì và tối ưu lịch chạy theo dữ liệu thực tế.",
      },
    ],
    sortOrder: 0,
  },
  {
    name: "Chuyển đổi số",
    slug: "chuyen-doi-so",
    shortDescription:
      "Ứng dụng AI, dữ liệu và tự động hóa quy trình để tối ưu vận hành tổ chức.",
    fullDescription:
      "ARAR xây dựng giải pháp số theo nhu cầu thực tế: trợ lý AI, kiosk, dashboard quản trị, tích hợp dữ liệu và các công cụ tự động hóa nghiệp vụ.",
    icon: "brain",
    imageUrl: "/images/landing/chatdash-conversation-optimized.png",
    imageFit: "contain",
    pillars: [
      {
        title: "Tư vấn quy trình",
        text: "Xác định điểm nghẽn, dữ liệu cần thu thập và chỉ số đo hiệu quả.",
      },
      {
        title: "Triển khai AI",
        text: "Ứng dụng AI vào tư vấn, tra cứu, phân loại và hỗ trợ quyết định.",
      },
      {
        title: "Quản trị tập trung",
        text: "Theo dõi vận hành qua dashboard và báo cáo định kỳ.",
      },
    ],
    sortOrder: 1,
  },
  {
    name: "Giải pháp chuyên ngành cho Hành chính công",
    slug: "hanh-chinh-cong",
    shortDescription:
      "Danh mục thiết bị và hạ tầng CNTT theo mô hình chuẩn cho UBND phường/xã và trung tâm hành chính.",
    fullDescription:
      "Giải pháp bao phủ khu vực tiếp đón, giao dịch, nội bộ, hạ tầng mạng, an toàn thông tin và công cụ kiểm tra chính tả văn bản.",
    icon: "shield",
    imageUrl: "/images/arar/products/kiosk-v2.jpg",
    imageFit: "contain",
    pillars: [
      {
        title: "Tiếp đón & thông tin",
        text: "Màn hình LED, kiosk tra cứu TTHC, hệ thống lấy số tự động.",
      },
      {
        title: "Giao dịch & tác nghiệp",
        text: "Máy tính, máy in, scanner, đầu đọc CCCD, ký số và đánh giá hài lòng.",
      },
      {
        title: "Mạng & an toàn thông tin",
        text: "Firewall, router, core switch, Wi-Fi 6, endpoint protection và lưu trữ nội bộ.",
      },
    ],
    sortOrder: 2,
  },
] as const;

const newsSeeds = [
  {
    title: "ARAR tham gia triển lãm công nghệ số 2024",
    slug: "arar-tham-gia-trien-lam-cong-nghe-so-2024",
    excerpt:
      "ARAR giới thiệu các giải pháp tự động hóa và chuyển đổi số ứng dụng AI cho tổ chức Việt Nam.",
    content:
      "Tại sự kiện, ARAR tập trung trình bày các giải pháp kiosk, robot di động và công cụ AI hỗ trợ vận hành.\n\nCác sản phẩm được thiết kế theo hướng dễ tích hợp, phù hợp với nhu cầu của cơ quan hành chính công, trường học và doanh nghiệp dịch vụ.",
    coverImageUrl: "/images/arar/products/kiosk.jpg",
    imageFit: "cover",
    publishedAt: new Date("2024-03-15T09:00:00.000Z"),
    sortOrder: 0,
  },
  {
    title: "Ra mắt giải pháp Robot giám sát thông minh",
    slug: "ra-mat-robot-giam-sat-thong-minh",
    excerpt:
      "Giải pháp robot tuần tra hỗ trợ giám sát an ninh, cảnh báo bất thường và báo cáo theo tuyến.",
    content:
      "Robot giám sát giúp tự động hóa các tuyến tuần tra lặp lại, ghi nhận dữ liệu hiện trường và hỗ trợ đội vận hành phản ứng nhanh hơn.\n\nGiải pháp phù hợp cho nhà máy, kho bãi, khuôn viên rộng và các khu vực cần kiểm soát an ninh liên tục.",
    coverImageUrl: "/images/arar/products/robot-giam-sat.jpg",
    imageFit: "cover",
    publishedAt: new Date("2024-03-10T09:00:00.000Z"),
    sortOrder: 1,
  },
  {
    title: "ARAR ký kết hợp tác chiến lược với đối tác công nghệ",
    slug: "hop-tac-chien-luoc-doi-tac-cong-nghe",
    excerpt:
      "Thỏa thuận hợp tác mở rộng năng lực nghiên cứu, tích hợp và triển khai giải pháp tự động hóa.",
    content:
      "Hợp tác chiến lược giúp ARAR tăng tốc phát triển các giải pháp AI, robot và nền tảng quản trị cho khách hàng tổ chức.\n\nĐịnh hướng của ARAR là phát triển sản phẩm Việt Nam có khả năng tùy biến cao và đáp ứng tiêu chuẩn triển khai thực tế.",
    coverImageUrl: "/images/arar/products/smartbus.jpg",
    imageFit: "cover",
    publishedAt: new Date("2024-03-05T09:00:00.000Z"),
    sortOrder: 2,
  },
] as const;

const demoProductSlugs = [
  "techcrm-pro",
  "cloud-deploy",
  "datasync-hub",
  "devkit-internal",
] as const;

const demoServiceSlugs = [
  "phat-trien-web",
  "phat-trien-mobile",
  "tu-van-cloud-devops",
  "ai-machine-learning",
] as const;

async function upsertCategory(seed: (typeof categorySeeds)[number]) {
  const existing = await db
    .select()
    .from(productCategories)
    .where(eq(productCategories.slug, seed.slug))
    .limit(1);

  if (existing[0]) {
    await db
      .update(productCategories)
      .set({ ...seed, updatedAt: new Date() })
      .where(eq(productCategories.id, existing[0].id));
    return existing[0].id;
  }

  const inserted = await db
    .insert(productCategories)
    .values(seed)
    .returning({ id: productCategories.id });
  return inserted[0].id;
}

async function seedCategories() {
  const categoryIdBySlug = new Map<string, string>();
  for (const seed of categorySeeds) {
    const id = await upsertCategory(seed);
    categoryIdBySlug.set(seed.slug, id);
  }
  return categoryIdBySlug;
}

async function seedProducts(categoryIdBySlug: Map<string, string>) {
  for (const seed of productSeeds) {
    const existing = await db
      .select()
      .from(products)
      .where(eq(products.slug, seed.slug))
      .limit(1);

    const payload = {
      name: seed.name,
      slug: seed.slug,
      shortDescription: seed.shortDescription,
      fullDescription: seed.fullDescription,
      categoryId: categoryIdBySlug.get(seed.categorySlug) ?? null,
      thumbnailUrl: seed.thumbnailUrl,
      images: [],
      imageFit: seed.imageFit,
      benefits: [...seed.benefits],
      features: [...seed.features],
      specs: [...seed.specs],
      isPublished: true,
      isFeatured: seed.isFeatured,
      sortOrder: seed.sortOrder,
      seoMeta: {
        metaTitle: `${seed.name} | ARAR`,
        metaDescription: seed.shortDescription,
        ogImage: seed.thumbnailUrl,
      },
    };

    if (existing[0]) {
      await db
        .update(products)
        .set({ ...payload, updatedAt: new Date() })
        .where(eq(products.id, existing[0].id));
    } else {
      await db.insert(products).values(payload);
    }
  }
}

async function seedServices() {
  for (const seed of serviceSeeds) {
    const existing = await db
      .select()
      .from(services)
      .where(eq(services.slug, seed.slug))
      .limit(1);

    const payload = {
      name: seed.name,
      slug: seed.slug,
      shortDescription: seed.shortDescription,
      fullDescription: seed.fullDescription,
      icon: seed.icon,
      imageUrl: seed.imageUrl,
      imageFit: seed.imageFit,
      pillars: [...seed.pillars],
      isPublished: true,
      sortOrder: seed.sortOrder,
      seoMeta: {
        metaTitle: `${seed.name} | ARAR`,
        metaDescription: seed.shortDescription,
        ogImage: seed.imageUrl,
      },
    };

    if (existing[0]) {
      await db
        .update(services)
        .set({ ...payload, updatedAt: new Date() })
        .where(eq(services.id, existing[0].id));
    } else {
      await db.insert(services).values(payload);
    }
  }
}

async function seedNews() {
  for (const seed of newsSeeds) {
    const existing = await db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.slug, seed.slug))
      .limit(1);

    const payload = {
      title: seed.title,
      slug: seed.slug,
      excerpt: seed.excerpt,
      content: seed.content,
      coverImageUrl: seed.coverImageUrl,
      imageFit: seed.imageFit,
      publishedAt: seed.publishedAt,
      sortOrder: seed.sortOrder,
      isPublished: true,
      seoMeta: {
        metaTitle: `${seed.title} | ARAR`,
        metaDescription: seed.excerpt,
        ogImage: seed.coverImageUrl,
      },
    };

    if (existing[0]) {
      await db
        .update(newsArticles)
        .set({ ...payload, updatedAt: new Date() })
        .where(eq(newsArticles.id, existing[0].id));
    } else {
      await db.insert(newsArticles).values(payload);
    }
  }
}

async function unpublishDemoContent() {
  for (const slug of demoProductSlugs) {
    const existing = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);
    if (existing[0]) {
      await db
        .update(products)
        .set({ isPublished: false, updatedAt: new Date() })
        .where(eq(products.id, existing[0].id));
    }
  }

  for (const slug of demoServiceSlugs) {
    const existing = await db
      .select()
      .from(services)
      .where(eq(services.slug, slug))
      .limit(1);
    if (existing[0]) {
      await db
        .update(services)
        .set({ isPublished: false, updatedAt: new Date() })
        .where(eq(services.id, existing[0].id));
    }
  }
}

async function main() {
  console.log("Seeding ARAR public content...");
  const categoryIdBySlug = await seedCategories();
  await seedProducts(categoryIdBySlug);
  await seedServices();
  await seedNews();
  await unpublishDemoContent();
  console.log("ARAR content seeded successfully.");
  await client.end();
}

main().catch(async (error) => {
  console.error("Seed failed:", error);
  await client.end();
  process.exit(1);
});
