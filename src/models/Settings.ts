import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPricing {
  cuciLipat: number;
  setrika: number;
  cuciSetrika: number;
}

export interface IEstimatedTime {
  cuciLipat: string;
  setrika: string;
  cuciSetrika: string;
}

export interface ISettingsDocument extends Document {
  pricing: IPricing;
  estimatedTime: IEstimatedTime;
  adminPhone: string;
  storeName: string;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettingsDocument>(
  {
    pricing: {
      cuciLipat: { type: Number, required: true, default: 7000 },
      setrika: { type: Number, required: true, default: 5000 },
      cuciSetrika: { type: Number, required: true, default: 10000 },
    },
    estimatedTime: {
      cuciLipat: { type: String, required: true, default: "2-3 hari" },
      setrika: { type: String, required: true, default: "1 hari" },
      cuciSetrika: { type: String, required: true, default: "3-4 hari" },
    },
    adminPhone: { type: String, default: process.env.ADMIN_PHONE || "6281234567890" },
    storeName: { type: String, default: "Wangsit Laundry" },
  },
  { timestamps: true }
);

const Settings: Model<ISettingsDocument> =
  mongoose.models.Settings ||
  mongoose.model<ISettingsDocument>("Settings", SettingsSchema);

export default Settings;

export async function getOrCreateSettings(): Promise<ISettingsDocument> {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
}
