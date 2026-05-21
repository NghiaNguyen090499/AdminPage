import { NextResponse } from "next/server";
import { getPublishedNewsArticles } from "@/lib/db/queries/news";

export async function GET() {
  try {
    const data = await getPublishedNewsArticles();
    return NextResponse.json({ success: true, data, total: data.length });
  } catch (error) {
    console.error("[GET /api/v1/public/news] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Không thể lấy dữ liệu tin tức public" },
      { status: 500 }
    );
  }
}
