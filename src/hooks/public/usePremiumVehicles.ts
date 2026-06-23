import { useQuery } from "@tanstack/react-query";
import type { Vehicle } from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

interface SpringPageResponse {
  content: Vehicle[];
  totalPages: number;
  totalElements: number;
}

export function usePremiumVehicles(page: number = 0, size: number = 7) {
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useQuery<SpringPageResponse>({
      queryKey: ["premium-vehicles", page, size],
      queryFn: async () => {
        const res = await fetch(
          `${API_BASE_URL}/api/vehicle/premium/all-vehicle?page=${page}&size=${size}`,
        );
        const body = await res.json();
        if (!res.ok)
          throw new Error(body?.message ?? "Failed to fetch premium vehicles");
        return body;
      },
      staleTime: 1000 * 60 * 2, // 2 minutes
    });

  return {
    vehicles: data?.content ?? [],
    totalPages: data?.totalPages ?? 1,
    totalElements: data?.totalElements ?? 0,
    loading: isLoading,
    error: isError ? (error?.message ?? "Failed to load premium vehicles") : null,
    refetch,
    isRefetching,
  };
}
