import { IOrder } from "@/types/models";

type OrderLike = Omit<IOrder, "createdAt" | "updatedAt"> & {
  createdAt: Date | string;
  updatedAt?: Date | string;
};

export function buildOrderReceiptMessage(order: OrderLike): string {
  const serviceLabels: Record<string, string> = {
    cuciLipat: "Cuci Lipat",
    setrika: "Setrika",
    cuciSetrika: "Cuci + Setrika",
  };

  const servicesText = order.services
    .map((s) => serviceLabels[s] || s)
    .join(", ");

  return `*STRUK LAUNDRY WANGSIT*
━━━━━━━━━━━━━━━━━━━━
No. Order: ${order.orderNumber}
Tanggal: ${new Date(order.createdAt).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })}
━━━━━━━━━━━━━━━━━━━━
Nama: ${order.clientName}
Layanan: ${servicesText}
Berat: ${order.kg} kg
Total: Rp ${order.totalPrice.toLocaleString("id-ID")}
Pembayaran: ${order.paymentMethod === "bayar_nanti" ? "Bayar Nanti" : "Sudah Dibayar"}
Estimasi Selesai: ${order.estimatedCompletion}
━━━━━━━━━━━━━━━━━━━━
Terima kasih telah menggunakan layanan Wangsit Laundry! 🧺`;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const normalizedPhone = phone.replace(/\D/g, "");
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}

export function buildStatusNotificationMessage(order: OrderLike): string {
  return `Halo *${order.clientName}*! 👋

Pesanan laundry Anda dengan No. Order *${order.orderNumber}* telah *SELESAI* dikerjakan.

Silakan ambil cucian Anda di toko kami.

Terima kasih telah menggunakan layanan *Wangsit Laundry*! 🧺`;
}
