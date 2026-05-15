/**
 * @nhom        : API
 * @chucnang    : RESTful API lấy landing page đầy đủ theo slug — kèm sections + items
 * @lienquan    : src/lib/db/queries/landing.ts
 * @alias       : api-landing-detail
 */
import { NextResponse } from "next/server";
import { getFullLandingPageBySlug } from "@/lib/db/queries/landing";

/**
 * GET /api/v1/landing/[slug]
 * Trả về landing page đầy đủ (sections + items) cho frontend render
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const page = await getFullLandingPageBySlug(slug);

    if (!page) {
      return NextResponse.json(
        { success: false, error: "Không tìm thấy landing page" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: page.id,
        slug: page.slug,
        title: page.title,
        description: page.description,
        seo: {
          title: page.seoTitle,
          description: page.seoDescription,
          ogImage: page.ogImage,
        },
        publishedAt: page.publishedAt,
        sections: page.sections.map((section) => ({
          id: section.id,
          type: section.sectionType,
          title: section.title,
          subtitle: section.subtitle,
          description: section.description,
          background: {
            type: section.backgroundType,
            value: section.backgroundValue,
          },
          config: section.config,
          items: section.items.map((item) => ({
            id: item.id,
            type: item.itemType,
            title: item.title,
            description: item.description,
            icon: item.icon,
            imageUrl: item.imageUrl,
            linkUrl: item.linkUrl,
            linkText: item.linkText,
            metadata: item.metadata,
          })),
        })),
      },
    });
  } catch (error) {
    console.error("[GET /api/v1/landing/:slug] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Lỗi server" },
      { status: 500 }
    );
  }
}
