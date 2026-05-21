/**
 * @nhom        : Database
 * @chucnang    : Định nghĩa schema (cấu trúc) database cho ADMINMANAGER
 * @lienquan    : src/lib/db/index.ts, drizzle.config.ts
 * @alias       : database-schema, db-tables
 *
 * Các bảng:
 * - company_info: Thông tin giới thiệu công ty
 * - team_members: Thành viên đội ngũ
 * - services: Dịch vụ công ty cung cấp
 * - product_categories: Danh mục sản phẩm
 * - products: Sản phẩm công ty
 * - landing_pages: Trang landing page sản phẩm
 * - landing_sections: Các section trong landing page
 * - landing_items: Nội dung con trong mỗi section
 */

import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================
// BẢNG: company_info — Thông tin giới thiệu công ty
// ============================================================
export const companyInfo = pgTable("company_info", {
  // ID duy nhất — sử dụng UUID
  id: uuid("id").defaultRandom().primaryKey(),

  // Khóa duy nhất để phân biệt các section (about, vision, mission, history)
  key: varchar("key", { length: 50 }).unique().notNull(),

  // Tiêu đề hiển thị
  title: varchar("title", { length: 255 }).notNull(),

  // Nội dung chi tiết (hỗ trợ rich text / HTML)
  content: text("content"),

  // Ảnh đại diện section
  imageUrl: text("image_url"),

  // Thứ tự hiển thị — số nhỏ hiển thị trước
  sortOrder: integer("sort_order").default(0).notNull(),

  // Trạng thái hiển thị (true = hiện, false = ẩn)
  isPublished: boolean("is_published").default(true).notNull(),

  // SEO metadata — lưu dạng JSON
  seoMeta: jsonb("seo_meta").$type<{
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  }>(),

  // Timestamps — thời gian tạo và cập nhật
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// BẢNG: team_members — Thành viên đội ngũ
// ============================================================
export const teamMembers = pgTable("team_members", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Họ tên đầy đủ
  fullName: varchar("full_name", { length: 255 }).notNull(),

  // Chức vụ / vị trí
  position: varchar("position", { length: 255 }).notNull(),

  // Tiểu sử ngắn
  bio: text("bio"),

  // Ảnh đại diện
  avatarUrl: text("avatar_url"),

  // Email liên hệ (tùy chọn)
  email: varchar("email", { length: 255 }),

  // Liên kết mạng xã hội — lưu dạng JSON
  socialLinks: jsonb("social_links").$type<{
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  }>(),

  // Thứ tự hiển thị
  sortOrder: integer("sort_order").default(0).notNull(),

  // Trạng thái hiển thị
  isPublished: boolean("is_published").default(true).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// BẢNG: services — Dịch vụ công ty cung cấp
// ============================================================
export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Tên dịch vụ
  name: varchar("name", { length: 255 }).notNull(),

  // Slug — dùng cho URL thân thiện (ví dụ: "web-development")
  slug: varchar("slug", { length: 255 }).unique().notNull(),

  // Mô tả ngắn — hiển thị ở danh sách
  shortDescription: text("short_description"),

  // Mô tả chi tiết — trang riêng
  fullDescription: text("full_description"),

  // Icon name hoặc URL icon
  icon: varchar("icon", { length: 100 }),

  // Ảnh đại diện dịch vụ
  imageUrl: text("image_url"),

  // Cách hiển thị ảnh
  imageFit: varchar("image_fit", { length: 20 }).default("cover"),

  // Các trụ cột/nhóm nội dung chính của giải pháp
  pillars: jsonb("pillars").$type<Array<{ title: string; text: string }>>().default([]),

  // Thứ tự hiển thị
  sortOrder: integer("sort_order").default(0).notNull(),

  // Trạng thái: active (hoạt động) / inactive (ngừng)
  isPublished: boolean("is_published").default(true).notNull(),

  // SEO metadata
  seoMeta: jsonb("seo_meta").$type<{
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  }>(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// BẢNG: product_categories — Danh mục sản phẩm
// ============================================================
export const productCategories = pgTable("product_categories", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Tên danh mục
  name: varchar("name", { length: 255 }).notNull(),

  // Slug cho URL
  slug: varchar("slug", { length: 255 }).unique().notNull(),

  // Mô tả danh mục
  description: text("description"),

  // Thứ tự hiển thị
  sortOrder: integer("sort_order").default(0).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// BẢNG: products — Sản phẩm công ty
// ============================================================
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Tên sản phẩm
  name: varchar("name", { length: 255 }).notNull(),

  // Slug cho URL
  slug: varchar("slug", { length: 255 }).unique().notNull(),

  // Mô tả ngắn
  shortDescription: text("short_description"),

  // Mô tả chi tiết
  fullDescription: text("full_description"),

  // Danh mục (FK — foreign key)
  categoryId: uuid("category_id").references(() => productCategories.id, {
    onDelete: "set null",
  }),

  // Ảnh đại diện sản phẩm
  thumbnailUrl: text("thumbnail_url"),

  // Danh sách ảnh bổ sung — lưu dạng JSON array
  images: jsonb("images").$type<string[]>().default([]),

  // Cách hiển thị ảnh
  imageFit: varchar("image_fit", { length: 20 }).default("cover"),

  // Giá trị/lợi ích chính
  benefits: jsonb("benefits").$type<string[]>().default([]),

  // Các tính năng nổi bật
  features: jsonb("features").$type<string[]>().default([]),

  // Bảng thông số hiển thị ở frontend
  specs: jsonb("specs").$type<Array<{ label: string; value: string }>>().default([]),

  // Trạng thái hiển thị
  isPublished: boolean("is_published").default(true).notNull(),

  // Nổi bật (featured) — hiển thị ưu tiên
  isFeatured: boolean("is_featured").default(false).notNull(),

  // SEO metadata
  seoMeta: jsonb("seo_meta").$type<{
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  }>(),

  // Thứ tự hiển thị
  sortOrder: integer("sort_order").default(0).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// BẢNG: news_articles — Tin tức / bài viết
// ============================================================
export const newsArticles = pgTable("news_articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  excerpt: text("excerpt"),
  content: text("content"),
  coverImageUrl: text("cover_image_url"),
  imageFit: varchar("image_fit", { length: 20 }).default("cover"),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  sortOrder: integer("sort_order").default(0).notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  seoMeta: jsonb("seo_meta").$type<{
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
  }>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  message: text("message").notNull(),
  source: varchar("source", { length: 100 }).default("website-contact").notNull(),
  status: varchar("status", { length: 30 }).default("new").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// RELATIONS — Quan hệ giữa các bảng
// ============================================================

/**
 * Quan hệ: productCategories → products (1-N)
 * Một danh mục có nhiều sản phẩm
 */
export const productCategoriesRelations = relations(
  productCategories,
  ({ many }) => ({
    products: many(products),
  })
);

/**
 * Quan hệ: products → productCategories (N-1)
 * Một sản phẩm thuộc một danh mục
 */
export const productsRelations = relations(products, ({ one }) => ({
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),
}));

// ============================================================
// BẢNG: landing_pages — Trang landing page sản phẩm
// ============================================================
export const landingPages = pgTable("landing_pages", {
  // ID duy nhất
  id: uuid("id").defaultRandom().primaryKey(),

  // Slug duy nhất cho URL — ví dụ: "ai-sales-assistant"
  slug: varchar("slug", { length: 255 }).unique().notNull(),

  // Tên landing page (hiển thị trong admin)
  title: varchar("title", { length: 255 }).notNull(),

  // Mô tả ngắn (dùng trong danh sách admin)
  description: text("description"),

  // Trạng thái: draft (nháp) / published (đã xuất bản) / archived (lưu trữ)
  status: varchar("status", { length: 20 }).default("draft").notNull(),

  // SEO — Meta title cho thẻ <title>
  seoTitle: varchar("seo_title", { length: 255 }),

  // SEO — Meta description cho thẻ <meta name="description">
  seoDescription: text("seo_description"),

  // SEO — Open Graph image URL
  ogImage: text("og_image"),

  // Thời gian xuất bản (nullable — chỉ set khi publish)
  publishedAt: timestamp("published_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// BẢNG: landing_sections — Các section trong landing page
// ============================================================
export const landingSections = pgTable("landing_sections", {
  // ID duy nhất
  id: uuid("id").defaultRandom().primaryKey(),

  // FK — thuộc landing page nào
  landingPageId: uuid("landing_page_id")
    .references(() => landingPages.id, { onDelete: "cascade" })
    .notNull(),

  // Loại section: hero, pain_points, solution, features, how_it_works,
  //               stats, testimonials, pricing, faq, cta_footer, custom
  sectionType: varchar("section_type", { length: 50 }).notNull(),

  // Tiêu đề section (tùy chọn — một số section không cần)
  title: varchar("title", { length: 255 }),

  // Phụ đề section
  subtitle: text("subtitle"),

  // Nội dung mô tả (HTML/rich text nếu cần)
  description: text("description"),

  // Loại background: none, color, gradient, image
  backgroundType: varchar("background_type", { length: 20 }).default("none"),

  // Giá trị background: hex color, CSS gradient, hoặc URL ảnh
  backgroundValue: varchar("background_value", { length: 500 }),

  // Thứ tự hiển thị — số nhỏ hiển thị trước
  sortOrder: integer("sort_order").default(0).notNull(),

  // Ẩn/hiện section
  isVisible: boolean("is_visible").default(true).notNull(),

  // Cấu hình bổ sung theo loại section (JSONB linh hoạt)
  config: jsonb("config").$type<Record<string, unknown>>(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// BẢNG: landing_items — Nội dung con trong mỗi section
// ============================================================
export const landingItems = pgTable("landing_items", {
  // ID duy nhất
  id: uuid("id").defaultRandom().primaryKey(),

  // FK — thuộc section nào
  sectionId: uuid("section_id")
    .references(() => landingSections.id, { onDelete: "cascade" })
    .notNull(),

  // Loại item: feature, pain_point, step, stat, testimonial,
  //            pricing_plan, faq, cta, logo, custom
  itemType: varchar("item_type", { length: 50 }).notNull(),

  // Tiêu đề item
  title: varchar("title", { length: 255 }),

  // Mô tả / nội dung item
  description: text("description"),

  // Icon (tên icon hoặc emoji)
  icon: varchar("icon", { length: 100 }),

  // URL hình ảnh
  imageUrl: text("image_url"),

  // URL liên kết (CTA button)
  linkUrl: varchar("link_url", { length: 500 }),

  // Text hiển thị trên link/button
  linkText: varchar("link_text", { length: 255 }),

  // Metadata mở rộng theo loại item (JSONB)
  // testimonial: { author, role, company, avatar, rating }
  // pricing_plan: { price, period, currency, features[], isPopular, badge }
  // stat: { value, suffix, prefix }
  // faq: { answer } (description = question)
  // step: { stepNumber }
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),

  // Thứ tự hiển thị
  sortOrder: integer("sort_order").default(0).notNull(),

  // Ẩn/hiện item
  isVisible: boolean("is_visible").default(true).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// ============================================================
// RELATIONS — Quan hệ Landing Pages
// ============================================================

/** Quan hệ: landingPages → landingSections (1-N) */
export const landingPagesRelations = relations(landingPages, ({ many }) => ({
  sections: many(landingSections),
}));

/** Quan hệ: landingSections → landingPages (N-1) + landingItems (1-N) */
export const landingSectionsRelations = relations(
  landingSections,
  ({ one, many }) => ({
    landingPage: one(landingPages, {
      fields: [landingSections.landingPageId],
      references: [landingPages.id],
    }),
    items: many(landingItems),
  })
);

/** Quan hệ: landingItems → landingSections (N-1) */
export const landingItemsRelations = relations(landingItems, ({ one }) => ({
  section: one(landingSections, {
    fields: [landingItems.sectionId],
    references: [landingSections.id],
  }),
}));
