import { useQuery } from "@tanstack/react-query";
import type { Vehicle } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

export function useLatestVehicles() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<Vehicle[]>({
    queryKey: ["latest-vehicles"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/vehicle/latest-vehicles`);
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message ?? "Failed to fetch latest vehicles");
      // The API return is an array directly, or it might be wrapped in a data property.
      // Looking at the USER_REQUEST, it is:
      // http://localhost:8081/api/vehicle/latest-vehicles [ { "id": 14, ... } ]
      // And http://localhost:8081/api/vehicle/featured [ { "id": 11, ... } ]
      // It is directly an array! But let's check both options just in case to be robust.
      return Array.isArray(body) ? body : (body.data ?? []);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return {
    vehicles: data ?? [],
    loading: isLoading,
    error: isError ? (error?.message ?? "Failed to load latest vehicles") : null,
    refetch,
    isRefetching,
  };
}

export function useFeaturedVehicles() {
  const { data, isLoading, isError, error, refetch, isRefetching } = useQuery<Vehicle[]>({
    queryKey: ["featured-vehicles"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/vehicle/featured`);
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message ?? "Failed to fetch featured vehicles");
      return Array.isArray(body) ? body : (body.data ?? []);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return {
    vehicles: data ?? [],
    loading: isLoading,
    error: isError ? (error?.message ?? "Failed to load featured vehicles") : null,
    refetch,
    isRefetching,
  };
}
