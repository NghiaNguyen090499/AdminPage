import { NextResponse } from "next/server";
import { getPublishedProductsWithCategory } from "@/lib/db/queries/products";

export async function GET() {
  try {
    const data = await getPublishedProductsWithCategory();
    return NextResponse.json({ success: true, data, total: data.length });
  } catch (error) {
    console.error("[GET /api/v1/public/products] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Không thể lấy dữ liệu sản phẩm public" },
      { status: 500 }
    );
  }
}
