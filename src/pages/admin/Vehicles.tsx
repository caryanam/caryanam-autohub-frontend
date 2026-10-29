import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  RefreshCw,
  Search,
  Facebook,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useAdminAllVehicles } from "@/hooks/admin/useAdminAllVehicles";
import { formatINR, formatKM } from "@/utils/helpers";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=533&fit=crop";

function StatusBadge({ status }: { status: string }) {
  const s = status?.toUpperCase();
  if (s === "ACTIVE")
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 text-xs font-bold rounded-full px-3">
        Active
      </Badge>
    );
  if (s === "INACTIVE")
    return (
      <Badge className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold hover:bg-red-50 hover:text-red-800 rounded-full px-3">
        Inactive
      </Badge>
    );
  if (s === "FEATURED")
    return (
      <Badge className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs hover:bg-yellow-50 hover:text-yellow-800 font-bold rounded-full px-3">
        Featured
      </Badge>
    );
  return (
    <Badge variant="secondary" className="text-xs font-bold rounded-full px-3">
      {status}
    </Badge>
  );
}

function shareVehicleToFacebook(vehicleId: string | number) {
  const vehicleUrl = `https://caryanam.com/vehicle/${vehicleId}`;
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(vehicleUrl)}`;
  window.open(shareUrl, "_blank", "width=720,height=650");
}

export default function AdminVehicles() {
  const [search, setSearch] = useState("");
  const [certFilter, setCertFilter] = useState("ALL");
  const { vehicles, loading, error, refetch } = useAdminAllVehicles();

  const filtered = vehicles.filter((v) => {
    // Certification status filter
    if (certFilter === "VERIFIED" && !v.isCertified) return false;
    if (
      certFilter === "PENDING" &&
      (!v.certifyRequested || v.isCertified || v.inspectionStatus !== "PENDING")
    )
      return false;
    if (certFilter === "NOT_CERTIFIED" && v.isCertified) return false;

    // Search filter
    const q = search.toLowerCase();
    return (
      `${v.brand} ${v.model} ${v.variant}`.toLowerCase().includes(q) ||
      v.city?.toLowerCase().includes(q) ||
      v.fuelType?.toLowerCase().includes(q) ||
      v.vehicleType?.toLowerCase().includes(q)
    );
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <div>
          <p className="font-semibold">Failed to load vehicles</p>
          <p className="text-sm text-muted-foreground mt-1">{error}</p>
        </div>
        <Button onClick={() => refetch()} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Vehicles Inventory
          </h2>
          <p className="text-base text-slate-500 mt-1">
            {filtered.length} vehicles listed • Monitor verified vs unverified status
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Certification Filter */}
          <Select value={certFilter} onValueChange={setCertFilter}>
            <SelectTrigger className="w-44 h-10 rounded-xl text-xs bg-white border-slate-200">
              <SelectValue placeholder="Verification Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Verification</SelectItem>
              <SelectItem value="VERIFIED">Verified (Certified)</SelectItem>
              <SelectItem value="PENDING">Pending Verify</SelectItem>
              <SelectItem value="NOT_CERTIFIED">Not Certified</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative flex-1 sm:w-[260px] sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search brand, model, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            className="h-10 w-10 rounded-xl"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[1000px]">
            <TableHeader className="bg-black border-b border-black">
              <TableRow className="bg-black hover:bg-black border-none">
                <TableHead className="w-14 text-center text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Sr No
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pl-4">
                  Vehicle
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Price
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  KM / Fuel
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  City
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Listing Status
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Certification
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pr-6">
                  Year
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pr-6 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow
                    key={`skeleton-${idx}`}
                    className="border-b border-slate-100/80 last:border-none"
                  >
                    <TableCell className="w-14 text-center py-4">
                      <Skeleton className="h-4 w-4 mx-auto" />
                    </TableCell>
                    <TableCell className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-14 rounded shrink-0" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-32 rounded" />
                          <Skeleton className="h-3 w-20 rounded" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-20 rounded" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-28 rounded" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-16 rounded" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-7 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-7 w-24 rounded-full" />
                    </TableCell>
                    <TableCell className="py-4 pr-6">
                      <Skeleton className="h-4 w-12 rounded" />
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      <Skeleton className="h-8 w-24 rounded ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-12 text-muted-foreground font-medium"
                  >
                    {search || certFilter !== "ALL"
                      ? "No matching vehicles found."
                      : "No vehicles found."}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((v, idx) => (
                  <TableRow
                    key={v.id}
                    className="hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-none"
                  >
                    <TableCell className="text-center text-slate-400 text-sm font-medium py-4">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="py-4 pl-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            v.images && v.images.length > 0
                              ? v.images[0]
                              : FALLBACK_IMG
                          }
                          className="h-10 w-14 object-cover rounded shrink-0"
                          alt=""
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              FALLBACK_IMG;
                          }}
                        />
                        <div className="min-w-0 max-w-[260px]">
                          <div className="font-semibold text-slate-900 text-sm flex items-center gap-2">
                            <span
                              className="truncate block"
                              title={`${v.brand} ${v.model} ${v.variant}`}
                            >
                              {v.brand} {v.model} {v.variant}
                            </span>
                            {v.vehicleType && (
                              <Badge
                                className={`${
                                  v.vehicleType === "PREMIUM"
                                    ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                                } border-0 text-[10px] px-1.5 py-0.5 font-bold rounded shrink-0`}
                              >
                                {v.vehicleType}
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            {v.dealerBusinessName || v.dealerContactName || "—"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-800 text-sm py-4">
                      {formatINR(v.askingPrice)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 py-4">
                      {formatKM(v.kilometerDriven)} · {v.fuelType}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 py-4">
                      {v.city}
                    </TableCell>
                    <TableCell className="py-4">
                      <StatusBadge status={v.vehicleStatus} />
                    </TableCell>
                    <TableCell className="py-4">
                      {v.isCertified ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full px-2.5 py-1">
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </span>
                      ) : v.certifyRequested || v.inspectionStatus === "PENDING" ? (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full px-2.5 py-1">
                          <Clock className="h-3 w-3" /> Pending Verify
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full px-2.5 py-1">
                          Not Certified
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-slate-400 py-4 pr-6">
                      {v.registrationYear}
                    </TableCell>
                    <TableCell className="py-4 pr-6 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-[#1877F2] border-[#1877F2]/30 hover:bg-[#1877F2]/10"
                        onClick={() => shareVehicleToFacebook(v.id)}
                      >
                        <Facebook className="h-4 w-4" />
                        <span className="hidden lg:inline">Share</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
