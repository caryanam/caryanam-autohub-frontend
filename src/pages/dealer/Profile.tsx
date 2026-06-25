import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDealerAuth } from "@/contexts/DealerAuthContext";
import { toast } from "sonner";
import {
  Loader2,
  Building2,
  MapPin,
  User,
  Phone,
  Calendar,
  Lock,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { useGetDealerProfile } from "@/hooks/dealer/useGetDealerProfile";
import { useUpdateDealerProfile } from "@/hooks/dealer/useUpdateDealerProfile";
import {
  useSendOtp,
  useVerifyOtp,
  useResetPassword,
} from "@/hooks/dealer/useChangePassword";
import { formatDate } from "@/utils/helpers";

export default function DealerProfile() {
  const { user, updateUserFields } = useDealerAuth();
  const dealerId = user?.id?.toString() || "";

  const { data: profile, isLoading } = useGetDealerProfile(dealerId);
  const updateMutation = useUpdateDealerProfile(dealerId);

  // Profile form state
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState<number | "">("");

  useEffect(() => {
    if (profile) {
      setBusinessName(profile.businessName || "");
      setOwnerName(profile.ownerName || "");
      setMobile(profile.mobile || "");
      setWhatsapp(profile.whatsapp || "");
      setAddress(profile.address || "");
      setCity(profile.city || "");
      setState(profile.state || "");
      setPinCode(profile.pinCode || "");
      setGstNumber(profile.gstNumber || "");
      setYearsInBusiness(
        profile.yearsInBusiness !== undefined && profile.yearsInBusiness !== null
          ? Number(profile.yearsInBusiness)
          : ""
      );
    }
  }, [profile]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({
        businessName,
        ownerName,
        mobile,
        whatsapp,
        address,
        city,
        state,
        pinCode,
      });
      updateUserFields({ businessName, ownerName });
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          (err instanceof Error ? err.message : String(err))
      );
    }
  };

  // Change password flow
  const [pwModal, setPwModal] = useState(false);
  const [step, setStep] = useState<"send" | "verify" | "reset">("send");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const sendOtpMutation = useSendOtp();
  const verifyOtpMutation = useVerifyOtp();
  const resetPasswordMutation = useResetPassword();

  const openPasswordModal = () => {
    setStep("send");
    setEmail(profile?.email || "");
    setOtp("");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPwModal(true);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await sendOtpMutation.mutateAsync(email);
      toast.success(
        typeof res === "string"
          ? res
          : (res?.message || res?.data?.message || "OTP sent to your email")
      );
      setStep("verify");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          (err instanceof Error ? err.message : String(err))
      );
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await verifyOtpMutation.mutateAsync({ email, otp });
      toast.success(
        typeof res === "string"
          ? res
          : (res?.message || res?.data?.message || "OTP verified")
      );
      setStep("reset");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          (err instanceof Error ? err.message : String(err))
      );
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await resetPasswordMutation.mutateAsync({
        email,
        oldPassword,
        newPassword,
      });
      toast.success(
        typeof res === "string"
          ? res
          : (res?.message || res?.data?.message || "Password changed successfully")
      );
      setPwModal(false);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          (err instanceof Error ? err.message : String(err))
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-4 w-64 mt-2 rounded" />
        </div>

        <div className="space-y-6">
          {/* Top Card Skeleton */}
          <Card className="rounded-3xl border border-slate-100 shadow-premium overflow-hidden bg-white">
            <Skeleton className="h-32 w-full" />
            <CardContent className="p-6 pt-0 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
                  <Skeleton className="h-24 w-24 rounded-2xl border-4 border-white bg-white" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48 rounded" />
                    <Skeleton className="h-4 w-32 rounded" />
                  </div>
                </div>
                <Skeleton className="h-10 w-36 rounded-xl" />
              </div>
              <hr className="my-5 border-slate-100" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </CardContent>
          </Card>

          {/* Bottom Card Skeleton */}
          <Card className="rounded-3xl border border-slate-100 shadow-premium bg-white">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-5 w-28 rounded" />
                <Skeleton className="h-3.5 w-48 rounded" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-32 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-11 w-full rounded-xl" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-32 rounded" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Skeleton className="h-11 w-full rounded-xl" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-32 rounded" />
                <div className="space-y-4">
                  <Skeleton className="h-11 w-full rounded-xl" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-11 w-full rounded-xl" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your business information and security.
        </p>
      </div>

      <div className="space-y-6">
        {/* Top Card - Quick Overview */}
        <Card className="rounded-3xl border border-slate-100 shadow-premium overflow-hidden bg-white">
          {/* Showroom Image Banner */}
          <div className="relative h-40 bg-slate-100 overflow-hidden">
            {profile?.showroomImage ? (
              <img
                src={profile.showroomImage.trim()}
                alt="Showroom"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full gradient-primary opacity-20 flex items-center justify-center">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
          </div>

          <CardContent className="p-6 relative pt-0">
            {/* Dealer Logo, Info & Change Password Button */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-12 mb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                {profile?.dealerLogo ? (
                  <img
                    src={profile.dealerLogo.trim()}
                    alt="Logo"
                    className="h-24 w-24 rounded-2xl object-cover border-4 border-white bg-white shadow-md z-10"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-md z-10">
                    {businessName?.charAt(0)?.toUpperCase()}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                    <h2 className="text-xl md:text-2xl capitalize font-black text-slate-900 leading-none">
                      {businessName}
                    </h2>

                  </div>
                  <p className="text-sm text-slate-500 capitalize font-medium">Owner: {ownerName}</p>
                </div>
              </div>

              <Button
                type="button"
                className="rounded-xl flex items-center justify-center gap-2 font-semibold h-10 gradient-primary text-white hover:opacity-90 transition-colors shadow-sm cursor-pointer px-4 shrink-0 self-center sm:self-end"
                onClick={openPasswordModal}
              >
                <Lock className="h-3.5 w-3.5 text-white" />
                Change Password
              </Button>
            </div>

            {/* Display Only Details - Row Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm mt-6 pt-5 border-t border-slate-100">
              <div className="space-y-1">
                <span className="text-slate-400 font-medium block">Email</span>
                <span className="font-semibold text-slate-700 truncate block" title={profile?.email}>{profile?.email}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-medium block">GST Number</span>
                <span className="font-bold text-slate-700">{profile?.gstNumber || "—"}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-medium block">Years in Business</span>
                <span className="font-bold text-slate-700">{profile?.yearsInBusiness ?? "—"} years</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-medium block">Registered On</span>
                <span className="font-medium text-slate-700">{profile?.createdAt ? formatDate(profile.createdAt) : "—"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Card - Form */}
        <Card className="rounded-3xl border border-slate-100 shadow-premium bg-white">
          <CardContent className="p-6 md:p-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">Edit Profile</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Update your company profile and showroom details.</p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Business Info Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Building2 className="h-4 w-4" /> Business Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-slate-600">Business Name</Label>
                    <Input
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="mt-1.5 rounded-xl h-11 border-slate-200 focus-visible:ring-blue-600 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-slate-600">Owner Name</Label>
                    <Input
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="mt-1.5 rounded-xl h-11 border-slate-200 focus-visible:ring-blue-600 bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contact Info Section */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Phone className="h-4 w-4" /> Contact Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold text-slate-600">Mobile Phone</Label>
                    <Input
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="mt-1.5 rounded-xl h-11 border-slate-200 focus-visible:ring-blue-600 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-slate-600">WhatsApp Number</Label>
                    <Input
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="WhatsApp contact"
                      className="mt-1.5 rounded-xl h-11 border-slate-200 focus-visible:ring-blue-600 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <MapPin className="h-4 w-4" /> Location Details
                </h4>

                <div className="space-y-4">
                  <div>
                    <Label className="text-xs font-semibold text-slate-600">Office / Showroom Address</Label>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1.5 rounded-xl h-11 border-slate-200 focus-visible:ring-blue-600 bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs font-semibold text-slate-600">City</Label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="mt-1.5 rounded-xl h-11 border-slate-200 focus-visible:ring-blue-600 bg-white"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-slate-600">State</Label>
                      <Input
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="mt-1.5 rounded-xl h-11 border-slate-200 focus-visible:ring-blue-600 bg-white"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold text-slate-600">PIN Code</Label>
                      <Input
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        placeholder="e.g. 411045"
                        className="mt-1.5 rounded-xl h-11 border-slate-200 focus-visible:ring-blue-600 bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  className="rounded-xl px-8 gradient-primary text-white hover:opacity-90 font-semibold shadow-md flex items-center gap-2 h-11 cursor-pointer"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Modal */}
      <Dialog open={pwModal} onOpenChange={setPwModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {step === "send" && "Change Password"}
              {step === "verify" && "Verify OTP"}
              {step === "reset" && "Set New Password"}
            </DialogTitle>
          </DialogHeader>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-2">
            {(["send", "verify", "reset"] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${step === s
                    ? "gradient-primary text-white"
                    : (step === "verify" && i === 0) ||
                      (step === "reset" && i <= 1)
                      ? "bg-green-100 text-green-700"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {i + 1}
                </div>
                {i < 2 && <div className="h-px w-8 bg-muted" />}
              </div>
            ))}
            <span className="ml-2 text-xs text-muted-foreground">
              {step === "send"
                ? "Enter email"
                : step === "verify"
                  ? "Enter OTP"
                  : "Set password"}
            </span>
          </div>

          {/* Step 1: Send OTP */}
          {step === "send" && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="mt-1 rounded-xl"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full gradient-primary text-white border-0 rounded-xl"
                disabled={sendOtpMutation.isPending}
              >
                {sendOtpMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send OTP
              </Button>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {step === "verify" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                OTP sent to{" "}
                <span className="font-medium text-foreground">{email}</span>
              </p>
              <div>
                <Label>Enter OTP</Label>
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  maxLength={6}
                  className="mt-1 rounded-xl tracking-widest text-center text-lg"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setStep("send")}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gradient-primary text-white border-0 rounded-xl"
                  disabled={verifyOtpMutation.isPending}
                >
                  {verifyOtpMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Verify OTP
                </Button>
              </div>
              <button
                type="button"
                className="text-xs text-primary underline w-full text-center"
                onClick={handleSendOtp as any}
                disabled={sendOtpMutation.isPending}
              >
                Resend OTP
              </button>
            </form>
          )}

          {/* Step 3: Reset Password */}
          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <Label>Current Password</Label>
                <Input
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  type="password"
                  className="mt-1 rounded-xl"
                  required
                />
              </div>
              <div>
                <Label>New Password</Label>
                <Input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  className="mt-1 rounded-xl"
                  required
                />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  className="mt-1 rounded-xl"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full gradient-primary text-white border-0 rounded-xl"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Change Password
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
