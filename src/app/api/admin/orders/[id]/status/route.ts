import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { buildStatusNotificationMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { getOrCreateSettings } from "@/models/Settings";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Akses ditolak" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { orderStatus, paymentStatus } = await req.json();

    const validOrderStatuses = ["Pending", "Proses", "Selesai", "Lunas", "Dibatalkan"];
    if (orderStatus && !validOrderStatuses.includes(orderStatus)) {
      return NextResponse.json(
        { success: false, error: "Status tidak valid" },
        { status: 400 }
      );
    }

    await connectDB();
    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order tidak ditemukan" },
        { status: 404 }
      );
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    } else if (orderStatus === "Lunas") {
      order.paymentStatus = "paid";
    }
    await order.save();

    const orderObj = order.toObject();
    const serialized = { ...orderObj, _id: orderObj._id.toString() };

    let whatsappUrl: string | undefined;
    if (orderStatus === "Selesai" && order.clientPhone) {
      await getOrCreateSettings();
      const message = buildStatusNotificationMessage(serialized);
      whatsappUrl = buildWhatsAppUrl(order.clientPhone, message);
    }

    return NextResponse.json({
      success: true,
      data: serialized,
      whatsappUrl,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
