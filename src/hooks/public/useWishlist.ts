import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import apiClient from "@/lib/customerApiClient";
import { useCustomer } from "./useCustomerAuth";
import type { Vehicle } from "@/types";

function extractApiMessage(responseOrError: any, fallbackMessage: string): string {
  if (!responseOrError) return fallbackMessage;

  let data = responseOrError;
  if (axios.isAxiosError(responseOrError)) {
    data = responseOrError.response?.data;
  }

  if (!data) {
    if (responseOrError instanceof Error) {
      return responseOrError.message || fallbackMessage;
    }
    return fallbackMessage;
  }

  if (typeof data === "string") {
    return data.trim();
  }

  if (typeof data === "object") {
    if (data.message && typeof data.message === "string") {
      return data.message.trim();
    }
    if (data.data && typeof data.data === "string") {
      return data.data.trim();
    }
    if (data.data && typeof data.data === "object" && data.data.message && typeof data.data.message === "string") {
      return data.data.message.trim();
    }
    if (data.error && typeof data.error === "string") {
      return data.error.trim();
    }
  }

  return fallbackMessage;
}

export function useWishlist() {
  const queryClient = useQueryClient();
  const customer = useCustomer();
  const decoded = customer?.decoded || {};
  const resolvedId = decoded.id || decoded.customerId || decoded.userId || decoded.sub;
  const customerId = resolvedId ? String(resolvedId) : null;

  const getHeaders = () => {
    const token = localStorage.getItem("customerToken");
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  };

  // 1. Fetch wishlist from backend
  const { data: wishlistVehicles = [], isLoading, error, refetch } = useQuery<Vehicle[]>({
    queryKey: ["wishlist", customerId],
    queryFn: async () => {
      if (!customerId) return [];
      try {
        const { data: body } = await apiClient.get(
          `/api/wishlist/customer/${customerId}`,
          { headers: getHeaders() }
        );
        // Support both direct list of vehicles and wrapping items
        const rawItems = Array.isArray(body) ? body : (body?.data ?? []);
        return rawItems
          .map((item: any) => {
            if (item && item.brand && item.model) return item;
            if (item && item.vehicle) return item.vehicle;
            // Support backend wishlist response: { vehicleId, vehicleName, brand, flag, vehicleImage, price, addedAt }
            if (item && item.vehicleId) {
              return {
                id: item.vehicleId,
                vehicleId: String(item.vehicleId),
                brand: item.brand || "",
                model: item.vehicleName || "",
                askingPrice: item.price || 0,
                images: item.vehicleImage ? [item.vehicleImage] : [],
                variant: "",
                registrationYear: item.addedAt ? new Date(item.addedAt).getFullYear() : new Date().getFullYear(),
                kilometerDriven: 0,
                fuelType: "",
                transmission: "Manual",
                ownershipDetails: "",
                insuranceStatus: "",
                city: "",
                vehicleDescription: "",
                vehicleStatus: "",
                createdAt: item.addedAt || "",
              } as Vehicle;
            }
            return null;
          })
          .filter(Boolean) as Vehicle[];
      } catch (err) {
        console.error("Failed to fetch wishlist", err);
        return [];
      }
    },
    enabled: !!customerId,
  });

  // Helper to extract wishlist vehicle IDs
  const wishlistIds = wishlistVehicles.map((v) => v.id);

  // 2. Add to wishlist mutation
  const addMutation = useMutation<string, Error, number>({
    mutationFn: async (vehicleId) => {
      if (!customerId) throw new Error("User must be logged in");
      const headers = getHeaders();
      // Try POST first, fallback to GET if the API requires GET
      try {
        const { data: body } = await apiClient.post(
          `/api/wishlist/add-wishlist/${customerId}/${vehicleId}`,
          {},
          { headers }
        );
        return extractApiMessage(body, "Vehicle added to wishlist successfully");
      } catch (err: any) {
        const isMethodNotAllowed = err.response?.status === 405;
        if (isMethodNotAllowed) {
          try {
            const { data: body } = await apiClient.get(
              `/api/wishlist/add-wishlist/${customerId}/${vehicleId}`,
              { headers }
            );
            return extractApiMessage(body, "Vehicle added to wishlist successfully");
          } catch (innerErr: any) {
            throw new Error(extractApiMessage(innerErr, "Failed to add to wishlist"));
          }
        } else {
          throw new Error(extractApiMessage(err, "Failed to add to wishlist"));
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", customerId] });
    },
  });

  // 3. Remove from wishlist mutation
  const removeMutation = useMutation<string, Error, number>({
    mutationFn: async (vehicleId) => {
      if (!customerId) throw new Error("User must be logged in");
      const headers = getHeaders();
      // Try DELETE first, fallback to POST/GET if API uses them
      try {
        const { data: body } = await apiClient.delete(
          `/api/wishlist/customer/remove/${customerId}/${vehicleId}`,
          { headers }
        );
        return extractApiMessage(body, "Vehicle removed from wishlist successfully");
      } catch (err: any) {
        const isMethodNotAllowed = err.response?.status === 405;
        if (isMethodNotAllowed) {
          try {
            const { data: body } = await apiClient.post(
              `/api/wishlist/customer/remove/${customerId}/${vehicleId}`,
              {},
              { headers }
            );
            return extractApiMessage(body, "Vehicle removed from wishlist successfully");
          } catch (innerErr: any) {
            try {
              const { data: body } = await apiClient.get(
                `/api/wishlist/customer/remove/${customerId}/${vehicleId}`,
                { headers }
              );
              return extractApiMessage(body, "Vehicle removed from wishlist successfully");
            } catch (innermostErr: any) {
              throw new Error(extractApiMessage(innermostErr, "Failed to remove from wishlist"));
            }
          }
        } else {
          throw new Error(extractApiMessage(err, "Failed to remove from wishlist"));
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", customerId] });
    },
  });

  const toggleWishlist = async (vehicleId: number): Promise<string | undefined> => {
    if (!customerId) return;
    if (wishlistIds.includes(vehicleId)) {
      return await removeMutation.mutateAsync(vehicleId);
    } else {
      return await addMutation.mutateAsync(vehicleId);
    }
  };

  return {
    wishlist: wishlistVehicles,
    wishlistIds,
    loading: isLoading,
    error,
    refetch,
    toggleWishlist,
    isWishlisted: (vehicleId: number) => wishlistIds.includes(vehicleId),
  };
}
