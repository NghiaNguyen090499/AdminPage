/**
 * @nhom        : Types
 * @chucnang    : Định nghĩa TypeScript types từ database schema
 * @lienquan    : src/lib/db/schema.ts
 * @alias       : db-types, model-types
 */
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type {
  companyInfo,
  teamMembers,
  services,
  productCategories,
  products,
  landingPages,
  landingSections,
  landingItems,
} from "@/lib/db/schema";

// Company Info
export type CompanyInfo = InferSelectModel<typeof companyInfo>;
export type NewCompanyInfo = InferInsertModel<typeof companyInfo>;

// Team Members
export type TeamMember = InferSelectModel<typeof teamMembers>;
export type NewTeamMember = InferInsertModel<typeof teamMembers>;

// Services
export type Service = InferSelectModel<typeof services>;
export type NewService = InferInsertModel<typeof services>;

// Product Categories
export type ProductCategory = InferSelectModel<typeof productCategories>;
export type NewProductCategory = InferInsertModel<typeof productCategories>;

// Products
export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;

/** Sản phẩm kèm danh mục (khi JOIN) */
export type ProductWithCategory = Product & {
  category: ProductCategory | null;
};

// ============================================================
// Landing Pages
// ============================================================

/** Landing page — dữ liệu từ DB */
export type LandingPage = InferSelectModel<typeof landingPages>;
export type NewLandingPage = InferInsertModel<typeof landingPages>;

/** Section trong landing page */
export type LandingSection = InferSelectModel<typeof landingSections>;
export type NewLandingSection = InferInsertModel<typeof landingSections>;

/** Item (nội dung con) trong section */
export type LandingItem = InferSelectModel<typeof landingItems>;
export type NewLandingItem = InferInsertModel<typeof landingItems>;

/** Section kèm danh sách items (cho API response) */
export type LandingSectionWithItems = LandingSection & {
  items: LandingItem[];
};

/** Landing page đầy đủ — kèm sections + items (cho API response) */
export type LandingPageFull = LandingPage & {
  sections: LandingSectionWithItems[];
};
