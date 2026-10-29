import { useMemo, useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { AuthModal } from "@/components/shared/AuthModal";
import { useCustomer } from "@/hooks/public/useCustomerAuth";
import {
  Filter as FilterIcon,
  Search,
  X,
  AlertCircle,
  RefreshCw,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Car,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VehicleCard, VehicleCardSkeleton } from "@/components/cards/VehicleCard";
import { SEO } from "@/components/shared/SEO";
import { useVerifiedPremiumCars } from "@/hooks/public/useVerifiedPremiumCars";
import { formatINR } from "@/utils/helpers";
import type { Vehicle } from "@/types";

const PAGE = 9;

export default function VerifiedPremiumCars() {
  const [params, setParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const { vehicles: all, loading, error, refetch } = useVerifiedPremiumCars();
  const customer = useCustomer();
  const [authOpen, setAuthOpen] = useState(false);

  const get = (k: string) => params.get(k) || "";
  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v && v !== "all") next.set(k, v);
    else next.delete(k);
    next.delete("page");
    setParams(next);
  };

  const search = get("q");
  const sort = get("sort") || "featured";

  const clearAllFilters = () => {
    setParams(new URLSearchParams());
    setPage(1);
  };

  const filtered = useMemo(() => {
    return all.filter((car) => {
      if (search) {
        const q = search.toLowerCase();
        const matchTitle = `${car.brand} ${car.model} ${car.variant}`.toLowerCase().includes(q);
        const matchCity = car.city?.toLowerCase().includes(q);
        if (!matchTitle && !matchCity) return false;
      }
      return true;
    });
  }, [all, search]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sort === "price-asc") list.sort((a, b) => a.askingPrice - b.askingPrice);
    else if (sort === "price-desc") list.sort((a, b) => b.askingPrice - a.askingPrice);
    else if (sort === "year-desc") list.sort((a, b) => b.registrationYear - a.registrationYear);
    else if (sort === "km-asc") list.sort((a, b) => a.kilometerDriven - b.kilometerDriven);
    return list;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE));
  const pagedCars = useMemo(() => {
    const start = (page - 1) * PAGE;
    return sorted.slice(start, start + PAGE);
  }, [sorted, page]);

  return (
    <>
      <SEO
        title="Verified Premium Luxury Cars | Caryanam AutoHub"
        description="Explore verified premium and luxury vehicles certified by certified inspectors. Highest pedigree, physical verification, and pristine quality."
      />

      <div className="min-h-screen bg-slate-950 text-white pb-24">
        {/* Luxury Banner */}
        <div className="relative bg-gradient-to-b from-black via-slate-900 to-slate-950 py-16 px-4 sm:px-6 lg:px-8 border-b border-amber-500/20 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.12),transparent_60%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-gradient-to-r from-amber-500/20 to-yellow-400/20 text-amber-300 border border-amber-500/40 shadow-xl mb-4">
              <Crown className="h-4 w-4 text-amber-400" />
              <span>Certified Luxury Pedigree</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
              Verified Premium Collection
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
              Luxury and premium marquee vehicles that have passed physical inspection and met our highest certification benchmarks.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex-1 max-w-md relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
              <Input
                placeholder="Search verified premium cars..."
                value={search}
                onChange={(e) => set("q", e.target.value)}
                className="pl-10 h-11 rounded-2xl bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">
                {sorted.length} Verified Premium {sorted.length === 1 ? "Car" : "Cars"}
              </span>

              <Select value={sort} onValueChange={(val) => set("sort", val)}>
                <SelectTrigger className="w-44 h-11 rounded-2xl bg-slate-900 border-slate-800 text-xs font-medium text-white">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="featured">Featured First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="year-desc">Year: Newest First</SelectItem>
                  <SelectItem value="km-asc">KM: Lowest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <VehicleCardSkeleton key={i} />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/60 rounded-3xl border border-slate-800 p-8">
              <Crown className="h-14 w-14 text-amber-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Verified Premium Vehicles Found</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                Currently, no premium vehicles have matching verified status. Check back soon as our luxury certifiers update the fleet.
              </p>
              <Button onClick={clearAllFilters} className="bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-2xl">
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pagedCars.map((vehicle, idx) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  index={idx}
                  isLoggedIn={Boolean(customer)}
                  onWishlistRequireLogin={() => setAuthOpen(true)}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-xl border-slate-800 bg-slate-900 text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs font-semibold px-4 text-slate-400">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-xl border-slate-800 bg-slate-900 text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} onSuccess={() => {}} />
    </>
  );
}

