/**
 * @nhom        : Admin / Landing
 * @chucnang    : Form tạo/chỉnh sửa landing page (thông tin chung + SEO)
 * @input       : initialData (LandingPage | null) — null khi tạo mới
 * @lienquan    : src/lib/actions/landing.ts
 * @alias       : landing-form
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createLandingPageAction, updateLandingPageAction } from "@/lib/actions/landing";
import type { LandingPage } from "@/types/database";

/** Tạo slug từ title */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function LandingForm({ initialData }: { initialData?: LandingPage | null }) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState(initialData?.status || "draft");
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || "");
  const [ogImage, setOgImage] = useState(initialData?.ogImage || "");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  /** Tự động tạo slug khi title thay đổi (chỉ khi tạo mới) */
  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEdit) {
      setSlug(generateSlug(value));
    }
  }

  /** Submit form */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("slug", slug);
    formData.set("description", description);
    formData.set("status", status);
    formData.set("seoTitle", seoTitle);
    formData.set("seoDescription", seoDescription);
    formData.set("ogImage", ogImage);

    try {
      const result = isEdit
        ? await updateLandingPageAction(initialData!.id, formData)
        : await createLandingPageAction(formData);

      if (result.success) {
        setMessage({ type: "success", text: result.message });
        if (!isEdit && result.id) {
          // Redirect sang trang chỉnh sửa sau khi tạo
          setTimeout(() => router.push(`/landing/${result.id}`), 500);
        } else {
          router.refresh();
        }
      } else {
        setMessage({ type: "error", text: result.error || result.message });
      }
    } catch {
      setMessage({ type: "error", text: "Lỗi không xác định" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Thông báo */}
      {message && (
        <div className={`p-4 rounded-lg text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.text}
        </div>
      )}

      {/* Thông tin chung */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Thông tin chung</h2>

        {/* Tên */}
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Tên Landing Page <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="VD: AI Sales Assistant"
            required
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">
            Slug (URL) <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--muted-foreground)]">/landing/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="ai-sales-assistant"
              required
              className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent font-mono"
            />
          </div>
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Mô tả ngắn</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Mô tả ngắn gọn về landing page..."
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
          />
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Trạng thái</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          >
            <option value="draft">📝 Nháp</option>
            <option value="published">✅ Xuất bản</option>
            <option value="archived">📦 Lưu trữ</option>
          </select>
        </div>
      </div>

      {/* SEO */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">SEO & Open Graph</h2>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Meta Title</label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="Tiêu đề hiển thị trên Google..."
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Meta Description</label>
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            rows={2}
            placeholder="Mô tả hiển thị trên Google (tối đa 160 ký tự)..."
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--foreground)] mb-1">OG Image URL</label>
          <input
            type="text"
            value={ogImage}
            onChange={(e) => setOgImage(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] px-6 py-2.5 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
        >
          {submitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang lưu...
            </>
          ) : (
            <>{isEdit ? "Cập nhật" : "Tạo Landing Page"}</>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-[var(--border)] px-6 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
