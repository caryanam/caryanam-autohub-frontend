import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import type {
  FacebookDealerVehicleStatusDTO,
  FacebookPostRequestBulkRequestDTO,
  FacebookPostRequestBulkResponseDTO,
} from "@/types/facebook";
import axios from "axios";

export function useGetDealerFacebookVehicles(enabled: boolean = true) {
  return useQuery<FacebookDealerVehicleStatusDTO[], Error>({
    queryKey: ["dealerFacebookVehicles"],
    queryFn: async () => {
      try {
        const { data: body } = await apiClient.get(
          "/api/dealer/facebook-post-requests/vehicles"
        );
        const data = body?.data !== undefined ? body.data : body;
        return Array.isArray(data) ? data : [];
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw new Error(err.response?.data?.message || "Failed to fetch Facebook vehicles");
        }
        throw err;
      }
    },
    enabled,
  });
}

export function useSubmitBulkFacebookPost() {
  const queryClient = useQueryClient();

  return useMutation<
    FacebookPostRequestBulkResponseDTO,
    Error,
    FacebookPostRequestBulkRequestDTO
  >({
    mutationFn: async (payload) => {
      try {
        const { data: body } = await apiClient.post(
          "/api/dealer/facebook-post-requests/bulk",
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
      queryClient.invalidateQueries({ queryKey: ["dealerFacebookVehicles"] });
    },
  });
}
