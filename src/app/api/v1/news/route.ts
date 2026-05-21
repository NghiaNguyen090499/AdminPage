import { NextResponse } from "next/server";
import {
  getAllNewsArticles,
  createNewsArticle,
} from "@/lib/db/queries/news";

export async function GET() {
  try {
    const data = await getAllNewsArticles();
    return NextResponse.json({ success: true, data, total: data.length });
  } catch (error) {
    console.error("[GET /api/v1/news] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Không thể lấy dữ liệu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.slug) {
      return NextResponse.json(
        { success: false, error: "Thiếu: title, slug" },
        { status: 400 }
      );
    }

    const data = await createNewsArticle({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt || null,
      content: body.content || null,
      coverImageUrl: body.coverImageUrl || null,
      imageFit: body.imageFit || "cover",
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
      sortOrder: body.sortOrder || 0,
      isPublished: body.isPublished ?? true,
      seoMeta: body.seoMeta || null,
    });

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/v1/news] Lỗi:", error);
    const isUnique = error instanceof Error && error.message.includes("unique");
    return NextResponse.json(
      { success: false, error: isUnique ? "Slug đã tồn tại" : "Không thể tạo" },
      { status: isUnique ? 409 : 500 }
    );
  }
}
