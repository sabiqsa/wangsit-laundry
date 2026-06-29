import useSWR from "swr";
import { ApiResponse } from "@/types/api";

interface ReportData {
  chart: Array<{ _id: string; total: number; count: number }>;
  summary: { totalRevenue: number; totalOrders: number; pendingOrders: number };
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useReports(period: "daily" | "weekly" | "monthly" = "daily") {
  const { data, error, isLoading } = useSWR<ApiResponse<ReportData>>(
    `/api/admin/reports?period=${period}`,
    fetcher
  );

  return {
    data: data?.data ?? null,
    isLoading,
    isError: !!error,
  };
}
