"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IPromo } from "@/types/models";

function PromoCard({ promo, onCopy }: { promo: IPromo; onCopy: (code: string) => void }) {
  const isPercent = promo.discountType === "percent";
  const discountLabel = isPercent
    ? `${promo.discountValue}% OFF`
    : `Rp ${promo.discountValue.toLocaleString("id-ID")} OFF`;

  const endDate = new Date(promo.endDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isAlmostExpired =
    new Date(promo.endDate).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;

  return (
    <div
      className="rounded-2xl border overflow-hidden shadow-sm"
      style={{ borderColor: "#C5CFF0" }}
    >
      {/* Top colored section */}
      <div
        className="px-4 py-4 flex items-center justify-between"
        style={{ background: "linear-gradient(135deg, #5B7EC9 0%, #3D5A9E 100%)" }}
      >
        <div>
          <p className="text-white font-bold text-lg leading-tight">{discountLabel}</p>
          <p className="text-white/80 text-sm mt-0.5">{promo.name}</p>
        </div>
        <div className="text-right">
          <div
            className="bg-white/20 rounded-xl px-3 py-2 text-center cursor-pointer hover:bg-white/30 transition-colors"
            onClick={() => onCopy(promo.code)}
          >
            <p className="text-white/70 text-[10px] mb-0.5">Kode Promo</p>
            <p className="text-white font-bold text-sm tracking-wider">{promo.code}</p>
          </div>
        </div>
      </div>

      {/* Bottom info section */}
      <div className="px-4 py-3 flex items-center justify-between bg-white">
        <div>
          {promo.minOrderAmount > 0 && (
            <p className="text-xs text-gray-500">
              Min. order <span className="font-medium text-gray-700">Rp {promo.minOrderAmount.toLocaleString("id-ID")}</span>
            </p>
          )}
          <p className="text-xs mt-0.5" style={{ color: isAlmostExpired ? "#ef4444" : "#6b7280" }}>
            {isAlmostExpired ? "⚡ " : ""}Berlaku hingga {endDate}
          </p>
          {promo.maxUsage && (
            <p className="text-xs text-gray-400 mt-0.5">
              Sisa {Math.max(0, promo.maxUsage - promo.usageCount)} penggunaan
            </p>
          )}
        </div>
        <button
          onClick={() => onCopy(promo.code)}
          className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors hover:bg-blue-50"
          style={{ borderColor: "#3D5A9E", color: "#3D5A9E" }}
        >
          Salin
        </button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-20 bg-gray-200" />
      <div className="px-4 py-3 bg-white flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-3 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
        <div className="h-7 w-16 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

export default function PromoPage() {
  const router = useRouter();
  const [promos, setPromos] = useState<IPromo[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState("");

  useEffect(() => {
    fetch("/api/promos")
      .then((r) => r.json())
      .then((result) => { if (result.success) setPromos(result.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100">
        <button onClick={() => router.back()} className="text-2xl font-bold w-8 flex items-center" style={{ color: "#3D5A9E" }}>
          &#8249;
        </button>
        <h1 className="flex-1 text-center text-lg font-bold" style={{ color: "#3D5A9E" }}>
          Promo
        </h1>
        <div className="w-8" />
      </div>

      {/* Toast */}
      {copiedCode && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-800 text-white text-xs px-4 py-2 rounded-full shadow-lg">
          Kode <span className="font-bold">{copiedCode}</span> disalin!
        </div>
      )}

      <div className="px-4 py-5 flex flex-col gap-4">
        {loading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : promos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="3" />
            </svg>
            <p className="text-gray-400 text-sm text-center">Belum ada promo aktif saat ini</p>
          </div>
        ) : (
          promos.map((promo) => (
            <PromoCard key={promo._id} promo={promo} onCopy={handleCopy} />
          ))
        )}
      </div>
    </div>
  );
}
