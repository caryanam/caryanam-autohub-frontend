import { useState, useEffect } from "react";
import axios from "axios";
import apiClient from "@/lib/apiClient";
import {
  ShieldCheck,
  UserPlus,
  Search,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Lock,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { Inspector } from "@/types";
import { useAreas } from "@/hooks/public/useAreas";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://c1.caryanam.com";

export default function AdminInspectors() {
  const [inspectors, setInspectors] = useState<Inspector[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { data: areas = [] } = useAreas();

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [assignedArea, setAssignedArea] = useState("");
  const [customArea, setCustomArea] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchInspectors = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await apiClient.get("/api/admin/inspectors");
      setInspectors(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load inspectors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspectors();
  }, []);

  const handleCreateInspector = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalArea = assignedArea === "OTHER" ? customArea.trim() : assignedArea.trim();

    if (!fullName.trim() || !email.trim() || !mobile.trim() || !password.trim() || !finalArea) {
      toast.error("Please fill in all required fields including assigned area.");
      return;
    }

    if (!mobile.match(/^[6-9]\d{9}$/)) {
      toast.error("Please enter a valid 10-digit mobile number starting with 6-9.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setCreating(true);
    try {
      const token = localStorage.getItem("adminToken");
      await apiClient.post("/api/admin/inspectors", {
          fullName: fullName.trim(),
          email: email.trim(),
          mobile: mobile.trim(),
          password: password.trim(),
          assignedArea: finalArea,
          isActive: true,
        });

      toast.success("Inspector Created Successfully!", {
        description: `Inspector ${fullName} assigned to ${finalArea}. They can now login with these credentials.`,
      });

      setIsCreateOpen(false);
      setFullName("");
      setEmail("");
      setMobile("");
      setPassword("");
      setAssignedArea("");
      setCustomArea("");
      fetchInspectors();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create inspector");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (id: number, currentActive: boolean) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `${API_BASE_URL}/api/admin/inspectors/${id}/status?active=${!currentActive}`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      toast.success(`Inspector ${!currentActive ? "Activated" : "Deactivated"} Successfully`);
      fetchInspectors();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to change inspector status");
    }
  };

  const filtered = inspectors.filter((i) => {
    const q = search.toLowerCase();
    return (
      i.fullName?.toLowerCase().includes(q) ||
      i.email?.toLowerCase().includes(q) ||
      i.mobile?.toLowerCase().includes(q) ||
      i.assignedArea?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40">
              <ShieldCheck className="h-3 w-3" /> Area Inspectors
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Inspectors Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Create and manage verified vehicle inspectors without direct registration. Assign operational areas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchInspectors}
            className="rounded-xl flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-rose-900 hover:bg-rose-950 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
          >
            <UserPlus className="h-4 w-4" /> Add Inspector
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <Search className="h-5 w-5 text-slate-400 ml-2" />
        <Input
          placeholder="Search inspectors by name, email, mobile, or assigned area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-0 bg-transparent focus-visible:ring-0 shadow-none text-sm"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center p-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <RefreshCw className="h-8 w-8 text-rose-900 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-slate-500">
          No inspectors found. Click "Add Inspector" to create one.
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Inspector Name</th>
                  <th className="py-3.5 px-4">Contact Details</th>
                  <th className="py-3.5 px-4">Assigned Area</th>
                  <th className="py-3.5 px-4">Inspections Completed</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                          {item.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{item.fullName}</p>
                          <p className="text-[11px] text-slate-400">ID #{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <Phone className="h-3 w-3 text-slate-400" /> {item.mobile}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                        <Mail className="h-3 w-3 text-slate-400" /> {item.email}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <MapPin className="h-3 w-3 text-emerald-600" /> {item.assignedArea}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-black text-sm text-slate-900 dark:text-white">
                        {item.totalCompletedInspections ?? 0}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-1">vehicles</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.isActive ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500">
                          <XCircle className="h-3.5 w-3.5" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(item.id, item.isActive)}
                        className={`text-xs rounded-xl ${
                          item.isActive
                            ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        }`}
                      >
                        {item.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Inspector Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <div className="flex items-center gap-2 text-rose-900 mb-1">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Admin Action</span>
            </div>
            <DialogTitle className="text-xl font-black">Add New Inspector</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Create an official inspector account. No direct registration is permitted for inspectors.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateInspector} className="space-y-3.5 py-2">
            <div>
              <Label className="text-xs font-semibold">Full Name *</Label>
              <Input
                placeholder="e.g. Rahul Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 text-xs rounded-xl"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Login Email *</Label>
              <Input
                type="email"
                placeholder="inspector.rahul@caryanam.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 text-xs rounded-xl"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Mobile Number *</Label>
              <Input
                placeholder="10-digit mobile (e.g. 9876543210)"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="mt-1 text-xs rounded-xl"
                maxLength={10}
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Account Password *</Label>
              <Input
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 text-xs rounded-xl"
                minLength={6}
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Assigned Operating City / Area *</Label>
              <select
                value={assignedArea}
                onChange={(e) => setAssignedArea(e.target.value)}
                className="w-full mt-1 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs"
                required
              >
                <option value="">Select an operational area...</option>
                <option value="Pune">Pune (All Area)</option>
                <option value="PCMC">PCMC (Pimpri-Chinchwad)</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Thane">Thane</option>
                <option value="Navi Mumbai">Navi Mumbai</option>
                <option value="Nagpur">Nagpur</option>
                <option value="Nashik">Nashik</option>
                <option value="Kolhapur">Kolhapur</option>
                <option value="OTHER">Other / Custom Area</option>
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {assignedArea === "OTHER" && (
              <div>
                <Label className="text-xs font-semibold">Specify Custom Area Name *</Label>
                <Input
                  placeholder="e.g. Hadapsar, Baner, Kothrud..."
                  value={customArea}
                  onChange={(e) => setCustomArea(e.target.value)}
                  className="mt-1 text-xs rounded-xl"
                  required
                />
              </div>
            )}

            <DialogFooter className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                disabled={creating}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={creating}
                className="bg-rose-900 hover:bg-rose-950 text-white rounded-xl text-xs font-bold"
              >
                {creating ? "Creating..." : "Save Inspector"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

