"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useAdminOrders } from "@/hooks/useOrders";
import { OrderTableSkeleton } from "@/components/skeletons/OrderTableSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { IOrder, ORDER_STATUS_LABELS, SERVICE_LABELS } from "@/types/models";
import { StatusUpdateDialog } from "./StatusUpdateDialog";

const STATUS_COLOR: Record<string, "warning" | "info" | "success" | "default"> = {
  Pending: "warning",
  Proses: "info",
  Selesai: "success",
  Lunas: "default",
};

export function OrderTable() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [toast, setToast] = useState<{ message: string; severity: "success" | "error" } | null>(null);
  const [pendingWhatsApp, setPendingWhatsApp] = useState<string | null>(null);

  const { orders, totalPages, isLoading, mutate } = useAdminOrders(page, statusFilter || undefined);

  const handleStatusUpdated = (waUrl?: string) => {
    mutate();
    setSelectedOrder(null);
    setToast({ message: "Status order berhasil diperbarui", severity: "success" });
    if (waUrl) setPendingWhatsApp(waUrl);
  };

  return (
    <>
      <Box display="flex" gap={2} mb={2} flexWrap="wrap" alignItems="center">
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Filter Status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter Status"
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <MenuItem value="">Semua</MenuItem>
            {["Pending", "Proses", "Selesai", "Lunas"].map((s) => (
              <MenuItem key={s} value={s}>{ORDER_STATUS_LABELS[s as keyof typeof ORDER_STATUS_LABELS]}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body2" color="text.secondary">
          Klik ikon edit untuk mengubah status order
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>No. Order</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Layanan</TableCell>
              <TableCell align="right">Berat</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tgl Order</TableCell>
              <TableCell align="center">Aksi</TableCell>
            </TableRow>
          </TableHead>

          {isLoading ? (
            <OrderTableSkeleton />
          ) : (
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <EmptyState title="Tidak ada order" description="Belum ada order masuk" />
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order._id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }} noWrap>
                        {order.orderNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.clientName}</TableCell>
                    <TableCell>
                      {order.services.map((s) => SERVICE_LABELS[s]).join(", ")}
                    </TableCell>
                    <TableCell align="right">{order.kg} kg</TableCell>
                    <TableCell align="right">
                      Rp {order.totalPrice.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ORDER_STATUS_LABELS[order.orderStatus]}
                        color={STATUS_COLOR[order.orderStatus]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ubah Status">
                        <IconButton
                          size="small"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {order.clientPhone && (
                        <Tooltip title="Kirim WhatsApp">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => {
                              window.open(
                                `https://wa.me/${order.clientPhone?.replace(/\D/g, "")}`,
                                "_blank"
                              );
                            }}
                          >
                            <WhatsAppIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, p) => setPage(p)}
            color="primary"
          />
        </Box>
      )}

      {selectedOrder && (
        <StatusUpdateDialog
          order={selectedOrder}
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onSuccess={handleStatusUpdated}
        />
      )}

      {pendingWhatsApp && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          message="Order selesai! Kirim notifikasi ke customer?"
          action={
            <Box display="flex" gap={1}>
              <Button
                size="small"
                color="inherit"
                startIcon={<WhatsAppIcon />}
                onClick={() => { window.open(pendingWhatsApp, "_blank"); setPendingWhatsApp(null); }}
              >
                Kirim
              </Button>
              <Button size="small" color="inherit" onClick={() => setPendingWhatsApp(null)}>
                Lewati
              </Button>
            </Box>
          }
        />
      )}

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
      >
        {toast ? (
          <Alert severity={toast.severity} onClose={() => setToast(null)}>
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  );
}
