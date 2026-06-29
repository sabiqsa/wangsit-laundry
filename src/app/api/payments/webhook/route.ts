import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { verifyMidtransSignature } from "@/lib/midtrans";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body;

    const isValid = verifyMidtransSignature(
      order_id,
      status_code,
      gross_amount,
      signature_key
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    await connectDB();
    const order = await Order.findOne({ midtransOrderId: order_id });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (
      (transaction_status === "capture" && fraud_status === "accept") ||
      transaction_status === "settlement"
    ) {
      order.paymentStatus = "paid";
      if (order.orderStatus === "Pending") order.orderStatus = "Proses";
    } else if (["cancel", "deny", "expire"].includes(transaction_status)) {
      order.paymentStatus = "unpaid";
    } else if (transaction_status === "pending") {
      order.paymentStatus = "pending";
    }

    await order.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
