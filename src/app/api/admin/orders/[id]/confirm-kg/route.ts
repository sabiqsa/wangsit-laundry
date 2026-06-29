import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getOrCreateSettings } from "@/models/Settings";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Akses ditolak" }, { status: 403 });
    }

    const { id } = await params;
    const { actualKg, kgPhotoUrl } = await req.json();

    if (!actualKg || actualKg <= 0) {
      return NextResponse.json({ success: false, error: "Berat harus lebih dari 0" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findById(id);
    if (!order) return NextResponse.json({ success: false, error: "Order tidak ditemukan" }, { status: 404 });

    // Round up to nearest 0.5 kg
    const roundedKg = Math.ceil(actualKg * 2) / 2;

    // Recalculate price
    const settings = await getOrCreateSettings();
    const pricePerKg = order.services.reduce((sum: number, svc: string) => {
      return sum + (settings.pricing[svc as keyof typeof settings.pricing] ?? 0);
    }, 0);
    const newTotal = Math.round(roundedKg * pricePerKg);
    const discountAmount = order.discountAmount ?? 0;

    order.actualKg = roundedKg;
    order.kgConfirmed = true;
    if (kgPhotoUrl) order.kgPhotoUrl = kgPhotoUrl;
    order.totalPrice = Math.max(0, newTotal - discountAmount);

    await order.save();

    return NextResponse.json({ success: true, data: { actualKg: roundedKg, totalPrice: order.totalPrice } });
  } catch {
    return NextResponse.json({ success: false, error: "Terjadi kesalahan" }, { status: 500 });
  }
}
