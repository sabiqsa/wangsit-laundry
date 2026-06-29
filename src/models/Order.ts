import mongoose, { Schema, Document, Model } from "mongoose";

export type OrderService = "cuciLipat" | "setrika" | "cuciSetrika";
export type OrderStatus = "Pending" | "Proses" | "Selesai" | "Lunas";
export type PaymentStatus = "unpaid" | "paid" | "pending";
export type PaymentMethod = "bayar_sekarang" | "bayar_nanti";

export interface IOrderDocument extends Document {
  orderNumber: string;
  clientId?: string;
  clientName: string;
  clientPhone?: string;
  services: OrderService[];
  kg: number;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  midtransOrderId?: string;
  midtransToken?: string;
  estimatedCompletion: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, unique: true },
    clientId: { type: String },
    clientName: { type: String, required: true, trim: true },
    clientPhone: { type: String },
    services: {
      type: [String],
      enum: ["cuciLipat", "setrika", "cuciSetrika"],
      required: true,
    },
    kg: { type: Number, required: true, min: 0.5 },
    totalPrice: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "pending"],
      default: "unpaid",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Proses", "Selesai", "Lunas"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["bayar_sekarang", "bayar_nanti"],
      required: true,
    },
    midtransOrderId: { type: String },
    midtransToken: { type: String },
    estimatedCompletion: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

// Auto-generate orderNumber before save
OrderSchema.pre("save", async function () {
  if (!this.orderNumber) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    const count = await (this.constructor as Model<IOrderDocument>).countDocuments({
      createdAt: { $gte: dayStart, $lt: dayEnd },
    });
    this.orderNumber = `WNG-${dateStr}-${String(count + 1).padStart(4, "0")}`;
  }
});

OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ clientId: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ orderStatus: 1 });

const Order: Model<IOrderDocument> =
  mongoose.models.Order || mongoose.model<IOrderDocument>("Order", OrderSchema);

export default Order;
