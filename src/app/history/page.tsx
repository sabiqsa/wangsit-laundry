"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Pagination,
  Typography,
} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useOrderHistory } from "@/hooks/useOrders";
import { EmptyState } from "@/components/ui/EmptyState";
import { IOrder, ORDER_STATUS_LABELS, SERVICE_LABELS } from "@/types/models";

const STATUS_COLOR: Record<string, "warning" | "info" | "success" | "default"> = {
  Pending: "warning",
  Proses: "info",
  Selesai: "success",
  Lunas: "default",
};

function OrderHistoryCard({ order }: { order: IOrder }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>{order.orderNumber}</Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(order.createdAt).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Typography>
            <Typography variant="body2" mt={0.5}>
              {order.services.map((s) => SERVICE_LABELS[s]).join(", ")} — {order.kg} kg
            </Typography>
          </Box>
          <Box textAlign="right">
            <Chip
              label={ORDER_STATUS_LABELS[order.orderStatus]}
              color={STATUS_COLOR[order.orderStatus]}
              size="small"
              sx={{ mb: 1 }}
            />
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: "bold" }} display="block">
              Rp {order.totalPrice.toLocaleString("id-ID")}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { orders, totalPages, isLoading } = useOrderHistory(page);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  if (status === "loading" || isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <HistoryIcon color="primary" />
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Riwayat Order
        </Typography>
      </Box>

      {!session?.user && null}

      {orders.length === 0 ? (
        <EmptyState
          title="Belum ada order"
          description="Anda belum memiliki riwayat order laundry"
        />
      ) : (
        <>
          {orders.map((order) => (
            <OrderHistoryCard key={order._id} order={order} />
          ))}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, p) => setPage(p)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
