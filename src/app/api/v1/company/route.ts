/**
 * @nhom        : API
 * @chucnang    : RESTful API cho company_info — GET (danh sách) + POST (tạo mới)
 * @input       : Request — HTTP request
 * @output      : NextResponse — JSON response
 * @lienquan    : src/lib/db/queries/company.ts
 * @alias       : api-company, company-endpoint
 */
import { NextResponse } from "next/server";
import {
  getAllCompanyInfo,
  createCompanyInfo,
} from "@/lib/db/queries/company";

/**
 * GET /api/v1/company
 * Lấy tất cả company sections — public API (cho frontend)
 */
export async function GET() {
  try {
    const data = await getAllCompanyInfo();
    return NextResponse.json({
      success: true,
      data,
      total: data.length,
    });
  } catch (error) {
    console.error("[GET /api/v1/company] Lỗi:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể lấy dữ liệu company",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/company
 * Tạo company section mới — yêu cầu xác thực (auth)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate dữ liệu
    if (!body.key || !body.title) {
      return NextResponse.json(
        {
          success: false,
          error: "Thiếu trường bắt buộc: key, title",
        },
        { status: 400 }
      );
    }

    const data = await createCompanyInfo({
      key: body.key,
      title: body.title,
      content: body.content || null,
      imageUrl: body.imageUrl || null,
      sortOrder: body.sortOrder || 0,
      isPublished: body.isPublished ?? true,
      seoMeta: body.seoMeta || null,
    });

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/v1/company] Lỗi:", error);

    // Kiểm tra lỗi unique constraint (key trùng)
    const message =
      error instanceof Error && error.message.includes("unique")
        ? "Key đã tồn tại — vui lòng chọn key khác"
        : "Không thể tạo company section";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: error instanceof Error && error.message.includes("unique") ? 409 : 500 }
    );
  }
}
