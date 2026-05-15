/**
 * @nhom        : Admin / Services
 * @chucnang    : Trang chỉnh sửa dịch vụ — kết nối DB thực
 * @lienquan    : src/app/(admin)/services/services-form.tsx, src/lib/db/queries/services.ts
 * @alias       : services-edit
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceForm } from "../../services-form";
import { getServiceById } from "@/lib/db/queries/services";

export const metadata: Metadata = {
  title: "Chỉnh sửa dịch vụ",
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditServicePage({ params }: PageProps) {
  const { id } = await params;
  const service = await getServiceById(id);

  if (!service) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Chỉnh sửa dịch vụ</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Cập nhật thông tin cho <span className="font-medium text-[var(--foreground)]">{service.name}</span>
        </p>
      </div>
      <ServiceForm initialData={service} />
    </div>
  );
}
