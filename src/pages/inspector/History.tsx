import { useState, useEffect } from "react";
import axios from "axios";
import apiClient from "@/lib/apiClient";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  Search,
  Car,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { formatINR } from "@/utils/helpers";
import type { VehicleInspectionRequest } from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://c1.caryanam.com";

export default function InspectorHistory() {
  const [history, setHistory] = useState<VehicleInspectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchHistory = async () => {
    try {
      const res = await apiClient.get("/api/inspector/requests/history");
      const list = res.data?.data;
      setHistory(Array.isArray(list) ? list : []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load inspection history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filtered = history.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.vehicleBrand?.toLowerCase().includes(q) ||
      r.vehicleModel?.toLowerCase().includes(q) ||
      r.dealerBusinessName?.toLowerCase().includes(q) ||
      r.area?.toLowerCase().includes(q) ||
      r.status?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Completed Inspections
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Historical log of vehicles you have personally inspected, verified, or rejected.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchHistory}
            className="rounded-xl flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <div className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Total Processed</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{history.length}</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <Search className="h-5 w-5 text-slate-400 ml-2" />
        <Input
          placeholder="Filter completed inspections by car, dealer, or area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-0 bg-transparent focus-visible:ring-0 shadow-none text-sm"
        />
      </div>

      {/* Table / List */}
      {loading ? (
        <div className="flex items-center justify-center p-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <RefreshCw className="h-8 w-8 text-rose-900 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
          No completed inspections found.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Vehicle</th>
                  <th className="py-3.5 px-4">Dealer</th>
                  <th className="py-3.5 px-4">Area</th>
                  <th className="py-3.5 px-4">Inspection Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((item) => {
                  const isPass = item.status === "VERIFIED";
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                            {item.vehicleThumbnail ? (
                              <img src={item.vehicleThumbnail} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Car className="h-full w-full p-2 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white truncate">
                              {item.vehicleBrand} {item.vehicleModel}
                            </p>
                            <p className="text-[11px] text-slate-400">{item.registrationYear} • {formatINR(item.askingPrice)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                        {item.dealerBusinessName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                          <MapPin className="h-3 w-3 text-slate-400" /> {item.area}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {item.completedDate ? new Date(item.completedDate).toLocaleString() : "N/A"}
                      </td>
                      <td className="py-3.5 px-4">
                        {isPass ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Certified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                            <XCircle className="h-3.5 w-3.5" /> Rejected
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                        {item.inspectionNotes || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

