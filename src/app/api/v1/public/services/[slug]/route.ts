import { NextResponse } from "next/server";
import { getServiceBySlug } from "@/lib/db/queries/services";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const data = await getServiceBySlug(slug);

    if (!data || !data.isPublished) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy giải pháp public" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[GET /api/v1/public/services/:slug] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Không thể lấy dữ liệu giải pháp public" },
      { status: 500 }
    );
  }
}
