import { useQuery } from "@tanstack/react-query";
import type { Vehicle } from "@/types";

import apiClient from "@/lib/apiClient";

export function useAdminAllVehicles() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<
    Vehicle[]
  >({
    queryKey: ["admin-all-vehicles"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/admin/all-vehicle");
      return data?.data ?? [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return {
    vehicles: data ?? [],
    loading: isLoading,
    error: isError ? (error?.message ?? "Failed to load vehicles") : null,
    refetch,
    isRefetching,
  };
}
