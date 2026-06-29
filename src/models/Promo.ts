import mongoose, { Schema, Document, Model } from "mongoose";

export type DiscountType = "flat" | "percent";

export interface IPromoDocument extends Document {
  code: string;
  name: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxUsage?: number;
  usageCount: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PromoSchema = new Schema<IPromoDocument>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    discountType: { type: String, enum: ["flat", "percent"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0 },
    maxUsage: { type: Number },
    usageCount: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PromoSchema.index({ code: 1 });
PromoSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

const Promo: Model<IPromoDocument> =
  mongoose.models.Promo || mongoose.model<IPromoDocument>("Promo", PromoSchema);

export default Promo;
