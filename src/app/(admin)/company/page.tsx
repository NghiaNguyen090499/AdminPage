/**
 * @nhom        : Admin / Company
 * @chucnang    : Trang danh sách sections công ty — kết nối DB thực
 * @lienquan    : src/lib/db/queries/company.ts, src/lib/actions/company.ts
 * @alias       : company-list, company-page
 */
import type { Metadata } from "next";
import Link from "next/link";
import { CompanyTable } from "./company-table";
import { getAllCompanyInfo } from "@/lib/db/queries/company";
import type { CompanyInfo } from "@/types/database";

export const metadata: Metadata = {
  title: "Quản lý công ty",
};

/**
 * Lấy dữ liệu từ database thực
 */
async function getData(): Promise<CompanyInfo[]> {
  try {
    return (await getAllCompanyInfo()) as CompanyInfo[];
  } catch (error) {
    console.error("[CompanyPage] Lỗi truy vấn DB:", error);
    return [];
  }
}

export default async function CompanyPage() {
  const data = await getData();

  return (
    <div className="space-y-6">
      {/* Header — tiêu đề + nút thêm mới */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Quản lý giới thiệu công ty
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Quản lý các mục giới thiệu: About, Tầm nhìn, Sứ mệnh, Lịch sử
          </p>
        </div>
        <Link
          href="/company/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Thêm mục mới
        </Link>
      </div>

      {/* Bảng dữ liệu */}
      <CompanyTable data={data} />
    </div>
  );
}
