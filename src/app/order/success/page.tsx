"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";
import { ReceiptCard } from "@/features/receipt/ReceiptCard";
import { ReceiptActions } from "@/features/receipt/ReceiptActions";
import { IOrder } from "@/types/models";
import { Suspense } from "react";

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const receiptRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((result) => {
        if (result.success) setOrder(result.data);
        else setError("Order tidak ditemukan");
      })
      .catch(() => setError("Gagal memuat data order"))
      .finally(() => setLoading(false));
  }, [orderId, router]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Box py={4}>
        <Alert severity="error">{error || "Order tidak ditemukan"}</Alert>
        <Button onClick={() => router.push("/")} sx={{ mt: 2 }}>
          Kembali ke Beranda
        </Button>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
      <Box textAlign="center">
        <CheckCircleIcon color="success" sx={{ fontSize: 64 }} />
        <Typography variant="h5" sx={{ fontWeight: "bold" }} mt={1}>
          Order Berhasil!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No. Order: <strong>{order.orderNumber}</strong>
        </Typography>
      </Box>

      <ReceiptCard ref={receiptRef} order={order} />
      <ReceiptActions order={order} contentRef={receiptRef} />

      <Button
        variant="text"
        startIcon={<HomeIcon />}
        onClick={() => router.push("/")}
      >
        Kembali ke Beranda
      </Button>
    </Box>
  );
}

export default function OrderSuccessPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Suspense fallback={<CircularProgress />}>
        <OrderSuccessContent />
      </Suspense>
    </Container>
  );
}
