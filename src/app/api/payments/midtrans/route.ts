import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { createMidtransTransaction } from "@/lib/midtrans";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID wajib diisi" },
        { status: 400 }
      );
    }

    await connectDB();
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order tidak ditemukan" },
        { status: 404 }
      );
    }

    const midtransOrderId = `${order.orderNumber}-${Date.now()}`;
    const { token, redirectUrl } = await createMidtransTransaction({
      orderId: midtransOrderId,
      amount: order.totalPrice,
      customerName: order.clientName,
      customerPhone: order.clientPhone,
    });

    order.midtransOrderId = midtransOrderId;
    order.midtransToken = token;
    await order.save();

    return NextResponse.json({ success: true, data: { token, redirectUrl } });
  } catch (error) {
    console.error("Midtrans payment error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan pembayaran" },
      { status: 500 }
    );
  }
}
