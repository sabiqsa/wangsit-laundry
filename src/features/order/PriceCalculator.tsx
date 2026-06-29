"use client";

import { Box, Paper, Typography, Divider } from "@mui/material";
import { ISettings, OrderService, SERVICE_LABELS } from "@/types/models";

interface PriceCalculatorProps {
  settings: ISettings | null;
  services: OrderService[];
  kg: number;
  deliveryFee?: number;
  discount?: number;
}

function calculatePrice(settings: ISettings, services: OrderService[], kg: number): number {
  if (!settings || !services.length || !kg) return 0;

  let pricePerKg = 0;
  if (services.includes("cuciSetrika")) {
    pricePerKg = settings.pricing.cuciSetrika;
  } else if (services.includes("cuciLipat") && services.includes("setrika")) {
    pricePerKg = settings.pricing.cuciSetrika;
  } else if (services.includes("cuciLipat")) {
    pricePerKg = settings.pricing.cuciLipat;
  } else if (services.includes("setrika")) {
    pricePerKg = settings.pricing.setrika;
  }

  return Math.round(pricePerKg * kg);
}

export function PriceCalculator({ settings, services, kg, deliveryFee = 0, discount = 0 }: PriceCalculatorProps) {
  if (!settings || !services.length || !kg) return null;

  const base = calculatePrice(settings, services, kg);
  const total = Math.max(0, base + deliveryFee - discount);
  const serviceNames = services.map((s) => SERVICE_LABELS[s]).join(", ");

  return (
    <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: "primary.main", color: "white" }}>
      <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>Estimasi Biaya</Typography>
      <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.3)" }} />

      <Box display="flex" justifyContent="space-between" mb={0.5}>
        <Typography variant="body2" sx={{ opacity: 0.85 }}>{serviceNames} × {kg} kg</Typography>
        <Typography variant="body2">Rp {base.toLocaleString("id-ID")}</Typography>
      </Box>

      {deliveryFee > 0 && (
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>Ongkir jemput & antar</Typography>
          <Typography variant="body2">+Rp {deliveryFee.toLocaleString("id-ID")}</Typography>
        </Box>
      )}

      {discount > 0 && (
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>Diskon promo</Typography>
          <Typography variant="body2">-Rp {discount.toLocaleString("id-ID")}</Typography>
        </Box>
      )}

      <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.3)" }} />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" sx={{ opacity: 0.85 }}>Total</Typography>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Rp {total.toLocaleString("id-ID")}
        </Typography>
      </Box>
    </Paper>
  );
}

export { calculatePrice };
