"use client";
/**
 * @nhom        : Admin / Products
 * @chucnang    : Form tạo/chỉnh sửa sản phẩm
 * @lienquan    : src/lib/actions/products.ts
 * @alias       : products-form
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import type { Product, ProductCategory } from "@/types/database";

interface ProductFormProps {
  initialData?: Product;
  categories: ProductCategory[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [shortDesc, setShortDesc] = useState(initialData?.shortDescription ?? "");
  const [fullDesc, setFullDesc] = useState(initialData?.fullDescription ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnailUrl ?? "");
  const [imageFit, setImageFit] = useState(initialData?.imageFit ?? "cover");
  const [benefits, setBenefits] = useState((initialData?.benefits ?? []).join("\n"));
  const [features, setFeatures] = useState((initialData?.features ?? []).join("\n"));
  const [specs, setSpecs] = useState(
    (initialData?.specs ?? [])
      .map((item) => `${item.label}: ${item.value}`)
      .join("\n")
  );
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder ?? 0);
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [seoTitle, setSeoTitle] = useState(initialData?.seoMeta?.metaTitle ?? "");
  const [seoDesc, setSeoDesc] = useState(initialData?.seoMeta?.metaDescription ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const genSlug = (t: string) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    const fd = new FormData();
    fd.set("name",name); fd.set("slug",slug); fd.set("shortDescription",shortDesc);
    fd.set("fullDescription",fullDesc); fd.set("categoryId",categoryId);
    fd.set("thumbnailUrl",thumbnailUrl); fd.set("sortOrder",String(sortOrder));
    fd.set("imageFit", imageFit); fd.set("benefits", benefits); fd.set("features", features); fd.set("specs", specs);
    fd.set("isPublished",String(isPublished)); fd.set("isFeatured",String(isFeatured));
    fd.set("seoMetaTitle",seoTitle); fd.set("seoMetaDescription",seoDesc);
    try {
      if (isEdit && initialData) {
        const { updateProductAction } = await import("@/lib/actions/products");
        const r = await updateProductAction(initialData.id, fd);
        if (!r.success) { setError(r.error||r.message); setLoading(false); return; }
      } else {
        const { createProductAction } = await import("@/lib/actions/products");
        const r = await createProductAction(fd);
        if (!r.success) { setError(r.error||r.message); setLoading(false); return; }
      }
      router.push("/products"); router.refresh();
    } catch { setError("Lỗi. Thử lại."); setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
      <Card>
        <CardHeader><CardTitle>Thông tin sản phẩm</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên sản phẩm <span className="text-red-400">*</span></Label>
            <Input id="name" value={name} onChange={e=>setName(e.target.value)} placeholder="AdminPanel Pro" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug <span className="text-red-400">*</span></Label>
            <div className="flex gap-2">
              <Input id="slug" value={slug} onChange={e=>setSlug(e.target.value)} placeholder="admin-panel-pro" required />
              <Button type="button" variant="outline" size="sm" className="cursor-pointer shrink-0" onClick={()=>setSlug(genSlug(name))}>Tạo từ tên</Button>
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">URL: /products/{slug||"..."}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoryId">Danh mục</Label>
            <select id="categoryId" value={categoryId} onChange={e=>setCategoryId(e.target.value)} className="w-full h-9 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]">
              <option value="">— Không thuộc danh mục —</option>
              {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortDesc">Mô tả ngắn</Label>
            <Textarea id="shortDesc" value={shortDesc} onChange={e=>setShortDesc(e.target.value)} placeholder="Mô tả ngắn..." className="min-h-[80px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullDesc">Mô tả chi tiết</Label>
            <Textarea id="fullDesc" value={fullDesc} onChange={e=>setFullDesc(e.target.value)} placeholder="Chi tiết sản phẩm..." className="min-h-[200px]" />
          </div>
          {/* Upload hình ảnh sản phẩm */}
          <ImageUpload
            value={thumbnailUrl}
            onChange={setThumbnailUrl}
            folder="products"
            label="Hình ảnh sản phẩm"
            description="Ảnh đại diện sản phẩm — hiển thị ở danh sách và trang chi tiết"
          />
          <div className="space-y-2">
            <Label htmlFor="imageFit">Kiểu hiển thị ảnh</Label>
            <select id="imageFit" value={imageFit} onChange={e=>setImageFit(e.target.value)} className="w-full h-9 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]">
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits / Lợi ích</Label>
            <Textarea id="benefits" value={benefits} onChange={e=>setBenefits(e.target.value)} placeholder="Mỗi dòng là một lợi ích..." className="min-h-[120px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="features">Features / Tính năng</Label>
            <Textarea id="features" value={features} onChange={e=>setFeatures(e.target.value)} placeholder="Mỗi dòng là một tính năng..." className="min-h-[120px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="specs">Specs / Thông số</Label>
            <Textarea id="specs" value={specs} onChange={e=>setSpecs(e.target.value)} placeholder="Mỗi dòng theo dạng Label: Value" className="min-h-[140px]" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Cài đặt hiển thị</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Thứ tự</Label>
            <Input id="sortOrder" type="number" value={sortOrder} onChange={e=>setSortOrder(parseInt(e.target.value)||0)} min={0} className="w-32" />
          </div>
          <div className="flex items-center justify-between">
            <div><Label>Hiển thị công khai</Label><p className="text-xs text-[var(--muted-foreground)] mt-0.5">Bật để hiển thị trên website</p></div>
            <Switch checked={isPublished} onCheckedChange={setIsPublished} />
          </div>
          <div className="flex items-center justify-between">
            <div><Label>Sản phẩm nổi bật</Label><p className="text-xs text-[var(--muted-foreground)] mt-0.5">Hiển thị ưu tiên trên trang chủ</p></div>
            <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>SEO Metadata</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">Meta Title</Label>
            <Input id="seoTitle" value={seoTitle} onChange={e=>setSeoTitle(e.target.value)} placeholder="Tiêu đề SEO..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDesc">Meta Description</Label>
            <Textarea id="seoDesc" value={seoDesc} onChange={e=>setSeoDesc(e.target.value)} placeholder="Mô tả SEO..." className="min-h-[80px]" />
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <Button type="button" variant="ghost" className="cursor-pointer" onClick={()=>router.push("/products")}>← Quay lại</Button>
        <Button type="submit" disabled={loading||!name||!slug} className="cursor-pointer min-w-[120px]">
          {loading?"Đang lưu...":isEdit?"Cập nhật":"Tạo sản phẩm"}
        </Button>
      </div>
    </form>
  );
}
