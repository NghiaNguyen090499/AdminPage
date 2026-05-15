"use client";
/**
 * @nhom        : Admin / Products / Categories
 * @chucnang    : Form tạo/sửa danh mục sản phẩm
 * @alias       : category-form
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductCategory } from "@/types/database";

interface CategoryFormProps { initialData?: ProductCategory; }

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const genSlug = (t: string) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null);
    const fd = new FormData();
    fd.set("name",name); fd.set("slug",slug); fd.set("description",description); fd.set("sortOrder",String(sortOrder));
    try {
      if (isEdit && initialData) {
        const { updateCategoryAction } = await import("@/lib/actions/products");
        const r = await updateCategoryAction(initialData.id, fd);
        if (!r.success) { setError(r.error||r.message); setLoading(false); return; }
      } else {
        const { createCategoryAction } = await import("@/lib/actions/products");
        const r = await createCategoryAction(fd);
        if (!r.success) { setError(r.error||r.message); setLoading(false); return; }
      }
      router.push("/products/categories"); router.refresh();
    } catch { setError("Lỗi. Thử lại."); setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
      <Card>
        <CardHeader><CardTitle>Thông tin danh mục</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên danh mục <span className="text-red-400">*</span></Label>
            <Input id="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Phần mềm" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug <span className="text-red-400">*</span></Label>
            <div className="flex gap-2">
              <Input id="slug" value={slug} onChange={e=>setSlug(e.target.value)} placeholder="phan-mem" required />
              <Button type="button" variant="outline" size="sm" className="cursor-pointer shrink-0" onClick={()=>setSlug(genSlug(name))}>Tạo từ tên</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Mô tả</Label>
            <Textarea id="desc" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Mô tả danh mục..." className="min-h-[100px]" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Thứ tự</Label>
            <Input id="sortOrder" type="number" value={sortOrder} onChange={e=>setSortOrder(parseInt(e.target.value)||0)} min={0} className="w-32" />
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
        <Button type="button" variant="ghost" className="cursor-pointer" onClick={()=>router.push("/products/categories")}>← Quay lại</Button>
        <Button type="submit" disabled={loading||!name||!slug} className="cursor-pointer min-w-[120px]">
          {loading?"Đang lưu...":isEdit?"Cập nhật":"Tạo danh mục"}
        </Button>
      </div>
    </form>
  );
}
