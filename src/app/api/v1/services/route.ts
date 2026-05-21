/**
 * @nhom        : API
 * @chucnang    : RESTful API cho services — GET (danh sách) + POST (tạo mới)
 * @input       : Request — HTTP request
 * @output      : NextResponse — JSON response
 * @lienquan    : src/lib/db/queries/services.ts
 * @alias       : api-services, services-endpoint
 */
import { NextResponse } from "next/server";
import { getAllServices, createService } from "@/lib/db/queries/services";

/**
 * GET /api/v1/services
 * Lấy tất cả dịch vụ — public API
 */
export async function GET() {
  try {
    const data = await getAllServices();
    return NextResponse.json({
      success: true,
      data,
      total: data.length,
    });
  } catch (error) {
    console.error("[GET /api/v1/services] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Không thể lấy dữ liệu dịch vụ" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/services
 * Tạo dịch vụ mới — yêu cầu xác thực
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.slug) {
      return NextResponse.json(
        { success: false, error: "Thiếu trường bắt buộc: name, slug" },
        { status: 400 }
      );
    }

    const data = await createService({
      name: body.name,
      slug: body.slug,
      shortDescription: body.shortDescription || null,
      fullDescription: body.fullDescription || null,
      icon: body.icon || null,
      imageUrl: body.imageUrl || null,
      imageFit: body.imageFit || "cover",
      pillars: body.pillars || [],
      sortOrder: body.sortOrder || 0,
      isPublished: body.isPublished ?? true,
      seoMeta: body.seoMeta || null,
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/v1/services] Lỗi:", error);
    const isUnique = error instanceof Error && error.message.includes("unique");
    return NextResponse.json(
      {
        success: false,
        error: isUnique ? "Slug đã tồn tại" : "Không thể tạo dịch vụ",
      },
      { status: isUnique ? 409 : 500 }
    );
  }
}
