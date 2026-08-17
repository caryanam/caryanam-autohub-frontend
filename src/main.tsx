import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import App from "./App";
import "./styles.css";

// Global response interceptor for direct axios calls
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || error.response.headers['Retry-After'];
      toast.error(`Too many requests. Please try again ${retryAfter ? `in ${retryAfter} seconds` : 'later'}.`);
    }
    return Promise.reject(error);
  },
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(

  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>

);
