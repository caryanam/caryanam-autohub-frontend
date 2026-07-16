import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import type {
  FacebookAdminDealerSummaryDTO,
  FacebookAdminVehicleRequestDTO,
  FacebookRejectRequestDTO,
  FacebookBulkApprovePublishRequestDTO,
  FacebookBulkApprovePublishResponseDTO,
  FacebookBatchStatusDTO,
  FacebookRetryFailedRequestDTO,
} from "@/types/facebook";
import axios from "axios";

export function useGetAdminFacebookDealerSummary() {
  return useQuery<FacebookAdminDealerSummaryDTO[], Error>({
    queryKey: ["adminFacebookDealerSummary"],
    queryFn: async () => {
      try {
        const { data: body } = await apiClient.get(
          "/api/admin/facebook-post-requests/dealer-summary"
        );
        const data = body?.data !== undefined ? body.data : body;
        return Array.isArray(data) ? data : [];
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw new Error(err.response?.data?.message || "Failed to fetch dealer summaries");
        }
        throw err;
      }
    },
  });
}

export function useGetAdminFacebookDealerRequests(dealerId: number | null) {
  return useQuery<FacebookAdminVehicleRequestDTO[], Error>({
    queryKey: ["adminFacebookDealerRequests", dealerId],
    queryFn: async () => {
      if (!dealerId) return [];
      try {
        const { data: body } = await apiClient.get(
          `/api/admin/facebook-post-requests/dealer/${dealerId}`
        );
        const data = body?.data !== undefined ? body.data : body;
        return Array.isArray(data) ? data : [];
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw new Error(err.response?.data?.message || "Failed to fetch requests for dealer");
        }
        throw err;
      }
    },
    enabled: !!dealerId,
  });
}

export function useAdminRejectFacebookRequests(dealerId: number) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, FacebookRejectRequestDTO>({
    mutationFn: async (payload) => {
      try {
        await apiClient.post(
          "/api/admin/facebook-post-requests/reject",
          payload
        );
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw new Error(err.response?.data?.message || "Failed to reject requests");
        }
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFacebookDealerSummary"] });
      queryClient.invalidateQueries({ queryKey: ["adminFacebookDealerRequests", dealerId] });
    },
  });
}

export function useAdminBulkApproveFacebookPublish(dealerId: number) {
  const queryClient = useQueryClient();

  return useMutation<
    FacebookBulkApprovePublishResponseDTO,
    Error,
    FacebookBulkApprovePublishRequestDTO
  >({
    mutationFn: async (payload) => {
      try {
        const { data: body } = await apiClient.post(
          "/api/admin/facebook-post-requests/bulk-approve-publish",
          payload
        );
        return body?.data !== undefined ? body.data : body;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw new Error(err.response?.data?.message || "Failed to approve & publish batch");
        }
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFacebookDealerSummary"] });
      queryClient.invalidateQueries({ queryKey: ["adminFacebookDealerRequests", dealerId] });
    },
  });
}

export function useGetAdminFacebookBatchStatus(batchId: number | null) {
  return useQuery<FacebookBatchStatusDTO, Error>({
    queryKey: ["adminFacebookBatchStatus", batchId],
    queryFn: async () => {
      if (!batchId) throw new Error("No batch ID provided");
      try {
        const { data: body } = await apiClient.get(
          `/api/admin/facebook-post-requests/batch/${batchId}/status`
        );
        return body?.data !== undefined ? body.data : body;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw new Error(err.response?.data?.message || "Failed to fetch batch status");
        }
        throw err;
      }
    },
    enabled: !!batchId,
    refetchInterval: (data) => {
      if (!data) return 2000;
      const status = data.status;
      // Continue polling if batch is QUEUED or PROCESSING
      if (status === "QUEUED" || status === "PROCESSING") {
        return 2000;
      }
      return false; // Stop polling once completed/failed
    },
  });
}

export function useAdminRetryFailedFacebookPublish(batchId: number) {
  const queryClient = useQueryClient();

  return useMutation<
    FacebookBulkApprovePublishResponseDTO,
    Error,
    FacebookRetryFailedRequestDTO
  >({
    mutationFn: async (payload) => {
      try {
        const { data: body } = await apiClient.post(
          "/api/admin/facebook-post-requests/retry-failed",
          payload
        );
        return body?.data !== undefined ? body.data : body;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw new Error(err.response?.data?.message || "Failed to retry failed items");
        }
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminFacebookBatchStatus", batchId] });
      queryClient.invalidateQueries({ queryKey: ["adminFacebookDealerSummary"] });
    },
  });
}
export type { FacebookRejectRequestDTO, FacebookBulkApprovePublishRequestDTO, FacebookRetryFailedRequestDTO };
