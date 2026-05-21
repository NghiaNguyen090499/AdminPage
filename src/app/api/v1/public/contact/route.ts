import { NextResponse } from "next/server";
import { createContactSubmission } from "@/lib/db/queries/contact-submissions";

function isFilled(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: unknown) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeOptionalText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isFilled(body?.name) || !isValidEmail(body?.email) || !isFilled(body?.message)) {
      return NextResponse.json(
        {
          success: false,
          error: "Thiếu hoặc sai thông tin bắt buộc: name, email, message",
        },
        { status: 400 }
      );
    }

    const data = await createContactSubmission({
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: normalizeOptionalText(body.phone),
      company: normalizeOptionalText(body.company),
      message: body.message.trim(),
      source: normalizeOptionalText(body.source) ?? "website-contact",
      status: "new",
      metadata:
        body.metadata && typeof body.metadata === "object" ? body.metadata : null,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: data.id,
          createdAt: data.createdAt,
          status: data.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/v1/public/contact] Lỗi:", error);
    return NextResponse.json(
      { success: false, error: "Không thể lưu liên hệ" },
      { status: 500 }
    );
  }
}
