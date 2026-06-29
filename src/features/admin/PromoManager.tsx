"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IPromo } from "@/types/models";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const EMPTY_FORM = {
  code: "",
  name: "",
  discountType: "flat" as "flat" | "percent",
  discountValue: 0,
  minOrderAmount: 0,
  maxUsage: "",
  startDate: "",
  endDate: "",
  isActive: true,
};

export function PromoManager() {
  const { data, mutate } = useSWR<{ success: boolean; data: IPromo[] }>("/api/admin/promos", fetcher);
  const promos = data?.data ?? [];

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; severity: "success" | "error" } | null>(null);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, maxUsage: form.maxUsage ? Number(form.maxUsage) : undefined }),
      });
      const result = await res.json();
      if (result.success) {
        mutate();
        setOpen(false);
        setForm(EMPTY_FORM);
        setToast({ message: "Promo berhasil dibuat", severity: "success" });
      } else {
        setToast({ message: result.error, severity: "error" });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (promo: IPromo) => {
    await fetch(`/api/admin/promos/${promo._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !promo.isActive }),
    });
    mutate();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus promo ini?")) return;
    await fetch(`/api/admin/promos/${id}`, { method: "DELETE" });
    mutate();
    setToast({ message: "Promo dihapus", severity: "success" });
  };

  const isExpired = (endDate: string) => new Date(endDate) < new Date();

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Tambah Promo
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Kode</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Diskon</TableCell>
              <TableCell>Min. Order</TableCell>
              <TableCell>Periode</TableCell>
              <TableCell>Pemakaian</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="text.secondary" py={2}>Belum ada promo</Typography>
                </TableCell>
              </TableRow>
            ) : promos.map((promo) => (
              <TableRow key={promo._id} hover>
                <TableCell><Typography variant="body2" fontWeight="bold">{promo.code}</Typography></TableCell>
                <TableCell>{promo.name}</TableCell>
                <TableCell>
                  {promo.discountType === "percent"
                    ? `${promo.discountValue}%`
                    : `Rp ${promo.discountValue.toLocaleString("id-ID")}`}
                </TableCell>
                <TableCell>Rp {promo.minOrderAmount.toLocaleString("id-ID")}</TableCell>
                <TableCell>
                  <Typography variant="caption" display="block">
                    {new Date(promo.startDate).toLocaleDateString("id-ID")}
                  </Typography>
                  <Typography variant="caption" display="block">
                    s/d {new Date(promo.endDate).toLocaleDateString("id-ID")}
                  </Typography>
                </TableCell>
                <TableCell>
                  {promo.usageCount}{promo.maxUsage ? `/${promo.maxUsage}` : ""}
                </TableCell>
                <TableCell>
                  {isExpired(promo.endDate) ? (
                    <Chip label="Kadaluarsa" size="small" color="default" />
                  ) : (
                    <Switch
                      size="small"
                      checked={promo.isActive}
                      onChange={() => handleToggle(promo)}
                    />
                  )}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Hapus">
                    <IconButton size="small" color="error" onClick={() => handleDelete(promo._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tambah Promo Baru</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField label="Kode Promo" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required inputProps={{ style: { textTransform: "uppercase" } }} />
            <TextField label="Nama Promo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <FormControl fullWidth>
              <InputLabel>Tipe Diskon</InputLabel>
              <Select value={form.discountType} label="Tipe Diskon" onChange={(e) => setForm({ ...form, discountType: e.target.value as "flat" | "percent" })}>
                <MenuItem value="flat">Potongan Harga (Rp)</MenuItem>
                <MenuItem value="percent">Persentase (%)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={form.discountType === "percent" ? "Besar Diskon (%)" : "Potongan Harga (Rp)"}
              type="number"
              value={form.discountValue}
              onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
              required
            />
            <TextField label="Minimum Order (Rp)" type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })} />
            <TextField label="Maks. Pemakaian (kosongkan = unlimited)" type="number" value={form.maxUsage} onChange={(e) => setForm({ ...form, maxUsage: e.target.value })} />
            <TextField label="Tanggal Mulai" type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} InputLabelProps={{ shrink: true }} required />
            <TextField label="Tanggal Berakhir" type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} InputLabelProps={{ shrink: true }} required />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Batal</Button>
          <Button variant="contained" onClick={handleCreate} disabled={saving || !form.code || !form.name || !form.startDate || !form.endDate}>
            {saving ? <CircularProgress size={20} /> : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!toast} autoHideDuration={3000} onClose={() => setToast(null)}>
        {toast ? <Alert severity={toast.severity} onClose={() => setToast(null)}>{toast.message}</Alert> : undefined}
      </Snackbar>
    </>
  );
}
