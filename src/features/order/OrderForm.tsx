"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { orderFormSchema, OrderFormInput } from "@/schemas/order.schema";
import { useSettings } from "@/hooks/useSettings";
import { OrderService } from "@/types/models";
import NextLink from "next/link";

const SERVICES: { value: OrderService; label: string }[] = [
  { value: "cuciLipat", label: "Cuci Lipat" },
  { value: "setrika", label: "Cuci Kering" },
  { value: "cuciSetrika", label: "Cuci Setrika" },
];

const TIME_SLOTS = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "12:00 - 14:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
];

const PAYMENT_METHODS = [
  {
    value: "bayar_nanti",
    label: "Bayar di Toko",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    value: "bayar_sekarang",
    label: "QRIS",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="3" height="3" rx="0.5" /><rect x="18" y="14" width="3" height="3" rx="0.5" /><rect x="14" y="18" width="3" height="3" rx="0.5" /><rect x="18" y="18" width="3" height="3" rx="0.5" />
        <rect x="5" y="5" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" /><rect x="16" y="5" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" /><rect x="5" y="16" width="3" height="3" rx="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold mt-5 mb-3" style={{ color: "#3D5A9E" }}>
      {children}
    </h2>
  );
}

function RoundedInput({ error, children }: { error?: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="flex items-center px-4 py-3 rounded-2xl border bg-white" style={{ borderColor: "#5B7EC9" }}>
        {children}
      </div>
      {error && <p className="text-red-500 text-xs mt-1 ml-2">{error}</p>}
    </div>
  );
}

export function OrderForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const { settings } = useSettings();
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(TIME_SLOTS[1]);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormInput>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      clientName: session?.user?.name || "",
      clientPhone: session?.user?.phone || "",
      services: [],
      kg: 5,
      paymentMethod: "bayar_nanti",
      deliveryType: "jemput_antar",
      deliveryAddress: "",
      promoCode: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (session?.user?.name && !watch("clientName")) setValue("clientName", session.user.name);
    if (session?.user?.phone && !watch("clientPhone")) setValue("clientPhone", session.user.phone);
  }, [session, setValue, watch]);

  const selectedServices = watch("services");
  const kg = watch("kg");
  const paymentMethod = watch("paymentMethod");

  const serviceTotal = settings
    ? selectedServices.reduce((sum, s) => sum + (settings.pricing[s as OrderService] ?? 0), 0) * kg
    : 0;
  const ongkosKirim = settings?.deliveryFee ?? 0;
  const total = serviceTotal + ongkosKirim;

  const formatRp = (n: number) => `Rp. ${n.toLocaleString("id-ID")}`;

  const formatDateDisplay = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const handleLanjut = async () => {
    const valid = await trigger(["clientName", "clientPhone", "deliveryAddress", "services", "kg"]);
    if (valid) setStep(2);
  };

  const onSubmit = async (data: OrderFormInput) => {
    setError("");
    const scheduleNote = `Jadwal Penjemputan: ${formatDateDisplay(selectedDate)}, ${selectedTimeSlot}`;
    const fullNotes = [scheduleNote, data.notes].filter(Boolean).join(" | ");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, notes: fullNotes }),
      });
      const result = await res.json();
      if (!result.success) { setError(result.error || "Gagal membuat order"); return; }

      const { orderId } = result.data;

      if (data.paymentMethod === "bayar_sekarang") {
        const payRes = await fetch("/api/payments/midtrans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        const payResult = await payRes.json();
        if (payResult.success && typeof window !== "undefined" && (window as unknown as { snap?: { pay: (t: string, cb: unknown) => void } }).snap) {
          const snap = (window as unknown as { snap: { pay: (t: string, cb: unknown) => void } }).snap;
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
      <script src="https://app.midtrans.com/snap/snap.js" data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} async />

      {/* Step header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100 -mx-5">
        {step === 1 ? (
          <NextLink href="/" className="text-blue-600 text-2xl font-bold mr-4 w-8 flex items-center">&#8249;</NextLink>
        ) : (
          <button type="button" onClick={() => setStep(1)} className="text-blue-600 text-2xl font-bold mr-4 w-8 flex items-center">&#8249;</button>
        )}
        <h1 className="flex-1 text-center text-lg font-bold" style={{ color: "#3D5A9E" }}>
          {step === 1 ? "Pesan Laundry" : "Pembayaran"}
        </h1>
        <div className="w-8" />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-600 text-sm px-4 py-2 rounded-xl mt-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* ── STEP 1: Data + Layanan ── */}
        {step === 1 && (
          <>
            <SectionTitle>Data Pelanggan</SectionTitle>

            <RoundedInput error={errors.clientName?.message}>
              <input {...register("clientName")} type="text" placeholder="Nama Lengkap"
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent" />
            </RoundedInput>

            <RoundedInput error={errors.clientPhone?.message}>
              <input {...register("clientPhone")} type="tel" placeholder="Nomor HP"
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent" />
            </RoundedInput>

            <RoundedInput error={errors.deliveryAddress?.message}>
              <input {...register("deliveryAddress")} type="text" placeholder="Alamat"
                className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent" />
            </RoundedInput>

            <SectionTitle>Pilih Layanan</SectionTitle>

            <Controller name="services" control={control} render={({ field }) => (
              <div className="grid grid-cols-2 gap-3">
                {SERVICES.map((svc) => {
                  const isSelected = field.value.includes(svc.value);
                  const price = settings?.pricing[svc.value];
                  return (
                    <button key={svc.value} type="button"
                      onClick={() => {
                        if (isSelected) field.onChange(field.value.filter((v: string) => v !== svc.value));
                        else field.onChange([...field.value, svc.value]);
                      }}
                      className="relative flex flex-col p-3 rounded-2xl border text-left transition-colors"
                      style={{ borderColor: isSelected ? "#3D5A9E" : "#d1d5db", background: isSelected ? "#EEF2FF" : "white" }}
                    >
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full border flex items-center justify-center"
                        style={{ borderColor: isSelected ? "#3D5A9E" : "#9ca3af", background: isSelected ? "#3D5A9E" : "transparent" }}>
                        {isSelected && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="font-semibold text-sm text-gray-800 pr-6">{svc.label}</span>
                      {price !== undefined && <span className="text-xs text-gray-500 mt-0.5">Rp. {price.toLocaleString("id-ID")}/kg</span>}
                    </button>
                  );
                })}
              </div>
            )} />
            {errors.services && <p className="text-red-500 text-xs mt-1">{errors.services.message}</p>}

            <SectionTitle>Berat Pakaian</SectionTitle>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setValue("kg", Math.max(0.5, kg - 1))}
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 font-bold text-lg hover:bg-gray-50">−</button>
              <span className="text-lg font-semibold text-gray-800 w-8 text-center">{kg}</span>
              <button type="button" onClick={() => setValue("kg", Math.min(100, kg + 1))}
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 font-bold text-lg hover:bg-gray-50">+</button>
            </div>

            <button type="button" onClick={handleLanjut}
              className="w-full py-4 rounded-2xl font-bold text-white text-sm tracking-widest mt-8 flex items-center justify-center"
              style={{ background: "#3D5A9E" }}>
              Lanjut ke Pembayaran
            </button>
          </>
        )}

        {/* ── STEP 2: Pembayaran ── */}
        {step === 2 && (
          <>
            <SectionTitle>Detail Pembayaran</SectionTitle>

            {/* Summary card */}
            <div className="rounded-2xl overflow-hidden border border-gray-200">
              <div className="bg-gray-50 divide-y divide-gray-200">
                <div className="flex justify-between px-4 py-3 text-sm">
                  <span className="text-gray-500">Layanan</span>
                  <span className="font-medium text-gray-800">
                    {selectedServices.map(s => SERVICES.find(sv => sv.value === s)?.label).filter(Boolean).join(", ") || "-"}
                  </span>
                </div>
                <div className="flex justify-between px-4 py-3 text-sm">
                  <span className="text-gray-500">Berat</span>
                  <span className="font-medium text-gray-800">{kg} kg</span>
                </div>
                {ongkosKirim > 0 && (
                  <div className="flex justify-between px-4 py-3 text-sm">
                    <span className="text-gray-500">Ongkos Kirim</span>
                    <span className="font-medium text-gray-800">{formatRp(ongkosKirim)}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between px-4 py-3 border-t border-gray-200 bg-white">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-gray-800">{formatRp(total)}</span>
              </div>
            </div>

            <SectionTitle>Pilih Metode Pembayaran</SectionTitle>

            <Controller name="paymentMethod" control={control} render={({ field }) => (
              <div className="flex flex-col gap-3">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = field.value === method.value;
                  return (
                    <button key={method.value} type="button"
                      onClick={() => field.onChange(method.value)}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-colors text-left"
                      style={{ borderColor: isSelected ? "#3D5A9E" : "#d1d5db", background: isSelected ? "#EEF2FF" : "white" }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: isSelected ? "#3D5A9E" : "#f3f4f6", color: isSelected ? "white" : "#6b7280" }}>
                        {method.icon}
                      </div>
                      <span className="flex-1 text-sm font-medium text-gray-800">{method.label}</span>
                      <div className="w-5 h-5 rounded-full border flex items-center justify-center"
                        style={{ borderColor: isSelected ? "#3D5A9E" : "#9ca3af", background: isSelected ? "#3D5A9E" : "transparent" }}>
                        {isSelected && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )} />

            <SectionTitle>Jadwal Penjemputan</SectionTitle>
            <div className="flex gap-3">
              <div className="flex items-center gap-2 flex-1 px-3 py-2.5 rounded-2xl border bg-white" style={{ borderColor: "#d1d5db" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B7EC9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 text-xs text-gray-700 outline-none bg-transparent"
                  min={new Date().toISOString().split("T")[0]} />
              </div>

              <div className="relative">
                <button type="button" onClick={() => setShowTimeSlots((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-2xl border bg-white" style={{ borderColor: "#d1d5db" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5B7EC9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                  </svg>
                  <span className="text-xs text-gray-700 whitespace-nowrap">{selectedTimeSlot}</span>
                  <span className="text-gray-400 text-xs">›</span>
                </button>
                {showTimeSlots && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 min-w-36">
                    {TIME_SLOTS.map((slot) => (
                      <button key={slot} type="button"
                        onClick={() => { setSelectedTimeSlot(slot); setShowTimeSlots(false); }}
                        className="w-full text-left text-xs px-4 py-2.5 hover:bg-blue-50 first:rounded-t-xl last:rounded-b-xl"
                        style={{ color: slot === selectedTimeSlot ? "#3D5A9E" : "#374151", fontWeight: slot === selectedTimeSlot ? 600 : 400 }}>
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <SectionTitle>Catatan (Opsional)</SectionTitle>
            <div className="rounded-2xl border px-4 py-3 bg-white" style={{ borderColor: "#5B7EC9" }}>
              <textarea {...register("notes")} placeholder="Contoh : Pakaian putih dipisah" rows={3}
                className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent resize-none" />
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full py-4 rounded-2xl font-bold text-white text-sm tracking-widest mt-6 flex items-center justify-center disabled:opacity-70 transition-opacity"
              style={{ background: "#3D5A9E" }}>
              {isSubmitting ? <CircularProgress size={22} sx={{ color: "white" }} /> : "PESAN SEKARANG"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-3">
              Total Estimasi : <span className="font-semibold">{formatRp(total)}</span>
            </p>
          </>
        )}
      </form>
    </>
  );
}
