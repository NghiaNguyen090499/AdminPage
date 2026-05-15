/**
 * @nhom        : Admin / Landing
 * @chucnang    : Trang tạo landing page mới
 * @lienquan    : src/app/(admin)/landing/landing-form.tsx
 * @alias       : landing-new-page
 */
import type { Metadata } from "next";
import { LandingForm } from "../landing-form";

export const metadata: Metadata = {
  title: "Tạo Landing Page mới",
};

export default function NewLandingPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Tạo Landing Page mới</h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-1">
          Điền thông tin cơ bản, sau đó thêm sections và nội dung
        </p>
      </div>

      {/* Form */}
      <LandingForm />
    </div>
  );
}
