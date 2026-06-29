"use client";

import { useSearchParams } from "next/navigation";
import { Box, Button, Card, CardContent, Typography, Alert } from "@mui/material";
import NextLink from "next/link";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    OAuthAccountNotLinked: "Akun Google ini terkait dengan akun admin. Silakan login dengan email dan password.",
    Configuration: "Terjadi kesalahan konfigurasi autentikasi.",
    AccessDenied: "Akses ditolak.",
    Default: "Terjadi kesalahan saat login.",
  };

  const message = errorMessages[error || "Default"] || errorMessages.Default;

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={2}
    >
      <Card sx={{ maxWidth: 400, width: "100%" }}>
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" sx={{ fontWeight: "bold" }} mb={2}>
            Kesalahan Login
          </Typography>
          <Alert severity="error" sx={{ mb: 3 }}>
            {message}
          </Alert>
          <Button component={NextLink} href="/auth/login" variant="contained">
            Kembali ke Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={null}>
      <ErrorContent />
    </Suspense>
  );
}
