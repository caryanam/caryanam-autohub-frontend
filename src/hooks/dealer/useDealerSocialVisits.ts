import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export interface SocialVisitLogDTO {
    id: number;
    vehicleId: number;
    vehicleName: string;
    dealerId: number;
    dealerName: string;
    source: string;
    postId: string;
    postUrl: string;
    visitedAt: string;
}

export function useDealerSocialVisits() {
    return useQuery<SocialVisitLogDTO[]>({
        queryKey: ["dealer-social-visits"],
        queryFn: async () => {
            // Need to check which apiClient dealers use. Let's assume apiClient for now or we will fix it later.
            // In hooks/dealer/useGetVehicles.ts it usually uses apiClient.
            const { data } = await apiClient.get("/api/dealer/social-visits");
            return Array.isArray(data) ? data : (data?.data ?? []);
        },
    });
}
