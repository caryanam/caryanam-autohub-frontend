import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export interface VehicleShareResponseDTO {
  id?: number;
  vehicleId: number;
  dealerId: number;
  sharedAt?: string;
  whatsappLink?: string;
  shareUrl?: string;
  shareType?: string;
  status?: string;
}

export interface ShareVehicleRequest {
  dealerId: string;
  shareToSelf: boolean;
  customerWhatsapp?: string;
}

export function useShareVehicleOnWhatsApp() {
  return useMutation<
    VehicleShareResponseDTO[],
    Error,
    { vehicleId: number; payload: ShareVehicleRequest }
  >({
    mutationFn: async ({ vehicleId, payload }) => {
      const response = await apiClient.post(
        `/api/dealer/vehicles/${vehicleId}/share-on-whatsapp`,
        payload
      );
      return response.data?.data || response.data;
    },
  });
}

