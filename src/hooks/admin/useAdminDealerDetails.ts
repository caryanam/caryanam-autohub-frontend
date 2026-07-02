import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import type { Vehicle } from "@/types";

export interface DealerDashboardData {
  dealerName: string;
  featuredVehicles: number;
  totalLeads: number;
  totalVehicles: number;
  vehicleViews: number;
}

export interface DealerLeadData {
  id: number;
  uniqueLeadId: string;
  customerName: string;
  customerMobile: string;
  customerCity: string;
  enquiryDate: string;
  leadStatus: string;
  vehicleName: string;
  dealer: number;
}

export interface DealerDetailsResponse {
  dashboard: DealerDashboardData;
  leads: DealerLeadData[];
  vehicles: Vehicle[];
}

export function useAdminDealerDetails(dealerId: number) {
  return useQuery<DealerDetailsResponse>({
    queryKey: ["admin-dealer-details", dealerId],
    queryFn: async () => {
      const [dashRes, leadsRes, vehiclesRes] = await Promise.all([
        apiClient.get(`/api/dealer/dashboard/${dealerId}`),
        apiClient.get(`/api/lead/all-leads/${dealerId}`),
        apiClient.get(`/api/vehicle/dealer/${dealerId}`),
      ]);

      return {
        dashboard: dashRes.data,
        leads: Array.isArray(leadsRes.data) ? leadsRes.data : (leadsRes.data?.data ?? []),
        vehicles: Array.isArray(vehiclesRes.data) ? vehiclesRes.data : (vehiclesRes.data?.data ?? []),
      };
    },
    enabled: !!dealerId,
    staleTime: 5 * 60 * 1000, // Cache fresh for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetching on window focus
    retry: 1, // Only retry once if there is a network error
  });
}
