"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IOrder } from "@/types/models";
import { OrderDetailView } from "@/features/order/OrderDetailView";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((result) => {
        if (result.success) setOrder(result.data);
        else setError("Pesanan tidak ditemukan");
      })
      .catch(() => setError("Terjadi kesalahan"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-gray-500">{error || "Pesanan tidak ditemukan"}</p>
      </div>
    );
  }

  return <OrderDetailView order={order} backHref="/history" />;
}
