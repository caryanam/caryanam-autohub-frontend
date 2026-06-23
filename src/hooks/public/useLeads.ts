import { useCallback, useState } from "react";
import axios from "axios";
import apiClient from "@/lib/customerApiClient";

type LeadPayload = {
  customerName: string;
  customerMobile: string;
  customerCity: string;
};

const getHeaders = () => {
  const token = localStorage.getItem("customerToken");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

export function useGenerateLead() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateLead = useCallback(
    async (vehicleId: number, payload: LeadPayload) => {
      setIsSubmitting(true);
      try {
        await apiClient.post(
          `/api/lead/generate-lead/${vehicleId}`,
          payload,
          { headers: getHeaders() }
        );
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const body = err.response?.data;
          throw new Error(body?.message ?? "Failed to submit lead");
        }
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return { isSubmitting, generateLead };
}

const trackedViews = new Set<number>();

export function useGenerateView() {
  const generateView = useCallback(async (vehicleId: number) => {
    if (trackedViews.has(vehicleId)) return;
    trackedViews.add(vehicleId);
    try {
      await apiClient.get(
        `/api/lead/generate-view/${vehicleId}`,
        { headers: getHeaders() }
      );
    } catch {
      // Remove on failure so we can try again
      trackedViews.delete(vehicleId);
    }
  }, []);

  return { generateView };
}
