/**
 * @nhom        : API
 * @chucnang    : RESTful API cho products — GET + POST
 * @lienquan    : src/lib/db/queries/products.ts
 * @alias       : api-products
 */
import { NextResponse } from "next/server";
import { getAllProducts, createProduct } from "@/lib/db/queries/products";

export async function GET() {
  try {
    const data = await getAllProducts();
    return NextResponse.json({ success: true, data, total: data.length });
  } catch (error) {
    console.error("[GET /api/v1/products] Lỗi:", error);
    return NextResponse.json({ success: false, error: "Không thể lấy dữ liệu" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ success: false, error: "Thiếu: name, slug" }, { status: 400 });
    }
    const data = await createProduct({
      name: body.name, slug: body.slug,
      shortDescription: body.shortDescription || null,
      fullDescription: body.fullDescription || null,
      categoryId: body.categoryId || null,
      thumbnailUrl: body.thumbnailUrl || null,
      images: body.images || [],
      imageFit: body.imageFit || "cover",
      benefits: body.benefits || [],
      features: body.features || [],
      specs: body.specs || [],
      sortOrder: body.sortOrder || 0,
      isPublished: body.isPublished ?? true,
      isFeatured: body.isFeatured ?? false,
      seoMeta: body.seoMeta || null,
    });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/v1/products] Lỗi:", error);
    const isUnique = error instanceof Error && error.message.includes("unique");
    return NextResponse.json({ success: false, error: isUnique ? "Slug đã tồn tại" : "Không thể tạo" }, { status: isUnique ? 409 : 500 });
  }
}
