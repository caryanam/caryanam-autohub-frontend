import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

export class UpdateProfileError extends Error {
  fieldErrors?: Record<string, string>;
  constructor(message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.fieldErrors = fieldErrors;
  }
}

export interface UpdateProfilePayload {
  businessName: string;
  dateOfBirth?: string;
  executiveMobile?: string | null;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  ownerName?: string;
  dealerLogo?: string;
  showroomImage?: string;
  email?: string;
}

export function useUpdateDealerProfile(dealerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ payload, showroomImage, dealerLogo }: { payload: UpdateProfilePayload, showroomImage?: File | null, dealerLogo?: File | null }) => {
      try {
        const formData = new FormData();
        formData.append("request", JSON.stringify(payload));
        if (showroomImage) {
          formData.append("showroomImage", showroomImage);
        }
        if (dealerLogo) {
          formData.append("dealerLogo", dealerLogo);
        }

        const { data: body } = await apiClient.put(
          `/api/dealer/update-profile/${dealerId}`,
          formData,
        );
        return body.data;
      } catch (err: any) {
        const body = err?.response?.data;
        throw new UpdateProfileError(
          body?.message || "Failed to update profile",
          body?.errors
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dealer-profile", dealerId] });
    },
  });
}
