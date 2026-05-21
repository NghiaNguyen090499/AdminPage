import { NextResponse } from "next/server";
import { getPublishedProductBySlugWithCategory } from "@/lib/db/queries/products";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const data = await getPublishedProductBySlugWithCategory(slug);

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy sản phẩm public" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[GET /api/v1/public/products/:slug] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Không thể lấy dữ liệu sản phẩm public" },
      { status: 500 }
    );
  }
}
