/**
 * @nhom        : Admin / Services
 * @chucnang    : Trang danh sách dịch vụ — kết nối DB thực
 * @lienquan    : src/lib/db/queries/services.ts, src/lib/actions/services.ts
 * @alias       : services-list, services-page
 */
import type { Metadata } from "next";
import Link from "next/link";
import { ServicesTable } from "./services-table";
import { getAllServices } from "@/lib/db/queries/services";
import type { Service } from "@/types/database";

export const metadata: Metadata = {
  title: "Quản lý dịch vụ",
};

/**
 * Lấy dữ liệu từ database thực
 */
async function getData(): Promise<Service[]> {
  try {
    return (await getAllServices()) as Service[];
  } catch (error) {
    console.error("[ServicesPage] Lỗi truy vấn DB:", error);
    return [];
  }
}

export default async function ServicesPage() {
  const data = await getData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Quản lý dịch vụ
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Quản lý các dịch vụ công ty cung cấp: tên, mô tả, icon, SEO
          </p>
        </div>
        <Link
          href="/services/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm dịch vụ
        </Link>
      </div>

      {/* Bảng dữ liệu */}
      <ServicesTable data={data} />
    </div>
  );
}
