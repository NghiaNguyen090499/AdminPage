/**
 * @nhom        : Admin / Landing
 * @chucnang    : Trang chi tiết landing page — chỉnh sửa thông tin + quản lý sections
 * @lienquan    : src/lib/db/queries/landing.ts, src/app/(admin)/landing/landing-form.tsx
 * @alias       : landing-detail-page
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLandingPageById, getSectionsByPageId } from "@/lib/db/queries/landing";
import { LandingForm } from "../landing-form";
import { SectionsManager } from "./sections-manager";
import type { LandingPage, LandingSection } from "@/types/database";

export const metadata: Metadata = {
  title: "Chỉnh sửa Landing Page",
};

export default async function EditLandingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Lấy landing page từ DB
  const page = (await getLandingPageById(id)) as LandingPage | null;
  if (!page) notFound();

  // Lấy sections
  const sections = (await getSectionsByPageId(id)) as LandingSection[];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            {page.title}
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Slug: <code className="bg-[var(--muted)] px-2 py-0.5 rounded">{page.slug}</code>
            {page.status === "published" && (
              <a
                href={`/api/v1/landing/${page.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 text-blue-500 hover:underline"
              >
                Xem API →
              </a>
            )}
          </p>
        </div>
      </div>

      {/* Tab-like layout: 2 sections chính */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Thông tin chung (1/3) */}
        <div className="lg:col-span-1">
          <LandingForm initialData={page} />
        </div>

        {/* Cột phải: Quản lý sections (2/3) */}
        <div className="lg:col-span-2">
          <SectionsManager landingPageId={page.id} sections={sections} />
        </div>
      </div>
    </div>
  );
}
