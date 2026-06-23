import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useDealerAuth } from "@/contexts/DealerAuthContext";
import { clearCustomer } from "@/hooks/public/useCustomerAuth";

export function SessionExpiredModal() {
  const [open, setOpen] = useState(false);
  const [expiredUserType, setExpiredUserType] = useState<"admin" | "dealer" | "customer" | null>(null);
  const { logout: logoutAdmin } = useAdminAuth();
  const { logout: logoutDealer } = useDealerAuth();

  useEffect(() => {
    const handleExpired = async (e: Event) => {
      const customEvent = e as CustomEvent<{ role: string }>;
      const role = customEvent.detail?.role;

      // Prevent duplicate modal triggers
      if (open) return;

      // Clear local storage and state for the expired session
      if (role === "admin") {
        setExpiredUserType("admin");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        try {
          await logoutAdmin();
        } catch {
          // ignore
        }
      } else {
        setExpiredUserType("dealer");
        localStorage.removeItem("dealerToken");
        localStorage.removeItem("dealerData");
        try {
          await logoutDealer();
        } catch {
          // ignore
        }
      }

      setOpen(true);
    };

    const handleCustomerExpired = () => {
      if (open) return;
      setExpiredUserType("customer");
      clearCustomer();
      setOpen(true);
    };

    window.addEventListener("auth-session-expired", handleExpired);
    window.addEventListener("customer-session-expired", handleCustomerExpired);
    return () => {
      window.removeEventListener("auth-session-expired", handleExpired);
      window.removeEventListener("customer-session-expired", handleCustomerExpired);
    };
  }, [open, logoutAdmin, logoutDealer]);

  const handleConfirm = () => {
    setOpen(false);
    if (expiredUserType === "customer") {
      window.location.href = "/";
    } else {
      window.location.href = "/auth/login";
    }
  };

  const getModalDescription = () => {
    if (expiredUserType === "customer") {
      return "Your customer session has expired. Please login again to continue.";
    }
    return "Your session has expired. Please login again to continue.";
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-slate-900">
            Session Expired
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-600 mt-2">
            {getModalDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-6">
          <AlertDialogAction
            onClick={handleConfirm}
            className="w-full sm:w-auto gradient-primary text-white border-0"
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
