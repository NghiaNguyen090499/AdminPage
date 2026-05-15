/**
 * @nhom        : API
 * @chucnang    : RESTful API cho team member cụ thể — GET/PUT/DELETE theo ID
 * @input       : Request + params.id — HTTP request + UUID thành viên
 * @output      : NextResponse — JSON response
 * @lienquan    : src/lib/db/queries/team.ts
 * @alias       : api-team-detail, team-detail-endpoint
 */
import { NextResponse } from "next/server";
import {
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
} from "@/lib/db/queries/team";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/v1/team/:id
 * Lấy thông tin 1 thành viên theo ID
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await getTeamMemberById(id);

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy thành viên" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[GET /api/v1/team/:id] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi server" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/v1/team/:id
 * Cập nhật thông tin thành viên
 */
export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // Kiểm tra thành viên tồn tại
    const existing = await getTeamMemberById(id);
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy thành viên" },
        { status: 404 }
      );
    }

    const data = await updateTeamMember(id, {
      fullName: body.fullName ?? existing.fullName,
      position: body.position ?? existing.position,
      bio: body.bio !== undefined ? body.bio : existing.bio,
      avatarUrl: body.avatarUrl !== undefined ? body.avatarUrl : existing.avatarUrl,
      email: body.email !== undefined ? body.email : existing.email,
      socialLinks: body.socialLinks !== undefined ? body.socialLinks : existing.socialLinks,
      sortOrder: body.sortOrder ?? existing.sortOrder,
      isPublished: body.isPublished ?? existing.isPublished,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[PUT /api/v1/team/:id] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Không thể cập nhật thành viên" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/team/:id
 * Xóa thành viên
 */
export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteTeamMember(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy thành viên" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: deleted,
      message: `Đã xóa thành viên "${deleted.fullName}"`,
    });
  } catch (error) {
    console.error("[DELETE /api/v1/team/:id] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Không thể xóa thành viên" },
      { status: 500 }
    );
  }
}
