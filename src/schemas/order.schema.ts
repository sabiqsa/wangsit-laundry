import { z } from "zod";

export const orderFormSchema = z.object({
  clientName: z.string().min(2, "Nama minimal 2 karakter").max(100),
  clientPhone: z.string().optional(),
  services: z
    .array(z.enum(["cuciLipat", "setrika", "cuciSetrika"]))
    .min(1, "Pilih minimal 1 layanan"),
  kg: z.number().min(0.5, "Berat minimal 0.5 kg").max(100, "Berat maksimal 100 kg"),
  paymentMethod: z.enum(["bayar_sekarang", "bayar_nanti"]),
  deliveryType: z.enum(["jemput_antar", "ambil_sendiri"]).optional(),
  deliveryAddress: z.string().max(500).optional(),
  promoCode: z.string().max(50).optional(),
  discountAmount: z.number().min(0).optional(),
  notes: z.string().max(500).optional(),
}).refine(
  (data) => data.deliveryType !== "jemput_antar" || !!data.deliveryAddress?.trim(),
  { message: "Alamat wajib diisi untuk layanan jemput & antar", path: ["deliveryAddress"] }
);

export const orderTrackingSchema = z.object({
  orderNumber: z.string().min(1, "Nomor order wajib diisi"),
});

export type OrderFormInput = z.infer<typeof orderFormSchema>;
export type OrderTrackingInput = z.infer<typeof orderTrackingSchema>;
