"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { IOrder } from "@/types/models";

interface ConfirmKgDialogProps {
  order: IOrder;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ConfirmKgDialog({ order, open, onClose, onSuccess }: ConfirmKgDialogProps) {
  const [kg, setKg] = useState("");
  const [photoBase64, setPhotoBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roundedKg = kg ? Math.ceil(parseFloat(kg) * 2) / 2 : null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoBase64(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleConfirm = async () => {
    if (!kg || parseFloat(kg) <= 0) {
      setError("Masukkan berat yang valid");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/orders/${order._id}/confirm-kg`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actualKg: parseFloat(kg), kgPhotoUrl: photoBase64 || undefined }),
      });
      const result = await res.json();
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error);
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Konfirmasi Berat Cucian</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Order: <strong>{order.orderNumber}</strong> — {order.clientName}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          label="Berat Aktual (kg)"
          type="number"
          fullWidth
          value={kg}
          onChange={(e) => setKg(e.target.value)}
          InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
          inputProps={{ step: "0.1", min: "0.1" }}
          autoFocus
        />

        {roundedKg && (
          <Box mt={1} p={1.5} bgcolor="warning.light" borderRadius={1}>
            <Typography variant="body2">
              Dibulatkan ke atas: <strong>{roundedKg} kg</strong>
              {" ("}kelipatan 0.5 kg{")"}
            </Typography>
          </Box>
        )}

        <Box mt={2}>
          <Typography variant="body2" color="text.secondary" mb={1}>Foto Timbangan (opsional)</Typography>
          <input type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} />
          {photoBase64 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoBase64} alt="foto kg" style={{ width: "100%", marginTop: 8, borderRadius: 4 }} />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Batal</Button>
        <Button variant="contained" onClick={handleConfirm} disabled={loading || !kg}>
          {loading ? <CircularProgress size={20} /> : "Konfirmasi"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
