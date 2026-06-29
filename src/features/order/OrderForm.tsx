"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
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
  Radio,
  RadioGroup,
  Slider,
  Snackbar,
  Alert,
  TextField,
  Typography,
} from "@mui/material";
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
      services: [],
      kg: 1,
      paymentMethod: "bayar_nanti",
    },
  });

  useEffect(() => {
    if (session?.user?.name && !watch("clientName")) {
      setValue("clientName", session.user.name);
    }
  }, [session, setValue, watch]);

  const selectedServices = watch("services");
  const kg = watch("kg");

  const onSubmit = async (data: OrderFormInput) => {
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!result.success) {
        setError(result.error || "Gagal membuat order");
        return;
      }

      const { orderId, orderNumber } = result.data;

      if (data.paymentMethod === "bayar_sekarang") {
        // Get Midtrans token
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
      {/* Midtrans Snap.js */}
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
        />

        <FormControl
          component="fieldset"
          error={!!errors.services}
          sx={{ mt: 2, width: "100%" }}
        >
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
                            if (e.target.checked) {
                              field.onChange([...field.value, service.value]);
                            } else {
                              field.onChange(field.value.filter((v: string) => v !== service.value));
                            }
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
          {errors.services && (
            <FormHelperText>{errors.services.message}</FormHelperText>
          )}
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
            InputProps={{
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            sx={{ mt: 1 }}
          />
        </Box>

        <PriceCalculator
          settings={settings}
          services={selectedServices as OrderService[]}
          kg={kg}
        />

        {settings && selectedServices.length > 0 && (
          <Box mt={1} display="flex" gap={1} flexWrap="wrap">
            {selectedServices.map((s) => {
              const service = SERVICES.find((sv) => sv.value === s);
              const estTime = settings.estimatedTime[s as OrderService];
              return service ? (
                <Chip
                  key={s}
                  label={`${service.label}: ${estTime}`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ) : null;
            })}
          </Box>
        )}

        <FormControl sx={{ mt: 3, width: "100%" }}>
          <FormLabel>Metode Pembayaran</FormLabel>
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <RadioGroup {...field} row>
                <FormControlLabel
                  value="bayar_nanti"
                  control={<Radio />}
                  label="Bayar Nanti (di toko)"
                />
                <FormControlLabel
                  value="bayar_sekarang"
                  control={<Radio />}
                  label="Bayar Sekarang (QRIS/GoPay/Transfer)"
                />
              </RadioGroup>
            )}
          />
        </FormControl>

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
