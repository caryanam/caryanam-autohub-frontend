import * as React from "react";
import axios from "axios";
import apiClient from "@/lib/apiClient";

type DealerRegistrationPayload = {
  businessName: string;
  ownerName: string;
  dateOfBirth?: string;
  gstNumber: string;
  yearsInBusiness: number;
  dealerMobile: string;
  executiveMobile?: string;
  whatsapp: string;
  email?: string;
  password: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
};

/** Structured error thrown when the API returns a non-2xx response */
export class ApiError extends Error {
  status: number;
  /** Field-level validation errors from the 400 response */
  fieldErrors?: Record<string, string>;

  constructor(
    message: string,
    status: number,
    fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

export function useRegister() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const registerDealer = React.useCallback(
    async (
      payload: DealerRegistrationPayload,
      showroomImage?: File | null,
      dealerLogo?: File | null,
    ) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append(
          "dealer",
          new Blob([JSON.stringify(payload)], { type: "application/json" }),
        );
        if (showroomImage) {
          formData.append("showroomImage", showroomImage);
        }
        if (dealerLogo) {
          formData.append("dealerLogo", dealerLogo);
        }

        const { data: body } = await apiClient.post(
          "/api/dealer/register",
          formData,
        );
        return body;
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const body = err.response?.data;
          throw new ApiError(
            body?.message ?? err.message,
            body?.status ?? err.response?.status ?? 500,
            body?.errors,
          );
        }
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return { isSubmitting, registerDealer };
}

export function useSendRegistrationOtp() {
  const [isSending, setIsSending] = React.useState(false);

  const sendOtp = React.useCallback(async (email: string) => {
    setIsSending(true);
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL as string;
      const { data } = await axios.post(`${baseURL}/api/dealer/send-registration-otp?email=${encodeURIComponent(email)}`);
      return data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const body = err.response?.data;
        throw new ApiError(
          body?.message ?? err.message,
          body?.status ?? err.response?.status ?? 500,
          body?.errors,
        );
      }
      throw err;
    } finally {
      setIsSending(false);
    }
  }, []);

  return { isSending, sendOtp };
}

export function useVerifyRegistrationOtp() {
  const [isVerifying, setIsVerifying] = React.useState(false);

  const verifyOtp = React.useCallback(async (email: string, otp: string) => {
    setIsVerifying(true);
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL as string;
      const { data } = await axios.post(`${baseURL}/api/dealer/verify-registration-otp`, { email, otp });
      return data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const body = err.response?.data;
        throw new ApiError(
          body?.message ?? err.message,
          body?.status ?? err.response?.status ?? 500,
          body?.errors,
        );
      }
      throw err;
    } finally {
      setIsVerifying(false);
    }
  }, []);

  return { isVerifying, verifyOtp };
}
