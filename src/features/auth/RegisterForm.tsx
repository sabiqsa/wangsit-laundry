"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { registerSchema, RegisterInput } from "@/schemas/auth.schema";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!result.success) {
        setError(result.error || "Registrasi gagal");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 1500);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    }
  };

  if (success) {
    return (
      <Alert severity="success">
        Registrasi berhasil! Mengalihkan ke halaman login...
      </Alert>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        {...register("name")}
        label="Nama Lengkap"
        fullWidth
        margin="normal"
        error={!!errors.name}
        helperText={errors.name?.message}
      />

      <TextField
        {...register("email")}
        label="Email"
        type="email"
        fullWidth
        margin="normal"
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        {...register("phone")}
        label="Nomor WhatsApp (opsional)"
        fullWidth
        margin="normal"
        error={!!errors.phone}
        helperText={errors.phone?.message}
        placeholder="contoh: 081234567890"
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        {...register("password")}
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <TextField
        {...register("confirmPassword")}
        label="Konfirmasi Password"
        type="password"
        fullWidth
        margin="normal"
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={isSubmitting}
        sx={{ mt: 2 }}
      >
        {isSubmitting ? <CircularProgress size={24} /> : "Daftar"}
      </Button>
    </Box>
  );
}
