/**
 * @nhom        : Admin / Landing
 * @chucnang    : Editor quản lý items trong mỗi section
 *                Hiển thị danh sách items + form thêm/sửa item
 * @input       : sectionId, landingPageId, sectionType
 * @lienquan    : src/lib/actions/landing.ts, src/lib/db/queries/landing.ts
 * @alias       : section-items-editor
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  createItemAction,
  updateItemAction,
  deleteItemAction,
} from "@/lib/actions/landing";
import type { LandingItem } from "@/types/database";

/** Map loại section → loại item mặc định */
const SECTION_ITEM_TYPE_MAP: Record<string, string> = {
  hero: "cta",
  pain_points: "pain_point",
  solution: "feature",
  features: "feature",
  how_it_works: "step",
  stats: "stat",
  testimonials: "testimonial",
  pricing: "pricing_plan",
  faq: "faq",
  cta_footer: "cta",
  custom: "custom",
};

/** Label cho từng loại item */
const ITEM_TYPE_LABELS: Record<string, string> = {
  feature: "Tính năng",
  pain_point: "Vấn đề",
  step: "Bước",
  stat: "Số liệu",
  testimonial: "Đánh giá",
  pricing_plan: "Gói giá",
  faq: "Câu hỏi",
  cta: "Nút CTA",
  logo: "Logo",
  custom: "Tùy chỉnh",
};

export function SectionItemsEditor({
  sectionId,
  landingPageId,
  sectionType,
}: {
  sectionId: string;
  landingPageId: string;
  sectionType: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState<LandingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<LandingItem | null>(null);
  const defaultItemType = SECTION_ITEM_TYPE_MAP[sectionType] || "custom";

  /** Load items từ server */
  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/internal/landing-items?sectionId=${sectionId}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error("Lỗi load items:", error);
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  /** Xóa item */
  async function handleDeleteItem(id: string) {
    if (!confirm("Xóa item này?")) return;
    const result = await deleteItemAction(id, landingPageId);
    if (result.success) {
      loadItems();
      router.refresh();
    } else {
      alert(result.error || result.message);
    }
  }

  /** Submit form (tạo hoặc cập nhật) */
  async function handleSubmitItem(formData: FormData) {
    formData.set("sectionId", sectionId);
    formData.set("landingPageId", landingPageId);

    if (editingItem) {
      const result = await updateItemAction(editingItem.id, formData);
      if (result.success) {
        setEditingItem(null);
        setShowForm(false);
        loadItems();
        router.refresh();
      } else {
        alert(result.error || result.message);
      }
    } else {
      const result = await createItemAction(formData);
      if (result.success) {
        setShowForm(false);
        loadItems();
        router.refresh();
      } else {
        alert(result.error || result.message);
      }
    }
  }

  if (loading) {
    return (
      <div className="text-center py-4 text-sm text-[var(--muted-foreground)]">
        Đang tải items...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--foreground)]">
          Items ({items.length})
        </h3>
        <button
          onClick={() => { setShowForm(true); setEditingItem(null); }}
          className="text-xs px-3 py-1.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90"
        >
          + Thêm {ITEM_TYPE_LABELS[defaultItemType] || "Item"}
        </button>
      </div>

      {/* Danh sách items */}
      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] ${
                !item.isVisible ? "opacity-50" : ""
              }`}
            >
              {/* Icon */}
              {item.icon && <span className="text-lg">{item.icon}</span>}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[var(--foreground)]">
                  {item.title || `(${ITEM_TYPE_LABELS[item.itemType] || item.itemType})`}
                </div>
                {item.description && (
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5 line-clamp-2">{item.description}</p>
                )}
                {/* Metadata preview */}
                {item.metadata && (
                  <div className="text-xs text-blue-500 mt-1">
                    {item.itemType === "stat" && `${(item.metadata as Record<string, unknown>).prefix || ""}${(item.metadata as Record<string, unknown>).value}${(item.metadata as Record<string, unknown>).suffix || ""}`}
                    {item.itemType === "testimonial" && `— ${(item.metadata as Record<string, unknown>).author}, ${(item.metadata as Record<string, unknown>).company}`}
                    {item.itemType === "pricing_plan" && `${(item.metadata as Record<string, unknown>).currency || "$"}${(item.metadata as Record<string, unknown>).price}/${(item.metadata as Record<string, unknown>).period || "tháng"}`}
                    {item.itemType === "step" && `Bước ${(item.metadata as Record<string, unknown>).stepNumber}`}
                    {item.itemType === "custom" && Array.isArray((item.metadata as Record<string, unknown>).example) && `${((item.metadata as Record<string, unknown>).example as unknown[]).length} dòng ví dụ`}
                  </div>
                )}
              </div>

              {/* Type badge */}
              <span className="text-xs bg-[var(--muted)] px-2 py-0.5 rounded">
                {ITEM_TYPE_LABELS[item.itemType] || item.itemType}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setEditingItem(item); setShowForm(true); }}
                  className="p-1 rounded hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
                  title="Sửa"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1 rounded hover:bg-red-50 hover:text-red-500 text-[var(--muted-foreground)]"
                  title="Xóa"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form thêm/sửa item */}
      {showForm && (
        <ItemForm
          defaultType={defaultItemType}
          sectionType={sectionType}
          initialData={editingItem}
          onSubmit={handleSubmitItem}
          onCancel={() => { setShowForm(false); setEditingItem(null); }}
        />
      )}
    </div>
  );
}

// ============================================================
// Sub-component: Form tạo/sửa item
// ============================================================
function ItemForm({
  defaultType,
  sectionType,
  initialData,
  onSubmit,
  onCancel,
}: {
  defaultType: string;
  sectionType: string;
  initialData: LandingItem | null;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}) {
  const isEdit = !!initialData;
  const [itemType, setItemType] = useState(initialData?.itemType || defaultType);
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [icon, setIcon] = useState(initialData?.icon || "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [linkUrl, setLinkUrl] = useState(initialData?.linkUrl || "");
  const [linkText, setLinkText] = useState(initialData?.linkText || "");
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder ?? 0);
  const [submitting, setSubmitting] = useState(false);

  // Metadata fields — phụ thuộc vào itemType
  const meta = (initialData?.metadata || {}) as Record<string, unknown>;
  const [metaAuthor, setMetaAuthor] = useState((meta.author as string) || "");
  const [metaRole, setMetaRole] = useState((meta.role as string) || "");
  const [metaCompany, setMetaCompany] = useState((meta.company as string) || "");
  const [metaRating, setMetaRating] = useState(String(meta.rating || "5"));
  const [metaPrice, setMetaPrice] = useState(String(meta.price || ""));
  const [metaPeriod, setMetaPeriod] = useState((meta.period as string) || "tháng");
  const [metaCurrency, setMetaCurrency] = useState((meta.currency as string) || "$");
  const [metaFeatures, setMetaFeatures] = useState((meta.features as string[])?.join("\n") || "");
  const [metaIsPopular, setMetaIsPopular] = useState(!!meta.isPopular);
  const [metaValue, setMetaValue] = useState(String(meta.value || ""));
  const [metaSuffix, setMetaSuffix] = useState((meta.suffix as string) || "");
  const [metaPrefix, setMetaPrefix] = useState((meta.prefix as string) || "");
  const [metaStepNumber, setMetaStepNumber] = useState(String(meta.stepNumber || ""));
  const [metaAnswer, setMetaAnswer] = useState((meta.answer as string) || "");
  const [metaBefore, setMetaBefore] = useState((meta.before as string) || "");
  const [metaAfter, setMetaAfter] = useState((meta.after as string) || "");
  const [metaExample, setMetaExample] = useState((meta.example as string[])?.join("\n") || "");
  const [metaFieldType, setMetaFieldType] = useState((meta.fieldType as string) || "");
  const [metaOptions, setMetaOptions] = useState((meta.options as string[])?.join("\n") || "");
  const [metaRequired, setMetaRequired] = useState(!!meta.required);

  /** Build metadata object từ state */
  function buildMetadata(): Record<string, unknown> | null {
    switch (itemType) {
      case "testimonial":
        return { author: metaAuthor, role: metaRole, company: metaCompany, rating: parseInt(metaRating) || 5 };
      case "pricing_plan":
        return {
          price: metaPrice, period: metaPeriod, currency: metaCurrency,
          features: metaFeatures.split("\n").filter(Boolean),
          isPopular: metaIsPopular,
        };
      case "stat":
        return { value: metaValue, suffix: metaSuffix, prefix: metaPrefix };
      case "step":
        return { stepNumber: parseInt(metaStepNumber) || sortOrder + 1 };
      case "faq":
        return { answer: metaAnswer };
      case "custom": {
        const metadata: Record<string, unknown> = {};
        const example = metaExample.split("\n").map((line) => line.trim()).filter(Boolean);
        const options = metaOptions.split("\n").map((line) => line.trim()).filter(Boolean);

        if (metaBefore) metadata.before = metaBefore;
        if (metaAfter) metadata.after = metaAfter;
        if (example.length > 0) metadata.example = example;
        if (metaFieldType) metadata.fieldType = metaFieldType;
        if (options.length > 0) metadata.options = options;
        if (metaFieldType) metadata.required = metaRequired;

        return Object.keys(metadata).length > 0 ? metadata : null;
      }
      default:
        return null;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.set("itemType", itemType);
    formData.set("title", title);
    formData.set("description", description);
    formData.set("icon", icon);
    formData.set("imageUrl", imageUrl);
    formData.set("linkUrl", linkUrl);
    formData.set("linkText", linkText);
    formData.set("sortOrder", String(sortOrder));

    const metadata = buildMetadata();
    if (metadata) formData.set("metadata", JSON.stringify(metadata));

    await onSubmit(formData);
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-[var(--primary)] bg-[var(--background)] p-4 space-y-3">
      <h4 className="text-sm font-medium text-[var(--foreground)]">
        {isEdit ? "Sửa item" : "Thêm item mới"}
      </h4>

      {/* Loại item (ẩn nếu section type đã xác định) */}
      {sectionType === "custom" && (
        <div>
          <label className="block text-xs text-[var(--muted-foreground)] mb-1">Loại item</label>
          <select
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
          >
            {Object.entries(ITEM_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {/* Tiêu đề */}
        <div className="col-span-2">
          <label className="block text-xs text-[var(--muted-foreground)] mb-1">
            {itemType === "faq" ? "Câu hỏi" : "Tiêu đề"}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
            placeholder={itemType === "faq" ? "Câu hỏi..." : "Tiêu đề item..."}
          />
        </div>

        {/* Mô tả */}
        <div className="col-span-2">
          <label className="block text-xs text-[var(--muted-foreground)] mb-1">
            {itemType === "faq" ? "Câu trả lời ngắn (hiển thị trong preview)" : "Mô tả"}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm resize-none"
          />
        </div>

        {/* Icon + Image (cho feature, pain_point, step) */}
        {["feature", "pain_point", "step", "stat", "custom"].includes(itemType) && (
          <>
            <div>
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">Icon (emoji)</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
                placeholder="🤖"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">Image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
                placeholder="https://..."
              />
            </div>
          </>
        )}

        {/* CTA fields */}
        {["cta", "feature", "pricing_plan", "custom"].includes(itemType) && (
          <>
            <div>
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">Link URL</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
                placeholder="/trial"
              />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">Link Text</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
                placeholder="Dùng thử miễn phí"
              />
            </div>
          </>
        )}

        {/* Testimonial metadata */}
        {itemType === "testimonial" && (
          <>
            <div>
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">Tên tác giả</label>
              <input type="text" value={metaAuthor} onChange={(e) => setMetaAuthor(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm" />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">Chức vụ</label>
              <input type="text" value={metaRole} onChange={(e) => setMetaRole(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm" />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">Công ty</label>
              <input type="text" value={metaCompany} onChange={(e) => setMetaCompany(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm" />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">Đánh giá (1-5)</label>
              <input type="number" min={1} max={5} value={metaRating} onChange={(e) => setMetaRating(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm" />
            </div>
          </>
        )}

        {/* Pricing metadata */}
        {itemType === "pricing_plan" && (
          <>
            <div>
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">Giá</label>
              <input type="text" value={metaPrice} onChange={(e) => setMetaPrice(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm" placeholder="99" />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">Chu kỳ</label>
              <input type="text" value={metaPeriod} onChange={(e) => setMetaPeriod(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm" placeholder="tháng" />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">Tiền tệ</label>
              <input type="text" value={metaCurrency} onChange={(e) => setMetaCurrency(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm" placeholder="$" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={metaIsPopular} onChange={(e) => setMetaIsPopular(e.target.checked)} id="isPopular" />
              <label htmlFor="isPopular" className="text-xs text-[var(--muted-foreground)]">Gói phổ biến</label>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">Tính năng (mỗi dòng 1 tính năng)</label>
              <textarea value={metaFeatures} onChange={(e) => setMetaFeatures(e.target.value)} rows={3} className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm resize-none" placeholder="Tính năng 1&#10;Tính năng 2" />
            </div>
          </>
        )}

        {/* Stat metadata */}
        {itemType === "stat" && (
          <>
            <div>
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">Giá trị</label>
              <input type="text" value={metaValue} onChange={(e) => setMetaValue(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm" placeholder="300" />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">Prefix (trước số)</label>
              <input type="text" value={metaPrefix} onChange={(e) => setMetaPrefix(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm" placeholder="+" />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">Suffix (sau số)</label>
              <input type="text" value={metaSuffix} onChange={(e) => setMetaSuffix(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm" placeholder="%" />
            </div>
          </>
        )}

        {/* Step metadata */}
        {itemType === "step" && (
          <div>
            <label className="block text-xs text-[var(--muted-foreground)] mb-1">Số bước</label>
            <input type="number" value={metaStepNumber} onChange={(e) => setMetaStepNumber(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm" placeholder="1" />
          </div>
        )}

        {/* FAQ metadata */}
        {itemType === "faq" && (
          <div className="col-span-2">
            <label className="block text-xs text-[var(--muted-foreground)] mb-1">Câu trả lời chi tiết</label>
            <textarea value={metaAnswer} onChange={(e) => setMetaAnswer(e.target.value)} rows={3} className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm resize-none" placeholder="Câu trả lời đầy đủ..." />
          </div>
        )}

        {/* Custom metadata */}
        {itemType === "custom" && (
          <>
            <div>
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">Before (so sánh trước/sau)</label>
              <input type="text" value={metaBefore} onChange={(e) => setMetaBefore(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm" placeholder="Khách hỏi nhưng chờ sale trả lời" />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">After (so sánh trước/sau)</label>
              <input type="text" value={metaAfter} onChange={(e) => setMetaAfter(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm" placeholder="AI phản hồi ngay 24/7" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">Ví dụ hội thoại (mỗi dòng 1 câu)</label>
              <textarea value={metaExample} onChange={(e) => setMetaExample(e.target.value)} rows={5} className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm resize-y" placeholder={"Khách: Em cần mua điện thoại dưới 8 triệu...\nASA: Anh/chị có thể tham khảo iPhone 12...\nASA: Anh/chị đang ở khu vực nào..."} />
            </div>
            <div>
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">Loại field form</label>
              <select value={metaFieldType} onChange={(e) => setMetaFieldType(e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm">
                <option value="">Không phải field form</option>
                <option value="text">Text</option>
                <option value="tel">Phone</option>
                <option value="email">Email</option>
                <option value="select">Select</option>
                <option value="textarea">Textarea</option>
              </select>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" checked={metaRequired} onChange={(e) => setMetaRequired(e.target.checked)} id="custom-required" disabled={!metaFieldType} />
              <label htmlFor="custom-required" className="text-xs text-[var(--muted-foreground)]">Field bắt buộc</label>
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-[var(--muted-foreground)] mb-1">Options cho select (mỗi dòng 1 lựa chọn)</label>
              <textarea value={metaOptions} onChange={(e) => setMetaOptions(e.target.value)} rows={3} className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm resize-y" placeholder={"Bán lẻ điện thoại\nTrường học / tuyển sinh\nDịch vụ B2B"} />
            </div>
          </>
        )}

        {/* Sort order */}
        <div>
          <label className="block text-xs text-[var(--muted-foreground)] mb-1">Thứ tự</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-1.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-medium disabled:opacity-50"
        >
          {submitting ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-1.5 rounded-lg border border-[var(--border)] text-xs"
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
