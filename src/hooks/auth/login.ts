import * as React from "react";
import axios from "axios";
import apiClient from "@/lib/apiClient";

type LoginPayload = {
  username: string;
  password: string;
};

type LoginData = {
  token: string;
};

export class LoginError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "LoginError";
    this.status = status;
  }
}

/** Decode a JWT payload without any external library */
export function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return {};
  }
}

export function useLogin() {
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const login = React.useCallback(async (payload: LoginPayload) => {
    setIsLoggingIn(true);
    try {
      const { data: body } = await apiClient.post<{
        status: number;
        message: string;
        data: LoginData;
      }>("/api/auth/login", payload);

      const token = body?.data?.token;
      if (!token) {
        throw new LoginError(
          body?.message ?? "Login failed — no token received",
          body?.status ?? 401,
        );
      }

      const decoded = decodeJwtPayload(token);

      const rawRole = String(
        decoded.role ?? decoded.roles ?? decoded.authority ?? "",
      ).toUpperCase();

      const isAdmin =
        rawRole.includes("ADMIN") ||
        (Array.isArray(decoded.roles) &&
          (decoded.roles as string[]).some((r) =>
            r.toUpperCase().includes("ADMIN"),
          ));

      const isInspector =
        rawRole.includes("INSPECTOR") ||
        (Array.isArray(decoded.roles) &&
          (decoded.roles as string[]).some((r) =>
            r.toUpperCase().includes("INSPECTOR"),
          ));

      const isDealer =
        rawRole.includes("DEALER") ||
        (Array.isArray(decoded.roles) &&
          (decoded.roles as string[]).some((r) =>
            r.toUpperCase().includes("DEALER"),
          ));

      if (isAdmin) {
        localStorage.removeItem("dealerToken");
        localStorage.removeItem("dealerData");
        localStorage.removeItem("inspectorToken");
        localStorage.removeItem("inspectorData");
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminData", JSON.stringify(decoded));
        return { role: "admin" as const, token, data: decoded };
      } else if (isInspector) {
        localStorage.removeItem("dealerToken");
        localStorage.removeItem("dealerData");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        localStorage.setItem("inspectorToken", token);
        localStorage.setItem("inspectorData", JSON.stringify(decoded));
        return { role: "inspector" as const, token, data: decoded };
      } else if (isDealer) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        localStorage.removeItem("inspectorToken");
        localStorage.removeItem("inspectorData");
        localStorage.setItem("dealerToken", token);
        localStorage.setItem("dealerData", JSON.stringify(decoded));
        return { role: "dealer" as const, token, data: decoded };
      } else {
        throw new LoginError(
          "Access denied. Only authorized dealers, inspectors, and administrators can access this portal.",
          403,
        );
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const body = err.response?.data;
        throw new LoginError(
          body?.message ?? "Login failed",
          body?.status ?? err.response?.status ?? 500,
        );
      }
      throw err;
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  return { login, isLoggingIn };
}
