import {
  useWhatsappDashboard,
  useWhatsappFailedMessages,
  useRetryWhatsappMessage,
  useWhatsappLeadStats,
  useWhatsappOfferStats,
  useWhatsappVehicleStats,
  useWhatsappBirthdayStats,
  useWhatsappLeadLogs,
  useWhatsappOfferLogs,
  useWhatsappVehicleLogs,
  useWhatsappBirthdayLogs,
  WhatsappLogItem
} from "@/hooks/admin/useWhatsappDashboard";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  CheckSquare,
  Activity,
  Inbox,
  CarFront,
  Gift,
  Cake,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function WhatsappDashboard() {
  const { data: stats, isLoading: isStatsLoading } = useWhatsappDashboard();
  const { data: leadStats, isLoading: isLeadLoading } = useWhatsappLeadStats();
  const { data: offerStats, isLoading: isOfferLoading } = useWhatsappOfferStats();
  const { data: vehicleStats, isLoading: isVehicleLoading } = useWhatsappVehicleStats();
  const { data: birthdayStats, isLoading: isBirthdayLoading } = useWhatsappBirthdayStats();

  const { data: failedMessages = [], isLoading: isMessagesLoading } = useWhatsappFailedMessages();

  const { data: leadLogs = [], isLoading: isLeadLogsLoading } = useWhatsappLeadLogs();
  const { data: offerLogs = [], isLoading: isOfferLogsLoading } = useWhatsappOfferLogs();
  const { data: vehicleLogs = [], isLoading: isVehicleLogsLoading } = useWhatsappVehicleLogs();
  const { data: birthdayLogs = [], isLoading: isBirthdayLogsLoading } = useWhatsappBirthdayLogs();

  const retryMutation = useRetryWhatsappMessage();
  const [retryingId, setRetryingId] = useState<number | null>(null);

  const handleRetry = async (logType: string, logId: number) => {
    setRetryingId(logId);
    try {
      const result = await retryMutation.mutateAsync({ logType, logId });
      if (result.success) {
        toast.success(result.message || "Message retried successfully.");
      } else {
        toast.error(result.message || "Retry failed.");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred while retrying.");
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-green-600" />
            WhatsApp Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">Monitor WhatsApp messaging performance, logs, and manage failed messages.</p>
        </div>
      </div>

      {/* Stats Summary Grid */}
      {isStatsLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm">
            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center mb-2">
              <Inbox className="h-4 w-4 text-slate-600" />
            </div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Sent</p>
            <p className="text-2xl font-black text-slate-800">{stats.totalMessagesSent}</p>
          </div>
          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm">
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mb-2">
              <RefreshCw className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-1">Queued</p>
            <p className="text-2xl font-black text-amber-700">{stats.totalQueued ?? stats.totalAccepted ?? 0}</p>
          </div>
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm">
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
              <CheckSquare className="h-4 w-4 text-emerald-600" />
            </div>
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Delivered</p>
            <p className="text-2xl font-black text-emerald-700">{stats.totalDelivered}</p>
          </div>
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
            </div>
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">Read</p>
            <p className="text-2xl font-black text-blue-700">{stats.totalRead}</p>
          </div>
          <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm">
            <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center mb-2">
              <XCircle className="h-4 w-4 text-rose-600" />
            </div>
            <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-1">Failed</p>
            <p className="text-2xl font-black text-rose-700">{stats.totalFailed}</p>
          </div>
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm">
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
              <Activity className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-1">Delivery Rate</p>
            <p className="text-2xl font-black text-indigo-700">{stats.overallDeliveryRate?.toFixed(1)}%</p>
          </div>
          <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mb-2">
              <Activity className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-[11px] font-bold text-purple-600 uppercase tracking-wider mb-1">Read Rate</p>
            <p className="text-2xl font-black text-purple-700">{stats.overallReadRate?.toFixed(1)}%</p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
          <p className="text-muted-foreground">Unable to load dashboard stats.</p>
        </div>
      )}

      {/* Template Breakdown Section (4 Templates) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <TemplateStatCard title="Leads Template" icon={<Inbox className="h-5 w-5 text-indigo-500" />} stats={leadStats} isLoading={isLeadLoading} />
        <TemplateStatCard title="Offers Template" icon={<Gift className="h-5 w-5 text-rose-500" />} stats={offerStats} isLoading={isOfferLoading} />
        <TemplateStatCard title="Vehicles Template" icon={<CarFront className="h-5 w-5 text-amber-500" />} stats={vehicleStats} isLoading={isVehicleLoading} />
        <TemplateStatCard title="Birthday Wishes" icon={<Cake className="h-5 w-5 text-pink-500" />} stats={birthdayStats} isLoading={isBirthdayLoading} />
      </div>

      {/* Level 1 Tabs: Failed Messages vs Activity Logs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6">
        <Tabs defaultValue="failed" className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Messages & Logs Management
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Switch between Failed Messages and Template Activity Logs.</p>
            </div>

            {/* Top Level Tabs: Failed Messages / Activity Logs */}
            <TabsList className="bg-slate-100/80 p-1 rounded-xl flex gap-1 self-start sm:self-auto">
              <TabsTrigger value="failed" className="rounded-lg gap-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-xs">
                <AlertCircle className="h-3.5 w-3.5 text-rose-500" /> Failed Messages ({failedMessages.length})
              </TabsTrigger>
              <TabsTrigger value="logs" className="rounded-lg gap-2 text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-xs">
                <FileText className="h-3.5 w-3.5 text-blue-600" /> Activity Logs
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Level 1 Content: Failed Messages */}
          <TabsContent value="failed" className="mt-0">
            <FailedMessagesTable
              failedMessages={failedMessages}
              isLoading={isMessagesLoading}
              retryingId={retryingId}
              isPending={retryMutation.isPending}
              onRetry={handleRetry}
            />
          </TabsContent>

          {/* Level 1 Content: Activity Logs (Nested 4 sub-tabs for each template log) */}
          <TabsContent value="logs" className="mt-0 space-y-4">
            <Tabs defaultValue="leads" className="w-full space-y-4">
              <TabsList className="bg-slate-100/80 p-1 rounded-xl flex flex-wrap gap-1">
                <TabsTrigger value="leads" className="rounded-lg gap-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-xs">
                  <Inbox className="h-3.5 w-3.5 text-indigo-500" /> Leads Logs ({leadLogs.length})
                </TabsTrigger>
                <TabsTrigger value="offers" className="rounded-lg gap-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-xs">
                  <Gift className="h-3.5 w-3.5 text-rose-500" /> Offers Logs ({offerLogs.length})
                </TabsTrigger>
                <TabsTrigger value="vehicles" className="rounded-lg gap-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-xs">
                  <CarFront className="h-3.5 w-3.5 text-amber-500" /> Vehicles Logs ({vehicleLogs.length})
                </TabsTrigger>
                <TabsTrigger value="birthdays" className="rounded-lg gap-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-xs">
                  <Cake className="h-3.5 w-3.5 text-pink-500" /> Birthday Logs ({birthdayLogs.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="leads" className="mt-0">
                <LogsTable logs={leadLogs} isLoading={isLeadLogsLoading} />
              </TabsContent>
              <TabsContent value="offers" className="mt-0">
                <LogsTable logs={offerLogs} isLoading={isOfferLogsLoading} />
              </TabsContent>
              <TabsContent value="vehicles" className="mt-0">
                <LogsTable logs={vehicleLogs} isLoading={isVehicleLogsLoading} />
              </TabsContent>
              <TabsContent value="birthdays" className="mt-0">
                <LogsTable logs={birthdayLogs} isLoading={isBirthdayLogsLoading} />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function TemplateStatCard({ title, icon, stats, isLoading }: { title: string, icon: any, stats: any, isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex justify-center items-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center py-12">
        <p className="text-muted-foreground text-sm">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-shadow">
      <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2 text-lg border-b pb-3">{icon} {title}</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500">Sent</span>
          <span className="font-bold text-slate-700">{stats.totalSent ?? stats.sent ?? 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500">Queued</span>
          <span className="font-bold text-amber-600">{stats.totalQueued ?? stats.queued ?? stats.accepted ?? stats.totalAccepted ?? 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500">Delivered</span>
          <span className="font-bold text-emerald-600">{stats.totalDelivered ?? stats.delivered ?? 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500">Read</span>
          <span className="font-bold text-blue-600">{stats.totalRead ?? stats.read ?? 0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500">Failed</span>
          <span className="font-bold text-rose-600">{stats.totalFailed ?? stats.failed ?? 0}</span>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 -mx-6 px-6 -mb-6 py-4 rounded-b-2xl">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Delivery Rate</span>
            <span className="text-sm font-black text-slate-800">{stats.deliveryRate ?? 0}%</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Read Rate</span>
            <span className="text-sm font-black text-slate-800">{stats.readRate ?? 0}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FailedMessagesTable({
  failedMessages,
  isLoading,
  retryingId,
  isPending,
  onRetry
}: {
  failedMessages: any[];
  isLoading: boolean;
  retryingId: number | null;
  isPending: boolean;
  onRetry: (logType: string, logId: number) => void;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!failedMessages || failedMessages.length === 0) {
    return (
      <div className="text-center py-12 flex flex-col items-center justify-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-300 mb-3" />
        <h4 className="text-lg font-medium text-slate-800">No Failed Messages</h4>
        <p className="text-muted-foreground text-sm mt-1">All your WhatsApp messages are being delivered successfully.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Type & Template</TableHead>
            <TableHead>Dealer</TableHead>
            <TableHead>Status & Error</TableHead>
            <TableHead>Retry Count</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {failedMessages.map((msg) => (
            <TableRow key={msg.logId}>
              <TableCell>
                <div className="font-semibold text-slate-900">{msg.logType}</div>
                <div className="text-xs text-muted-foreground">{msg.templateName}</div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-slate-800">{msg.dealerName}</div>
                <div className="text-xs text-slate-500">+{msg.mobileNumber}</div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 items-start">
                  <Badge variant="destructive" className="bg-rose-100 text-rose-700 hover:bg-rose-100 text-[10px]">
                    {msg.deliveryStatus}
                  </Badge>
                  <span className="text-xs text-rose-600 truncate max-w-xs block" title={msg.errorMessage}>
                    {msg.errorMessage || msg.apiStatus}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm font-medium">{msg.retryCount} / 3</div>
              </TableCell>
              <TableCell>
                <div className="text-xs text-slate-500">
                  <div><span className="font-medium text-slate-700">Created:</span> {new Date(msg.createdAt).toLocaleString()}</div>
                  {msg.lastRetryAt && (
                    <div className="mt-1"><span className="font-medium text-slate-700">Last Retry:</span> {new Date(msg.lastRetryAt).toLocaleString()}</div>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 cursor-pointer"
                  disabled={!msg.canRetry || isPending}
                  onClick={() => onRetry(msg.logType, msg.logId)}
                >
                  {retryingId === msg.logId ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Retry
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function LogsTable({ logs, isLoading }: { logs: WhatsappLogItem[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-12 flex flex-col items-center justify-center">
        <Inbox className="h-10 w-10 text-slate-300 mb-2" />
        <p className="text-muted-foreground text-sm">No log records found for this template.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Dealer / Recipient</TableHead>
            <TableHead>Mobile Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Error Message</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => {
            const status = log.deliveryStatus || log.apiStatus || log.status || "SENT";
            const isFailed = status === "FAILED" || status === "ERROR";
            const isDelivered = status === "DELIVERED" || status === "READ";

            return (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs text-slate-500">#{log.id}</TableCell>
                <TableCell>
                  <div className="font-medium text-slate-800">
                    {log.dealerName || log.dealer?.businessName || log.dealer?.ownerName || log.recipientName || "—"}
                  </div>
                  {log.templateName && <div className="text-[11px] text-slate-400">{log.templateName}</div>}
                </TableCell>
                <TableCell className="text-xs text-slate-600">
                  {log.mobileNumber || log.recipientMobile || log.phone ? `+${log.mobileNumber || log.recipientMobile || log.phone}` : "—"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={isFailed ? "destructive" : isDelivered ? "default" : "outline"}
                    className={
                      isFailed
                        ? "bg-rose-100 text-rose-700 hover:bg-rose-100 text-[10px]"
                        : isDelivered
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 text-[10px]"
                          : "text-[10px]"
                    }
                  >
                    {status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-slate-500 truncate max-w-xs block" title={log.errorMessage}>
                    {log.errorMessage || "—"}
                  </span>
                </TableCell>
                <TableCell className="text-xs text-slate-500">
                  {log.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
