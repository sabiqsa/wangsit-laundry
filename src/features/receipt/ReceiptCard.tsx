"use client";

import { forwardRef, useEffect, useState } from "react";
import {
  Box,
  Divider,
  Paper,
  Typography,
  Chip,
} from "@mui/material";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import { QRCodeSVG } from "qrcode.react";
import { IOrder, SERVICE_LABELS, ORDER_STATUS_LABELS } from "@/types/models";

interface ReceiptCardProps {
  order: IOrder;
}

export const ReceiptCard = forwardRef<HTMLDivElement, ReceiptCardProps>(
  ({ order }, ref) => {
    const [trackUrl, setTrackUrl] = useState("");

    useEffect(() => {
      const base = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      setTrackUrl(`${base}/track?orderNumber=${order.orderNumber}`);
    }, [order.orderNumber]);

    const statusColor: Record<string, "warning" | "info" | "success" | "default"> = {
      Pending: "warning",
      Proses: "info",
      Selesai: "success",
      Lunas: "default",
    };

    return (
      <Paper
        ref={ref}
        elevation={0}
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "divider",
          maxWidth: 400,
          width: "100%",
          "@media print": {
            boxShadow: "none",
            border: "none",
          },
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <LocalLaundryServiceIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold" }} mt={1}>
            WANGSIT LAUNDRY
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Struk Pembayaran
          </Typography>
        </Box>

        <Divider />

        <Box mt={2} display="flex" flexDirection="column" gap={1}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">No. Order</Typography>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>{order.orderNumber}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Tanggal</Typography>
            <Typography variant="body2">
              {new Date(order.createdAt).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Nama</Typography>
            <Typography variant="body2">{order.clientName}</Typography>
          </Box>

          {order.clientPhone && (
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">No. HP</Typography>
              <Typography variant="body2">{order.clientPhone}</Typography>
            </Box>
          )}

          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Layanan</Typography>
            <Typography variant="body2" textAlign="right">
              {order.services.map((s) => SERVICE_LABELS[s]).join(", ")}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Berat</Typography>
            <Typography variant="body2">{order.kg} kg</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Estimasi Selesai</Typography>
            <Typography variant="body2">{order.estimatedCompletion}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">Status</Typography>
            <Chip
              label={ORDER_STATUS_LABELS[order.orderStatus]}
              color={statusColor[order.orderStatus]}
              size="small"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>TOTAL</Typography>
          <Typography variant="h6" sx={{ fontWeight: "bold" }} color="primary">
            Rp {order.totalPrice.toLocaleString("id-ID")}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mt={1}>
          <Typography variant="body2" color="text.secondary">Pembayaran</Typography>
          <Typography variant="body2">
            {order.paymentMethod === "bayar_nanti" ? "Bayar Nanti" : "Sudah Dibayar"}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
          Terima kasih telah menggunakan layanan Wangsit Laundry! 🧺
        </Typography>

        {trackUrl && (
          <Box display="flex" flexDirection="column" alignItems="center" mt={2} gap={0.5}>
            <QRCodeSVG value={trackUrl} size={100} level="M" />
            <Typography variant="caption" color="text.secondary" textAlign="center">
              Scan untuk lacak status order
            </Typography>
          </Box>
        )}
      </Paper>
    );
  }
);

ReceiptCard.displayName = "ReceiptCard";
