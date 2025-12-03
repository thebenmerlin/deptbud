import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadReceipt } from "@/lib/upload";
import { Logger } from "@/lib/logger";
import { APP_CONFIG } from "@/constants/config";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    if (file.size > APP_CONFIG.MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds ${APP_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB limit`,
        },
        { status: 400 }
      );
    }

    // Validate file type
    const fileExtension = `.${file.name.split(".").pop()}`.toLowerCase();
    if (!APP_CONFIG.ALLOWED_FILE_TYPES.includes(fileExtension)) {
      return NextResponse.json(
        {
          error: `Allowed file types: ${APP_CONFIG.ALLOWED_FILE_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const result = await uploadReceipt(
      Buffer.from(buffer),
      file.name,
      `receipts/${session.user.id}`
    );

    return NextResponse.json(result);
  } catch (error) {
    Logger.error("POST /api/upload error", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
