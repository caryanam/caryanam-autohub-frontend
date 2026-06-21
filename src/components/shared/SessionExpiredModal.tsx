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

export function SessionExpiredModal() {
  const [open, setOpen] = useState(false);
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
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        try {
          await logoutAdmin();
        } catch {
          // ignore
        }
      } else {
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

    window.addEventListener("auth-session-expired", handleExpired);
    return () => {
      window.removeEventListener("auth-session-expired", handleExpired);
    };
  }, [open, logoutAdmin, logoutDealer]);

  const handleConfirm = () => {
    setOpen(false);
    window.location.href = "/auth/login";
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-slate-900">
            Session Expired
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-600 mt-2">
            Your session has expired. Please login again to continue.
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
