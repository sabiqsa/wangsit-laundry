import { z } from "zod";

export const settingsSchema = z.object({
  pricing: z.object({
    cuciLipat: z.number().min(0, "Harga tidak boleh negatif"),
    setrika: z.number().min(0, "Harga tidak boleh negatif"),
    cuciSetrika: z.number().min(0, "Harga tidak boleh negatif"),
  }),
  estimatedTime: z.object({
    cuciLipat: z.string().min(1, "Estimasi waktu wajib diisi"),
    setrika: z.string().min(1, "Estimasi waktu wajib diisi"),
    cuciSetrika: z.string().min(1, "Estimasi waktu wajib diisi"),
  }),
  adminPhone: z.string().min(10, "Nomor WhatsApp tidak valid"),
  storeName: z.string().min(1, "Nama toko wajib diisi"),
  storeHours: z.object({
    open: z.string().min(1, "Jam buka wajib diisi"),
    close: z.string().min(1, "Jam tutup wajib diisi"),
  }),
  deliveryFee: z.number().min(0, "Ongkir tidak boleh negatif"),
  deliveryEnabled: z.boolean(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
