"use client";

import { useState } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { IOrder, ORDER_STATUS_LABELS, OrderStatus } from "@/types/models";

interface StatusUpdateDialogProps {
  order: IOrder;
  open: boolean;
  onClose: () => void;
  onSuccess: (whatsappUrl?: string) => void;
}

const ORDER_STATUSES: OrderStatus[] = ["Pending", "Proses", "Selesai", "Lunas"];

export function StatusUpdateDialog({
  order,
  open,
  onClose,
  onSuccess,
}: StatusUpdateDialogProps) {
  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order.orderStatus);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${order._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus }),
      });
      const result = await res.json();
      if (result.success) {
        onSuccess(result.whatsappUrl);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Ubah Status Order</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Order: <strong>{order.orderNumber}</strong> — {order.clientName}
        </Typography>

        <FormControl fullWidth>
          <InputLabel>Status Order</InputLabel>
          <Select
            value={orderStatus}
            label="Status Order"
            onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
          >
            {ORDER_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {ORDER_STATUS_LABELS[s]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {orderStatus === "Selesai" && order.clientPhone && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
            Notifikasi WhatsApp akan dikirim ke {order.clientPhone}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Batal
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdate}
          disabled={loading || orderStatus === order.orderStatus}
        >
          {loading ? <CircularProgress size={20} /> : "Simpan"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
