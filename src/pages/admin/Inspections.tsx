import { useState, useEffect } from "react";
import axios from "axios";
import apiClient from "@/lib/apiClient";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Search,
  RefreshCw,
  Phone,
  UserCheck,
  Car,
  FileBarChart,
  User,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatINR } from "@/utils/helpers";
import type { VehicleInspectionRequest, Inspector } from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://c1.caryanam.com";

export default function AdminInspections() {
  const [reports, setReports] = useState<VehicleInspectionRequest[]>([]);
  const [inspectors, setInspectors] = useState<Inspector[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Reassign Modal State
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<VehicleInspectionRequest | null>(null);
  const [selectedInspectorId, setSelectedInspectorId] = useState<string>("");
  const [savingReassign, setSavingReassign] = useState(false);

  const fetchReports = async () => {
    try {
      const [repRes, inspRes] = await Promise.all([
        apiClient.get("/api/admin/inspections/all"),
        apiClient.get("/api/admin/inspectors"),
      ]);
      const repData = repRes.data?.data;
      const inspData = inspRes.data?.data;
      setReports(Array.isArray(repData) ? repData : []);
      setInspectors(Array.isArray(inspData) ? inspData : []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load inspection reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleOpenReassign = (req: VehicleInspectionRequest) => {
    setSelectedReq(req);
    setSelectedInspectorId(req.inspectorId ? String(req.inspectorId) : "");
    setReassignModalOpen(true);
  };

  const handleSaveReassign = async () => {
    if (!selectedReq || !selectedInspectorId) {
      toast.error("Please select an inspector to assign.");
      return;
    }

    setSavingReassign(true);
    try {
      await apiClient.put(
        `/api/admin/inspections/${selectedReq.id}/assign/${selectedInspectorId}`,
        {}
      );
      toast.success("Inspector assigned to request successfully!");
      setReassignModalOpen(false);
      fetchReports();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to assign inspector");
    } finally {
      setSavingReassign(false);
    }
  };

  const verifiedCount = reports.filter((r) => r.status === "VERIFIED").length;
  const pendingCount = reports.filter((r) => r.status === "PENDING").length;
  const rejectedCount = reports.filter((r) => r.status === "REJECTED").length;

  const filtered = reports.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.vehicleBrand?.toLowerCase().includes(q) ||
        r.vehicleModel?.toLowerCase().includes(q) ||
        r.dealerBusinessName?.toLowerCase().includes(q) ||
        r.dealerOwnerName?.toLowerCase().includes(q) ||
        r.area?.toLowerCase().includes(q) ||
        r.inspectorName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <FileBarChart className="h-3 w-3" /> Audit & Reports
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Vehicle Certification Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track dealer certification requests, vehicle verification status (Verified vs Not Verified), and assigned inspectors.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchReports}
          className="rounded-xl flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Requests</span>
          <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">{reports.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">Verified (Certified)</span>
          <span className="text-2xl font-black text-emerald-800 dark:text-emerald-300 mt-1 block">{verifiedCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">Pending Verification</span>
          <span className="text-2xl font-black text-amber-800 dark:text-amber-300 mt-1 block">{pendingCount}</span>
        </div>
        <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
          <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">Rejected Inspections</span>
          <span className="text-2xl font-black text-rose-800 dark:text-rose-300 mt-1 block">{rejectedCount}</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex-1 w-full relative">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3" />
          <Input
            placeholder="Search by car, dealer, area, or inspector name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 border-0 bg-transparent focus-visible:ring-0 shadow-none text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-44 h-10 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border-0">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="VERIFIED">Verified (Certified)</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Audit Table */}
      {loading ? (
        <div className="flex items-center justify-center p-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <RefreshCw className="h-8 w-8 text-rose-900 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
          No certification requests match your query.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Requested Vehicle</th>
                  <th className="py-3.5 px-4">Requesting Dealer</th>
                  <th className="py-3.5 px-4">Verification Status</th>
                  <th className="py-3.5 px-4">Assigned / Verifying Inspector</th>
                  <th className="py-3.5 px-4">Timeline</th>
                  <th className="py-3.5 px-4">Notes</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                          {req.vehicleThumbnail ? (
                            <img src={req.vehicleThumbnail} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Car className="h-full w-full p-2 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white truncate">
                            {req.vehicleBrand} {req.vehicleModel}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {req.registrationYear} • {formatINR(req.askingPrice)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{req.dealerBusinessName}</p>
                      <p className="text-[11px] text-slate-500">{req.dealerOwnerName} ({req.dealerMobile})</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-2.5 w-2.5" /> {req.area || req.dealerCity}
                      </p>
                    </td>

                    <td className="py-3.5 px-4">
                      {req.status === "VERIFIED" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="h-3 w-3" /> VERIFIED
                        </span>
                      ) : req.status === "REJECTED" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          <XCircle className="h-3 w-3" /> NOT VERIFIED (REJECTED)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                          <Clock className="h-3 w-3" /> PENDING VERIFY
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {req.inspectorName ? (
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                            <UserCheck className="h-3.5 w-3.5 text-emerald-600" /> {req.inspectorName}
                          </p>
                          <p className="text-[11px] text-slate-400">{req.inspectorMobile} • {req.inspectorAssignedArea}</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">
                          Auto-pooled in {req.area} (Unassigned)
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-slate-500 space-y-0.5">
                      <div>Req: {req.requestDate ? new Date(req.requestDate).toLocaleDateString() : "—"}</div>
                      {req.completedDate && (
                        <div className="text-emerald-600 font-medium">Done: {req.completedDate ? new Date(req.completedDate).toLocaleDateString() : ""}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate text-[11px]">
                      {req.inspectionNotes || "—"}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenReassign(req)}
                        className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl"
                      >
                        {req.inspectorId ? "Reassign" : "Assign"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign Inspector Dialog */}
      <Dialog open={reassignModalOpen} onOpenChange={setReassignModalOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Assign Inspector</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Vehicle: <strong>{selectedReq?.vehicleBrand} {selectedReq?.vehicleModel}</strong> (Dealer: {selectedReq?.dealerBusinessName}, {selectedReq?.area})
            </DialogDescription>
          </DialogHeader>

          <div className="py-3">
            <Label className="text-xs font-semibold block mb-2">Select Official Inspector</Label>
            <select
              value={selectedInspectorId}
              onChange={(e) => setSelectedInspectorId(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs"
            >
              <option value="">Choose an inspector...</option>
              {inspectors.map((insp) => (
                <option key={insp.id} value={insp.id}>
                  {insp.fullName} ({insp.assignedArea}) - {insp.mobile}
                </option>
              ))}
            </select>
          </div>

          <DialogFooter className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReassignModalOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveReassign}
              disabled={savingReassign}
              className="bg-rose-900 hover:bg-rose-950 text-white rounded-xl text-xs font-bold"
            >
              {savingReassign ? "Saving..." : "Confirm Assignment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

