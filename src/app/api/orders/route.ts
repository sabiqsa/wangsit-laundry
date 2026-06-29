import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getOrCreateSettings } from "@/models/Settings";
import { orderFormSchema } from "@/schemas/order.schema";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const parsed = orderFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { clientName, clientPhone, services, kg, paymentMethod, notes } = parsed.data;

    await connectDB();
    const settings = await getOrCreateSettings();

    // Calculate total price (use highest-priced service per kg if multiple)
    let pricePerKg = 0;
    if (services.includes("cuciSetrika")) {
      pricePerKg = settings.pricing.cuciSetrika;
    } else if (services.includes("cuciLipat") && services.includes("setrika")) {
      pricePerKg = settings.pricing.cuciSetrika;
    } else if (services.includes("cuciLipat")) {
      pricePerKg = settings.pricing.cuciLipat;
    } else if (services.includes("setrika")) {
      pricePerKg = settings.pricing.setrika;
    }

    const totalPrice = Math.round(pricePerKg * kg);

    // Determine estimated completion
    let estimatedCompletion = settings.estimatedTime.cuciLipat;
    if (services.includes("cuciSetrika") || (services.includes("cuciLipat") && services.includes("setrika"))) {
      estimatedCompletion = settings.estimatedTime.cuciSetrika;
    } else if (services.includes("setrika")) {
      estimatedCompletion = settings.estimatedTime.setrika;
    }

    const order = await Order.create({
      clientId: session?.user?.id,
      clientName,
      clientPhone,
      services,
      kg,
      totalPrice,
      paymentMethod,
      estimatedCompletion,
      notes,
      paymentStatus: paymentMethod === "bayar_nanti" ? "unpaid" : "pending",
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          orderId: order._id.toString(),
          orderNumber: order.orderNumber,
          totalPrice: order.totalPrice,
          estimatedCompletion: order.estimatedCompletion,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
