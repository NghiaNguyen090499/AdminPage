/**
 * @nhom        : Admin / Team
 * @chucnang    : Trang tạo thành viên mới
 * @lienquan    : src/app/(admin)/team/team-form.tsx
 * @alias       : team-new, team-create-page
 */
import type { Metadata } from "next";
import { TeamForm } from "../team-form";

export const metadata: Metadata = {
  title: "Thêm thành viên mới",
};

export default function NewTeamMemberPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Thêm thành viên mới
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Điền thông tin thành viên mới cho đội ngũ
        </p>
      </div>

      {/* Form — mode tạo mới (không truyền initialData) */}
      <TeamForm />
    </div>
  );
}
