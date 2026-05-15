"use client";
/**
 * @nhom        : Admin / Services
 * @chucnang    : Form component dùng chung cho tạo mới + chỉnh sửa dịch vụ
 * @input       : initialData? (Service) — nếu có = mode sửa
 * @lienquan    : src/lib/actions/services.ts
 * @alias       : services-form, services-editor
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Service } from "@/types/database";

interface ServiceFormProps {
  initialData?: Service;
}

/** Danh sách icon có sẵn */
const availableIcons = [
  { value: "globe", label: "🌐 Web" },
  { value: "smartphone", label: "📱 Mobile" },
  { value: "cloud", label: "☁️ Cloud" },
  { value: "brain", label: "🧠 AI" },
  { value: "code", label: "💻 Code" },
  { value: "shield", label: "🛡️ Security" },
  { value: "chart", label: "📊 Analytics" },
  { value: "rocket", label: "🚀 Startup" },
  { value: "database", label: "🗄️ Database" },
  { value: "settings", label: "⚙️ Settings" },
];

export function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  // State form fields
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription ?? "");
  const [fullDescription, setFullDescription] = useState(initialData?.fullDescription ?? "");
  const [icon, setIcon] = useState(initialData?.icon ?? "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder ?? 0);
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
  const [seoTitle, setSeoTitle] = useState(initialData?.seoMeta?.metaTitle ?? "");
  const [seoDesc, setSeoDesc] = useState(initialData?.seoMeta?.metaDescription ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Tạo slug từ tên */
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("slug", slug);
    formData.set("shortDescription", shortDescription);
    formData.set("fullDescription", fullDescription);
    formData.set("icon", icon);
    formData.set("imageUrl", imageUrl);
    formData.set("sortOrder", String(sortOrder));
    formData.set("isPublished", String(isPublished));
    formData.set("seoMetaTitle", seoTitle);
    formData.set("seoMetaDescription", seoDesc);

    try {
      if (isEdit && initialData) {
        const { updateServiceAction } = await import("@/lib/actions/services");
        const result = await updateServiceAction(initialData.id, formData);
        if (!result.success) {
          setError(result.error || result.message);
          setLoading(false);
          return;
        }
      } else {
        const { createServiceAction } = await import("@/lib/actions/services");
        const result = await createServiceAction(formData);
        if (!result.success) {
          setError(result.error || result.message);
          setLoading(false);
          return;
        }
      }
      router.push("/services");
      router.refresh();
    } catch {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Thông tin cơ bản */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tên dịch vụ */}
          <div className="space-y-2">
            <Label htmlFor="name">Tên dịch vụ <span className="text-red-400">*</span></Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Phát triển Web" required />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug <span className="text-red-400">*</span></Label>
            <div className="flex gap-2">
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="phat-trien-web" required />
              <Button type="button" variant="outline" size="sm" className="cursor-pointer shrink-0" onClick={() => setSlug(generateSlug(name))}>
                Tạo từ tên
              </Button>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">URL-friendly, dùng cho đường dẫn: /services/{slug || "..."}</p>
          </div>

          {/* Icon */}
          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {availableIcons.map((ic) => (
                <button
                  key={ic.value}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all cursor-pointer ${
                    icon === ic.value
                      ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--foreground)]"
                      : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--foreground)]/30"
                  }`}
                  onClick={() => setIcon(icon === ic.value ? "" : ic.value)}
                >
                  {ic.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mô tả ngắn */}
          <div className="space-y-2">
            <Label htmlFor="shortDescription">Mô tả ngắn</Label>
            <Textarea
              id="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Mô tả hiển thị ở danh sách dịch vụ..."
              className="min-h-[80px]"
            />
          </div>

          {/* Mô tả chi tiết — Rich text editor */}
          <RichTextEditor
            value={fullDescription}
            onChange={setFullDescription}
            label="Mô tả chi tiết"
            placeholder="Nội dung chi tiết trang dịch vụ..."
            minHeight={250}
          />

          {/* Upload hình ảnh dịch vụ */}
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            folder="services"
            label="Hình ảnh dịch vụ"
            description="Ảnh minh họa dịch vụ — hiển thị trên trang chi tiết"
          />
        </CardContent>
      </Card>

      {/* Cài đặt */}
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt hiển thị</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Thứ tự hiển thị</Label>
            <Input id="sortOrder" type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} min={0} className="w-32" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Hiển thị công khai</Label>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Bật để hiển thị dịch vụ trên website</p>
            </div>
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">Meta Title</Label>
            <Input id="seoTitle" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Tiêu đề SEO..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDesc">Meta Description</Label>
            <Textarea id="seoDesc" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} placeholder="Mô tả SEO..." className="min-h-[80px]" />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <Button type="button" variant="ghost" className="cursor-pointer" onClick={() => router.push("/services")}>
          ← Quay lại
        </Button>
        <Button type="submit" disabled={loading || !name || !slug} className="cursor-pointer min-w-[120px]">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang lưu...
            </span>
          ) : isEdit ? "Cập nhật" : "Tạo dịch vụ"}
        </Button>
      </div>
    </form>
  );
}
