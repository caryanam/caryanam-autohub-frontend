import { useState, useEffect } from "react";
import axios from "axios";
import apiClient from "@/lib/apiClient";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Car,
  AlertCircle,
  RefreshCw,
  Search,
  Eye,
  Fuel,
  Gauge,
  Calendar,
  CheckSquare,
  Square,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatINR, formatKM } from "@/utils/helpers";
import type { VehicleInspectionRequest } from "@/types";
import { useInspectorAuth } from "@/contexts/InspectorAuthContext";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://c1.caryanam.com";

const CHECKLIST_ITEMS = [
  "Engine Condition & Oil Quality",
  "Transmission & Gear Shift Smoothness",
  "Odometer Authenticity & Diagnostics",
  "Chassis, Pillars & Frame Non-Accidental Check",
  "Braking System & Suspension",
  "Tyre Tread Depth & Wear (>60%)",
  "Electricals, Battery & Lights",
  "Air Conditioning & Cabin Electronics",
  "Original RC, Chassis & VIN Match",
];

export default function InspectorDashboard() {
  const { user } = useInspectorAuth();
  const [requests, setRequests] = useState<VehicleInspectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  // Modal State
  const [selectedReq, setSelectedReq] = useState<VehicleInspectionRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPending = async () => {
    try {
      const res = await apiClient.get("/api/inspector/requests/pending");
      const list = res.data?.data;
      setRequests(Array.isArray(list) ? list : []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load pending requests");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleOpenModal = (req: VehicleInspectionRequest) => {
    setSelectedReq(req);
    // Initialize all checklist items as checked by default for convenience
    const initialChecks: Record<string, boolean> = {};
    CHECKLIST_ITEMS.forEach((item) => {
      initialChecks[item] = true;
    });
    setCheckedItems(initialChecks);
    setNotes("");
    setIsModalOpen(true);
  };

  const toggleCheck = (item: string) => {
    setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const handleCompleteVerify = async () => {
    if (!selectedReq) return;

    const unchecked = CHECKLIST_ITEMS.filter((item) => !checkedItems[item]);
    if (unchecked.length > 0) {
      const proceed = confirm(
        `Warning: ${unchecked.length} check(s) are not marked as passed:\n- ${unchecked.join("\n- ")}\n\nDo you still want to approve this vehicle?`
      );
      if (!proceed) return;
    }

    setSubmitting(true);
    try {
      await apiClient.post(`/api/inspector/verify/${selectedReq.id}`, {
        status: "VERIFIED",
        inspectionNotes: summaryNotes,
        overallRating: unchecked.length === 0 ? 5 : 4,
      });

      toast.success("Vehicle Verified & Certified Successfully!", {
        description: `${selectedReq.vehicleBrand} ${selectedReq.vehicleModel} is now awarded the Certified badge!`,
      });

      setIsModalOpen(false);
      setSelectedReq(null);
      fetchPending();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to verify vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedReq) return;
    if (!notes.trim()) {
      toast.error("Please provide the rejection reason in the notes field.");
      return;
    }

    const confirmReject = confirm(
      "Are you sure you want to REJECT this vehicle's certification? The vehicle will remain uncertified."
    );
    if (!confirmReject) return;

    setSubmitting(true);
    try {
      await apiClient.post(`/api/inspector/reject/${selectedReq.id}`, {
        status: "REJECTED",
        inspectionNotes: notes.trim(),
      });

      toast.warning("Vehicle certification marked as rejected", {
        description: "Dealer vehicle will remain active without certified status.",
      });

      setIsModalOpen(false);
      setSelectedReq(null);
      fetchPending();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reject inspection");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.vehicleBrand?.toLowerCase().includes(q) ||
      r.vehicleModel?.toLowerCase().includes(q) ||
      r.dealerBusinessName?.toLowerCase().includes(q) ||
      r.area?.toLowerCase().includes(q) ||
      r.vehicleCity?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Area Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40">
              <Clock className="h-3 w-3" /> Area Pending Queue
            </span>
            <span className="text-xs text-slate-500">Auto-matched by City/Area</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Vehicle Certification Requests
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Physical inspection required before certifying vehicles in your assigned jurisdiction.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setRefreshing(true);
              fetchPending();
            }}
            disabled={refreshing}
            className="rounded-xl flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <div className="px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-right">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold tracking-wider block">
              Pending in {user?.assignedArea || "Your Area"}
            </span>
            <span className="text-xl font-black text-emerald-900 dark:text-emerald-200">
              {requests.length} Cars
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <Search className="h-5 w-5 text-slate-400 ml-2" />
        <Input
          placeholder="Search by brand, model, dealer name, or city..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-0 bg-transparent focus-visible:ring-0 shadow-none text-sm"
        />
        {search && (
          <Button variant="ghost" size="sm" onClick={() => setSearch("")} className="text-xs">
            Clear
          </Button>
        )}
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <RefreshCw className="h-8 w-8 text-rose-900 animate-spin mb-3" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Loading pending requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center">
          <div className="h-14 w-14 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 mb-4 border border-emerald-200 dark:border-emerald-900/50">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            All Caught Up!
          </h3>
          <p className="text-sm text-slate-500 max-w-md">
            There are no pending vehicle certification requests for{" "}
            <strong>{user?.assignedArea || "your area"}</strong> right now. When a dealer requests certification, it will appear here instantly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Header: Area badge and Request Date */}
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-bold text-rose-900 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-lg">
                    <MapPin className="h-3.5 w-3.5" /> {req.area || req.vehicleCity}
                  </span>
                  <span className="text-slate-400">
                    Requested on: {new Date(req.requestDate).toLocaleDateString()}
                  </span>
                </div>

                {/* Main Content: Vehicle Info & Thumbnail */}
                <div className="flex gap-4">
                  <div className="w-28 h-24 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-800">
                    {req.vehicleThumbnail ? (
                      <img
                        src={req.vehicleThumbnail}
                        alt={`${req.vehicleBrand} ${req.vehicleModel}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Car className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                      {req.vehicleBrand} {req.vehicleModel}
                    </h3>
                    <p className="text-xs text-slate-500 truncate mb-2">
                      {req.vehicleVariant || "Standard"} • {req.registrationYear}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-black text-rose-900 dark:text-rose-400">
                        {formatINR(req.askingPrice)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Gauge className="h-3 w-3 text-slate-400" /> {formatKM(req.kilometerDriven)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Fuel className="h-3 w-3 text-slate-400" /> {req.fuelType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dealer Info Box */}
                <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Dealer Details</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{req.dealerBusinessName}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <span>Contact: {req.dealerOwnerName}</span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${req.dealerMobile}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                      >
                        <Phone className="h-3 w-3" /> {req.dealerMobile}
                      </a>
                      {req.dealerWhatsapp && (
                        <a
                          href={`https://wa.me/91${req.dealerWhatsapp.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-600 hover:text-emerald-700"
                          title="Chat on WhatsApp"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  {req.dealerAddress && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1 pt-0.5">
                      <MapPin className="h-3 w-3 shrink-0 mt-0.5 text-slate-400" />
                      <span className="truncate">{req.dealerAddress}, {req.dealerCity}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                <Button
                  onClick={() => handleOpenModal(req)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Physically Inspect & Verify
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verification Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Physical Vehicle Inspection</span>
            </div>
            <DialogTitle className="text-xl font-black">
              {selectedReq?.vehicleBrand} {selectedReq?.vehicleModel} ({selectedReq?.registrationYear})
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Dealer: <strong>{selectedReq?.dealerBusinessName}</strong> • Showroom: {selectedReq?.dealerAddress}, {selectedReq?.dealerCity}
            </DialogDescription>
          </DialogHeader>

          {/* Inspection Checklist */}
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                <CheckSquare className="h-4 w-4 text-emerald-600" />
                Physical Inspection Checklist
              </h4>
              <p className="text-[11px] text-slate-500 mb-3">
                Toggle items based on physical inspection results. Approved parameters grant the official Caryanam Certified tag.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CHECKLIST_ITEMS.map((item) => {
                  const isChecked = !!checkedItems[item];
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleCheck(item)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        isChecked
                          ? "bg-emerald-50/70 border-emerald-300 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200"
                          : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500"
                      }`}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-300 shrink-0" />
                      )}
                      <span className="font-medium leading-tight">{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes & Remarks */}
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Inspector Notes & Physical Observations (Optional for Approval, Required for Rejection)
              </label>
              <Textarea
                placeholder="Add physical condition summary, tyre tread life, battery age, body polish remarks..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="text-xs rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleReject}
              disabled={submitting}
              className="rounded-xl text-xs flex items-center gap-1.5"
            >
              <XCircle className="h-4 w-4" />
              Reject Inspection
            </Button>

            <Button
              type="button"
              onClick={handleCompleteVerify}
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <CheckCircle2 className="h-4 w-4" />
              {submitting ? "Submitting..." : "Complete Verify (Certify Vehicle)"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

