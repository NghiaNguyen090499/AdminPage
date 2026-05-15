/**
 * @nhom        : Admin / Team
 * @chucnang    : Trang danh sách thành viên đội ngũ — kết nối DB thực
 * @lienquan    : src/lib/db/queries/team.ts, src/lib/actions/team.ts
 * @alias       : team-list, team-page
 */
import type { Metadata } from "next";
import Link from "next/link";
import { TeamTable } from "./team-table";
import { getAllTeamMembers } from "@/lib/db/queries/team";
import type { TeamMember } from "@/types/database";

export const metadata: Metadata = {
  title: "Quản lý đội ngũ",
};

/**
 * Lấy dữ liệu từ database thực
 */
async function getData(): Promise<TeamMember[]> {
  try {
    return (await getAllTeamMembers()) as TeamMember[];
  } catch (error) {
    console.error("[TeamPage] Lỗi truy vấn DB:", error);
    return [];
  }
}

export default async function TeamPage() {
  const data = await getData();

  return (
    <div className="space-y-6">
      {/* Header — tiêu đề + nút thêm mới */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            Quản lý đội ngũ
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Quản lý thành viên đội ngũ: thông tin, chức vụ, liên kết mạng xã hội
          </p>
        </div>
        <Link
          href="/team/new"
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
          Thêm thành viên
        </Link>
      </div>

      {/* Bảng dữ liệu */}
      <TeamTable data={data} />
    </div>
  );
}
