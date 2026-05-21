import { NextResponse } from "next/server";
import {
  getNewsArticleById,
  updateNewsArticle,
  deleteNewsArticle,
} from "@/lib/db/queries/news";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await getNewsArticleById(id);
    if (!data) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[GET /api/v1/news/:id] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi server" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const existing = await getNewsArticleById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy" },
        { status: 404 }
      );
    }

    const data = await updateNewsArticle(id, {
      title: body.title ?? existing.title,
      slug: body.slug ?? existing.slug,
      excerpt: body.excerpt !== undefined ? body.excerpt : existing.excerpt,
      content: body.content !== undefined ? body.content : existing.content,
      coverImageUrl:
        body.coverImageUrl !== undefined
          ? body.coverImageUrl
          : existing.coverImageUrl,
      imageFit: body.imageFit ?? existing.imageFit,
      publishedAt:
        body.publishedAt !== undefined
          ? body.publishedAt
            ? new Date(body.publishedAt)
            : null
          : existing.publishedAt,
      sortOrder: body.sortOrder ?? existing.sortOrder,
      isPublished: body.isPublished ?? existing.isPublished,
      seoMeta: body.seoMeta !== undefined ? body.seoMeta : existing.seoMeta,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[PUT /api/v1/news/:id] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Không thể cập nhật" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteNewsArticle(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    console.error("[DELETE /api/v1/news/:id] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Không thể xóa" },
      { status: 500 }
    );
  }
}
