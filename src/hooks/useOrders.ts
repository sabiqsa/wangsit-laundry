import useSWR from "swr";
import { IOrder } from "@/types/models";
import { PaginatedResponse } from "@/types/api";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useAdminOrders(page = 1, status?: string) {
  const params = new URLSearchParams({ page: String(page), limit: "20" });
  if (status) params.set("status", status);

  const { data, error, isLoading, mutate } = useSWR<PaginatedResponse<IOrder>>(
    `/api/admin/orders?${params}`,
    fetcher
  );

  return {
    orders: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isError: !!error,
    mutate,
  };
}

export function useOrderHistory(page = 1) {
  const params = new URLSearchParams({ page: String(page), limit: "10" });

  const { data, error, isLoading } = useSWR<PaginatedResponse<IOrder>>(
    `/api/orders/history?${params}`,
    fetcher
  );

  return {
    orders: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isError: !!error,
  };
}
