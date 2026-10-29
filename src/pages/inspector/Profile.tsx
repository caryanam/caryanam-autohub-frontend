import { useInspectorAuth } from "@/contexts/InspectorAuthContext";
import { User, MapPin, Mail, Phone, ShieldCheck, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function InspectorProfile() {
  const { user } = useInspectorAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5">
        <div className="h-16 w-16 rounded-2xl bg-slate-950 text-white flex items-center justify-center text-2xl font-black uppercase shadow-md">
          {user?.name ? user.name.charAt(0) : "I"}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {user?.name || "Inspector"}
            </h2>
            <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md">
              OFFICIAL VERIFIER
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Caryanam Authorized Vehicle Inspector</p>
        </div>
      </div>

      <Card className="rounded-3xl border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            Account & Operational Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" /> Assigned Jurisdiction Area
            </span>
            <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl text-xs">
              {user?.assignedArea || "Not specified"}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3">
            <span className="text-xs text-slate-500 flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" /> Login Email
            </span>
            <span className="font-medium text-slate-900 dark:text-white">{user?.email || "—"}</span>
          </div>

          <div className="flex items-center justify-between pt-3">
            <span className="text-xs text-slate-500 flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400" /> Mobile Number
            </span>
            <span className="font-medium text-slate-900 dark:text-white">{user?.mobile || "—"}</span>
          </div>

          <div className="flex items-center justify-between pt-3">
            <span className="text-xs text-slate-500 flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" /> Role Authority
            </span>
            <span className="font-semibold text-rose-900 dark:text-rose-400">INSPECTOR</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

