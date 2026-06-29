"use client";

import { useRef } from "react";
import { Box, Button, Stack } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useReactToPrint } from "react-to-print";
import { IOrder } from "@/types/models";
import { buildOrderReceiptMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { generateReceiptPDF } from "@/lib/pdf";

interface ReceiptActionsProps {
  order: IOrder;
  contentRef: React.RefObject<HTMLDivElement>;
  adminPhone?: string;
}

export function ReceiptActions({ order, contentRef, adminPhone }: ReceiptActionsProps) {
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Struk-${order.orderNumber}`,
  });

  const handleDownloadPDF = async () => {
    if (contentRef.current) {
      await generateReceiptPDF(contentRef.current, order.orderNumber);
    }
  };

  const handleWhatsApp = () => {
    const phone = adminPhone || process.env.NEXT_PUBLIC_ADMIN_PHONE || "6281234567890";
    const message = buildOrderReceiptMessage(order);
    const url = buildWhatsAppUrl(phone, message);
    window.open(url, "_blank");
  };

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} mt={2}>
      <Button
        variant="outlined"
        startIcon={<PrintIcon />}
        onClick={() => handlePrint()}
        fullWidth
      >
        Cetak Struk
      </Button>

      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={handleDownloadPDF}
        fullWidth
      >
        Unduh PDF
      </Button>

      <Button
        variant="contained"
        color="success"
        startIcon={<WhatsAppIcon />}
        onClick={handleWhatsApp}
        fullWidth
      >
        Kirim via WhatsApp
      </Button>
    </Stack>
  );
}
