/**
 * @nhom        : Admin / Team
 * @chucnang    : Trang chỉnh sửa thành viên — kết nối DB thực
 * @lienquan    : src/app/(admin)/team/team-form.tsx, src/lib/db/queries/team.ts
 * @alias       : team-edit, team-edit-page
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeamForm } from "../../team-form";
import { getTeamMemberById } from "@/lib/db/queries/team";

export const metadata: Metadata = {
  title: "Chỉnh sửa thành viên",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTeamMemberPage({ params }: PageProps) {
  const { id } = await params;
  const member = await getTeamMemberById(id);

  if (!member) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Chỉnh sửa thành viên
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Cập nhật thông tin cho <span className="font-medium text-[var(--foreground)]">{member.fullName}</span>
        </p>
      </div>

      {/* Form — mode edit (truyền initialData) */}
      <TeamForm initialData={member} />
    </div>
  );
}
