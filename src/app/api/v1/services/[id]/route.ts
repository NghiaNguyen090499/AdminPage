/**
 * @nhom        : API
 * @chucnang    : RESTful API cho service cụ thể — GET/PUT/DELETE theo ID
 * @input       : Request + params.id
 * @output      : NextResponse — JSON response
 * @lienquan    : src/lib/db/queries/services.ts
 * @alias       : api-service-detail
 */
import { NextResponse } from "next/server";
import {
  getServiceById,
  updateService,
  deleteService,
} from "@/lib/db/queries/services";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/v1/services/:id
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await getServiceById(id);
    if (!data) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy dịch vụ" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[GET /api/v1/services/:id] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi server" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/services/:id
 */
export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const existing = await getServiceById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy dịch vụ" },
        { status: 404 }
      );
    }

    const data = await updateService(id, {
      name: body.name ?? existing.name,
      slug: body.slug ?? existing.slug,
      shortDescription: body.shortDescription !== undefined ? body.shortDescription : existing.shortDescription,
      fullDescription: body.fullDescription !== undefined ? body.fullDescription : existing.fullDescription,
      icon: body.icon !== undefined ? body.icon : existing.icon,
      imageUrl: body.imageUrl !== undefined ? body.imageUrl : existing.imageUrl,
      imageFit: body.imageFit ?? existing.imageFit,
      pillars: body.pillars !== undefined ? body.pillars : existing.pillars,
      sortOrder: body.sortOrder ?? existing.sortOrder,
      isPublished: body.isPublished ?? existing.isPublished,
      seoMeta: body.seoMeta !== undefined ? body.seoMeta : existing.seoMeta,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[PUT /api/v1/services/:id] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Không thể cập nhật dịch vụ" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/services/:id
 */
export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteService(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy dịch vụ" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      data: deleted,
      message: `Đã xóa dịch vụ "${deleted.name}"`,
    });
  } catch (error) {
    console.error("[DELETE /api/v1/services/:id] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Không thể xóa dịch vụ" },
      { status: 500 }
    );
  }
}
