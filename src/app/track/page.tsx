"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { IOrder, ORDER_STATUS_LABELS, SERVICE_LABELS } from "@/types/models";

const STATUS_COLOR: Record<string, "warning" | "info" | "success" | "default"> = {
  Pending: "warning",
  Proses: "info",
  Selesai: "success",
  Lunas: "default",
};

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderNumber.trim())}`);
      const result = await res.json();

      if (result.success) {
        setOrder(result.data);
      } else {
        setError("Order tidak ditemukan. Periksa kembali nomor order Anda.");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box mb={3} textAlign="center">
        <TrackChangesIcon color="primary" sx={{ fontSize: 48 }} />
        <Typography variant="h5" sx={{ fontWeight: "bold" }} mt={1}>
          Lacak Order Laundry
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Masukkan nomor order untuk melihat status cucian Anda
        </Typography>
      </Box>

      <Box display="flex" gap={1} mb={3}>
        <TextField
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          label="Nomor Order"
          placeholder="contoh: WNG-20240101-0001"
          fullWidth
          onKeyDown={(e) => e.key === "Enter" && handleTrack()}
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleTrack}
          disabled={loading || !orderNumber.trim()}
          startIcon={loading ? <CircularProgress size={18} /> : <SearchIcon />}
          sx={{ minWidth: 120 }}
        >
          Lacak
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {order && (
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>{order.orderNumber}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(order.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </Typography>
              </Box>
              <Chip
                label={ORDER_STATUS_LABELS[order.orderStatus]}
                color={STATUS_COLOR[order.orderStatus]}
                sx={{ fontWeight: "bold" }}
              />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box display="flex" flexDirection="column" gap={1.5}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Nama</Typography>
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>{order.clientName}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Layanan</Typography>
                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                  {order.services.map((s) => SERVICE_LABELS[s]).join(", ")}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Berat</Typography>
                <Typography variant="body2">{order.kg} kg</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Total</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }} color="primary">
                  Rp {order.totalPrice.toLocaleString("id-ID")}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Estimasi Selesai</Typography>
                <Typography variant="body2">{order.estimatedCompletion}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
