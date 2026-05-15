/**
 * @nhom        : API
 * @chucnang    : RESTful API cho product detail — GET/PUT/DELETE
 * @lienquan    : src/lib/db/queries/products.ts
 * @alias       : api-product-detail
 */
import { NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/lib/db/queries/products";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await getProductById(id);
    if (!data) return NextResponse.json({ success: false, error: "Không tìm thấy" }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[GET /api/v1/products/:id] Lỗi:", error);
    return NextResponse.json({ success: false, error: "Lỗi server" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const existing = await getProductById(id);
    if (!existing) return NextResponse.json({ success: false, error: "Không tìm thấy" }, { status: 404 });

    const data = await updateProduct(id, {
      name: body.name ?? existing.name,
      slug: body.slug ?? existing.slug,
      shortDescription: body.shortDescription !== undefined ? body.shortDescription : existing.shortDescription,
      fullDescription: body.fullDescription !== undefined ? body.fullDescription : existing.fullDescription,
      categoryId: body.categoryId !== undefined ? body.categoryId : existing.categoryId,
      thumbnailUrl: body.thumbnailUrl !== undefined ? body.thumbnailUrl : existing.thumbnailUrl,
      images: body.images !== undefined ? body.images : existing.images,
      sortOrder: body.sortOrder ?? existing.sortOrder,
      isPublished: body.isPublished ?? existing.isPublished,
      isFeatured: body.isFeatured ?? existing.isFeatured,
      seoMeta: body.seoMeta !== undefined ? body.seoMeta : existing.seoMeta,
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[PUT /api/v1/products/:id] Lỗi:", error);
    return NextResponse.json({ success: false, error: "Không thể cập nhật" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteProduct(id);
    if (!deleted) return NextResponse.json({ success: false, error: "Không tìm thấy" }, { status: 404 });
    return NextResponse.json({ success: true, data: deleted, message: `Đã xóa "${deleted.name}"` });
  } catch (error) {
    console.error("[DELETE /api/v1/products/:id] Lỗi:", error);
    return NextResponse.json({ success: false, error: "Không thể xóa" }, { status: 500 });
  }
}
