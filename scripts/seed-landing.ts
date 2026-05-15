/**
 * @nhom        : Scripts
 * @chucnang    : Tạo dữ liệu mẫu Landing Page cho AI Sales Assistant
 * @lienquan    : src/lib/db/schema.ts, src/lib/db/queries/landing.ts
 * @alias       : seed-landing
 *
 * Chạy: npx dotenv -e .env.local -- npx tsx scripts/seed-landing.ts
 */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { landingPages, landingSections, landingItems } from "../src/lib/db/schema";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false, max: 1 });
const db = drizzle(client);

async function seed() {
  console.log("🌱 Bắt đầu tạo dữ liệu mẫu Landing Page...\n");

  // 1. Tạo Landing Page
  const [page] = await db.insert(landingPages).values({
    slug: "ai-sales-assistant",
    title: "AI Sales Assistant",
    description: "Trang giới thiệu sản phẩm AI Sales Assistant — trợ lý bán hàng thông minh",
    status: "published",
    seoTitle: "AI Sales Assistant — Tăng 300% Doanh Thu Bán Hàng",
    seoDescription: "Trợ lý bán hàng AI 24/7 — tự động tư vấn, chốt đơn, phân tích hành vi khách hàng. Dùng thử miễn phí.",
    publishedAt: new Date(),
  }).returning();
  console.log(`✅ Tạo Landing Page: ${page.title} (${page.slug})`);

  // 2. Tạo Sections + Items
  const sectionsData = [
    // ========== HERO ==========
    {
      section: { sectionType: "hero", title: "Tăng 300% Doanh Thu Với AI Sales Assistant", subtitle: "Trợ lý bán hàng AI 24/7 — tự động tư vấn, chốt đơn, phân tích hành vi khách hàng thông minh.", sortOrder: 0 },
      items: [
        { itemType: "cta", title: "Dùng thử miễn phí", linkUrl: "/trial", linkText: "Dùng thử miễn phí", sortOrder: 0 },
        { itemType: "cta", title: "Xem Demo", linkUrl: "/demo", linkText: "Xem Demo", sortOrder: 1 },
      ],
    },
    // ========== PAIN POINTS ==========
    {
      section: { sectionType: "pain_points", title: "Vấn Đề Doanh Nghiệp Đang Gặp Phải", sortOrder: 1 },
      items: [
        { itemType: "pain_point", icon: "⏰", title: "Mất thời gian trả lời thủ công", description: "Nhân viên sales dành 60% thời gian trả lời các câu hỏi lặp đi lặp lại thay vì chốt đơn.", sortOrder: 0 },
        { itemType: "pain_point", icon: "😴", title: "Bỏ lỡ khách hàng ngoài giờ", description: "70% tin nhắn từ khách hàng đến ngoài giờ làm việc — không ai phản hồi.", sortOrder: 1 },
        { itemType: "pain_point", icon: "📉", title: "Tỷ lệ chuyển đổi thấp", description: "Thiếu cá nhân hóa và tốc độ phản hồi chậm khiến tỷ lệ chốt đơn chỉ đạt 2-3%.", sortOrder: 2 },
        { itemType: "pain_point", icon: "🔍", title: "Không hiểu hành vi khách hàng", description: "Thiếu dữ liệu để phân tích nhu cầu thực sự và đưa ra đề xuất phù hợp.", sortOrder: 3 },
      ],
    },
    // ========== SOLUTION ==========
    {
      section: { sectionType: "solution", title: "Giải Pháp: AI Sales Assistant", subtitle: "Trợ lý bán hàng AI hoạt động 24/7, tự động tư vấn và chốt đơn với độ chính xác cao.", description: "AI Sales Assistant sử dụng công nghệ NLP tiên tiến để hiểu ngữ cảnh cuộc hội thoại, phân tích ý định khách hàng, và đưa ra phản hồi cá nhân hóa — tất cả chỉ trong vài giây.", sortOrder: 2 },
      items: [],
    },
    // ========== FEATURES ==========
    {
      section: { sectionType: "features", title: "Tính Năng Vượt Trội", subtitle: "Được thiết kế để tối ưu hóa mọi khâu trong quy trình bán hàng", sortOrder: 3 },
      items: [
        { itemType: "feature", icon: "🤖", title: "Tự động tư vấn 24/7", description: "AI phản hồi khách hàng tức thì, bất kể ngày đêm. Không bỏ lỡ bất kỳ cơ hội bán hàng nào.", sortOrder: 0 },
        { itemType: "feature", icon: "🎯", title: "Cá nhân hóa thông minh", description: "Phân tích hành vi duyệt web, lịch sử mua hàng để đề xuất sản phẩm phù hợp nhất cho từng khách.", sortOrder: 1 },
        { itemType: "feature", icon: "📊", title: "Phân tích & Báo cáo", description: "Dashboard trực quan theo dõi hiệu suất bán hàng, tỷ lệ chuyển đổi, revenue theo thời gian thực.", sortOrder: 2 },
        { itemType: "feature", icon: "🔗", title: "Tích hợp đa kênh", description: "Kết nối Facebook Messenger, Zalo, Website chat, Email — quản lý tất cả từ một nơi.", sortOrder: 3 },
        { itemType: "feature", icon: "🧠", title: "Học từ dữ liệu", description: "AI liên tục cải thiện qua mỗi cuộc hội thoại. Càng dùng nhiều, càng chính xác.", sortOrder: 4 },
        { itemType: "feature", icon: "⚡", title: "Chốt đơn tự động", description: "Tự động tạo đơn hàng, gửi link thanh toán, và follow-up khách hàng chưa hoàn tất.", sortOrder: 5 },
      ],
    },
    // ========== HOW IT WORKS ==========
    {
      section: { sectionType: "how_it_works", title: "Cách Hoạt Động", subtitle: "Chỉ 3 bước đơn giản để bắt đầu", sortOrder: 4 },
      items: [
        { itemType: "step", icon: "1️⃣", title: "Kết nối kênh bán hàng", description: "Tích hợp AI với website, Facebook, Zalo hoặc bất kỳ kênh nào bạn đang sử dụng.", metadata: { stepNumber: 1 }, sortOrder: 0 },
        { itemType: "step", icon: "2️⃣", title: "Huấn luyện AI", description: "Upload catalog sản phẩm, FAQ, script bán hàng — AI tự học và chuẩn bị sẵn sàng.", metadata: { stepNumber: 2 }, sortOrder: 1 },
        { itemType: "step", icon: "3️⃣", title: "Tự động bán hàng", description: "AI bắt đầu tư vấn, chốt đơn, và báo cáo kết quả. Bạn chỉ cần theo dõi dashboard.", metadata: { stepNumber: 3 }, sortOrder: 2 },
      ],
    },
    // ========== STATS ==========
    {
      section: { sectionType: "stats", title: "Con Số Ấn Tượng", sortOrder: 5 },
      items: [
        { itemType: "stat", title: "Tăng doanh thu", metadata: { value: "300", suffix: "%", prefix: "+" }, sortOrder: 0 },
        { itemType: "stat", title: "Thời gian phản hồi", metadata: { value: "3", suffix: "s", prefix: "<" }, sortOrder: 1 },
        { itemType: "stat", title: "Khách hàng tin dùng", metadata: { value: "1,000", suffix: "+", prefix: "" }, sortOrder: 2 },
        { itemType: "stat", title: "Tỷ lệ hài lòng", metadata: { value: "98", suffix: "%", prefix: "" }, sortOrder: 3 },
      ],
    },
    // ========== TESTIMONIALS ==========
    {
      section: { sectionType: "testimonials", title: "Khách Hàng Nói Gì", subtitle: "Hơn 1,000 doanh nghiệp đã tin dùng", sortOrder: 6 },
      items: [
        { itemType: "testimonial", description: "AI Sales Assistant giúp chúng tôi tăng 45% tỷ lệ chốt đơn chỉ trong tháng đầu tiên. Khách hàng được phản hồi ngay lập tức, dù là 2 giờ sáng.", metadata: { author: "Nguyễn Văn Minh", role: "CEO", company: "TechCorp Vietnam", rating: 5 }, sortOrder: 0 },
        { itemType: "testimonial", description: "Trước đây team sales 5 người phải trực 24/7. Giờ AI xử lý 80% câu hỏi, team chỉ tập trung vào khách VIP.", metadata: { author: "Trần Thị Hoa", role: "Sales Director", company: "ShopEase", rating: 5 }, sortOrder: 1 },
        { itemType: "testimonial", description: "Tích hợp chỉ mất 30 phút. Dashboard báo cáo rất trực quan. ROI đạt 500% sau 3 tháng sử dụng.", metadata: { author: "Lê Hoàng Nam", role: "Founder", company: "DigiMart", rating: 5 }, sortOrder: 2 },
      ],
    },
    // ========== PRICING ==========
    {
      section: { sectionType: "pricing", title: "Bảng Giá", subtitle: "Lựa chọn gói phù hợp với quy mô doanh nghiệp", sortOrder: 7 },
      items: [
        {
          itemType: "pricing_plan", title: "Starter", description: "Phù hợp cho cá nhân và doanh nghiệp nhỏ",
          linkUrl: "/signup?plan=starter", linkText: "Bắt đầu miễn phí",
          metadata: { price: "0", period: "tháng", currency: "đ", features: ["500 cuộc hội thoại/tháng", "1 kênh tích hợp", "Báo cáo cơ bản", "Hỗ trợ email"], isPopular: false },
          sortOrder: 0,
        },
        {
          itemType: "pricing_plan", title: "Professional", description: "Cho doanh nghiệp đang phát triển",
          linkUrl: "/signup?plan=pro", linkText: "Dùng thử 14 ngày",
          metadata: { price: "1,990,000", period: "tháng", currency: "đ", features: ["Không giới hạn hội thoại", "5 kênh tích hợp", "Phân tích nâng cao", "API access", "Hỗ trợ 24/7", "Custom branding"], isPopular: true, badge: "Phổ biến nhất" },
          sortOrder: 1,
        },
        {
          itemType: "pricing_plan", title: "Enterprise", description: "Giải pháp toàn diện cho doanh nghiệp lớn",
          linkUrl: "/contact", linkText: "Liên hệ",
          metadata: { price: "Liên hệ", period: "", currency: "", features: ["Mọi tính năng Professional", "Dedicated server", "SLA 99.9%", "Onboarding 1-1", "Custom AI training", "White-label solution"], isPopular: false },
          sortOrder: 2,
        },
      ],
    },
    // ========== FAQ ==========
    {
      section: { sectionType: "faq", title: "Câu Hỏi Thường Gặp", sortOrder: 8 },
      items: [
        { itemType: "faq", title: "AI Sales Assistant có thay thế nhân viên bán hàng không?", description: "Không, AI hoạt động như trợ lý hỗ trợ team sales.", metadata: { answer: "Không. AI Sales Assistant được thiết kế để hỗ trợ, không phải thay thế. AI xử lý các câu hỏi thường gặp và tư vấn ban đầu, giúp nhân viên sales tập trung vào các khách hàng tiềm năng cao và các deal phức tạp." }, sortOrder: 0 },
        { itemType: "faq", title: "Mất bao lâu để tích hợp?", description: "Chỉ 30 phút cho tích hợp cơ bản.", metadata: { answer: "Tích hợp cơ bản (website chat) chỉ mất 30 phút với hướng dẫn step-by-step. Tích hợp đa kênh (Facebook, Zalo, Email) mất khoảng 1-2 giờ. Đội ngũ support sẽ hỗ trợ bạn trong suốt quá trình." }, sortOrder: 1 },
        { itemType: "faq", title: "AI có hỗ trợ tiếng Việt không?", description: "Có, AI hỗ trợ đầy đủ tiếng Việt.", metadata: { answer: "Có! AI Sales Assistant được huấn luyện đặc biệt cho tiếng Việt, bao gồm cả tiếng lóng, từ ngữ địa phương, và các biến thể ngôn ngữ khác nhau. Ngoài ra còn hỗ trợ tiếng Anh và nhiều ngôn ngữ khác." }, sortOrder: 2 },
        { itemType: "faq", title: "Dữ liệu khách hàng có được bảo mật không?", description: "Tuyệt đối bảo mật với mã hóa end-to-end.", metadata: { answer: "Tuyệt đối. Chúng tôi sử dụng mã hóa AES-256, SSL/TLS cho mọi kết nối, và tuân thủ GDPR. Dữ liệu được lưu trữ trên server đạt chuẩn ISO 27001. Bạn có toàn quyền kiểm soát và xóa dữ liệu bất cứ lúc nào." }, sortOrder: 3 },
        { itemType: "faq", title: "Có thể dùng thử miễn phí không?", description: "Có, gói Starter hoàn toàn miễn phí.", metadata: { answer: "Có! Gói Starter hoàn toàn miễn phí với 500 cuộc hội thoại/tháng. Gói Professional có 14 ngày dùng thử không cần thẻ tín dụng. Bạn có thể nâng cấp hoặc hủy bất cứ lúc nào." }, sortOrder: 4 },
      ],
    },
    // ========== CTA FOOTER ==========
    {
      section: { sectionType: "cta_footer", title: "Sẵn Sàng Tăng Doanh Thu?", subtitle: "Bắt đầu miễn phí ngay hôm nay — không cần thẻ tín dụng", sortOrder: 9 },
      items: [
        { itemType: "cta", title: "Dùng thử miễn phí", linkUrl: "/trial", linkText: "Bắt đầu miễn phí", sortOrder: 0 },
        { itemType: "cta", title: "Liên hệ tư vấn", linkUrl: "/contact", linkText: "Liên hệ tư vấn", sortOrder: 1 },
      ],
    },
  ];

  for (const { section, items } of sectionsData) {
    // Tạo section
    const [createdSection] = await db.insert(landingSections).values({
      landingPageId: page.id,
      ...section,
    }).returning();
    console.log(`  📦 Section: ${section.sectionType} — ${section.title || "(no title)"}`);

    // Tạo items
    if (items.length > 0) {
      await db.insert(landingItems).values(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items.map((item) => ({
          sectionId: createdSection.id,
          ...item,
          metadata: (item as Record<string, unknown>).metadata as Record<string, unknown> | null ?? null,
        })) as any
      );
      console.log(`     └─ ${items.length} items`);
    }
  }

  console.log("\n✅ Hoàn tất seed dữ liệu Landing Page!");
  console.log(`   API: /api/v1/landing/${page.slug}`);

  await client.end();
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Lỗi seed:", error);
  process.exit(1);
});
