import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Promo from "@/models/Promo";

export async function POST(req: NextRequest) {
  try {
    const { code, orderAmount } = await req.json();
    if (!code) return NextResponse.json({ success: false, error: "Kode promo wajib diisi" }, { status: 400 });

    await connectDB();
    const now = new Date();
    const promo = await Promo.findOne({
      code: code.toUpperCase(),
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    if (!promo) return NextResponse.json({ success: false, error: "Kode promo tidak valid atau sudah kadaluarsa" }, { status: 404 });
    if (promo.maxUsage && promo.usageCount >= promo.maxUsage) {
      return NextResponse.json({ success: false, error: "Kuota promo sudah habis" }, { status: 400 });
    }
    if (orderAmount < promo.minOrderAmount) {
      return NextResponse.json({
        success: false,
        error: `Minimum order Rp ${promo.minOrderAmount.toLocaleString("id-ID")} untuk promo ini`,
      }, { status: 400 });
    }

    const discount = promo.discountType === "percent"
      ? Math.floor((orderAmount * promo.discountValue) / 100)
      : promo.discountValue;

    return NextResponse.json({
      success: true,
      data: {
        code: promo.code,
        name: promo.name,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        discount,
      },
    });
  } catch {
    return NextResponse.json({ success: false, error: "Terjadi kesalahan" }, { status: 500 });
  }
}
