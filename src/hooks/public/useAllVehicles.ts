import { useQuery } from "@tanstack/react-query";
import axios from "axios";
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

export function useAllVehicles() {
  const { data, isLoading, isError, error, refetch, isRefetching } =
    useQuery<ApiResponse>({
      queryKey: ["all-vehicles"],
      queryFn: async () => {
        try {
          const { data: body } = await axios.get<ApiResponse>(
            `${API_BASE_URL}/api/vehicle/non-premium/all-vehicle`
          );
          return body;
        } catch (err) {
          if (axios.isAxiosError(err)) {
            const body = err.response?.data;
            throw new Error(body?.message ?? "Failed to fetch vehicles");
          }
          throw err;
        }
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
    error: isError ? (error?.message ?? "Failed to load vehicles") : null,
    refetch,
    isRefetching,
  };
}
