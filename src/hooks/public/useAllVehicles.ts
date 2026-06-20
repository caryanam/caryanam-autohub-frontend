import { useQuery } from "@tanstack/react-query";
import type { Vehicle } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useAllVehicles() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<Vehicle[]>({
    queryKey: ["all-vehicles"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/vehicle/all-vehicle`);
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message ?? "Failed to fetch vehicles");
      return body.data ?? [];
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
