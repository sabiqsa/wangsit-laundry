"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  Slider,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StoreIcon from "@mui/icons-material/Store";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSession } from "next-auth/react";
import { orderFormSchema, OrderFormInput } from "@/schemas/order.schema";
import { useSettings } from "@/hooks/useSettings";
import { PriceCalculator } from "./PriceCalculator";
import { OrderService } from "@/types/models";

const SERVICES: { value: OrderService; label: string; description: string }[] = [
  { value: "cuciLipat", label: "Cuci Lipat", description: "Cuci + lipat rapi" },
  { value: "setrika", label: "Setrika", description: "Setrika saja" },
  { value: "cuciSetrika", label: "Cuci + Setrika", description: "Cuci, setrika, dan lipat" },
];

export function OrderForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const { settings } = useSettings();
  const [error, setError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoResult, setPromoResult] = useState<{ code: string; name: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<OrderFormInput>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      clientName: session?.user?.name || "",
      clientPhone: session?.user?.phone || "",
      services: [],
      kg: 1,
      paymentMethod: "bayar_nanti",
      deliveryType: "ambil_sendiri",
    },
  });

  useEffect(() => {
    if (session?.user?.name && !watch("clientName")) {
      setValue("clientName", session.user.name);
    }
    if (session?.user?.phone && !watch("clientPhone")) {
      setValue("clientPhone", session.user.phone);
    }
  }, [session, setValue, watch]);

  const selectedServices = watch("services");
  const kg = watch("kg");
  const deliveryType = watch("deliveryType");
  const promoCode = watch("promoCode");

  const basePrice = settings
    ? selectedServices.reduce((sum, s) => sum + (settings.pricing[s as OrderService] ?? 0), 0) * kg
    : 0;
  const deliveryFee = deliveryType === "jemput_antar" && settings ? (settings.deliveryFee ?? 0) : 0;
  const discount = promoResult?.discount ?? 0;

  const handleValidatePromo = async () => {
    if (!promoCode) return;
    setPromoLoading(true);
    setPromoError("");
    setPromoResult(null);
    try {
      const res = await fetch("/api/promos/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, orderAmount: basePrice + deliveryFee }),
      });
      const result = await res.json();
      if (result.success) {
        setPromoResult(result.data);
      } else {
        setPromoError(result.error);
      }
    } catch {
      setPromoError("Gagal memvalidasi promo");
    } finally {
      setPromoLoading(false);
    }
  };

  const onSubmit = async (data: OrderFormInput) => {
    setError("");
    try {
      const payload = {
        ...data,
        promoCode: promoResult?.code,
        discountAmount: discount,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!result.success) {
        setError(result.error || "Gagal membuat order");
        return;
      }

      const { orderId } = result.data;

      if (data.paymentMethod === "bayar_sekarang") {
        const payRes = await fetch("/api/payments/midtrans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        const payResult = await payRes.json();

        if (payResult.success && typeof window !== "undefined" && (window as unknown as { snap?: { pay: (token: string, callbacks: unknown) => void } }).snap) {
          const snap = (window as unknown as { snap: { pay: (token: string, callbacks: unknown) => void } }).snap;
          snap.pay(payResult.data.token, {
            onSuccess: () => router.push(`/order/success?id=${orderId}`),
            onPending: () => router.push(`/order/success?id=${orderId}`),
            onError: () => setError("Pembayaran gagal. Silakan coba lagi."),
            onClose: () => router.push(`/order/success?id=${orderId}`),
          });
          return;
        }
      }

      router.push(`/order/success?id=${orderId}`);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    }
  };

  return (
    <>
      <script
        src="https://app.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        async
      />

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          {...register("clientName")}
          label="Nama Lengkap"
          fullWidth
          margin="normal"
          error={!!errors.clientName}
          helperText={errors.clientName?.message}
          required
        />

        <TextField
          {...register("clientPhone")}
          label="Nomor WhatsApp"
          fullWidth
          margin="normal"
          error={!!errors.clientPhone}
          helperText={errors.clientPhone?.message || "Untuk notifikasi via WhatsApp"}
          placeholder="contoh: 081234567890"
          InputLabelProps={{ shrink: true }}
        />

        <FormControl component="fieldset" error={!!errors.services} sx={{ mt: 2, width: "100%" }}>
          <FormLabel component="legend">Layanan *</FormLabel>
          <Controller
            name="services"
            control={control}
            render={({ field }) => (
              <FormGroup>
                {SERVICES.map((service) => {
                  const isChecked = field.value.includes(service.value);
                  const isDisabled =
                    (service.value !== "cuciSetrika" && field.value.includes("cuciSetrika")) ||
                    (service.value === "cuciSetrika" && field.value.some((s: string) => s !== "cuciSetrika"));
                  return (
                    <FormControlLabel
                      key={service.value}
                      control={
                        <Checkbox
                          checked={isChecked}
                          disabled={isDisabled}
                          onChange={(e) => {
                            if (e.target.checked) field.onChange([...field.value, service.value]);
                            else field.onChange(field.value.filter((v: string) => v !== service.value));
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body1">{service.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {service.description}
                            {settings && ` — Rp ${settings.pricing[service.value].toLocaleString("id-ID")}/kg`}
                          </Typography>
                        </Box>
                      }
                    />
                  );
                })}
              </FormGroup>
            )}
          />
          {errors.services && <FormHelperText>{errors.services.message}</FormHelperText>}
        </FormControl>

        <Box sx={{ mt: 3, px: 1 }}>
          <FormLabel>Berat Cucian: {kg} kg</FormLabel>
          <Controller
            name="kg"
            control={control}
            render={({ field }) => (
              <Slider
                {...field}
                min={0.5}
                max={20}
                step={0.5}
                marks={[
                  { value: 1, label: "1 kg" },
                  { value: 5, label: "5 kg" },
                  { value: 10, label: "10 kg" },
                  { value: 20, label: "20 kg" },
                ]}
                valueLabelDisplay="auto"
                valueLabelFormat={(v) => `${v} kg`}
              />
            )}
          />
          <TextField
            label="Atau masukkan berat manual (kg)"
            type="number"
            size="small"
            value={kg}
            onChange={(e) => setValue("kg", parseFloat(e.target.value) || 0.5)}
            InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
            sx={{ mt: 1 }}
          />
        </Box>

        <PriceCalculator
          settings={settings}
          services={selectedServices as OrderService[]}
          kg={kg}
          deliveryFee={deliveryFee}
          discount={discount}
        />

        {settings && selectedServices.length > 0 && (
          <Box mt={1} display="flex" gap={1} flexWrap="wrap">
            {selectedServices.map((s) => {
              const service = SERVICES.find((sv) => sv.value === s);
              const estTime = settings.estimatedTime[s as OrderService];
              return service ? (
                <Chip key={s} label={`${service.label}: ${estTime}`} size="small" variant="outlined" color="primary" />
              ) : null;
            })}
          </Box>
        )}

        {/* Delivery type */}
        <FormControl sx={{ mt: 3, width: "100%" }}>
          <FormLabel>Pengiriman</FormLabel>
          <Controller
            name="deliveryType"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field}>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, mb: 1, cursor: "pointer", borderColor: field.value === "ambil_sendiri" ? "primary.main" : "divider" }}
                  onClick={() => field.onChange("ambil_sendiri")}
                >
                  <Box display="flex" alignItems="flex-start" gap={1}>
                    <Radio value="ambil_sendiri" sx={{ pt: 0 }} />
                    <Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <StoreIcon fontSize="small" color="primary" />
                        <Typography variant="body1" fontWeight="medium">Ambil di Toko</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">Antar & ambil sendiri ke toko</Typography>
                      {settings?.storeHours && (
                        <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                          <AccessTimeIcon sx={{ fontSize: 14 }} color="action" />
                          <Typography variant="caption" color="text.secondary">
                            Jam buka: {settings.storeHours.open} – {settings.storeHours.close}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Paper>

                {settings?.deliveryEnabled !== false && (
                  <Paper
                    variant="outlined"
                    sx={{ p: 2, cursor: "pointer", borderColor: field.value === "jemput_antar" ? "primary.main" : "divider" }}
                    onClick={() => field.onChange("jemput_antar")}
                  >
                    <Box display="flex" alignItems="flex-start" gap={1}>
                      <Radio value="jemput_antar" sx={{ pt: 0 }} />
                      <Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <LocalShippingIcon fontSize="small" color="primary" />
                          <Typography variant="body1" fontWeight="medium">Jemput & Antar</Typography>
                          {(settings?.deliveryFee ?? 0) > 0 && (
                            <Chip
                              label={`+Rp ${(settings?.deliveryFee ?? 0).toLocaleString("id-ID")}`}
                              size="small"
                              color="warning"
                            />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Kami jemput ke alamatmu & antar kembali. Berat ditimbang saat penjemputan.
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                )}
              </RadioGroup>
            )}
          />
        </FormControl>

        {deliveryType === "jemput_antar" && (
          <TextField
            {...register("deliveryAddress")}
            label="Alamat Lengkap"
            multiline
            rows={3}
            fullWidth
            margin="normal"
            error={!!errors.deliveryAddress}
            helperText={errors.deliveryAddress?.message || "Patokan / detail lokasi membantu kurir menemukan rumahmu"}
            placeholder="Jl. Contoh No. 1, RT/RW, Kelurahan, Kecamatan..."
            InputLabelProps={{ shrink: true }}
            required
          />
        )}

        <FormControl sx={{ mt: 3, width: "100%" }}>
          <FormLabel>Metode Pembayaran</FormLabel>
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel value="bayar_nanti" control={<Radio />} label="Bayar Nanti (di toko)" />
                <FormControlLabel value="bayar_sekarang" control={<Radio />} label="Bayar Sekarang (QRIS/GoPay/Transfer)" />
              </RadioGroup>
            )}
          />
        </FormControl>

        {/* Promo code */}
        <Box mt={2} display="flex" gap={1} alignItems="flex-start">
          <TextField
            {...register("promoCode")}
            label="Kode Promo (opsional)"
            size="small"
            sx={{ flex: 1 }}
            inputProps={{ style: { textTransform: "uppercase" } }}
            error={!!promoError}
            helperText={promoError}
            InputLabelProps={{ shrink: true }}
            placeholder="Masukkan kode promo"
            onChange={(e) => {
              setValue("promoCode", e.target.value.toUpperCase());
              setPromoResult(null);
              setPromoError("");
            }}
          />
          <Button
            variant="outlined"
            onClick={handleValidatePromo}
            disabled={!promoCode || promoLoading}
            sx={{ mt: 0.5, whiteSpace: "nowrap" }}
          >
            {promoLoading ? <CircularProgress size={20} /> : "Pakai"}
          </Button>
        </Box>
        {promoResult && (
          <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
            <CheckCircleIcon fontSize="small" color="success" />
            <Typography variant="caption" color="success.main">
              {promoResult.name} — hemat Rp {promoResult.discount.toLocaleString("id-ID")}
            </Typography>
          </Box>
        )}

        <TextField
          {...register("notes")}
          label="Catatan (opsional)"
          multiline
          rows={2}
          fullWidth
          margin="normal"
          error={!!errors.notes}
          helperText={errors.notes?.message}
          placeholder="Instruksi khusus untuk cucian Anda"
          InputLabelProps={{ shrink: true }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={isSubmitting}
          sx={{ mt: 3, py: 1.5 }}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Buat Order Sekarang"}
        </Button>
      </Box>

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError("")}>
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}
