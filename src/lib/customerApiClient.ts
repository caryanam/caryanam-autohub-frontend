import axios from "axios";

/**
 * Shared Axios instance for Customer API calls.
 * Automatically injects the customerToken from localStorage on every request.
 */
const customerApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
});

// Request interceptor — attach customer auth token if present
customerApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("customerToken") ?? "";
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle customer token expiration
customerApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.dispatchEvent(new CustomEvent("customer-session-expired"));
    }
    return Promise.reject(error);
  },
);

export default customerApiClient;
