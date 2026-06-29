import jsPDF from "jspdf";
import { IOrder } from "@/types/models";

export function generateReceiptPDF(order: IOrder): void {
  const doc = new jsPDF({ unit: "mm", format: "a6" });

  const serviceLabels: Record<string, string> = {
    cuciLipat: "Cuci Lipat",
    setrika: "Setrika",
    cuciSetrika: "Cuci + Setrika",
  };

  const servicesText = order.services
    .map((s) => serviceLabels[s] || s)
    .join(", ");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("WANGSIT LAUNDRY", 74, 15, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Struk Pembayaran", 74, 21, { align: "center" });

  doc.setLineWidth(0.5);
  doc.line(10, 25, 138, 25);

  doc.setFontSize(9);
  let y = 32;
  const lineH = 6;

  const addRow = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 10, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, 80, y);
    y += lineH;
  };

  addRow("No. Order:", order.orderNumber);
  addRow(
    "Tanggal:",
    new Date(order.createdAt).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  );
  addRow("Nama:", order.clientName);
  addRow("Layanan:", servicesText);
  addRow("Berat:", `${order.kg} kg`);

  doc.line(10, y, 138, y);
  y += lineH;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL:", 10, y);
  doc.text(`Rp ${order.totalPrice.toLocaleString("id-ID")}`, 80, y);
  y += lineH;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  addRow(
    "Pembayaran:",
    order.paymentMethod === "bayar_nanti" ? "Bayar Nanti" : "Sudah Dibayar"
  );
  addRow("Estimasi Selesai:", order.estimatedCompletion);

  doc.line(10, y, 138, y);
  y += lineH;

  doc.setFont("helvetica", "italic");
  doc.text("Terima kasih telah menggunakan layanan kami!", 74, y, {
    align: "center",
  });

  doc.save(`struk-${order.orderNumber}.pdf`);
}
