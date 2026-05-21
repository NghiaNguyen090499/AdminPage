import { NextResponse } from "next/server";
import { getPublishedServices } from "@/lib/db/queries/services";

export async function GET() {
  try {
    const data = await getPublishedServices();
    return NextResponse.json({ success: true, data, total: data.length });
  } catch (error) {
    console.error("[GET /api/v1/public/services] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Không thể lấy dữ liệu giải pháp public" },
      { status: 500 }
    );
  }
}
