import { useParams, useNavigate } from "react-router-dom";
import {
  Facebook,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  useGetAdminFacebookBatchStatus,
  useAdminRetryFailedFacebookPublish,
} from "@/hooks/admin/useAdminFacebook";
import type {
  SocialPostBatchStatus,
  SocialPostPublishStatus,
} from "@/types/facebook";

export default function AdminFacebookBatchProgress() {
  const { batchId } = useParams<{ batchId: string }>();
  const navigate = useNavigate();
  const parsedBatchId = batchId ? parseInt(batchId, 10) : null;

  const {
    data: batch,
    isLoading,
    isRefetching,
    refetch,
    error,
  } = useGetAdminFacebookBatchStatus(parsedBatchId);

  const retryMutation = useAdminRetryFailedFacebookPublish(parsedBatchId || 0);

  const handleRetryFailed = () => {
    if (!parsedBatchId) return;

    retryMutation.mutate(
      { batchId: parsedBatchId },
      {
        onSuccess: () => {
          toast.success("Retry batch queued! Polling resumed.");
          refetch();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to trigger retry");
        },
      }
    );
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <div>
          <p className="font-semibold text-lg">Failed to load batch status</p>
          <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
        </div>
        <Button onClick={() => refetch()} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  // Calculate progress percent
  const total = batch?.totalCount || 0;
  const success = batch?.successCount || 0;
  const failed = batch?.failedCount || 0;
  const pending = batch?.pendingCount || 0;
  const progressPercent = total > 0 ? ((success + failed) / total) * 100 : 0;

  const isBatchActive =
    batch?.status === "QUEUED" || batch?.status === "PROCESSING";

  // Check if there are failed items that can be retried (e.g. retryCount < max retry count, status failed)
  const hasFailedItems = failed > 0;

  const renderBatchStatusBadge = (status: SocialPostBatchStatus) => {
    switch (status) {
      case "QUEUED":
        return (
          <Badge className="bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-50 font-bold gap-1 rounded-full px-3 py-1">
            <Clock className="h-3.5 w-3.5" /> Queued
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50 font-bold gap-1 rounded-full px-3 py-1">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 font-bold gap-1 rounded-full px-3 py-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Completed
          </Badge>
        );
      case "PARTIALLY_COMPLETED":
        return (
          <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50 font-bold gap-1 rounded-full px-3 py-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Partially Completed
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-50 font-bold gap-1 rounded-full px-3 py-1">
            <XCircle className="h-3.5 w-3.5" /> Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderItemStatusBadge = (status: SocialPostPublishStatus) => {
    switch (status) {
      case "QUEUED":
        return (
          <Badge className="bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-50 font-semibold gap-1 rounded-full px-2.5 py-0.5">
            <Clock className="h-3 w-3" /> Queued
          </Badge>
        );
      case "PROCESSING":
        return (
          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50 font-semibold gap-1 rounded-full px-2.5 py-0.5">
            <Loader2 className="h-3 w-3 animate-spin" /> Processing
          </Badge>
        );
      case "RETRY_SCHEDULED":
        return (
          <Badge className="bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-50 font-semibold gap-1 rounded-full px-2.5 py-0.5">
            <Clock className="h-3 w-3" /> Retry Scheduled
          </Badge>
        );
      case "PUBLISHED":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-50 font-semibold gap-1 rounded-full px-2.5 py-0.5">
            <CheckCircle2 className="h-3 w-3" /> Published
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-50 font-semibold gap-1 rounded-full px-2.5 py-0.5">
            <AlertCircle className="h-3 w-3" /> Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-slate-50 text-slate-400 border border-slate-100 font-medium rounded-full px-2.5 py-0.5">
            Pending
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Navigation */}
      <div className="space-y-3">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/facebook-requests")}
          disabled={isBatchActive}
          className="p-0 text-slate-500 hover:text-slate-900 hover:bg-transparent cursor-pointer text-xs font-semibold gap-1 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Facebook Requests
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Facebook className="h-8 w-8 text-[#1877F2] fill-[#1877F2]" /> Batch Publishing
            </h2>
            <p className="text-base text-slate-500 mt-1">
              Live monitoring of Facebook auto-posts for Batch ID: #{parsedBatchId}.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isBatchActive && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
                <Loader2 className="h-3 w-3 animate-spin" /> Live Polling Active
              </span>
            )}
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
      </div>

      {/* Batch Overall Progress Card */}
      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-6">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-900">Publishing Status</CardTitle>
            {batch && renderBatchStatusBadge(batch.status)}
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {isLoading && !batch ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full rounded" />
              <div className="grid grid-cols-4 gap-4">
                <Skeleton className="h-12 w-full rounded" />
                <Skeleton className="h-12 w-full rounded" />
                <Skeleton className="h-12 w-full rounded" />
                <Skeleton className="h-12 w-full rounded" />
              </div>
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Progress ({success + failed} of {total} processed)</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <Progress value={progressPercent} className="h-2.5 bg-slate-100 text-[#1877F2] rounded-full [&>div]:bg-[#1877F2]" />
              </div>

              {/* Counts grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase">Total Items</p>
                  <h4 className="text-2xl font-bold text-slate-900 mt-1">{total}</h4>
                </div>
                <div className="bg-amber-50/60 p-4 rounded-xl text-center">
                  <p className="text-xs font-bold text-amber-600 uppercase">Pending</p>
                  <h4 className="text-2xl font-bold text-amber-700 mt-1">{pending}</h4>
                </div>
                <div className="bg-emerald-50/60 p-4 rounded-xl text-center">
                  <p className="text-xs font-bold text-emerald-600 uppercase">Successful</p>
                  <h4 className="text-2xl font-bold text-emerald-700 mt-1">{success}</h4>
                </div>
                <div className="bg-rose-50/60 p-4 rounded-xl text-center">
                  <p className="text-xs font-bold text-rose-600 uppercase">Failed</p>
                  <h4 className="text-2xl font-bold text-rose-700 mt-1">{failed}</h4>
                </div>
              </div>

              {/* Retry action bar if completed with failed items */}
              {!isBatchActive && hasFailedItems && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                  <p className="text-sm text-slate-500">
                    This batch has finished with failed items. You can retry the failed requests.
                  </p>
                  <Button
                    onClick={handleRetryFailed}
                    disabled={retryMutation.isPending}
                    className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-bold text-xs rounded-xl h-9 px-5 gap-2 cursor-pointer shrink-0 shadow-sm"
                  >
                    {retryMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Retry Failed Items
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Batch Items List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Batch Items Details</h3>

        <Card className="border border-slate-100 shadow-premium rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-0 overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader className="bg-black border-b border-black">
                <TableRow className="bg-black hover:bg-black border-none">
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pl-6">
                    Vehicle Name
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Request ID
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Retries
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Error Reason
                  </TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && !batch ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <TableRow key={`skeleton-${idx}`} className="border-b border-slate-100 last:border-none">
                      <TableCell className="py-4 pl-6">
                        <Skeleton className="h-4 w-60 rounded" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-4 w-12 rounded" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-7 w-20 rounded-full" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-4 w-8 rounded" />
                      </TableCell>
                      <TableCell className="py-4">
                        <Skeleton className="h-4 w-40 rounded" />
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6">
                        <Skeleton className="h-4 w-20 ml-auto rounded" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : !batch || batch.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground font-medium">
                      No items in this batch.
                    </TableCell>
                  </TableRow>
                ) : (
                  batch.items.map((item) => (
                    <TableRow
                      key={item.requestId}
                      className="hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-none"
                    >
                      <TableCell className="font-semibold text-slate-900 text-sm py-4 pl-6">
                        {item.vehicleName || `Vehicle ID: ${item.vehicleId}`}
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm py-4">
                        #{item.requestId}
                      </TableCell>
                      <TableCell className="py-4">
                        {renderItemStatusBadge(item.status)}
                      </TableCell>
                      <TableCell className="text-slate-600 text-sm py-4 font-medium">
                        {item.retryCount} / 3
                      </TableCell>
                      <TableCell className="text-rose-600 text-xs py-4 max-w-[250px] truncate" title={item.errorMessage || undefined}>
                        {item.errorMessage || "—"}
                      </TableCell>

                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
