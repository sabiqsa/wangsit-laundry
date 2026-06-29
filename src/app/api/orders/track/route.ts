import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    const orderNumber = req.nextUrl.searchParams.get("orderNumber");
    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: "Nomor order wajib diisi" },
        { status: 400 }
      );
    }

    await connectDB();
    const order = await Order.findOne({ orderNumber }).select(
      "orderNumber clientName orderStatus paymentStatus estimatedCompletion createdAt updatedAt services kg totalPrice paymentMethod"
    ).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Track order error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
