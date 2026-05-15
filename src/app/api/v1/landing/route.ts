/**
 * @nhom        : API
 * @chucnang    : RESTful API cho landing pages — GET danh sách (published only)
 * @lienquan    : src/lib/db/queries/landing.ts
 * @alias       : api-landing-list
 */
import { NextResponse } from "next/server";
import { getAllLandingPages } from "@/lib/db/queries/landing";

/**
 * GET /api/v1/landing
 * Trả về danh sách landing pages đã published
 */
export async function GET() {
  try {
    const allPages = await getAllLandingPages();
    // Chỉ trả về các trang đã published cho API public
    const published = allPages.filter((p) => p.status === "published");

    return NextResponse.json({
      success: true,
      data: published.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        seoTitle: p.seoTitle,
        ogImage: p.ogImage,
        publishedAt: p.publishedAt,
      })),
      total: published.length,
    });
  } catch (error) {
    console.error("[GET /api/v1/landing] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Không thể lấy dữ liệu" },
      { status: 500 }
    );
  }
}
