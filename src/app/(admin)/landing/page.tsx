/**
 * @nhom        : Admin / Landing
 * @chucnang    : Trang danh sách landing pages — quản lý CRUD
 * @lienquan    : src/lib/db/queries/landing.ts
 * @alias       : landing-list-page
 */
import type { Metadata } from "next";
import Link from "next/link";
import { LandingTable } from "./landing-table";
import { getAllLandingPages } from "@/lib/db/queries/landing";
import type { LandingPage } from "@/types/database";

export const metadata: Metadata = {
  title: "Quản lý Landing Pages",
};

/** Lấy danh sách landing pages từ DB */
async function getLandingPages(): Promise<LandingPage[]> {
  try {
    return (await getAllLandingPages()) as LandingPage[];
  } catch (error) {
    console.error("[LandingPage] Lỗi truy vấn:", error);
    return [];
  }
}

export default async function LandingPagesPage() {
  const pages = await getLandingPages();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Landing Pages
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Quản lý trang giới thiệu sản phẩm
          </p>
        </div>
        <Link
          href="/landing/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2.5 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo Landing Page
        </Link>
      </div>

      {/* Bảng danh sách */}
      <LandingTable data={pages} />
    </div>
  );
}
