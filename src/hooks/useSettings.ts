import useSWR from "swr";
import { ISettings } from "@/types/models";
import { ApiResponse } from "@/types/api";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useSettings() {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<ISettings>>(
    "/api/admin/settings",
    fetcher
  );

  return {
    settings: data?.data ?? null,
    isLoading,
    isError: !!error,
    mutate,
  };
}
