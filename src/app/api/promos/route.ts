import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Promo from "@/models/Promo";

export async function GET() {
  try {
    await connectDB();
    const now = new Date();
    const promos = await Promo.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: promos });
  } catch {
    return NextResponse.json({ success: false, error: "Terjadi kesalahan" }, { status: 500 });
  }
}
