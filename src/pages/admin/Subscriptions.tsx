import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, RefreshCw } from "lucide-react";
import { useAdminSubscriptions, useAdminPayments } from "@/hooks/admin/useAdminSubscriptions";

export default function AdminSubscriptions() {
  const [subSearch, setSubSearch] = useState("");
  const [paySearch, setPaySearch] = useState("");
  const { data: subscriptions = [], isLoading: subLoading, refetch: refetchSub, isFetching: subFetching } = useAdminSubscriptions();
  const { data: payments = [], isLoading: payLoading, refetch: refetchPay, isFetching: payFetching } = useAdminPayments();

  const filteredSubs = subscriptions.filter((s) =>
    s.dealerName?.toLowerCase().includes(subSearch.toLowerCase()) ||
    s.subscriptionPlan?.toLowerCase().includes(subSearch.toLowerCase())
  );

  const successPayments = payments
    .filter((p) => p.paymentStatus?.toUpperCase() === "SUCCESS")
    .filter((p) =>
      p.transactionId?.toLowerCase().includes(paySearch.toLowerCase()) ||
      p.subscriptionPlan?.toLowerCase().includes(paySearch.toLowerCase())
    );

  return (
    <div className="space-y-4">
      <Tabs defaultValue="subscriptions">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900"> {filteredSubs.length} Subscriptions</h2>

            <p className="text-base text-slate-500 mt-1">Manage dealer subscriptions &amp; payments</p>
          </div>
          <TabsList className="bg-slate-100 rounded-xl">
            <TabsTrigger value="subscriptions" className="rounded-lg">Subscriptions</TabsTrigger>
            <TabsTrigger value="payments" className="rounded-lg">Payment Success</TabsTrigger>
          </TabsList>
        </div>

        {/* ── Subscriptions Tab ── */}
        <TabsContent value="subscriptions" className="mt-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-[280px] sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search dealer or plan..."
                value={subSearch}
                onChange={(e) => setSubSearch(e.target.value)}
                className="pl-9 h-10 bg-white rounded-xl w-full"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetchSub()}
              disabled={subFetching}
              className="h-10 w-10 bg-white rounded-xl shrink-0 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${subFetching ? "animate-spin" : ""}`} />
            </Button>
          </div>

          <Card className="border border-slate-100 shadow-premium rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-0 overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader className="bg-blue-900 border-b border-blue-900">
                  <TableRow className="bg-blue-900 hover:bg-blue-900 border-none">
                    <TableHead className="w-16 text-center text-xs font-bold text-slate-100 uppercase tracking-wider py-4">Sr No</TableHead>
                    <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">Dealer</TableHead>
                    <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">Plan</TableHead>
                    <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">Start Date</TableHead>
                    <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">End Date</TableHead>
                    <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={`skeleton-sub-${idx}`} className="border-b border-slate-100/80 last:border-none">
                        <TableCell className="text-center py-4"><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
                        <TableCell className="py-4"><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell className="py-4"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell className="py-4"><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell className="py-4"><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell className="py-4 pr-6"><Skeleton className="h-7 w-20 rounded-full" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredSubs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground font-medium">
                        {subSearch ? "No matching subscriptions found." : "No subscriptions found."}
                      </TableCell>
                    </TableRow>
                  ) : filteredSubs.map((s, idx) => (
                    <TableRow key={s.dealerId} className="hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-none">
                      <TableCell className="text-center text-slate-400 text-sm font-medium py-4">{idx + 1}</TableCell>
                      <TableCell className="font-semibold text-slate-900 text-sm py-4">{s.dealerName}</TableCell>
                      <TableCell className="py-4">
                        {s.subscriptionPlan
                          ? <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-full px-3">{s.subscriptionPlan}</Badge>
                          : <span className="text-slate-400 text-sm">—</span>}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500 py-4">
                        {s.subscriptionStartDate ? new Date(s.subscriptionStartDate).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500 py-4">
                        {s.subscriptionEndDate ? new Date(s.subscriptionEndDate).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="py-4 pr-6">
                        <Badge className={s.subscriptionActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full px-3"
                          : "bg-slate-100 text-slate-500 border border-slate-200 text-xs font-bold rounded-full px-3"
                        }>
                          {s.subscriptionActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Payments Tab ── */}
        <TabsContent value="payments" className="mt-4 space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-[280px] sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transaction or plan..."
                value={paySearch}
                onChange={(e) => setPaySearch(e.target.value)}
                className="pl-9 h-10 bg-white rounded-xl w-full"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetchPay()}
              disabled={payFetching}
              className="h-10 w-10 bg-white rounded-xl shrink-0 cursor-pointer"
            >
              <RefreshCw className={`h-4 w-4 ${payFetching ? "animate-spin" : ""}`} />
            </Button>
            <span className="text-sm text-slate-500 ml-1">{successPayments.length} records</span>
          </div>

          <Card className="border border-slate-100 shadow-premium rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-0 overflow-x-auto">
              <Table className="min-w-[900px]">
                <TableHeader className="bg-blue-900 border-b border-blue-900">
                  <TableRow className="bg-blue-900 hover:bg-blue-900 border-none">
                    <TableHead className="w-16 text-center text-xs font-bold text-slate-100 uppercase tracking-wider py-4">Sr No</TableHead>
                    <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">Transaction ID</TableHead>
                    <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">Dealer ID</TableHead>
                    <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">Plan</TableHead>
                    <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">Amount</TableHead>
                    <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">Date</TableHead>
                    <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pr-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payLoading ? (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <TableRow key={`skeleton-pay-${idx}`} className="border-b border-slate-100/80 last:border-none">
                        <TableCell className="text-center py-4"><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
                        <TableCell className="py-4"><Skeleton className="h-4 w-40" /></TableCell>
                        <TableCell className="py-4"><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell className="py-4"><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell className="py-4"><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell className="py-4"><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell className="py-4 pr-6"><Skeleton className="h-7 w-20 rounded-full" /></TableCell>
                      </TableRow>
                    ))
                  ) : successPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground font-medium">
                        {paySearch ? "No matching payments found." : "No successful payments found."}
                      </TableCell>
                    </TableRow>
                  ) : successPayments.map((p, idx) => (
                    <TableRow key={p.transactionId} className="hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-none">
                      <TableCell className="text-center text-slate-400 text-sm font-medium py-4">{idx + 1}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-700 py-4">{p.transactionId ?? "—"}</TableCell>
                      <TableCell className="text-sm text-slate-600 py-4">{p.dealerId}</TableCell>
                      <TableCell className="py-4">
                        {p.subscriptionPlan
                          ? <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold rounded-full px-3">{p.subscriptionPlan}</Badge>
                          : <span className="text-slate-400 text-sm">—</span>}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-800 text-sm py-4">
                        {p.amount != null ? `₹${p.amount.toLocaleString("en-IN")}` : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-slate-400 py-4">
                        {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell className="py-4 pr-6">
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full px-3">Success</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
