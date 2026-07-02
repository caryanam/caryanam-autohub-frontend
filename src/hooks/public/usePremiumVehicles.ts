import { useQuery } from "@tanstack/react-query";
import type { Vehicle } from "@/types";

const API_BASE_URL =
  // import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
  import.meta.env.VITE_API_BASE_URL || " https://c1.caryanam.com";

type ApiResponse = Vehicle[] | {
  status?: number;
  message?: string;
  data?: Vehicle[];
  content?: Vehicle[];
  totalPages?: number;
  totalElements?: number;
};

export function usePremiumVehicles() {
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useQuery<ApiResponse>({
      queryKey: ["premium-vehicles"],
      queryFn: async () => {
        const res = await fetch(
          `${API_BASE_URL}/api/vehicle/premium/all-vehicle`,
        );
        const body = await res.json();
        if (!res.ok)
          throw new Error(body?.message ?? "Failed to fetch premium vehicles");
        return body;
      },
      staleTime: 1000 * 60 * 2, // 2 minutes
    });

  let vehicles: Vehicle[] = [];
  let totalPages = 1;
  let totalElements = 0;

  if (Array.isArray(data)) {
    vehicles = data;
    totalPages = 1;
    totalElements = data.length;
  } else if (data) {
    vehicles = data.data || data.content || [];
    totalPages = data.totalPages ?? 1;
    totalElements = data.totalElements ?? vehicles.length;
  }

  return {
    vehicles,
    totalPages,
    totalElements,
    loading: isLoading,
    error: isError ? (error?.message ?? "Failed to load premium vehicles") : null,
    refetch,
    isRefetching,
  };
}
