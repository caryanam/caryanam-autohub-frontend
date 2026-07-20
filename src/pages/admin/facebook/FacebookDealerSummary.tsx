import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Facebook,
  Search,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle2,
  Inbox,
  ArrowRight,
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
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAdminFacebookDealerSummary } from "@/hooks/admin/useAdminFacebook";

export default function AdminFacebookDealerSummary() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const {
    data: summaries = [],
    isLoading,
    isRefetching,
    refetch,
    error,
  } = useGetAdminFacebookDealerSummary();

  const handleRowClick = (dealerId: number) => {
    navigate(`/admin/facebook-requests/dealer/${dealerId}`);
  };

  const filteredSummaries = summaries.filter((s) =>
    s.dealerBusinessName?.toLowerCase().includes(search.toLowerCase())
  );

  const totalDealers = summaries.length;
  const totalPending = summaries.reduce((acc, curr) => acc + curr.pendingCount, 0);
  const totalProcessing = summaries.reduce((acc, curr) => acc + curr.processingCount, 0);
  const totalFailed = summaries.reduce((acc, curr) => acc + curr.failedCount, 0);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <div>
          <p className="font-semibold text-lg">Failed to load dealer requests summary</p>
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Facebook className="h-8 w-8 text-[#1877F2] fill-[#1877F2]" /> Facebook Requests
          </h2>
          <p className="text-base text-slate-500 mt-1">
            Overview of dealer-submitted vehicle publishing requests. Click on any dealer to review and publish.
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

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Dealers</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-1">
                {isLoading ? <Skeleton className="h-8 w-12" /> : totalDealers}
              </h3>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-slate-600">
              <Inbox className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Pending Approval</p>
              <h3 className="text-3xl font-bold text-amber-600 mt-1">
                {isLoading ? <Skeleton className="h-8 w-12" /> : totalPending}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
              <Clock className={`h-6 w-6 ${totalPending > 0 ? "animate-pulse" : ""}`} />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Processing</p>
              <h3 className="text-3xl font-bold text-blue-600 mt-1">
                {isLoading ? <Skeleton className="h-8 w-12" /> : totalProcessing}
              </h3>
            </div>
            {totalProcessing > 0 && (
              <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Failed Items</p>
              <h3 className="text-3xl font-bold text-rose-600 mt-1">
                {isLoading ? <Skeleton className="h-8 w-12" /> : totalFailed}
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
        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by dealer business name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 bg-white rounded-xl w-full"
          />
        </div>

        {/* Dealers Table */}
        <Card className="border border-slate-100 shadow-premium rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-0 overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader className="bg-black border-b border-black">
                <TableRow className="bg-black hover:bg-black border-none">
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pl-6">
                    Dealer Name
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Pending
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Processing
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Published
                  </TableHead>
                  <TableHead className="text-center text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Failed
                  </TableHead>
                  <TableHead className="text-right text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <TableRow key={`skeleton-${idx}`} className="border-b border-slate-100 last:border-none">
                      <TableCell className="py-4 pl-6">
                        <Skeleton className="h-4 w-48 rounded" />
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <Skeleton className="h-4 w-10 mx-auto rounded" />
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <Skeleton className="h-4 w-10 mx-auto rounded" />
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <Skeleton className="h-4 w-10 mx-auto rounded" />
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <Skeleton className="h-4 w-10 mx-auto rounded" />
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6">
                        <Skeleton className="h-8 w-28 rounded ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredSummaries.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12 text-muted-foreground font-medium"
                    >
                      {search ? "No matching dealers found." : "No dealer Facebook requests found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSummaries.map((s) => (
                    <TableRow
                      key={s.dealerId}
                      onClick={() => handleRowClick(s.dealerId)}
                      className="hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-none cursor-pointer"
                    >
                      <TableCell className="font-semibold text-slate-900 text-sm py-4 pl-6">
                        {s.dealerBusinessName || `Dealer ID: ${s.dealerId}`}
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <span
                          className={`font-semibold text-sm ${s.pendingCount > 0 ? "text-amber-600 font-bold" : "text-slate-400"
                            }`}
                        >
                          {s.pendingCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <span
                          className={`font-semibold text-sm ${s.processingCount > 0 ? "text-blue-600 font-bold animate-pulse" : "text-slate-400"
                            }`}
                        >
                          {s.processingCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <span
                          className={`font-semibold text-sm ${s.publishedCount > 0 ? "text-emerald-600" : "text-slate-400"
                            }`}
                        >
                          {s.publishedCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <span
                          className={`font-semibold text-sm ${s.failedCount > 0 ? "text-rose-600 font-bold" : "text-slate-400"
                            }`}
                        >
                          {s.failedCount}
                        </span>
                      </TableCell>
                      <TableCell className="text-right py-4 pr-6" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          onClick={() => handleRowClick(s.dealerId)}
                          className="text-[#1877F2] hover:bg-[#1877F2] font-semibold text-xs gap-1.5 cursor-pointer rounded-xl h-8"
                        >
                          Review <ArrowRight className="h-3 w-3" />
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
    </div>
  );
}
