"use client";
/**
 * @nhom        : Admin / Company
 * @chucnang    : Form component dùng chung cho tạo mới + chỉnh sửa company section
 * @input       : initialData? (CompanyInfo) — nếu có = mode sửa, không có = mode tạo
 * @lienquan    : src/lib/actions/company.ts
 * @alias       : company-form, company-editor
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CompanyInfo } from "@/types/database";

interface CompanyFormProps {
  initialData?: CompanyInfo;
}

export function CompanyForm({ initialData }: CompanyFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  // State cho form fields
  const [key, setKey] = useState(initialData?.key ?? "");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder ?? 0);
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
  const [seoTitle, setSeoTitle] = useState(initialData?.seoMeta?.metaTitle ?? "");
  const [seoDesc, setSeoDesc] = useState(initialData?.seoMeta?.metaDescription ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Tự động tạo key từ title (chuyển thành slug) */
  const generateKey = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  /** Xử lý submit form */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Tạo FormData
    const formData = new FormData();
    formData.set("key", key);
    formData.set("title", title);
    formData.set("content", content);
    formData.set("imageUrl", imageUrl);
    formData.set("sortOrder", String(sortOrder));
    formData.set("isPublished", String(isPublished));
    formData.set("seoMetaTitle", seoTitle);
    formData.set("seoMetaDescription", seoDesc);

    try {
      if (isEdit && initialData) {
        const { updateCompanyAction } = await import("@/lib/actions/company");
        const result = await updateCompanyAction(initialData.id, formData);
        if (!result.success) {
          setError(result.error || result.message);
          setLoading(false);
          return;
        }
      } else {
        const { createCompanyAction } = await import("@/lib/actions/company");
        const result = await createCompanyAction(formData);
        if (!result.success) {
          setError(result.error || result.message);
          setLoading(false);
          return;
        }
      }
      router.push("/company");
      router.refresh();
    } catch {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Thông báo lỗi */}
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
          {/* Key — chỉ cho phép sửa khi tạo mới */}
          <div className="space-y-2">
            <Label htmlFor="key">
              Key <span className="text-red-400">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="about, vision, mission..."
                required
                disabled={isEdit}
                className={isEdit ? "opacity-60" : ""}
              />
              {!isEdit && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer shrink-0"
                  onClick={() => setKey(generateKey(title))}
                >
                  Tạo từ tiêu đề
                </Button>
              )}
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              Định danh duy nhất, không thể thay đổi sau khi tạo
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Tiêu đề <span className="text-red-400">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Giới thiệu công ty"
              required
            />
          </div>

          {/* Content — Rich text editor */}
          <RichTextEditor
            value={content}
            onChange={setContent}
            label="Nội dung"
            placeholder="Nội dung chi tiết section..."
            minHeight={250}
          />

          {/* Image — Upload ảnh đại diện section */}
          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            folder="company"
            label="Ảnh đại diện section"
            description="Ảnh minh họa cho section này — hiển thị trên website"
            previewHeight={200}
          />
        </CardContent>
      </Card>

      {/* Cài đặt */}
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt hiển thị</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sort Order */}
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Thứ tự hiển thị</Label>
            <Input
              id="sortOrder"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              min={0}
              className="w-32"
            />
          </div>

          {/* Published toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Hiển thị công khai</Label>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Bật để hiển thị section trên website
              </p>
            </div>
            <Switch
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
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
            <Input
              id="seoTitle"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="Tiêu đề SEO..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDesc">Meta Description</Label>
            <Textarea
              id="seoDesc"
              value={seoDesc}
              onChange={(e) => setSeoDesc(e.target.value)}
              placeholder="Mô tả SEO..."
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <Button
          type="button"
          variant="ghost"
          className="cursor-pointer"
          onClick={() => router.push("/company")}
        >
          ← Quay lại
        </Button>
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={loading || !key || !title}
            className="cursor-pointer min-w-[120px]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Đang lưu...
              </span>
            ) : isEdit ? (
              "Cập nhật"
            ) : (
              "Tạo mới"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
