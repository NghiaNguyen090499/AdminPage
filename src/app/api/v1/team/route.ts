/**
 * @nhom        : API
 * @chucnang    : RESTful API cho team_members — GET (danh sách) + POST (tạo mới)
 * @input       : Request — HTTP request
 * @output      : NextResponse — JSON response
 * @lienquan    : src/lib/db/queries/team.ts
 * @alias       : api-team, team-endpoint
 */
import { NextResponse } from "next/server";
import {
  getAllTeamMembers,
  createTeamMember,
} from "@/lib/db/queries/team";

/**
 * GET /api/v1/team
 * Lấy tất cả thành viên đội ngũ — public API (cho frontend)
 */
export async function GET() {
  try {
    const data = await getAllTeamMembers();
    return NextResponse.json({
      success: true,
      data,
      total: data.length,
    });
  } catch (error) {
    console.error("[GET /api/v1/team] Lỗi:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể lấy dữ liệu team members",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/team
 * Tạo thành viên mới — yêu cầu xác thực (auth)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate dữ liệu bắt buộc
    if (!body.fullName || !body.position) {
      return NextResponse.json(
        {
          success: false,
          error: "Thiếu trường bắt buộc: fullName, position",
        },
        { status: 400 }
      );
    }

    const data = await createTeamMember({
      fullName: body.fullName,
      position: body.position,
      bio: body.bio || null,
      avatarUrl: body.avatarUrl || null,
      email: body.email || null,
      socialLinks: body.socialLinks || null,
      sortOrder: body.sortOrder || 0,
      isPublished: body.isPublished ?? true,
    });

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/v1/team] Lỗi:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể tạo thành viên",
      },
      { status: 500 }
    );
  }
}
