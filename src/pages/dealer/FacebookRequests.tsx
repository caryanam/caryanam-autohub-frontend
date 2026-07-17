import { useState } from "react";
import {
  Facebook,
  Search,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  useGetDealerFacebookVehicles,
  useSubmitBulkFacebookPost,
} from "@/hooks/dealer/useDealerFacebook";
import { formatINR } from "@/utils/helpers";
import type { FacebookDealerVehicleStatusDTO } from "@/types/facebook";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=533&fit=crop";

export default function DealerFacebookRequests() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const {
    data: vehicles = [],
    isLoading,
    isRefetching,
    refetch,
    error,
  } = useGetDealerFacebookVehicles();

  const submitMutation = useSubmitBulkFacebookPost();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectable = filteredVehicles
        .filter((v) => v.selectable)
        .map((v) => v.vehicleId);
      // Enforce the 10 max batch limit even on select all (select first 10)
      setSelectedIds(selectable.slice(0, 10));
      if (selectable.length > 10) {
        toast.info("Selected first 10 selectable vehicles (bulk limit).");
      }
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (vehicleId: number, checked: boolean) => {
    if (checked) {
      if (selectedIds.length >= 10) {
        toast.warning("You can request a maximum of 10 vehicles at a time.");
        return;
      }
      setSelectedIds((prev) => [...prev, vehicleId]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== vehicleId));
    }
  };

  const handleSubmit = () => {
    if (selectedIds.length === 0) return;
    if (selectedIds.length > 10) {
      toast.error("You can select a maximum of 10 vehicles at a time.");
      return;
    }

    submitMutation.mutate(
      { vehicleIds: selectedIds },
      {
        onSuccess: (data) => {
          toast.success(
            `Submitted successfully! Accepted: ${data.acceptedCount}, Skipped: ${data.skippedCount}`
          );
          setSelectedIds([]);
          refetch();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to submit request");
        },
      }
    );
  };

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      `${v.brand} ${v.model} ${v.variant}`.toLowerCase().includes(searchLower) ||
      v.registrationYear.toString().includes(searchLower);

    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "selectable") return matchesSearch && v.selectable;
    if (statusFilter === "pending")
      return matchesSearch && v.approvalStatus === "PENDING";
    if (statusFilter === "published")
      return matchesSearch && v.publishStatus === "PUBLISHED";
    if (statusFilter === "failed")
      return matchesSearch && (v.publishStatus === "FAILED" || v.approvalStatus === "REJECTED");
    if (statusFilter === "rejected")
      return matchesSearch && v.approvalStatus === "REJECTED";

    return matchesSearch;
  });

  // Stats calculation
  const totalCount = vehicles.length;
  const pendingCount = vehicles.filter((v) => v.approvalStatus === "PENDING").length;
  const publishedCount = vehicles.filter((v) => v.publishStatus === "PUBLISHED").length;
  const failedCount = vehicles.filter(
    (v) => v.publishStatus === "FAILED" || v.approvalStatus === "REJECTED"
  ).length;

  const renderApprovalStatus = (v: FacebookDealerVehicleStatusDTO) => {
    if (v.approvalStatus === "PENDING") {
      return (
        <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50 font-semibold gap-1 py-1 rounded-full px-3">
          <Clock className="h-3 w-3" /> Pending Review
        </Badge>
      );
    }
    if (v.approvalStatus === "APPROVED") {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 font-semibold gap-1 py-1 rounded-full px-3">
          <CheckCircle2 className="h-3 w-3" /> Approved
        </Badge>
      );
    }
    if (v.approvalStatus === "REJECTED") {
      return (
        <div className="flex flex-col gap-1 items-start">
          <Badge className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-50 font-semibold gap-1 py-1 rounded-full px-3">
            <XCircle className="h-3 w-3" /> Rejected
          </Badge>
          {v.rejectionReason && (
            <span className="text-[11px] text-rose-600 font-medium max-w-[180px] leading-tight">
              Reason: {v.rejectionReason}
            </span>
          )}
        </div>
      );
    }
    return (
      <Badge variant="secondary" className="bg-slate-50 text-slate-500 border border-slate-200 font-medium py-1 rounded-full px-3">
        No Request
      </Badge>
    );
  };

  const renderPublishStatus = (v: FacebookDealerVehicleStatusDTO) => {
    if (v.publishStatus === "QUEUED") {
      return (
        <Badge className="bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-50 font-semibold gap-1 py-1 rounded-full px-3">
          <Clock className="h-3 w-3" /> Queued
        </Badge>
      );
    }
    if (v.publishStatus === "PROCESSING") {
      return (
        <Badge className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50 font-semibold gap-1 py-1 rounded-full px-3">
          <Loader2 className="h-3 w-3 animate-spin" /> Processing
        </Badge>
      );
    }
    if (v.publishStatus === "RETRY_SCHEDULED") {
      return (
        <Badge className="bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-50 font-semibold gap-1 py-1 rounded-full px-3">
          <Clock className="h-3 w-3" /> Retrying
        </Badge>
      );
    }
    if (v.publishStatus === "PUBLISHED") {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 font-semibold gap-1 py-1 rounded-full px-3">
          <CheckCircle2 className="h-3 w-3" /> Published
        </Badge>
      );
    }
    if (v.publishStatus === "FAILED") {
      return (
        <Badge className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-50 font-semibold gap-1 py-1 rounded-full px-3">
          <AlertCircle className="h-3 w-3" /> Failed
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-slate-50 text-slate-400 border border-slate-100 font-medium py-1 rounded-full px-3">
        Not Started
      </Badge>
    );
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <div>
          <p className="font-semibold text-lg">Failed to load Facebook request list</p>
          <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
        </div>
        <Button onClick={() => refetch()} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  const allSelectableFiltered = filteredVehicles.filter((v) => v.selectable);
  const isAllSelected =
    allSelectableFiltered.length > 0 &&
    allSelectableFiltered.every((v) => selectedIds.includes(v.vehicleId));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Facebook className="h-8 w-8 text-[#1877F2] fill-[#1877F2]" /> Facebook Publishing
          </h2>
          <p className="text-base text-slate-500 mt-1">
            Request, track, and manage your vehicle auto-posts on the official Facebook Page.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isLoading || isRefetching}
            className="h-10 w-10 bg-white rounded-xl cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${(isLoading || isRefetching) ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Vehicles</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">
                {isLoading ? <Skeleton className="h-8 w-12" /> : totalCount}
              </h3>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
              <HelpCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Pending Review</p>
              <h3 className="text-3xl font-bold text-amber-600 mt-1">
                {isLoading ? <Skeleton className="h-8 w-12" /> : pendingCount}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Published Posts</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-1">
                {isLoading ? <Skeleton className="h-8 w-12" /> : publishedCount}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Failed / Rejected</p>
              <h3 className="text-3xl font-bold text-rose-600 mt-1">
                {isLoading ? <Skeleton className="h-8 w-12" /> : failedCount}
              </h3>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl text-rose-500">
              <AlertCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main List */}
      <div className="space-y-4">
        {/* Filters and search */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by brand, model or year..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-white rounded-xl w-full"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              className="h-10 rounded-xl px-4 cursor-pointer text-xs font-semibold"
            >
              All
            </Button>
            <Button
              variant={statusFilter === "selectable" ? "default" : "outline"}
              onClick={() => setStatusFilter("selectable")}
              className="h-10 rounded-xl px-4 cursor-pointer text-xs font-semibold"
            >
              Selectable
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              onClick={() => setStatusFilter("pending")}
              className="h-10 rounded-xl px-4 cursor-pointer text-xs font-semibold"
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === "published" ? "default" : "outline"}
              onClick={() => setStatusFilter("published")}
              className="h-10 rounded-xl px-4 cursor-pointer text-xs font-semibold "
            >
              Published
            </Button>
            <Button
              variant={statusFilter === "failed" ? "default" : "outline"}
              onClick={() => setStatusFilter("failed")}
              className="h-10 rounded-xl px-4 cursor-pointer text-xs font-semibold "
            >
              Failed/Rejected
            </Button>
          </div>
        </div>

        {/* Selected count header floating */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-[#1877F2]/10 border border-[#1877F2]/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2">
              <Facebook className="h-5 w-5 text-[#1877F2]" />
              <span className="text-sm font-semibold text-[#1877F2]">
                {selectedIds.length} vehicle{selectedIds.length > 1 ? "s" : ""} selected for Facebook posting
              </span>
              <span className="text-xs text-slate-500">(Max 10 at a time)</span>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white rounded-xl font-bold text-xs gap-2 px-5 py-2 cursor-pointer h-9 shrink-0 shadow-sm"
            >
              {submitMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Facebook className="h-4 w-4 fill-white" />
              )}
              Submit Request
            </Button>
          </div>
        )}

        {/* Vehicles Table */}
        <Card className="border border-slate-100 shadow-premium rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-0 overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader className="bg-black border-b border-black">
                <TableRow className="bg-black hover:bg-black border-none">
                  <TableHead className="w-16 text-center text-xs font-bold text-slate-100 py-4">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      disabled={isLoading || allSelectableFiltered.length === 0}
                      className="border-slate-300 data-[state=checked]:bg-white data-[state=checked]:text-black"
                    />
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Vehicle Info
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Price
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Approval Status
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Publish Status
                  </TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={`skeleton-${idx}`} className="border-b border-slate-100 last:border-none">
                      <TableCell className="text-center py-4">
                        <Skeleton className="h-4 w-4 mx-auto" />
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-14 rounded shrink-0" />
                          <div className="space-y-1.5">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-7 w-28 rounded-full" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-7 w-28 rounded-full" />
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6">
                        <Skeleton className="h-8 w-24 rounded ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredVehicles.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-muted-foreground font-medium"
                    >
                      {search ? "No matching vehicles found." : "No vehicles found for Facebook requests."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVehicles.map((v) => {
                    const isSelected = selectedIds.includes(v.vehicleId);
                    return (
                      <TableRow
                        key={v.vehicleId}
                        className={`hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-none ${isSelected ? "bg-slate-50/70" : ""
                          }`}
                      >
                        <TableCell className="text-center py-4">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleSelectOne(v.vehicleId, !!checked)
                            }
                            disabled={!v.selectable}
                            className="border-slate-300"
                          />
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={v.primaryImageUrl || FALLBACK_IMG}
                              alt={`${v.brand} ${v.model}`}
                              className="h-10 w-14 object-cover rounded shrink-0 border border-slate-100"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                              }}
                            />
                            <div>
                              <div className="font-semibold text-slate-900 text-sm">
                                {v.registrationYear} {v.brand} {v.model}
                              </div>
                              <div className="text-xs text-slate-400 mt-0.5">
                                {v.variant}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-slate-800 text-sm py-4">
                          {v.askingPrice ? formatINR(v.askingPrice) : "—"}
                        </TableCell>
                        <TableCell className="py-4">
                          {renderApprovalStatus(v)}
                        </TableCell>
                        <TableCell className="py-4">
                          {renderPublishStatus(v)}
                        </TableCell>

                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
