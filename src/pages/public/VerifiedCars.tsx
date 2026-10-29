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
  Car,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { VehicleCard, VehicleCardSkeleton } from "@/components/cards/VehicleCard";
import { SEO } from "@/components/shared/SEO";
import { useVerifiedCars } from "@/hooks/public/useVerifiedCars";
import { getCustomerBrands, getCustomerModels, getCustomerVariants } from "@/data/customerCarDatabase";
import { SearchableSelect } from "@/components/shared/SearchableSelect";
import { BUDGET_BANDS } from "@/utils/constants";
import { formatINR } from "@/utils/helpers";
import type { Vehicle } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { useAreas } from "@/hooks/public/useAreas";

const PAGE = 9;

export default function VerifiedCars() {
  const [params, setParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const { vehicles: all, loading, error, refetch, isRefetching } = useVerifiedCars();
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
  const brand = get("brand");
  const model = get("model");
  const variant = get("variant");
  const fuel = get("fuel");
  const minPrice = params.get("minPrice") ? Number(params.get("minPrice")) : 0;
  const maxPrice = params.get("maxPrice") ? Number(params.get("maxPrice")) : 5000000;
  const sort = get("sort") || "featured";
  const area = get("area");

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [selectedBudget, setSelectedBudget] = useState<string>("");

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const { data: dynamicAreas = [] } = useAreas();
  const customerBrands = getCustomerBrands();
  const customerModels = brand ? getCustomerModels(brand) : [];
  const customerVariants = brand && model ? getCustomerVariants(brand, model) : [];

  const handleBrandChange = (val: string) => {
    const next = new URLSearchParams(params);
    if (val && val !== "all") {
      next.set("brand", val);
    } else {
      next.delete("brand");
    }
    next.delete("model");
    next.delete("variant");
    setParams(next);
  };

  const handleModelChange = (val: string) => {
    const next = new URLSearchParams(params);
    if (val && val !== "all") {
      next.set("model", val);
    } else {
      next.delete("model");
    }
    next.delete("variant");
    setParams(next);
  };

  const handlePriceCommit = (values: [number, number]) => {
    const next = new URLSearchParams(params);
    next.set("minPrice", String(values[0]));
    next.set("maxPrice", String(values[1]));
    setSelectedBudget("");
    setParams(next);
  };

  const handleBudgetBand = (bandLabel: string, min: number, max: number) => {
    setSelectedBudget(bandLabel);
    setPriceRange([min, max]);
    const next = new URLSearchParams(params);
    next.set("minPrice", String(min));
    next.set("maxPrice", String(max));
    setParams(next);
  };

  const clearAllFilters = () => {
    setParams(new URLSearchParams());
    setPriceRange([0, 5000000]);
    setSelectedBudget("");
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
      if (brand && car.brand.toLowerCase() !== brand.toLowerCase()) return false;
      if (model && car.model.toLowerCase() !== model.toLowerCase()) return false;
      if (variant && car.variant.toLowerCase() !== variant.toLowerCase()) return false;
      if (fuel && car.fuelType.toUpperCase() !== fuel.toUpperCase()) return false;
      if (car.askingPrice < priceRange[0] || car.askingPrice > priceRange[1]) return false;
      if (area && !car.city?.toLowerCase().includes(area.toLowerCase())) return false;
      return true;
    });
  }, [all, search, brand, model, variant, fuel, priceRange, area]);

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
        title="Verified & Certified Cars | Caryanam AutoHub"
        description="Browse certified second hand vehicles verified by authorized area inspectors. 100% quality checked and certified."
      />

      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/30 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-900/20 mb-4">
              <ShieldCheck className="h-4 w-4" /> 100% Physically Certified
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-3">
              Caryanam Verified Vehicles
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
              Every vehicle listed here has been physically inspected by our certified area inspectors for engine health, non-accidental chassis, electricals, and authentic documents.
            </p>
          </div>
        </div>

        {/* Filters & Results Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Top Search & Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex-1 max-w-md relative">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
              <Input
                placeholder="Search verified cars..."
                value={search}
                onChange={(e) => set("q", e.target.value)}
                className="pl-10 h-11 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500">
                {sorted.length} Verified {sorted.length === 1 ? "Car" : "Cars"}
              </span>

              <Select value={sort} onValueChange={(val) => set("sort", val)}>
                <SelectTrigger className="w-44 h-11 rounded-2xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs font-medium">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="featured">Featured First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="year-desc">Year: Newest First</SelectItem>
                  <SelectItem value="km-asc">KM: Lowest First</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="h-11 rounded-2xl text-xs flex items-center gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" /> Reset
              </Button>
            </div>
          </div>

          {/* Grid of Vehicles */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <VehicleCardSkeleton key={i} />
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <div className="h-16 w-16 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 mb-4 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                No Verified Vehicles Found
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                No certified vehicles matched your current filters. Try resetting the filters or check back soon as our inspectors verify new submissions daily.
              </p>
              <Button onClick={clearAllFilters} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl">
                View All Verified Cars
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button
                variant="outline"
                size="icon"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-xl"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs font-semibold px-4 text-slate-600 dark:text-slate-400">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-xl"
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

