import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Akses ditolak" },
        { status: 403 }
      );
    }

    const period = req.nextUrl.searchParams.get("period") || "daily";
    const now = new Date();

    let startDate: Date;
    let dateFormat: string;

    if (period === "daily") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
      dateFormat = "%Y-%m-%d";
    } else if (period === "weekly") {
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
      dateFormat = "%Y-W%V";
    } else {
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
      dateFormat = "%Y-%m";
    }

    await connectDB();

    const results = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          $or: [{ paymentStatus: "paid" }, { orderStatus: "Lunas" }],
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: "$createdAt", timezone: "Asia/Jakarta" } },
          total: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const summaryResults = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $cond: [
                { $or: [{ $eq: ["$paymentStatus", "paid"] }, { $eq: ["$orderStatus", "Lunas"] }] },
                "$totalPrice",
                0,
              ],
            },
          },
          totalOrders: { $sum: 1 },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ["$orderStatus", "Pending"] }, 1, 0] },
          },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        chart: results,
        summary: summaryResults[0] || { totalRevenue: 0, totalOrders: 0, pendingOrders: 0 },
      },
    });
  } catch (error) {
    console.error("Reports error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
