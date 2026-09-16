import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export interface FestivalOfferData {
  id: number;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO";
  expiresAt: string;
  enabled: boolean;
  createdAt: string;
}

export interface FestivalOfferResponse {
  status: number;
  message: string;
  data: FestivalOfferData | null;
}

export function useAdminFestivalOffer() {
  return useQuery<FestivalOfferData | null>({
    queryKey: ["admin-festival-offer"],
    queryFn: async () => {
      const { data } = await apiClient.get<FestivalOfferResponse>("/api/admin/festival-offer");
      if (data && typeof data === "object" && "data" in data) {
        return data.data;
      }
      return data as unknown as FestivalOfferData;
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export interface UploadFestivalOfferParams {
  file: File;
  expiresAt: string; // ISO 8601 string "YYYY-MM-DDTHH:mm:ss"
}

export function useUploadFestivalOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, expiresAt }: UploadFestivalOfferParams) => {
      const formData = new FormData();
      // Provide file and media keys for backend compatibility
      formData.append("file", file);
      formData.append("media", file);
      formData.append("expiresAt", expiresAt);

      const { data } = await apiClient.post<FestivalOfferResponse>(
        "/api/admin/festival-offer/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-festival-offer"] });
      queryClient.invalidateQueries({ queryKey: ["festival-offer"] });
      queryClient.invalidateQueries({ queryKey: ["public-festival-offer"] });
    },
  });
}

export function useDisableFestivalOffer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await apiClient.put<{ status: number; message: string }>(
        `/api/admin/festival-offer/${id}/disable`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-festival-offer"] });
      queryClient.invalidateQueries({ queryKey: ["festival-offer"] });
      queryClient.invalidateQueries({ queryKey: ["public-festival-offer"] });
    },
  });
}
