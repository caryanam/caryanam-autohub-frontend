import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import type {
  SocialVisitLogDTO,
  InstagramAdminDealerSummaryDTO,
  InstagramAdminVehicleRequestDTO,
  InstagramRejectRequestDTO,
  InstagramBulkApprovePublishRequestDTO,
  InstagramBulkApprovePublishResponseDTO,
  InstagramBatchStatusDTO,
  InstagramRetryFailedRequestDTO,
} from "@/types/social";
import axios from "axios";

export function useGetAdminInstagramDealerSummary() {
  return useQuery<InstagramAdminDealerSummaryDTO[], Error>({
    queryKey: ["adminInstagramDealerSummary"],
    queryFn: async () => {
      try {
        const { data: body } = await apiClient.get(
          "/api/admin/instagram-post-requests/dealer-summary"
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

export function useGetAdminInstagramDealerRequests(dealerId: number | null) {
  return useQuery<InstagramAdminVehicleRequestDTO[], Error>({
    queryKey: ["adminInstagramDealerRequests", dealerId],
    queryFn: async () => {
      if (!dealerId) return [];
      try {
        const { data: body } = await apiClient.get(
          `/api/admin/instagram-post-requests/dealer/${dealerId}`
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

export function useAdminRejectInstagramRequests(dealerId: number) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, InstagramRejectRequestDTO>({
    mutationFn: async (payload) => {
      try {
        await apiClient.post(
          "/api/admin/instagram-post-requests/reject",
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
      queryClient.invalidateQueries({ queryKey: ["adminInstagramDealerSummary"] });
      queryClient.invalidateQueries({ queryKey: ["adminInstagramDealerRequests", dealerId] });
    },
  });
}

export function useAdminBulkApproveInstagramPublish(dealerId: number) {
  const queryClient = useQueryClient();

  return useMutation<
    InstagramBulkApprovePublishResponseDTO,
    Error,
    InstagramBulkApprovePublishRequestDTO
  >({
    mutationFn: async (payload) => {
      try {
        const { data: body } = await apiClient.post(
          "/api/admin/instagram-post-requests/bulk-approve-publish",
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
      queryClient.invalidateQueries({ queryKey: ["adminInstagramDealerSummary"] });
      queryClient.invalidateQueries({ queryKey: ["adminInstagramDealerRequests", dealerId] });
    },
  });
}

export function useGetAdminInstagramBatchStatus(batchId: number | null) {
  return useQuery<InstagramBatchStatusDTO, Error>({
    queryKey: ["adminInstagramBatchStatus", batchId],
    queryFn: async () => {
      if (!batchId) throw new Error("No batch ID provided");
      try {
        const { data: body } = await apiClient.get(
          `/api/admin/instagram-post-requests/batch/${batchId}/status`
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
    refetchInterval: (query) => {
      const data = query.state.data;
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

export function useAdminRetryFailedInstagramPublish(batchId: number) {
  const queryClient = useQueryClient();

  return useMutation<
    InstagramBulkApprovePublishResponseDTO,
    Error,
    InstagramRetryFailedRequestDTO
  >({
    mutationFn: async (payload) => {
      try {
        const { data: body } = await apiClient.post(
          "/api/admin/instagram-post-requests/retry-failed",
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
      queryClient.invalidateQueries({ queryKey: ["adminInstagramBatchStatus", batchId] });
      queryClient.invalidateQueries({ queryKey: ["adminInstagramDealerSummary"] });
    },
  });
}
// ADMIN — all instagram visits across the entire platform
export function useGetAdminAllSocialVisits() {
  return useQuery<SocialVisitLogDTO[], Error>({
    queryKey: ["adminInstagramVisits"],
    queryFn: async () => {
      try {
        const { data: body } = await apiClient.get(
          "/api/admin/social-visits"
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

// ADMIN — visits for a specific vehicle
export function useGetAdminSocialVisitsByVehicle(vehicleId: number | null) {
  return useQuery<SocialVisitLogDTO[], Error>({
    queryKey: ["adminInstagramVisitsByVehicle", vehicleId],
    queryFn: async () => {
      if (!vehicleId) return [];
      try {
        const { data: body } = await apiClient.get(
          `/api/admin/social-visits/${vehicleId}`
        );
        const data = body?.data !== undefined ? body.data : body;
        return Array.isArray(data) ? data : [];
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw new Error(err.response?.data?.message || "Failed to fetch visits for vehicle");
        }
        throw err;
      }
    },
    enabled: !!vehicleId,
  });
}

// ADMIN — visits for a specific dealer
export function useGetAdminSocialVisitsByDealer(dealerId: number | null) {
  return useQuery<SocialVisitLogDTO[], Error>({
    queryKey: ["adminInstagramVisitsByDealer", dealerId],
    queryFn: async () => {
      if (!dealerId) return [];
      try {
        const { data: body } = await apiClient.get(
          `/api/admin/social-visits/dealer/${dealerId}`
        );
        const data = body?.data !== undefined ? body.data : body;
        return Array.isArray(data) ? data : [];
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw new Error(err.response?.data?.message || "Failed to fetch dealer Instagram visits");
        }
        throw err;
      }
    },
    enabled: !!dealerId,
  });
}

export type { InstagramRejectRequestDTO, InstagramBulkApprovePublishRequestDTO, InstagramRetryFailedRequestDTO };
