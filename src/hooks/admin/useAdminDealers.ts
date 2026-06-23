import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export interface AdminDealer {
  id: number;
  businessName: string;
  ownerName: string;
  gstNumber?: string | null;
  yearsInBusiness?: number | null;
  mobile: string;
  whatsapp?: string | null;
  email: string;
  password?: string | null;
  address?: string | null;
  city: string;
  state: string;
  pinCode?: string | null;
  dealerLogo: string;
  showroomImage?: string | null;
  dealerAccountStatus: string;
  createdAt: string;
}

export function useAdminDealers() {
  return useQuery<AdminDealer[]>({
    queryKey: ["admin-dealers"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/admin/all-dealers");
      return Array.isArray(data) ? data : (data?.data ?? []);
    },
  });
}

export function useUpdateDealerStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      dealerId,
      status,
    }: {
      dealerId: number;
      status: string;
    }) => {
      const { data } = await apiClient.put(
        `/api/admin/dealer-status/${dealerId}`,
        { status },
      );
      return data; // { status, message, data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dealers"] });
    },
  });
}
