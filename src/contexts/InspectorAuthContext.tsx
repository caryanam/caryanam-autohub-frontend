import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthUser } from "@/types";

interface InspectorAuthContextValue {
  user: AuthUser | null;
  setUserFromToken: (decoded: Record<string, unknown>) => void;
  logout: () => Promise<void>;
}

const InspectorAuthContext = createContext<InspectorAuthContextValue | null>(null);

function buildInspector(decoded: Record<string, unknown>): AuthUser {
  return {
    id: String(decoded.id ?? decoded.sub ?? ""),
    name: String(decoded.name ?? decoded.fullName ?? "Inspector"),
    email: String(decoded.email ?? decoded.sub ?? ""),
    mobile: String(decoded.mobileNumber ?? decoded.mobile ?? ""),
    assignedArea: String(decoded.city ?? decoded.assignedArea ?? ""),
    role: "inspector",
  };
}

function restoreInspector(): AuthUser | null {
  try {
    const raw = localStorage.getItem("inspectorData");
    if (raw) return buildInspector(JSON.parse(raw));
  } catch {
    /* ignore */
  }
  return null;
}

export function InspectorAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(restoreInspector);

  const setUserFromToken = useCallback((decoded: Record<string, unknown>) => {
    setUser(buildInspector(decoded));
  }, []);

  const logout = useCallback(async () => {
    const token = localStorage.getItem("inspectorToken") ?? "";
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL || "https://c1.caryanam.com"}/api/auth/logout`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch {
      /* ignore */
    }
    localStorage.removeItem("inspectorToken");
    localStorage.removeItem("inspectorData");
    setUser(null);
  }, []);

  return (
    <InspectorAuthContext.Provider value={{ user, setUserFromToken, logout }}>
      {children}
    </InspectorAuthContext.Provider>
  );
}

export function useInspectorAuth() {
  const ctx = useContext(InspectorAuthContext);
  if (!ctx) {
    throw new Error("useInspectorAuth must be used within an InspectorAuthProvider");
  }
  return ctx;
}

