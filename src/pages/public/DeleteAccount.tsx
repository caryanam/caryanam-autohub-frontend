import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";
import { clearCustomer } from "@/hooks/public/useCustomerAuth";
import logo from "@/assets/logo.png";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle, Trash2, KeyRound, Mail, Loader2, ShieldAlert } from "lucide-react";

export default function DeleteAccount() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsModalOpen(false);
    setLoading(true);
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/customer/delete-account`, {
        data: {
          username,
          password
        }
      });
      toast.success(response.data || "Customer account deleted successfully.");
      clearCustomer();
      setUsername("");
      setPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete account. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="grid h-8 w-8 place-items-center rounded-sm overflow-hidden bg-black">
              <img src={logo} className="h-8 w-8 object-cover" />
            </div>
            <div
              className="font-logo text-sm tracking-[0.2em] text-[#0f172a] font-bold"
              style={{ transform: "scaleY(1.4)" }}
            >
              CARY<span className="text-yellow-500">A</span>NAM
            </div>
          </div>
          <h1 className="text-3xl font-black text-[#0f172a] mb-4">Delete Your Account</h1>
          <p className="text-slate-500 text-[15px] leading-relaxed max-w-3xl">
            Enter your registered email or phone number and password to request deletion of your Caryanam account. This flow is for customers and dealers who want to permanently remove account access.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200">
          
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2 bg-red-50 rounded-lg shrink-0 mt-1">
              <Trash2 className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0f172a] mb-4">Delete Your Caryanam Account</h2>
              <div className="space-y-4 text-slate-500 text-[14px] leading-relaxed">
                <p>
                  At Caryanam, we respect your privacy and give you control over your account information. You can request account deletion by verifying your registered email or phone number and password.
                </p>
                <p>
                  Once deletion is confirmed, your login access, profile details, saved cars, uploaded documents, payment verification records, dealer/customer records, and account-related information may be removed from our platform.
                </p>
                <p>
                  Some information may be retained where required for legal, payment, security, dispute resolution, audit, or compliance purposes.
                </p>
                <p>
                  Before deleting your account, make sure you have no active car purchases, pending payments, or unresolved service issues.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 my-8" />

          {/* Form */}
          <form onSubmit={handlePreSubmit} className="space-y-6 max-w-xl">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#0f172a]">Email Address / Phone Number</label>
              <Input 
                type="text" 
                placeholder="Enter your registered email or phone number" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#f4f7f9] border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-red-500/20 focus-visible:border-red-500 h-11 rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#0f172a]">Password</label>
              <Input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#f4f7f9] border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-red-500/20 focus-visible:border-red-500 h-11 rounded-lg"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="bg-[#d92d20] hover:bg-[#b42318] text-white h-11 rounded-lg font-bold px-6" 
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
              ) : (
                <><Trash2 className="mr-2 h-4 w-4" /> Request Account Deletion</>
              )}
            </Button>
          </form>
        </div>
      </div>

      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AlertDialogContent className="bg-white border-slate-200 text-slate-900 shadow-2xl rounded-2xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 text-red-600 mb-2">
              <div className="p-2 bg-red-50 rounded-full">
                <AlertCircle className="h-6 w-6" />
              </div>
              <AlertDialogTitle className="text-xl text-slate-900 font-bold">Absolute Certainty?</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-slate-500 text-[15px] leading-relaxed">
              This action cannot be undone. This will permanently delete your account
              and remove all of your data from our servers immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 border-t border-slate-100 pt-4">
            <AlertDialogCancel className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-xl font-semibold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => { e.preventDefault(); handleConfirmDelete(); }}
              className="bg-red-600 text-white hover:bg-red-700 rounded-xl font-semibold shadow-md shadow-red-600/20"
            >
              Yes, delete my account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
