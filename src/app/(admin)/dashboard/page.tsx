/**
 * @nhom        : Admin
 * @chucnang    : Dashboard page — thống kê thực từ DB
 * @lienquan    : src/lib/db/queries/
 * @alias       : dashboard-page, admin-home
 */
import type { Metadata } from "next";
import Link from "next/link";
import { countCompanyInfo } from "@/lib/db/queries/company";
import { countTeamMembers } from "@/lib/db/queries/team";
import { countServices } from "@/lib/db/queries/services";
import { countProducts } from "@/lib/db/queries/products";

export const metadata: Metadata = {
  title: "Dashboard",
};

/**
 * Lấy thống kê thực từ database
 */
async function getStats() {
  try {
    const [companyCount, teamCount, serviceCount, productCount] =
      await Promise.all([
        countCompanyInfo(),
        countTeamMembers(),
        countServices(),
        countProducts(),
      ]);

    return [
      {
        label: "Giới thiệu",
        value: String(companyCount),
        description: "Sections công ty",
        color: "from-blue-500 to-blue-600",
        href: "/company",
      },
      {
        label: "Đội ngũ",
        value: String(teamCount),
        description: "Thành viên",
        color: "from-emerald-500 to-emerald-600",
        href: "/team",
      },
      {
        label: "Dịch vụ",
        value: String(serviceCount),
        description: "Dịch vụ đang hoạt động",
        color: "from-amber-500 to-amber-600",
        href: "/services",
      },
      {
        label: "Sản phẩm",
        value: String(productCount),
        description: "Sản phẩm đã đăng",
        color: "from-purple-500 to-purple-600",
        href: "/products",
      },
    ];
  } catch (error) {
    console.error("[Dashboard] Lỗi lấy thống kê:", error);
    return [
      { label: "Giới thiệu", value: "—", description: "Lỗi kết nối", color: "from-blue-500 to-blue-600", href: "/company" },
      { label: "Đội ngũ", value: "—", description: "Lỗi kết nối", color: "from-emerald-500 to-emerald-600", href: "/team" },
      { label: "Dịch vụ", value: "—", description: "Lỗi kết nối", color: "from-amber-500 to-amber-600", href: "/services" },
      { label: "Sản phẩm", value: "—", description: "Lỗi kết nối", color: "from-purple-500 to-purple-600", href: "/products" },
    ];
  }
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      {/* Tiêu đề trang */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Dashboard
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Tổng quan hệ thống quản lý nội dung
        </p>
      </div>

      {/* Grid thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all duration-200 hover:shadow-lg hover:shadow-black/5 hover:border-[var(--primary)]/30"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[var(--muted-foreground)]">
                {stat.label}
              </p>
              <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
              >
                <span className="text-white text-xs font-bold">
                  {stat.value}
                </span>
              </div>
            </div>
            <p className="text-3xl font-bold text-[var(--foreground)] mt-3">
              {stat.value}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              {stat.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">
          Hành động nhanh
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Thêm mục giới thiệu", href: "/company/new" },
            { label: "Thêm thành viên mới", href: "/team/new" },
            { label: "Tạo dịch vụ mới", href: "/services/new" },
            { label: "Thêm sản phẩm mới", href: "/products/new" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 p-4 rounded-lg border border-dashed border-[var(--border)] text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-all duration-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
