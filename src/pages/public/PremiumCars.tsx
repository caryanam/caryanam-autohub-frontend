import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthModal } from "@/components/shared/AuthModal";
import {
  useCustomer,
  getStoredCustomer,
  type CustomerUser,
} from "@/hooks/public/useCustomerAuth";
import { AlertCircle, RefreshCw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  VehicleCard,
  VehicleCardSkeleton,
} from "@/components/cards/VehicleCard";
import { SEO } from "@/components/shared/SEO";
import { usePremiumVehicles } from "@/hooks/public/usePremiumVehicles";
import type { Vehicle } from "@/types";

const PAGE_SIZE = 9;

export default function PremiumCars() {
  const [params] = useSearchParams();
  const [page, setPage] = useState(1);

  const {
    vehicles = [],
    totalPages,
    totalElements,
    loading,
    error,
    refetch,
    isRefetching,
  } = usePremiumVehicles(page - 1, PAGE_SIZE);

  const customer = useCustomer();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <SEO
        title="Premium Cars Collection — CAPL"
        description="Explore our exclusive, hand-picked collection of premium luxury cars. Certified and verified with direct dealer contact."
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm uppercase tracking-wider">
              <Star className="h-4 w-4 fill-current" /> Exclusive Collection
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-black mt-1">
              Premium Luxury Cars
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              {loading
                ? "Loading luxury collection…"
                : `${totalElements} elite vehicles available`}
            </p>
          </div>
        </div>

        <div className="min-h-[500px]">
          {error && (
            <div className="flex flex-col items-center justify-center py-16 bg-card rounded-2xl border border-destructive/30 text-center gap-4">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <div>
                <h3 className="font-bold text-lg">Failed to load premium vehicles</h3>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
              <Button
                onClick={() => refetch()}
                disabled={isRefetching}
                className="gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}
                />{" "}
                Retry
              </Button>
            </div>
          )}

          {!error && loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <VehicleCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!error && !loading && vehicles.length === 0 && (
            <div className="text-center py-20 bg-card rounded-2xl border border-border">
              <h3 className="font-display font-bold text-lg">
                No premium vehicles found
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Please check back later as our inventory updates frequently.
              </p>
            </div>
          )}

          {!error && !loading && vehicles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {vehicles.map((v) => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  isLoggedIn={!!customer}
                  onWishlistRequireLogin={() => setAuthOpen(true)}
                />
              ))}
            </div>
          )}
        </div>

        {!error && !loading && vehicles.length > 0 && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2 pt-4 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground px-3">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={(u) => {}}
      />
    </>
  );
}
