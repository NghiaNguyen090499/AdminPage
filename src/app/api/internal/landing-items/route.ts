/**
 * @nhom        : API / Internal
 * @chucnang    : API nội bộ — lấy items của section (dùng bởi admin UI)
 * @lienquan    : src/lib/db/queries/landing.ts
 * @alias       : api-internal-landing-items
 */
import { NextResponse } from "next/server";
import { getItemsBySectionId } from "@/lib/db/queries/landing";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get("sectionId");

    if (!sectionId) {
      return NextResponse.json({ error: "Thiếu sectionId" }, { status: 400 });
    }

    const items = await getItemsBySectionId(sectionId);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("[GET /api/internal/landing-items] Lỗi:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
