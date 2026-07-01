"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { IOrder } from "@/types/models";
import { OrderDetailView } from "@/features/order/OrderDetailView";

function TrackPageContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTrack = async (num?: string) => {
    const query = (num ?? orderNumber).trim();
    if (!query) return;
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(query)}`);
      const result = await res.json();
      if (result.success) {
        setOrder(result.data);
      } else {
        setError("Order tidak ditemukan. Periksa kembali nomor order Anda.");
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const num = searchParams.get("orderNumber");
    if (!num) return;
    setOrderNumber(num);
    handleTrack(num);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (order) {
    return (
      <div>
        <OrderDetailView order={order} backHref="/track" />
        <div className="px-5 pb-8 -mt-2">
          <button
            onClick={() => { setOrder(null); setError(""); setTimeout(() => inputRef.current?.focus(), 100); }}
            className="w-full py-3 rounded-2xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Lacak Order Lain
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100">
        <div className="w-8" />
        <h1 className="flex-1 text-center text-lg font-bold" style={{ color: "#3D5A9E" }}>
          Lacak Pesanan
        </h1>
        <div className="w-8" />
      </div>

      <div className="px-5 pt-8 pb-10 flex flex-col gap-4">
        <div className="flex flex-col items-center gap-3 mb-4">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
            <circle cx="36" cy="36" r="36" fill="#EEF2FF" />
            <circle cx="30" cy="30" r="14" stroke="#5B7EC9" strokeWidth="3" fill="none" />
            <line x1="40" y1="40" x2="54" y2="54" stroke="#5B7EC9" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p className="text-gray-500 text-sm text-center max-w-60">
            Masukkan nomor order untuk melihat status cucian Anda
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border bg-white" style={{ borderColor: "#5B7EC9" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
            placeholder="contoh: WNG-20240101-0001"
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            autoCapitalize="characters"
          />
          {orderNumber && (
            <button onClick={() => { setOrderNumber(""); setError(""); }} className="text-gray-400 text-lg leading-none">×</button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-2xl text-center">
            {error}
          </div>
        )}

        <button
          onClick={() => handleTrack()}
          disabled={loading || !orderNumber.trim()}
          className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-opacity"
          style={{ background: "#3D5A9E" }}
        >
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Lacak Pesanan
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-400">
          Nomor order dikirim ke WhatsApp Anda setelah pemesanan
        </p>
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense>
      <TrackPageContent />
    </Suspense>
  );
}
