import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const API_BASE_URL =
import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";
export function useAreas() {
  return useQuery<string[]>({
    queryKey: ["all-areas"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE_URL}/api/pincode/all-areas`);
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 10,
  });
}
