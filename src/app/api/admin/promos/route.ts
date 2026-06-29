import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Promo from "@/models/Promo";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    await connectDB();
    const promos = await Promo.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: promos });
  } catch {
    return NextResponse.json({ success: false, error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    const body = await req.json();
    await connectDB();
    const promo = await Promo.create(body);
    return NextResponse.json({ success: true, data: promo }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error && error.message.includes("duplicate") ? "Kode promo sudah digunakan" : "Terjadi kesalahan";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
