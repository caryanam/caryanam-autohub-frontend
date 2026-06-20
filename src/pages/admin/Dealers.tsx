import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import { useAdminDealers, useUpdateDealerStatus } from "@/hooks/admin/useAdminDealers";

const statusStyle: Record<string, string> = {
  APPROVED: "bg-success/15 text-success",
  PENDING: "bg-warning/20 text-warning-foreground",
  SUSPENDED: "bg-muted text-foreground/70",
  REJECTED: "bg-destructive/15 text-destructive",
};

export default function AdminDealers() {
  const [search, setSearch] = useState("");
  const { data: dealers = [], isLoading, refetch, isFetching } = useAdminDealers();
  const { mutate: updateStatus, isPending } = useUpdateDealerStatus();

  const filtered = dealers.filter((d) =>
    d.businessName.toLowerCase().includes(search.toLowerCase()) ||
    d.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    d.city.toLowerCase().includes(search.toLowerCase())
  );

  const approve = (dealerId: number) => {
    updateStatus(
      { dealerId, status: "Approved" },
      {
        onSuccess: (res) => toast.success(res?.message ?? "Dealer approved"),
        onError: (err: any) => toast.error(err?.response?.data?.message ?? "Action failed"),
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dealers</h2>
          <p className="text-base text-slate-500 mt-1">{filtered.length} dealers</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-[280px] sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search dealers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 bg-white rounded-xl w-full"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-10 w-10 bg-white rounded-xl shrink-0 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <Card className="border border-slate-100 shadow-premium rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader className="bg-blue-900 border-b border-blue-900">
              <TableRow className="bg-blue-900 hover:bg-blue-900 border-none">
                <TableHead className="w-16 text-center text-xs font-bold text-slate-100 uppercase tracking-wider py-4">Sr No</TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pl-6">Business</TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">City</TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">Contact</TableHead>
                <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={`skeleton-${idx}`} className="border-b border-slate-200 last:border-none">
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded shrink-0" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-28 rounded" />
                          <Skeleton className="h-3 w-20 rounded" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-16 rounded" /></TableCell>
                    <TableCell className="py-4">
                      <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-24 rounded" />
                        <Skeleton className="h-3 w-32 rounded" />
                      </div>
                    </TableCell>
                    <TableCell className="py-4 pr-6"><Skeleton className="h-7 w-20 rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground font-medium">
                    No dealers found.
                  </TableCell>
                </TableRow>
              ) : filtered.map((d, idx) => (
                <TableRow key={d.id} className="hover:bg-slate-100 transition-colors border-b border-slate-200 last:border-none">
                  <TableCell className="text-center text-slate-400 text-sm font-medium py-4">{idx + 1}</TableCell>
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL}/${d.dealerLogo}`}
                        className="h-9 w-9 rounded object-cover shrink-0"
                        alt=""
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{d.businessName}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{d.ownerName}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm py-4">{d.city}</TableCell>
                  <TableCell className="py-4">
                    <div className="text-slate-700 text-xs font-medium">{d.mobile}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{d.email}</div>
                  </TableCell>
                  <TableCell className="py-4 pr-6">
                    {d.dealerAccountStatus === "PENDING" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1.5 h-7 px-3 rounded-full bg-warning/20 text-warning-foreground hover:bg-green-500 hover:text-white transition-colors cursor-pointer"
                        onClick={() => approve(d.id)}
                        disabled={isPending}
                        title="Click to approve"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span className="text-xs font-semibold">PENDING</span>
                      </Button>
                    ) : (
                      <Badge className={`${statusStyle[d.dealerAccountStatus] ?? ""} border-0 font-semibold px-2.5 py-0.5 rounded-full text-xs`}>
                        {d.dealerAccountStatus}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
