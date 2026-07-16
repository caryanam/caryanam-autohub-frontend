import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Facebook,
  Search,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  Loader2,
  Calendar,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  useGetAdminFacebookDealerRequests,
  useAdminRejectFacebookRequests,
  useAdminBulkApproveFacebookPublish,
} from "@/hooks/admin/useAdminFacebook";
import { formatINR } from "@/utils/helpers";
import type { FacebookAdminVehicleRequestDTO } from "@/types/facebook";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=533&fit=crop";

export default function AdminFacebookDealerRequests() {
  const { dealerId } = useParams<{ dealerId: string }>();
  const navigate = useNavigate();
  const parsedDealerId = dealerId ? parseInt(dealerId, 10) : null;

  const [selectedRequestIds, setSelectedRequestIds] = useState<number[]>([]);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const {
    data: requests = [],
    isLoading,
    isRefetching,
    refetch,
    error,
  } = useGetAdminFacebookDealerRequests(parsedDealerId);

  const rejectMutation = useAdminRejectFacebookRequests(parsedDealerId || 0);
  const approveMutation = useAdminBulkApproveFacebookPublish(parsedDealerId || 0);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pendingIds = filteredRequests
        .filter((r) => r.approvalStatus === "PENDING")
        .map((r) => r.requestId);
      setSelectedRequestIds(pendingIds.slice(0, 10)); // Enforce batch limit of 10
      if (pendingIds.length > 10) {
        toast.info("Selected first 10 pending requests (bulk limit).");
      }
    } else {
      setSelectedRequestIds([]);
    }
  };

  const handleSelectOne = (requestId: number, checked: boolean) => {
    if (checked) {
      if (selectedRequestIds.length >= 10) {
        toast.warning("You can approve/reject a maximum of 10 requests at a time.");
        return;
      }
      setSelectedRequestIds((prev) => [...prev, requestId]);
    } else {
      setSelectedRequestIds((prev) => prev.filter((id) => id !== requestId));
    }
  };

  const handleApprovePublish = () => {
    if (selectedRequestIds.length === 0 || !parsedDealerId) return;

    approveMutation.mutate(
      {
        dealerId: parsedDealerId,
        requestIds: selectedRequestIds,
      },
      {
        onSuccess: (data) => {
          toast.success("Requests approved and queued for publishing!");
          setSelectedRequestIds([]);
          // Navigate to live batch progress page
          navigate(`/admin/facebook-requests/batch/${data.batchId}`);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to approve & publish requests");
        },
      }
    );
  };

  const handleRejectSubmit = () => {
    if (selectedRequestIds.length === 0) return;
    if (!rejectReason.trim()) {
      toast.error("Please enter a rejection reason.");
      return;
    }

    rejectMutation.mutate(
      {
        requestIds: selectedRequestIds,
        reason: rejectReason.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Requests rejected successfully.");
          setIsRejectModalOpen(false);
          setRejectReason("");
          setSelectedRequestIds([]);
          refetch();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to reject requests");
        },
      }
    );
  };

  // Status badges helpers
  const renderApprovalStatus = (r: FacebookAdminVehicleRequestDTO) => {
    if (r.approvalStatus === "PENDING") {
      return (
        <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50 font-semibold gap-1 rounded-full px-2.5 py-0.5">
          <Clock className="h-3 w-3" /> Pending Review
        </Badge>
      );
    }
    if (r.approvalStatus === "APPROVED") {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 font-semibold gap-1 rounded-full px-2.5 py-0.5">
          <CheckCircle2 className="h-3 w-3" /> Approved
        </Badge>
      );
    }
    if (r.approvalStatus === "REJECTED") {
      return (
        <Badge className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-50 font-semibold gap-1 rounded-full px-2.5 py-0.5">
          <XCircle className="h-3 w-3" /> Rejected
        </Badge>
      );
    }
    return null;
  };

  const renderPublishStatus = (r: FacebookAdminVehicleRequestDTO) => {
    if (r.publishStatus === "QUEUED") {
      return (
        <Badge className="bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-50 font-semibold gap-1 rounded-full px-2.5 py-0.5">
          <Clock className="h-3 w-3" /> Queued
        </Badge>
      );
    }
    if (r.publishStatus === "PROCESSING") {
      return (
        <Badge className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50 font-semibold gap-1 rounded-full px-2.5 py-0.5">
          <Loader2 className="h-3 w-3 animate-spin" /> Processing
        </Badge>
      );
    }
    if (r.publishStatus === "RETRY_SCHEDULED") {
      return (
        <Badge className="bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-50 font-semibold gap-1 rounded-full px-2.5 py-0.5">
          <Clock className="h-3 w-3" /> Retrying
        </Badge>
      );
    }
    if (r.publishStatus === "PUBLISHED") {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 font-semibold gap-1 rounded-full px-2.5 py-0.5">
          <CheckCircle2 className="h-3 w-3" /> Published
        </Badge>
      );
    }
    if (r.publishStatus === "FAILED") {
      return (
        <Badge className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-50 font-semibold gap-1 rounded-full px-2.5 py-0.5">
          <AlertCircle className="h-3 w-3" /> Failed
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-slate-50 text-slate-400 border border-slate-100 font-medium rounded-full px-2.5 py-0.5">
        Not Started
      </Badge>
    );
  };

  const filteredRequests = requests; // Can add filtering by status if needed

  const pendingRequests = filteredRequests.filter((r) => r.approvalStatus === "PENDING");
  const isAllSelected =
    pendingRequests.length > 0 &&
    pendingRequests.every((r) => selectedRequestIds.includes(r.requestId));

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <div>
          <p className="font-semibold text-lg">Failed to load requests for this dealer</p>
          <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
        </div>
        <Button onClick={() => refetch()} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back & Title */}
      <div className="space-y-3">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/facebook-requests")}
          className="p-0 text-slate-500 hover:text-slate-900 cursor-pointer text-xs font-semibold gap-1"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Summaries
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Review Dealer Requests
            </h2>
            <p className="text-base text-slate-500 mt-1">
              Select pending vehicle requests for this dealer and approve to auto-publish on Facebook.
            </p>
          </div>

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

      {/* Bulk Action Header bar */}
      {selectedRequestIds.length > 0 && (
        <div className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <Facebook className="h-5 w-5 text-[#1877F2]" />
            <span className="text-sm font-semibold text-slate-800">
              {selectedRequestIds.length} request{selectedRequestIds.length > 1 ? "s" : ""} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsRejectModalOpen(true)}
              disabled={rejectMutation.isPending || approveMutation.isPending}
              className="border-rose-200 hover:bg-rose-50 text-rose-600 hover:text-rose-700 font-bold text-xs rounded-xl h-9 px-4 cursor-pointer"
            >
              Reject Selected
            </Button>
            <Button
              onClick={handleApprovePublish}
              disabled={approveMutation.isPending || rejectMutation.isPending}
              className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-bold text-xs gap-2 rounded-xl h-9 px-5 cursor-pointer shadow-sm"
            >
              {approveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Facebook className="h-4 w-4 fill-white" />
              )}
              Approve & Publish
            </Button>
          </div>
        </div>
      )}

      {/* Requests table */}
      <Card className="border border-slate-100 shadow-premium rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader className="bg-black border-b border-black">
              <TableRow className="bg-black hover:bg-black border-none">
                <TableHead className="w-16 text-center text-xs font-bold text-slate-100 py-4">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    disabled={isLoading || pendingRequests.length === 0}
                    className="border-slate-300 data-[state=checked]:bg-white data-[state=checked]:text-black"
                  />
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                  Vehicle
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
                <TableHead className="text-right text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pr-6">
                  Requested At
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
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-7 w-24 rounded-full" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-7 w-24 rounded-full" />
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6">
                      <Skeleton className="h-4 w-24 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground font-medium"
                  >
                    No requests submitted by this dealer.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((r) => {
                  const isSelected = selectedRequestIds.includes(r.requestId);
                  const isPending = r.approvalStatus === "PENDING";
                  return (
                    <TableRow
                      key={r.requestId}
                      className={`hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-none ${
                        isSelected ? "bg-slate-50/70" : ""
                      }`}
                    >
                      <TableCell className="text-center py-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleSelectOne(r.requestId, !!checked)
                          }
                          disabled={!isPending}
                          className="border-slate-300"
                        />
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={r.primaryImageUrl || FALLBACK_IMG}
                            alt={`${r.brand} ${r.model}`}
                            className="h-10 w-14 object-cover rounded shrink-0 border border-slate-100"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                            }}
                          />
                          <div>
                            <div className="font-semibold text-slate-900 text-sm">
                              {r.registrationYear} {r.brand} {r.model}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {r.variant} • {r.fuelType}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-slate-800 text-sm py-4">
                        {r.askingPrice ? formatINR(r.askingPrice) : "—"}
                      </TableCell>
                      <TableCell className="py-4">
                        {renderApprovalStatus(r)}
                      </TableCell>
                      <TableCell className="py-4">
                        {renderPublishStatus(r)}
                      </TableCell>
                      <TableCell className="text-right text-sm text-slate-500 py-4 pr-6">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          {new Date(r.requestedAt).toLocaleDateString()} at{" "}
                          {new Date(r.requestedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reject Modal Dialog */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-md bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-slate-900 font-bold text-lg">Reject Post Requests</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-slate-500">
              Please enter a reason for rejecting the selected {selectedRequestIds.length} requests. This explanation will be visible to the dealer.
            </p>
            <Textarea
              placeholder="e.g. Mandatory vehicle details missing, inappropriate pricing, or bad quality primary image..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px] bg-slate-50 border-slate-200 focus:bg-white rounded-xl"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectReason("");
              }}
              className="rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectSubmit}
              disabled={rejectMutation.isPending}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer"
            >
              {rejectMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : null}
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
