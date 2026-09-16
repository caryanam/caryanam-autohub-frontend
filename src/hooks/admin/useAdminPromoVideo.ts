import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export interface PromoVideoData {
  id: number;
  videoUrl: string;
  active: boolean;
  createdAt: string;
}

export interface PromoVideoResponse {
  status: number;
  message: string;
  data: PromoVideoData | null;
}

export function useAdminPromoVideo() {
  return useQuery<PromoVideoData | null>({
    queryKey: ["admin-promo-video"],
    queryFn: async () => {
      const { data } = await apiClient.get<PromoVideoResponse>("/api/admin/offer-video");
      if (data && typeof data === "object" && "data" in data) {
        return data.data;
      }
      return data as unknown as PromoVideoData;
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useUploadPromoVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      // Provide video, file, and offerVideo keys for backend compatibility
      formData.append("video", file);
      formData.append("file", file);
      formData.append("offerVideo", file);

      const { data } = await apiClient.post<PromoVideoResponse>(
        "/api/admin/offer-video/upload",
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
      queryClient.invalidateQueries({ queryKey: ["admin-promo-video"] });
      queryClient.invalidateQueries({ queryKey: ["admin-offer-video"] });
      queryClient.invalidateQueries({ queryKey: ["offer-video"] });
      queryClient.invalidateQueries({ queryKey: ["public-offer-video"] });
    },
  });
}
