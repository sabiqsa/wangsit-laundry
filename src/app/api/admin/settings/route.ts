import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Settings, { getOrCreateSettings } from "@/models/Settings";
import { settingsSchema } from "@/schemas/settings.schema";

export async function GET() {
  try {
    await connectDB();
    const settings = await getOrCreateSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Akses ditolak" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(parsed.data);
    } else {
      Object.assign(settings, parsed.data);
      await settings.save();
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
