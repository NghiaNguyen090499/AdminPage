/**
 * @nhom        : Admin / Landing
 * @chucnang    : Component quản lý sections + items trong landing page
 *                Cho phép thêm/sửa/xóa sections và items bên trong
 * @input       : landingPageId (string), sections (LandingSection[])
 * @lienquan    : src/lib/actions/landing.ts
 * @alias       : sections-manager
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createSectionAction,
  deleteSectionAction,
  updateSectionAction,
} from "@/lib/actions/landing";
import type { LandingSection } from "@/types/database";
import { SectionItemsEditor } from "./section-items-editor";

/** Danh sách loại section có sẵn */
const SECTION_TYPES = [
  { value: "hero", label: "🎯 Hero", desc: "Banner chính — headline, CTA" },
  { value: "pain_points", label: "😫 Pain Points", desc: "Vấn đề khách hàng gặp phải" },
  { value: "solution", label: "💡 Solution", desc: "Giải pháp tổng quan" },
  { value: "features", label: "⚡ Features", desc: "Tính năng nổi bật" },
  { value: "how_it_works", label: "🔄 How It Works", desc: "Cách hoạt động (steps)" },
  { value: "stats", label: "📊 Stats", desc: "Số liệu — social proof" },
  { value: "testimonials", label: "💬 Testimonials", desc: "Đánh giá khách hàng" },
  { value: "pricing", label: "💰 Pricing", desc: "Bảng giá" },
  { value: "faq", label: "❓ FAQ", desc: "Câu hỏi thường gặp" },
  { value: "cta_footer", label: "🚀 CTA Footer", desc: "Kêu gọi hành động cuối trang" },
  { value: "custom", label: "🔧 Custom", desc: "Section tùy chỉnh" },
];

export function SectionsManager({
  landingPageId,
  sections,
}: {
  landingPageId: string;
  sections: LandingSection[];
}) {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [addingType, setAddingType] = useState("");
  const [addingTitle, setAddingTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  /** Thêm section mới */
  async function handleAddSection() {
    if (!addingType) return;
    setSubmitting(true);
    const formData = new FormData();
    formData.set("landingPageId", landingPageId);
    formData.set("sectionType", addingType);
    formData.set("title", addingTitle);
    formData.set("sortOrder", String(sections.length));

    const result = await createSectionAction(formData);
    if (result.success) {
      setShowAddForm(false);
      setAddingType("");
      setAddingTitle("");
      router.refresh();
    } else {
      alert(result.error || result.message);
    }
    setSubmitting(false);
  }

  /** Xóa section */
  async function handleDeleteSection(id: string) {
    if (!confirm("Xóa section này? Toàn bộ items bên trong cũng sẽ bị xóa.")) return;
    const result = await deleteSectionAction(id, landingPageId);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || result.message);
    }
  }

  /** Cập nhật section inline */
  async function handleUpdateSection(id: string, data: { title?: string; subtitle?: string; description?: string; isVisible?: boolean }) {
    const formData = new FormData();
    formData.set("landingPageId", landingPageId);
    if (data.title !== undefined) formData.set("title", data.title);
    if (data.subtitle !== undefined) formData.set("subtitle", data.subtitle);
    if (data.description !== undefined) formData.set("description", data.description);
    if (data.isVisible !== undefined) formData.set("isVisible", String(data.isVisible));

    const section = sections.find(s => s.id === id);
    if (section) {
      formData.set("sortOrder", String(section.sortOrder));
    }

    const result = await updateSectionAction(id, formData);
    if (result.success) {
      setEditingSection(null);
      router.refresh();
    } else {
      alert(result.error || result.message);
    }
  }

  /** Toggle ẩn/hiện section */
  async function handleToggleVisibility(section: LandingSection) {
    await handleUpdateSection(section.id, { isVisible: !section.isVisible });
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Sections ({sections.length})
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] px-3 py-2 text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm Section
        </button>
      </div>

      {/* Form thêm section */}
      {showAddForm && (
        <div className="rounded-xl border-2 border-dashed border-[var(--primary)] bg-[var(--card)] p-4 space-y-3">
          <h3 className="text-sm font-medium text-[var(--foreground)]">Thêm section mới</h3>

          {/* Chọn loại section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SECTION_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setAddingType(type.value)}
                className={`text-left p-2 rounded-lg border text-sm transition-all ${
                  addingType === type.value
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 ring-1 ring-[var(--primary)]"
                    : "border-[var(--border)] hover:border-[var(--primary)]"
                }`}
              >
                <div className="font-medium">{type.label}</div>
                <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{type.desc}</div>
              </button>
            ))}
          </div>

          {/* Title (tùy chọn) */}
          {addingType && (
            <input
              type="text"
              value={addingTitle}
              onChange={(e) => setAddingTitle(e.target.value)}
              placeholder="Tiêu đề section (tùy chọn)"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
            />
          )}

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAddSection}
              disabled={!addingType || submitting}
              className="px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-medium disabled:opacity-50"
            >
              {submitting ? "Đang thêm..." : "Thêm"}
            </button>
            <button
              onClick={() => { setShowAddForm(false); setAddingType(""); setAddingTitle(""); }}
              className="px-4 py-2 rounded-lg border border-[var(--border)] text-sm"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Danh sách sections */}
      {sections.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <p className="text-[var(--muted-foreground)]">Chưa có section nào. Bấm &quot;Thêm Section&quot; để bắt đầu.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sections.map((section, index) => {
            const typeInfo = SECTION_TYPES.find(t => t.value === section.sectionType);
            const isExpanded = expandedSection === section.id;
            const isEditing = editingSection === section.id;

            return (
              <div
                key={section.id}
                className={`rounded-xl border bg-[var(--card)] overflow-hidden transition-all ${
                  section.isVisible
                    ? "border-[var(--border)]"
                    : "border-[var(--border)] opacity-60"
                }`}
              >
                {/* Section header */}
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Số thứ tự */}
                  <span className="w-6 h-6 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>

                  {/* Type badge */}
                  <span className="text-sm">{typeInfo?.label || section.sectionType}</span>

                  {/* Title */}
                  {section.title && (
                    <span className="text-sm text-[var(--muted-foreground)]">— {section.title}</span>
                  )}

                  {/* Visibility indicator */}
                  {!section.isVisible && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Ẩn</span>
                  )}

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {/* Toggle visibility */}
                    <button
                      onClick={() => handleToggleVisibility(section)}
                      className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors"
                      title={section.isVisible ? "Ẩn" : "Hiện"}
                    >
                      {section.isVisible ? (
                        <svg className="w-4 h-4 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>

                    {/* Edit section */}
                    <button
                      onClick={() => setEditingSection(isEditing ? null : section.id)}
                      className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors"
                      title="Sửa section"
                    >
                      <svg className="w-4 h-4 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    {/* Expand items */}
                    <button
                      onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                      className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors"
                      title="Quản lý items"
                    >
                      <svg className={`w-4 h-4 text-[var(--muted-foreground)] transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors text-[var(--muted-foreground)]"
                      title="Xóa section"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Inline edit form */}
                {isEditing && (
                  <SectionEditForm
                    section={section}
                    onSave={(data) => handleUpdateSection(section.id, data)}
                    onCancel={() => setEditingSection(null)}
                  />
                )}

                {/* Items editor (expandable) */}
                {isExpanded && (
                  <div className="border-t border-[var(--border)] p-4">
                    <SectionItemsEditor
                      sectionId={section.id}
                      landingPageId={landingPageId}
                      sectionType={section.sectionType}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Sub-component: Form chỉnh sửa section inline
// ============================================================
function SectionEditForm({
  section,
  onSave,
  onCancel,
}: {
  section: LandingSection;
  onSave: (data: { title: string; subtitle: string; description: string }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(section.title || "");
  const [subtitle, setSubtitle] = useState(section.subtitle || "");
  const [description, setDescription] = useState(section.description || "");

  return (
    <div className="border-t border-[var(--border)] p-4 bg-[var(--muted)]/30 space-y-3">
      <div>
        <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">Tiêu đề section</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
          placeholder="Tiêu đề..."
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">Phụ đề</label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
          placeholder="Phụ đề..."
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-1">Mô tả</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm resize-none"
          placeholder="Mô tả section..."
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave({ title, subtitle, description })}
          className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-medium"
        >
          Lưu
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs"
        >
          Hủy
        </button>
      </div>
    </div>
  );
}
