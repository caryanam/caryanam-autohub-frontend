import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useAreas() {
  return useQuery<string[]>({
    queryKey: ["all-areas"],
    queryFn: async () => {
      const { data } = await axios.get("http://localhost:8082/api/pincode/all-areas");
      return Array.isArray(data) ? data : [];
    },
    staleTime: 1000 * 60 * 10,
  });
}
