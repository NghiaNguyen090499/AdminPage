/**
 * @nhom        : Admin / Company
 * @chucnang    : Form tạo section giới thiệu công ty mới
 * @lienquan    : src/lib/actions/company.ts, src/app/(admin)/company/page.tsx
 * @alias       : company-new, company-create-form
 */
import type { Metadata } from "next";
import { CompanyForm } from "../company-form";

export const metadata: Metadata = {
  title: "Thêm mục giới thiệu mới",
};

export default function NewCompanyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">
          Thêm mục giới thiệu mới
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Tạo section mới cho trang giới thiệu công ty
        </p>
      </div>

      {/* Form — không truyền initialData = mode tạo mới */}
      <CompanyForm />
    </div>
  );
}
