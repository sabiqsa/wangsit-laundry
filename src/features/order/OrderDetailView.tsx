"use client";

import NextLink from "next/link";
import { IOrder, SERVICE_LABELS, OrderStatus, ORDER_STATUS_LABELS } from "@/types/models";
import { useSettings } from "@/hooks/useSettings";

const STEPS: { label: string }[] = [
  { label: "Pesanan diterima" },
  { label: "Dijemput" },
  { label: "Dicuci" },
  { label: "Disetrika" },
  { label: "Diantar" },
  { label: "Selesai" },
];

// Which step index is "active" for each backend status
const STATUS_ACTIVE_STEP: Record<OrderStatus, number> = {
  Pending: 0,
  Proses: 1,
  Selesai: 4,
  Lunas: 5,
  Dibatalkan: -1,
};

function ScooterIllustration() {
  return (
    <svg width="72" height="56" viewBox="0 0 72 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Helmet + head */}
      <circle cx="42" cy="8" r="7" fill="#e2e8f0" />
      <path d="M35 8 Q36 2 42 2 Q48 2 49 8 Z" fill="#94a3b8" />
      {/* Body */}
      <rect x="34" y="15" width="14" height="14" rx="3" fill="#e2e8f0" />
      {/* Delivery box on back */}
      <rect x="50" y="14" width="14" height="12" rx="2" fill="#cbd5e1" />
      <text x="52" y="24" fontSize="8" fill="#64748b" fontWeight="bold">Y</text>
      {/* Scooter body */}
      <path d="M20 32 Q22 24 34 26 L48 26 Q58 26 60 32 L62 36 L18 36 Z" fill="#94a3b8" />
      {/* Wheels */}
      <circle cx="24" cy="40" r="8" fill="#475569" />
      <circle cx="24" cy="40" r="4" fill="#94a3b8" />
      <circle cx="56" cy="40" r="8" fill="#475569" />
      <circle cx="56" cy="40" r="4" fill="#94a3b8" />
      {/* Handlebars */}
      <path d="M46 20 Q50 18 52 22" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
      {/* Exhaust */}
      <path d="M18 34 Q10 34 8 38" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
      <path d="M1.5 5.5L5.5 9.5L12.5 1.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export function OrderDetailView({ order, backHref = "/" }: { order: IOrder; backHref?: string }) {
  const { settings } = useSettings();

  const activeStep = STATUS_ACTIVE_STEP[order.orderStatus];

  const waMessage = encodeURIComponent(`Halo, saya ingin bertanya tentang pesanan ${order.orderNumber}`);
  const whatsappUrl = settings?.adminPhone ? `https://wa.me/${settings.adminPhone}?text=${waMessage}` : "#";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100">
        <NextLink href={backHref} className="text-2xl font-bold w-8 flex items-center" style={{ color: "#3D5A9E" }}>
          &#8249;
        </NextLink>
        <h1 className="flex-1 text-center text-lg font-bold" style={{ color: "#3D5A9E" }}>
          Detail Pesanan
        </h1>
        <div className="w-8" />
      </div>

      <div className="px-5 py-4">
        {/* Order info card */}
        <div
          className="rounded-2xl p-4 flex items-start justify-between mb-1"
          style={{ background: "#5B7EC9" }}
        >
          <div className="flex-1">
            <p className="text-white font-bold text-base">{order.orderNumber}</p>
            <p className="text-white/80 text-sm mt-1">
              {fmtDate(order.createdAt)} | {fmtTime(order.createdAt)}
            </p>
            <p className="text-white/80 text-sm">
              {order.kg} kg - {order.services.map((s) => SERVICE_LABELS[s]).join(", ")}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1 ml-2">
            <ScooterIllustration />
            <span className="text-white text-xs font-semibold">
              {ORDER_STATUS_LABELS[order.orderStatus]}
            </span>
          </div>
        </div>

        {/* Status timeline */}
        <h2 className="text-base font-bold mt-5 mb-3" style={{ color: "#3D5A9E" }}>
          Status Pemesanan
        </h2>

        <div>
          {STEPS.map((step, idx) => {
            const isDone = idx < activeStep;
            const isCurrent = idx === activeStep;
            const isPending = idx > activeStep;

            const circleColor = isDone ? "#22c55e" : isCurrent ? "#3D5A9E" : "#d1d5db";
            const lineColor = isDone ? "#22c55e" : "#e5e7eb";
            const textColor = isPending ? "#9ca3af" : "#1f2937";
            const textWeight = isCurrent ? "700" : isPending ? "400" : "600";

            let timestampLine = "";
            if (isDone && idx === 0) timestampLine = `${fmtDate(order.createdAt)} - ${fmtTime(order.createdAt)}`;
            else if (isDone) timestampLine = fmtDate(order.createdAt);
            else if (isCurrent && idx === 0) timestampLine = `${fmtDate(order.createdAt)} - ${fmtTime(order.createdAt)}`;
            else if (isCurrent) timestampLine = `${fmtDate(order.updatedAt)} - ${fmtTime(order.updatedAt)}`;

            return (
              <div key={idx} className="flex items-start gap-4">
                {/* Circle + connector */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: circleColor }}
                  >
                    <CheckIcon color={isPending ? "#fff" : "white"} />
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div className="w-0.5 flex-1 min-h-5 my-0.5" style={{ background: lineColor }} />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 pb-4">
                  <p style={{ color: textColor, fontWeight: textWeight }}>{step.label}</p>
                  {timestampLine && (
                    <p className="text-xs text-gray-400 mt-0.5">{timestampLine}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Estimasi Selesai */}
        <div className="rounded-2xl px-5 py-4 mt-2 text-center" style={{ background: "#EEF2FF" }}>
          <p className="font-bold text-gray-800 text-sm">Estimasi Selesai</p>
          <p className="font-bold text-gray-700 text-sm mt-1">{order.estimatedCompletion || "-"}</p>
        </div>

        {/* Hubungi Admin */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl border mt-4 text-sm font-semibold transition-colors hover:bg-blue-50"
          style={{ borderColor: "#3D5A9E", color: "#3D5A9E" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
          Hubungi Admin
        </a>
      </div>
    </div>
  );
}
