"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { settingsSchema, SettingsInput } from "@/schemas/settings.schema";
import { useSettings } from "@/hooks/useSettings";

export function SettingsForm() {
  const { settings, mutate } = useSettings();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
  });

  useEffect(() => {
    if (settings) {
      reset({
        pricing: settings.pricing,
        estimatedTime: settings.estimatedTime,
        adminPhone: settings.adminPhone,
        storeName: settings.storeName,
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: SettingsInput) => {
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        setSuccess(true);
        mutate();
      } else {
        setError(result.error || "Gagal menyimpan pengaturan");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h6" mb={2}>Informasi Toko</Typography>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register("storeName")}
            label="Nama Toko"
            fullWidth
            error={!!errors.storeName}
            helperText={errors.storeName?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            {...register("adminPhone")}
            label="Nomor WhatsApp Admin"
            fullWidth
            error={!!errors.adminPhone}
            helperText={errors.adminPhone?.message || "Format: 628xxxxxxxxxx"}
          />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" mb={2}>Harga Layanan (per kg)</Typography>
      <Grid container spacing={2} mb={3}>
        {[
          { key: "pricing.cuciLipat" as const, label: "Cuci Lipat" },
          { key: "pricing.setrika" as const, label: "Setrika" },
          { key: "pricing.cuciSetrika" as const, label: "Cuci + Setrika" },
        ].map((item) => (
          <Grid item xs={12} sm={4} key={item.key}>
            <TextField
              {...register(item.key, { valueAsNumber: true })}
              label={item.label}
              type="number"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
              }}
              error={!!errors.pricing?.[item.key.split(".")[1] as "cuciLipat" | "setrika" | "cuciSetrika"]}
              helperText={(errors.pricing?.[item.key.split(".")[1] as "cuciLipat" | "setrika" | "cuciSetrika"] as { message?: string })?.message}
            />
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mb: 3 }} />

      <Typography variant="h6" mb={2}>Estimasi Waktu Pengerjaan</Typography>
      <Grid container spacing={2} mb={3}>
        {[
          { key: "estimatedTime.cuciLipat" as const, label: "Cuci Lipat" },
          { key: "estimatedTime.setrika" as const, label: "Setrika" },
          { key: "estimatedTime.cuciSetrika" as const, label: "Cuci + Setrika" },
        ].map((item) => (
          <Grid item xs={12} sm={4} key={item.key}>
            <TextField
              {...register(item.key)}
              label={item.label}
              fullWidth
              placeholder="contoh: 2-3 hari"
              error={!!errors.estimatedTime?.[item.key.split(".")[1] as "cuciLipat" | "setrika" | "cuciSetrika"]}
              helperText={(errors.estimatedTime?.[item.key.split(".")[1] as "cuciLipat" | "setrika" | "cuciSetrika"] as { message?: string })?.message}
            />
          </Grid>
        ))}
      </Grid>

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isSubmitting}
      >
        {isSubmitting ? <CircularProgress size={24} /> : "Simpan Pengaturan"}
      </Button>

      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success">Pengaturan berhasil disimpan</Alert>
      </Snackbar>

      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Box>
  );
}
