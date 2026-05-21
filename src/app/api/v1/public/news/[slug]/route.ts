import { NextResponse } from "next/server";
import { getNewsArticleBySlug } from "@/lib/db/queries/news";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const data = await getNewsArticleBySlug(slug);

    if (!data || !data.isPublished) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy tin tức public" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[GET /api/v1/public/news/:slug] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Không thể lấy dữ liệu tin tức public" },
      { status: 500 }
    );
  }
}
