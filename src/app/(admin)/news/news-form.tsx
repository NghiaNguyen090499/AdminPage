"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { NewsArticle } from "@/types/database";

interface NewsFormProps {
  initialData?: NewsArticle;
}

export function NewsForm({ initialData }: NewsFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialData?.coverImageUrl ?? ""
  );
  const [imageFit, setImageFit] = useState(initialData?.imageFit ?? "cover");
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt
      ? new Date(initialData.publishedAt).toISOString().slice(0, 16)
      : ""
  );
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder ?? 0);
  const [isPublished, setIsPublished] = useState(
    initialData?.isPublished ?? true
  );
  const [seoTitle, setSeoTitle] = useState(
    initialData?.seoMeta?.metaTitle ?? ""
  );
  const [seoDesc, setSeoDesc] = useState(
    initialData?.seoMeta?.metaDescription ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("slug", slug);
    formData.set("excerpt", excerpt);
    formData.set("content", content);
    formData.set("coverImageUrl", coverImageUrl);
    formData.set("imageFit", imageFit);
    formData.set("publishedAt", publishedAt);
    formData.set("sortOrder", String(sortOrder));
    formData.set("isPublished", String(isPublished));
    formData.set("seoMetaTitle", seoTitle);
    formData.set("seoMetaDescription", seoDesc);

    try {
      if (isEdit && initialData) {
        const { updateNewsArticleAction } = await import("@/lib/actions/news");
        const result = await updateNewsArticleAction(initialData.id, formData);
        if (!result.success) {
          setError(result.error || result.message);
          setLoading(false);
          return;
        }
      } else {
        const { createNewsArticleAction } = await import("@/lib/actions/news");
        const result = await createNewsArticleAction(formData);
        if (!result.success) {
          setError(result.error || result.message);
          setLoading(false);
          return;
        }
      }
      router.push("/news");
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

      <Card>
        <CardHeader>
          <CardTitle>Thông tin bài viết</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề <span className="text-red-400">*</span></Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug <span className="text-red-400">*</span></Label>
            <div className="flex gap-2">
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
              <Button type="button" variant="outline" size="sm" className="cursor-pointer shrink-0" onClick={() => setSlug(generateSlug(title))}>
                Tạo từ tiêu đề
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="min-h-[90px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[220px]" />
          </div>
          <ImageUpload
            value={coverImageUrl}
            onChange={setCoverImageUrl}
            folder="news"
            label="Ảnh cover"
            description="Ảnh hiển thị tại listing và trang chi tiết"
          />
          <div className="space-y-2">
            <Label htmlFor="imageFit">Kiểu hiển thị ảnh</Label>
            <select id="imageFit" value={imageFit} onChange={(e) => setImageFit(e.target.value)} className="w-full h-9 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]">
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cài đặt xuất bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="publishedAt">Ngày xuất bản</Label>
            <Input id="publishedAt" type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Thứ tự hiển thị</Label>
            <Input id="sortOrder" type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)} className="w-32" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Hiển thị công khai</Label>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Bật để hiển thị bài viết trên website</p>
            </div>
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">Meta Title</Label>
            <Input id="seoTitle" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDesc">Meta Description</Label>
            <Textarea id="seoDesc" value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} className="min-h-[90px]" />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <Button type="button" variant="ghost" className="cursor-pointer" onClick={() => router.push("/news")}>
          ← Quay lại
        </Button>
        <Button type="submit" disabled={loading || !title || !slug} className="cursor-pointer min-w-[120px]">
          {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo bài viết"}
        </Button>
      </div>
    </form>
  );
}
