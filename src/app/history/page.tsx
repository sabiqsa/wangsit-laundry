"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { useOrderHistory } from "@/hooks/useOrders";
import { EmptyState } from "@/components/ui/EmptyState";
import { IOrder, ORDER_STATUS_LABELS, SERVICE_LABELS, OrderStatus } from "@/types/models";

type FilterTab = "Semua" | "Selesai" | "Diproses" | "Dibatalkan";

const FILTER_TABS: FilterTab[] = ["Semua", "Selesai", "Diproses", "Dibatalkan"];

const STATUS_BADGE: Record<OrderStatus, { label: string; bg: string; text: string; border?: string }> = {
  Pending:     { label: "Menunggu",   bg: "#FEF3C7", text: "#D97706" },
  Proses:      { label: "Diproses",   bg: "#FEF3C7", text: "#D97706" },
  Selesai:     { label: "Selesai",    bg: "#D1FAE5", text: "#059669" },
  Lunas:       { label: "Selesai",    bg: "#D1FAE5", text: "#059669" },
  Dibatalkan:  { label: "Dibatalkan", bg: "transparent", text: "#9ca3af", border: "#d1d5db" },
};

function matchesFilter(status: OrderStatus, tab: FilterTab): boolean {
  if (tab === "Semua") return true;
  if (tab === "Selesai") return status === "Selesai" || status === "Lunas";
  if (tab === "Diproses") return status === "Pending" || status === "Proses";
  if (tab === "Dibatalkan") return status === "Dibatalkan";
  return false;
}

function OrderCard({ order }: { order: IOrder }) {
  const badge = STATUS_BADGE[order.orderStatus] ?? { label: order.orderStatus, bg: "#f3f4f6", text: "#6b7280" };
  const isActive = order.orderStatus === "Pending" || order.orderStatus === "Proses";
  const isSelesai = order.orderStatus === "Selesai" || order.orderStatus === "Lunas";
  const isCancelled = order.orderStatus === "Dibatalkan";

  const dateStr = new Date(order.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-3 shadow-sm">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <p className="font-bold text-gray-800 text-sm">{order.orderNumber}</p>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
          style={{
            background: badge.bg,
            color: badge.text,
            border: badge.border ? `1px solid ${badge.border}` : undefined,
          }}
        >
          {badge.label}
        </span>
      </div>

      {/* Date & service */}
      <p className="text-xs text-gray-400 mt-1">{dateStr}</p>
      <p className="text-xs text-gray-600 mt-0.5">
        {order.kg} kg - {order.services.map((s) => SERVICE_LABELS[s]).join(", ")}
      </p>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-3">
        <p className="font-bold text-gray-800 text-sm">
          Rp. {order.totalPrice.toLocaleString("id-ID")}
        </p>

        <div className="flex gap-2">
          {isActive && (
            <NextLink
              href={`/order/${order._id}`}
              className="px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors hover:bg-blue-50"
              style={{ borderColor: "#3D5A9E", color: "#3D5A9E" }}
            >
              Lihat Detail
            </NextLink>
          )}
          {isSelesai && (
            <NextLink
              href="/order"
              className="px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors hover:bg-blue-50"
              style={{ borderColor: "#3D5A9E", color: "#3D5A9E" }}
            >
              Pesan Lagi
            </NextLink>
          )}
          {!isCancelled && !isActive && !isSelesai && null}
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [page] = useState(1);
  const [activeTab, setActiveTab] = useState<FilterTab>("Semua");
  const { orders, isLoading } = useOrderHistory(page);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  const filtered = orders.filter((o) => matchesFilter(o.orderStatus, activeTab));

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center px-4 py-4 border-b border-gray-100">
        <button onClick={() => router.back()} className="text-2xl font-bold w-8 flex items-center" style={{ color: "#3D5A9E" }}>
          &#8249;
        </button>
        <h1 className="flex-1 text-center text-lg font-bold" style={{ color: "#3D5A9E" }}>
          Riwayat Pesanan
        </h1>
        <div className="w-8" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-4 py-4 overflow-x-auto no-scrollbar">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            style={{
              background: activeTab === tab ? "#3D5A9E" : "transparent",
              color: activeTab === tab ? "white" : "#6b7280",
              border: activeTab === tab ? "none" : "1.5px solid #d1d5db",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Order list */}
      <div className="px-4 pb-6">
        {!session?.user ? null : filtered.length === 0 ? (
          <EmptyState
            title="Tidak ada pesanan"
            description={activeTab === "Semua" ? "Anda belum memiliki riwayat pesanan" : `Tidak ada pesanan dengan status "${activeTab}"`}
          />
        ) : (
          filtered.map((order) => <OrderCard key={order._id} order={order} />)
        )}
      </div>
    </div>
  );
}
