import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Promo from "@/models/Promo";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    const { id } = await params;
    const body = await req.json();
    await connectDB();
    const promo = await Promo.findByIdAndUpdate(id, body, { new: true });
    if (!promo) return NextResponse.json({ success: false, error: "Promo tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ success: true, data: promo });
  } catch {
    return NextResponse.json({ success: false, error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }
    const { id } = await params;
    await connectDB();
    await Promo.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Terjadi kesalahan" }, { status: 500 });
  }
}
