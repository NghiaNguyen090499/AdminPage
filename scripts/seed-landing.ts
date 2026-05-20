/**
 * @nhom        : Scripts
 * @chucnang    : Tạo/cập nhật dữ liệu mẫu Landing Page cho ASA - AI Sales Assistant
 * @lienquan    : src/lib/db/schema.ts, src/lib/db/queries/landing.ts
 * @alias       : seed-landing
 *
 * Chạy: npx dotenv -e .env.local -- npx tsx scripts/seed-landing.ts
 */
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { landingItems, landingPages, landingSections } from "../src/lib/db/schema";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, { prepare: false, max: 1 });
const db = drizzle(client);

async function seed() {
  console.log("Bat dau tao/cap nhat du lieu Landing Page ASA...\n");

  await db.delete(landingPages).where(eq(landingPages.slug, "ai-sales-assistant"));

  const [page] = await db.insert(landingPages).values({
    slug: "ai-sales-assistant",
    title: "ASA - AI Sales Assistant",
    description: "Landing page B2B cho ASA - giai phap AI Sales Assistant cua ARAR",
    status: "published",
    seoTitle: "ASA - AI Sales Assistant cho tu van khach hang va thu lead online",
    seoDescription: "ASA giup doanh nghiep tu dong tu van khach hang 24/7, thu thap lead, phan loai nhu cau va chuyen du lieu cho doi sale.",
    publishedAt: new Date(),
  }).returning();
  console.log(`Tao Landing Page: ${page.title} (${page.slug})`);

  const sectionsData = [
    {
      section: {
        sectionType: "hero",
        title: "ASA - AI Sales Assistant giúp doanh nghiệp tư vấn khách hàng 24/7 và không bỏ lỡ lead online",
        subtitle: "Tự động trả lời khách hàng, tư vấn theo nhu cầu, thu thập thông tin lead và chuyển dữ liệu cho đội sale/tư vấn xử lý tiếp.",
        description: "Phù hợp cho chuỗi bán lẻ, chuỗi điện thoại, trường học, trung tâm giáo dục và các doanh nghiệp có nhiều khách hàng hỏi qua Facebook, Zalo, website.",
        sortOrder: 0,
      },
      items: [
        { itemType: "cta", title: "Đăng ký demo ASA 30 phút", linkUrl: "/contact?intent=asa-demo", linkText: "Đăng ký demo ASA 30 phút", sortOrder: 0 },
        { itemType: "cta", title: "Nhận tư vấn flow chatbot", linkUrl: "/contact?intent=chatbot-flow", linkText: "Nhận tư vấn flow chatbot", sortOrder: 1 },
      ],
    },
    {
      section: {
        sectionType: "pain_points",
        title: "Doanh nghiệp đang mất lead online mỗi ngày mà không nhận ra",
        subtitle: "Khách hàng rời đi rất nhanh khi không được phản hồi đúng lúc hoặc không được tư vấn đủ thông tin.",
        description: "Với ASA, mỗi cuộc hội thoại online có thể trở thành một cơ hội bán hàng được ghi nhận, phân loại và chuyển tiếp cho đội sale.",
        sortOrder: 1,
      },
      items: [
        { itemType: "pain_point", icon: "⏱️", title: "Inbox không được trả lời ngay", description: "Khách hàng cần phản hồi nhanh trên Facebook, Zalo hoặc website, đặc biệt ngoài giờ hành chính và giờ cao điểm.", sortOrder: 0 },
        { itemType: "pain_point", icon: "📚", title: "Câu hỏi lặp lại quá nhiều", description: "Giá, sản phẩm, học phí, lịch tư vấn, chính sách và địa chỉ thường lặp lại, làm đội tư vấn mất nhiều thời gian.", sortOrder: 1 },
        { itemType: "pain_point", icon: "🧾", title: "Không thu được thông tin lead", description: "Nhiều cuộc hội thoại kết thúc mà chưa có số điện thoại, nhu cầu, ngân sách, khu vực hoặc thông tin khách hàng.", sortOrder: 2 },
        { itemType: "pain_point", icon: "🧩", title: "Dữ liệu hội thoại rời rạc", description: "Quản lý khó biết khách quan tâm sản phẩm/dịch vụ nào, lead nào cần follow-up và hiệu quả tư vấn online ra sao.", sortOrder: 3 },
        { itemType: "pain_point", icon: "🎚️", title: "Chất lượng tư vấn không đồng đều", description: "Mỗi nhân viên có cách hỏi và ghi nhận thông tin khác nhau, khiến trải nghiệm khách hàng thiếu nhất quán.", sortOrder: 4 },
      ],
    },
    {
      section: {
        sectionType: "solution",
        title: "ASA là gì?",
        subtitle: "ASA không phải là chatbot FAQ đơn thuần.",
        description: "ASA là hệ thống AI chatbot hỗ trợ bán hàng và tư vấn khách hàng, được thiết kế cho doanh nghiệp cần xử lý nhiều hội thoại online trên Facebook, Zalo, website hoặc các kênh digital khác. ASA hoạt động như một lớp AI Sales Operator giúp biến hội thoại thành dữ liệu bán hàng.",
        sortOrder: 2,
      },
      items: [
        { itemType: "feature", icon: "💬", title: "Hiểu nhu cầu khách hàng", description: "Nhận diện câu hỏi, ngữ cảnh và nhu cầu ban đầu của khách để dẫn dắt hội thoại đúng hướng.", sortOrder: 0 },
        { itemType: "feature", icon: "🎯", title: "Tư vấn sản phẩm/dịch vụ phù hợp", description: "Gợi ý nội dung tư vấn dựa trên dữ liệu doanh nghiệp cung cấp.", sortOrder: 1 },
        { itemType: "feature", icon: "📥", title: "Thu thập và phân loại lead", description: "Ghi nhận thông tin quan trọng, phân loại mức độ quan tâm và chuyển tiếp cho đội sale/tư vấn.", sortOrder: 2 },
        { itemType: "feature", icon: "📈", title: "Tạo dữ liệu KPI tư vấn online", description: "Giúp quản lý theo dõi số hội thoại, lead, nhu cầu và chất lượng tư vấn.", sortOrder: 3 },
      ],
    },
    {
      section: {
        sectionType: "custom",
        title: "Từ hội thoại rời rạc thành hệ thống lead có dữ liệu",
        subtitle: "ASA chuẩn hóa cách tư vấn, cách thu lead và cách chuyển dữ liệu cho đội sale.",
        sortOrder: 3,
      },
      items: [
        { itemType: "custom", icon: "↔️", title: "Khách hỏi nhưng chờ sale trả lời", description: "Sau khi có ASA: AI phản hồi ngay 24/7 và giữ cuộc hội thoại tiếp tục.", metadata: { before: "Khách hỏi nhưng chờ sale trả lời", after: "AI phản hồi ngay 24/7" }, sortOrder: 0 },
        { itemType: "custom", icon: "↔️", title: "Inbox rời rạc, khó quản lý", description: "Sau khi có ASA: lead được ghi nhận, phân loại và chuyển tiếp theo quy trình.", metadata: { before: "Inbox rời rạc, khó quản lý", after: "Lead được ghi nhận và phân loại" }, sortOrder: 1 },
        { itemType: "custom", icon: "↔️", title: "Nhân viên hỏi thiếu thông tin", description: "Sau khi có ASA: hệ thống tự động hỏi nhu cầu, ngân sách, khu vực và số điện thoại.", metadata: { before: "Nhân viên hỏi thiếu thông tin", after: "ASA tự động hỏi thông tin quan trọng" }, sortOrder: 2 },
        { itemType: "custom", icon: "↔️", title: "Khó đo hiệu quả online", description: "Sau khi có ASA: dashboard theo dõi lead, conversion và chất lượng hội thoại.", metadata: { before: "Khó đo hiệu quả online", after: "Theo dõi được lead và KPI" }, sortOrder: 3 },
      ],
    },
    {
      section: {
        sectionType: "custom",
        title: "Use case theo ngành",
        subtitle: "ASA có thể bắt đầu từ những nghiệp vụ rõ nhất của từng doanh nghiệp.",
        sortOrder: 4,
      },
      items: [
        {
          itemType: "custom",
          icon: "📱",
          title: "ASA cho chuỗi bán lẻ điện thoại",
          description: "Hỗ trợ tư vấn giá, tình trạng còn hàng, so sánh iPhone/Samsung/Xiaomi/Oppo, chọn máy theo ngân sách, trả góp, bảo hành và địa chỉ cửa hàng gần nhất.",
          linkUrl: "/contact?intent=asa-phone-retail",
          linkText: "Xem demo ASA cho chuỗi điện thoại",
          metadata: {
            example: [
              "Khách: Em cần mua điện thoại dưới 8 triệu, pin tốt, chụp ảnh ổn.",
              "ASA: Với nhu cầu pin tốt, chụp ảnh ổn trong tầm dưới 8 triệu, anh/chị có thể tham khảo iPhone 12 cũ đẹp, Xiaomi 15T hoặc Redmi Note 14 Pro tùy ưu tiên iOS, camera hay pin.",
              "ASA: Anh/chị muốn máy mới hay máy đã qua sử dụng? Nếu ưu tiên chụp ảnh và hệ sinh thái Apple, iPhone 12 là lựa chọn hợp lý. Nếu muốn pin khỏe, sạc nhanh và màn hình lớn, em sẽ ưu tiên Xiaomi/Redmi.",
              "ASA: Anh/chị đang ở khu vực nào để em kiểm tra cửa hàng gần nhất còn hàng, màu/bộ nhớ phù hợp và chương trình trả góp nếu cần?",
            ],
          },
          sortOrder: 0,
        },
        {
          itemType: "custom",
          icon: "🏫",
          title: "ASA cho trường học và tuyển sinh",
          description: "Hỗ trợ phụ huynh hỏi về chương trình học, học phí, lịch tuyển sinh, độ tuổi/lớp phù hợp, xe đưa đón, lịch tham quan trường và quy trình đăng ký tư vấn.",
          linkUrl: "/contact?intent=asa-school-admission",
          linkText: "Xem demo ASA cho tuyển sinh trường học",
          metadata: {
            example: [
              "Phụ huynh: Trường còn tuyển sinh lớp 1 không?",
              "ASA: Dạ có. Anh/chị cho em hỏi bé sinh năm nào và gia đình mình đang ở khu vực nào ạ?",
              "ASA: Em có thể hỗ trợ đặt lịch tham quan trường trong tuần này.",
            ],
          },
          sortOrder: 1,
        },
      ],
    },
    {
      section: {
        sectionType: "features",
        title: "Các tính năng chính của ASA",
        subtitle: "Tập trung vào tư vấn, thu lead, chuyển sale và theo dõi hiệu quả.",
        sortOrder: 5,
      },
      items: [
        { itemType: "feature", icon: "🤖", title: "AI tư vấn 24/7", description: "Tự động trả lời khách hàng trên các kênh online theo dữ liệu và phạm vi tư vấn đã cấu hình.", sortOrder: 0 },
        { itemType: "feature", icon: "📝", title: "Thu thập lead", description: "Lấy tên, số điện thoại, nhu cầu, ngân sách, khu vực và thông tin cần thiết cho đội sale/tư vấn.", sortOrder: 1 },
        { itemType: "feature", icon: "🧠", title: "Tư vấn theo dữ liệu", description: "Gợi ý sản phẩm/dịch vụ dựa trên catalog, FAQ, chính sách và dữ liệu nghiệp vụ của doanh nghiệp.", sortOrder: 2 },
        { itemType: "feature", icon: "🔥", title: "Phân loại khách hàng", description: "Nhận diện khách nóng, khách đang cân nhắc hoặc khách cần chăm sóc tiếp.", sortOrder: 3 },
        { itemType: "feature", icon: "📤", title: "Chuyển sale xử lý", description: "Gửi thông tin khách hàng và ngữ cảnh hội thoại cho nhân viên phụ trách.", sortOrder: 4 },
        { itemType: "feature", icon: "📊", title: "Dashboard KPI", description: "Theo dõi số lead, số hội thoại, tỷ lệ lấy số điện thoại, nhu cầu khách hàng và chất lượng tư vấn.", sortOrder: 5 },
      ],
    },
    {
      section: {
        sectionType: "how_it_works",
        title: "Quy trình hoạt động của ASA",
        subtitle: "Từ khách nhắn tin đến dữ liệu lead và dashboard KPI.",
        sortOrder: 6,
      },
      items: [
        { itemType: "step", icon: "1", title: "Khách hàng nhắn tin", description: "Khách bắt đầu hội thoại qua Facebook, Zalo hoặc website.", metadata: { stepNumber: 1 }, sortOrder: 0 },
        { itemType: "step", icon: "2", title: "ASA hiểu nhu cầu", description: "AI phân tích câu hỏi, nhận diện nhu cầu và tiếp tục hỏi thông tin cần thiết.", metadata: { stepNumber: 2 }, sortOrder: 1 },
        { itemType: "step", icon: "3", title: "Tư vấn theo dữ liệu doanh nghiệp", description: "ASA truy xuất dữ liệu sản phẩm, dịch vụ, chính sách hoặc tuyển sinh để tư vấn.", metadata: { stepNumber: 3 }, sortOrder: 2 },
        { itemType: "step", icon: "4", title: "Thu thập thông tin lead", description: "Hệ thống ghi nhận tên, số điện thoại, ngân sách, khu vực và nhu cầu cụ thể.", metadata: { stepNumber: 4 }, sortOrder: 3 },
        { itemType: "step", icon: "5", title: "Chuyển sale và theo dõi KPI", description: "Đội sale/tư vấn nhận lead, còn quản lý theo dõi hiệu quả trên dashboard.", metadata: { stepNumber: 5 }, sortOrder: 4 },
      ],
    },
    {
      section: {
        sectionType: "custom",
        title: "Doanh nghiệp cần chuẩn bị gì để triển khai ASA?",
        subtitle: "ASA có thể bắt đầu từ bộ dữ liệu đơn giản, sau đó mở rộng theo từng giai đoạn.",
        description: "ARAR có thể hỗ trợ chuẩn hóa dữ liệu ban đầu để ASA vận hành theo đúng nghiệp vụ của từng doanh nghiệp.",
        sortOrder: 7,
      },
      items: [
        { itemType: "custom", icon: "📦", title: "Dữ liệu sản phẩm/dịch vụ", description: "Tên sản phẩm, mô tả, giá, chính sách, chương trình học hoặc dịch vụ cần tư vấn.", sortOrder: 0 },
        { itemType: "custom", icon: "❓", title: "FAQ và chính sách", description: "Các câu hỏi thường gặp về giá, bảo hành, học phí, tuyển sinh, trả góp, đổi trả hoặc địa chỉ.", sortOrder: 1 },
        { itemType: "custom", icon: "🏬", title: "Chi nhánh/cơ sở", description: "Địa chỉ cửa hàng, cơ sở trường, khu vực phục vụ và thông tin liên hệ.", sortOrder: 2 },
        { itemType: "custom", icon: "🔁", title: "Quy trình chuyển lead", description: "Ai nhận lead, nhận qua kênh nào, thời gian phản hồi và tiêu chí lead đủ thông tin.", sortOrder: 3 },
      ],
    },
    {
      section: {
        sectionType: "custom",
        title: "ASA có thể triển khai trên nhiều kênh khách hàng",
        subtitle: "Bắt đầu từ kênh chính, sau đó mở rộng theo nhu cầu vận hành.",
        description: "ASA có thể triển khai trước trên Facebook Messenger hoặc website chatbot, sau đó mở rộng sang Zalo OA, CRM và các hệ thống dữ liệu nội bộ theo nhu cầu của doanh nghiệp.",
        sortOrder: 8,
      },
      items: [
        { itemType: "custom", icon: "💬", title: "Facebook Messenger", description: "Phù hợp với doanh nghiệp có lượng inbox lớn từ fanpage.", sortOrder: 0 },
        { itemType: "custom", icon: "🌐", title: "Website chatbot", description: "Tư vấn khách truy cập website và thu lead ngay trên trang.", sortOrder: 1 },
        { itemType: "custom", icon: "📲", title: "Zalo OA", description: "Có thể mở rộng theo mức độ sẵn sàng tích hợp và nhu cầu của doanh nghiệp.", sortOrder: 2 },
        { itemType: "custom", icon: "🗂️", title: "Google Sheet / CRM / API", description: "Đồng bộ lead và dữ liệu hội thoại sang hệ thống vận hành hiện có.", sortOrder: 3 },
      ],
    },
    {
      section: {
        sectionType: "stats",
        title: "Theo dõi hiệu quả tư vấn online bằng KPI rõ ràng",
        subtitle: "ASA không chỉ trả lời khách hàng. ASA giúp doanh nghiệp nhìn thấy dữ liệu bán hàng từ từng cuộc hội thoại.",
        sortOrder: 9,
      },
      items: [
        { itemType: "stat", title: "Hội thoại", description: "Tổng số cuộc trò chuyện, số khách mới, số khách quay lại", metadata: { value: "1", suffix: "", prefix: "" }, sortOrder: 0 },
        { itemType: "stat", title: "Lead", description: "Số lead thu được, tỷ lệ lấy số điện thoại, tỷ lệ lead đủ thông tin", metadata: { value: "2", suffix: "", prefix: "" }, sortOrder: 1 },
        { itemType: "stat", title: "Nhu cầu", description: "Sản phẩm/dịch vụ được hỏi nhiều nhất, ngân sách phổ biến", metadata: { value: "3", suffix: "", prefix: "" }, sortOrder: 2 },
        { itemType: "stat", title: "Chuyển đổi", description: "Demo booking, lịch hẹn, khách quan tâm mua hàng hoặc đăng ký", metadata: { value: "4", suffix: "", prefix: "" }, sortOrder: 3 },
      ],
    },
    {
      section: {
        sectionType: "custom",
        title: "Bắt đầu với một pilot nhỏ trước khi triển khai toàn hệ thống",
        subtitle: "Một pilot rõ phạm vi giúp doanh nghiệp kiểm chứng hiệu quả và tối ưu flow trước khi mở rộng.",
        description: "Với dữ liệu đầu vào rõ ràng, ASA có thể triển khai phiên bản pilot trong khoảng 2-3 tuần.",
        sortOrder: 10,
      },
      items: [
        { itemType: "step", icon: "1", title: "Khảo sát nhu cầu", description: "Xác định ngành, kênh online, quy trình sale/tư vấn và mục tiêu pilot.", metadata: { stepNumber: 1 }, sortOrder: 0 },
        { itemType: "step", icon: "2", title: "Chuẩn hóa dữ liệu", description: "Thu thập sản phẩm, dịch vụ, FAQ, chính sách và thông tin chi nhánh/cơ sở.", metadata: { stepNumber: 2 }, sortOrder: 1 },
        { itemType: "step", icon: "3", title: "Thiết kế flow tư vấn", description: "Xây dựng luồng hỏi đáp theo từng nhóm khách hàng và tiêu chí lead.", metadata: { stepNumber: 3 }, sortOrder: 2 },
        { itemType: "step", icon: "4", title: "Cấu hình, test và go-live", description: "Kết nối kênh, kiểm tra câu trả lời, vận hành thử và theo dõi KPI.", metadata: { stepNumber: 4 }, sortOrder: 3 },
      ],
    },
    {
      section: {
        sectionType: "custom",
        title: "Vì sao doanh nghiệp nên triển khai ASA cùng ARAR?",
        subtitle: "ARAR xây ASA như một hệ thống hỗ trợ vận hành sale, có dữ liệu, KPI và khả năng cải tiến liên tục.",
        sortOrder: 11,
      },
      items: [
        { itemType: "custom", icon: "🧪", title: "AI ứng dụng thực tế", description: "Tập trung vào bài toán vận hành cụ thể thay vì chỉ trình diễn chatbot.", sortOrder: 0 },
        { itemType: "custom", icon: "📱", title: "Kinh nghiệm với bán lẻ điện thoại", description: "Đã có hướng triển khai chatbot AI cho nghiệp vụ tư vấn trong lĩnh vực bán lẻ điện thoại.", sortOrder: 1 },
        { itemType: "custom", icon: "🧬", title: "Xây theo dữ liệu riêng", description: "Flow tư vấn, câu trả lời và logic thu lead được thiết kế theo nghiệp vụ từng doanh nghiệp.", sortOrder: 2 },
        { itemType: "custom", icon: "📊", title: "Dashboard và tối ưu vận hành", description: "Không chỉ trả lời tự động, ASA còn hỗ trợ theo dõi KPI và cải tiến chất lượng tư vấn.", sortOrder: 3 },
      ],
    },
    {
      section: {
        sectionType: "faq",
        title: "Câu hỏi thường gặp",
        sortOrder: 13,
      },
      items: [
        { itemType: "faq", title: "ASA khác gì chatbot thông thường?", description: "ASA tập trung vào tư vấn, thu lead, phân loại nhu cầu và hỗ trợ sale.", metadata: { answer: "ASA không chỉ trả lời FAQ. Hệ thống được thiết kế để tư vấn theo dữ liệu doanh nghiệp, thu thập thông tin lead, phân loại nhu cầu và chuyển dữ liệu cho đội sale/tư vấn xử lý tiếp." }, sortOrder: 0 },
        { itemType: "faq", title: "ASA có dùng được cho Facebook, Zalo và website không?", description: "Có thể bắt đầu từ Facebook Messenger hoặc website chatbot, sau đó mở rộng.", metadata: { answer: "ASA có thể triển khai trước trên Facebook Messenger hoặc website chatbot. Zalo OA, CRM và các hệ thống dữ liệu nội bộ có thể được tích hợp theo từng giai đoạn tùy nhu cầu và mức độ sẵn sàng kỹ thuật." }, sortOrder: 1 },
        { itemType: "faq", title: "Có cần dữ liệu sản phẩm đầy đủ ngay từ đầu không?", description: "Không nhất thiết. Có thể bắt đầu từ bộ dữ liệu cơ bản.", metadata: { answer: "Doanh nghiệp có thể bắt đầu bằng bộ dữ liệu cơ bản như sản phẩm/dịch vụ chính, FAQ, chính sách và quy trình chuyển lead. Sau pilot, dữ liệu có thể được mở rộng dần." }, sortOrder: 2 },
        { itemType: "faq", title: "ASA có thay thế nhân viên sale không?", description: "Không. ASA hỗ trợ lọc nhu cầu và chuyển lead tốt hơn cho sale.", metadata: { answer: "ASA không thay thế đội sale. ASA xử lý tư vấn ban đầu, hỏi thông tin cần thiết, phân loại nhu cầu và giúp đội sale tập trung vào những lead có dữ liệu rõ hơn." }, sortOrder: 3 },
        { itemType: "faq", title: "Thời gian triển khai bao lâu?", description: "Pilot thường có thể triển khai trong khoảng 2-3 tuần nếu dữ liệu rõ ràng.", metadata: { answer: "Với phạm vi pilot nhỏ và dữ liệu đầu vào rõ ràng, ASA thường có thể triển khai phiên bản đầu trong khoảng 2-3 tuần, sau đó tiếp tục tối ưu theo dữ liệu vận hành thực tế." }, sortOrder: 4 },
        { itemType: "faq", title: "Có dashboard theo dõi không?", description: "Có. Dashboard theo dõi hội thoại, lead, nhu cầu và chất lượng tư vấn.", metadata: { answer: "Dashboard có thể theo dõi số hội thoại, số lead, tỷ lệ lấy thông tin, nhu cầu phổ biến, câu hỏi bot chưa trả lời tốt và các KPI phục vụ quản lý sale/tư vấn." }, sortOrder: 5 },
      ],
    },
    {
      section: {
        sectionType: "pricing",
        title: "Bảng giá triển khai ASA",
        subtitle: "Chọn gói phù hợp để bắt đầu thử nghiệm, vận hành nhỏ hoặc triển khai đầy đủ cho đội tư vấn.",
        sortOrder: 12,
      },
      items: [
        {
          itemType: "pricing_plan",
          title: "Gói demo",
          description: "Phù hợp để xem thử luồng tư vấn ASA và đánh giá mức độ phù hợp với nghiệp vụ.",
          linkUrl: "/contact?intent=asa-demo",
          linkText: "Đăng ký demo",
          metadata: {
            price: "Miễn phí",
            period: "30 phút",
            currency: "",
            features: [
              "Demo luồng tư vấn mẫu theo ngành",
              "Tư vấn dữ liệu cần chuẩn bị",
              "Đề xuất phạm vi pilot ban đầu",
            ],
            isPopular: false,
          },
          sortOrder: 0,
        },
        {
          itemType: "pricing_plan",
          title: "Starter",
          description: "Dành cho doanh nghiệp muốn chạy thử ASA trên một kênh chính với phạm vi rõ ràng.",
          linkUrl: "/contact?intent=asa-starter",
          linkText: "Chọn gói Starter",
          metadata: {
            price: "599.000đ",
            period: "tháng",
            currency: "",
            features: [
              "1 kênh tư vấn chính",
              "Flow hỏi đáp và thu lead cơ bản",
              "Theo dõi hội thoại và lead đầu vào",
            ],
            isPopular: true,
            badge: "Phổ biến",
          },
          sortOrder: 1,
        },
        {
          itemType: "pricing_plan",
          title: "Business",
          description: "Dành cho đội sale/tư vấn cần triển khai nhiều nghiệp vụ, dữ liệu và báo cáo vận hành.",
          linkUrl: "/contact?intent=asa-business",
          linkText: "Tư vấn gói Business",
          metadata: {
            price: "4.999.999đ",
            period: "tháng",
            currency: "",
            features: [
              "Nhiều flow tư vấn theo nhóm khách",
              "Tích hợp dữ liệu sản phẩm/dịch vụ",
              "Dashboard KPI và phân loại lead",
            ],
            isPopular: false,
          },
          sortOrder: 2,
        },
      ],
    },
    {
      section: {
        sectionType: "cta_footer",
        title: "Sẵn sàng xem ASA phù hợp với doanh nghiệp của bạn như thế nào?",
        subtitle: "Đăng ký demo 30 phút để ARAR tư vấn flow chatbot, dữ liệu cần chuẩn bị và phạm vi pilot phù hợp.",
        sortOrder: 14,
      },
      items: [
        { itemType: "cta", title: "Đăng ký demo ASA 30 phút", linkUrl: "/contact?intent=asa-demo", linkText: "Đăng ký demo ASA 30 phút", sortOrder: 0 },
        { itemType: "cta", title: "Đăng ký pilot ASA", linkUrl: "/contact?intent=asa-pilot", linkText: "Đăng ký pilot ASA", sortOrder: 1 },
      ],
    },
    {
      section: {
        sectionType: "custom",
        title: "Thông tin nên có trong form đăng ký demo",
        subtitle: "Form nên ngắn, đủ để ARAR hiểu nhanh nhu cầu và chuẩn bị buổi demo.",
        sortOrder: 15,
      },
      items: [
        { itemType: "custom", title: "Họ và tên", metadata: { fieldType: "text", required: true }, sortOrder: 0 },
        { itemType: "custom", title: "Công ty / trường học", metadata: { fieldType: "text", required: true }, sortOrder: 1 },
        { itemType: "custom", title: "Số điện thoại", metadata: { fieldType: "tel", required: true }, sortOrder: 2 },
        { itemType: "custom", title: "Email", metadata: { fieldType: "email", required: true }, sortOrder: 3 },
        { itemType: "custom", title: "Ngành hoạt động", metadata: { fieldType: "select", required: true, options: ["Bán lẻ điện thoại", "Trường học / tuyển sinh", "Bán lẻ khác", "Dịch vụ B2B", "Khác"] }, sortOrder: 4 },
        { itemType: "custom", title: "Nhu cầu chính", description: "Bán hàng, tuyển sinh, chăm sóc khách hàng, thu lead hoặc tối ưu quy trình tư vấn.", metadata: { fieldType: "textarea", required: false }, sortOrder: 5 },
      ],
    },
  ];

  for (const { section, items } of sectionsData) {
    const [createdSection] = await db.insert(landingSections).values({
      landingPageId: page.id,
      ...section,
    }).returning();
    console.log(`Section: ${section.sectionType} - ${section.title || "(no title)"}`);

    if (items.length > 0) {
      await db.insert(landingItems).values(
        items.map((item) => ({
          sectionId: createdSection.id,
          ...item,
          metadata: (item as Record<string, unknown>).metadata as Record<string, unknown> | null ?? null,
        }))
      );
      console.log(`  Items: ${items.length}`);
    }
  }

  console.log("\nHoan tat seed du lieu Landing Page ASA!");
  console.log(`API: /api/v1/landing/${page.slug}`);

  await client.end();
  process.exit(0);
}

seed().catch((error) => {
  console.error("Loi seed:", error);
  process.exit(1);
});
