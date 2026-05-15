/**
 * @nhom        : Admin / Company
 * @chucnang    : Trang chỉnh sửa section giới thiệu công ty — kết nối DB thực
 * @lienquan    : src/lib/db/queries/company.ts, src/app/(admin)/company/company-form.tsx
 * @alias       : company-edit, company-update
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompanyForm } from "../../company-form";
import { getCompanyInfoById } from "@/lib/db/queries/company";

export const metadata: Metadata = {
  title: "Chỉnh sửa mục giới thiệu",
};

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await getCompanyInfoById(id);

  if (!data) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Chỉnh sửa: {data.title}
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Cập nhật nội dung section &ldquo;{data.key}&rdquo;
        </p>
      </div>
      <CompanyForm initialData={data} />
    </div>
  );
}
