import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { VehicleQrData } from "@/types";
import apiClient from "@/lib/apiClient";

type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export class VehicleQrError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "VehicleQrError";
    this.status = status;
  }
}

export function useGetVehicleQr(vehicleId?: number | null) {
  return useQuery<VehicleQrData, Error>({
    queryKey: ["vehicle-qr", vehicleId],
    queryFn: async () => {
      if (!vehicleId) throw new Error("No vehicle ID provided");
      try {
        const { data: body } = await apiClient.get<ApiResponse<VehicleQrData>>(
          `/api/vehicle/qr/${vehicleId}`,
        );
        return body?.data !== undefined ? body.data : (body as unknown as VehicleQrData);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const body = err.response?.data;
          throw new VehicleQrError(
            body?.message ?? "Failed to fetch vehicle QR code",
            body?.status ?? err.response?.status ?? 500,
          );
        }
        throw err;
      }
    },
    enabled: !!vehicleId,
  });
}
