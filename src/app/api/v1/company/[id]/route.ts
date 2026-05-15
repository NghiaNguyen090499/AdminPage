/**
 * @nhom        : API
 * @chucnang    : RESTful API cho company_info — GET/PUT/DELETE 1 item theo ID
 * @input       : Request + params.id — HTTP request + UUID
 * @output      : NextResponse — JSON response
 * @lienquan    : src/lib/db/queries/company.ts
 * @alias       : api-company-detail, company-item-endpoint
 */
import { NextResponse } from "next/server";
import {
  getCompanyInfoById,
  updateCompanyInfo,
  deleteCompanyInfo,
} from "@/lib/db/queries/company";

/** Kiểu params cho dynamic route */
type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/v1/company/:id
 * Lấy chi tiết 1 section
 */
export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const data = await getCompanyInfoById(id);

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy section" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[GET /api/v1/company/:id] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi server" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/company/:id
 * Cập nhật 1 section
 */
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.title) {
      return NextResponse.json(
        { success: false, error: "Thiếu trường bắt buộc: title" },
        { status: 400 }
      );
    }

    const data = await updateCompanyInfo(id, {
      title: body.title,
      content: body.content ?? undefined,
      imageUrl: body.imageUrl ?? undefined,
      sortOrder: body.sortOrder ?? undefined,
      isPublished: body.isPublished ?? undefined,
      seoMeta: body.seoMeta ?? undefined,
    });

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy section" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[PUT /api/v1/company/:id] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Không thể cập nhật" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/company/:id
 * Xóa 1 section
 */
export async function DELETE(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const data = await deleteCompanyInfo(id);

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy section" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Đã xóa section "${data.title}"`,
    });
  } catch (error) {
    console.error("[DELETE /api/v1/company/:id] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Không thể xóa" },
      { status: 500 }
    );
  }
}
