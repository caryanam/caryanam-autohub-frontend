import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import type {
  SocialVisitLogDTO,
  InstagramDealerVehicleStatusDTO,
  InstagramPostRequestBulkRequestDTO,
  InstagramPostRequestBulkResponseDTO,
} from "@/types/social";
import axios from "axios";

export function useGetDealerInstagramVehicles(enabled: boolean = true) {
  return useQuery<InstagramDealerVehicleStatusDTO[], Error>({
    queryKey: ["dealerInstagramVehicles"],
    queryFn: async () => {
      try {
        const { data: body } = await apiClient.get(
          "/api/dealer/instagram-post-requests/vehicles"
        );
        const data = body?.data !== undefined ? body.data : body;
        return Array.isArray(data) ? data : [];
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw new Error(err.response?.data?.message || "Failed to fetch Instagram vehicles");
        }
        throw err;
      }
    },
    enabled,
  });
}

export function useSubmitBulkInstagramPost() {
  const queryClient = useQueryClient();

  return useMutation<
    InstagramPostRequestBulkResponseDTO,
    Error,
    InstagramPostRequestBulkRequestDTO
  >({
    mutationFn: async (payload) => {
      try {
        const { data: body } = await apiClient.post(
          "/api/dealer/instagram-post-requests/bulk",
          payload
        );
        return body?.data !== undefined ? body.data : body;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw new Error(err.response?.data?.message || "Failed to submit post request");
        }
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dealerInstagramVehicles"] });
    },
  });
}

// DEALER — all instagram visits on my vehicles
export function useGetMyInstagramVisits() {
  return useQuery<SocialVisitLogDTO[], Error>({
    queryKey: ["dealerInstagramVisits"],
    queryFn: async () => {
      try {
        const { data: body } = await apiClient.get(
          "/api/dealer/social-visits"
        );
        const data = body?.data !== undefined ? body.data : body;
        return Array.isArray(data) ? data : [];
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw new Error(err.response?.data?.message || "Failed to fetch Instagram visits");
        }
        throw err;
      }
    },
  });
}

// DEALER — visits on a specific vehicle (must be my vehicle)
export function useGetMyVehicleInstagramVisits(vehicleId: number | null) {
  return useQuery<SocialVisitLogDTO[], Error>({
    queryKey: ["dealerInstagramVisitsByVehicle", vehicleId],
    queryFn: async () => {
      if (!vehicleId) return [];
      try {
        const { data: body } = await apiClient.get(
          `/api/dealer/social-visits/${vehicleId}`
        );
        const data = body?.data !== undefined ? body.data : body;
        return Array.isArray(data) ? data : [];
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw new Error(err.response?.data?.message || "Failed to fetch vehicle Instagram visits");
        }
        throw err;
      }
    },
    enabled: !!vehicleId,
  });
}
