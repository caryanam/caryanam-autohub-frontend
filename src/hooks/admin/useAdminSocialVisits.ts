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

export function useAdminSocialVisits() {
    return useQuery<SocialVisitLogDTO[]>({
        queryKey: ["admin-social-visits"],
        queryFn: async () => {
            const { data } = await apiClient.get("/api/admin/social-visits");
            return Array.isArray(data) ? data : (data?.data ?? []);
        },
    });
}
