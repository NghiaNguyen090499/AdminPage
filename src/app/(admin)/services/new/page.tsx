/**
 * @nhom        : Admin / Services
 * @chucnang    : Trang tạo dịch vụ mới
 * @lienquan    : src/app/(admin)/services/services-form.tsx
 * @alias       : services-new
 */
import type { Metadata } from "next";
import { ServiceForm } from "../services-form";

export const metadata: Metadata = {
  title: "Thêm dịch vụ mới",
};

export default function NewServicePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Thêm dịch vụ mới</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">Điền thông tin dịch vụ công ty cung cấp</p>
      </div>
      <ServiceForm />
    </div>
  );
}
