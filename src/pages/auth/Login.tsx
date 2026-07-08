import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { User, Lock, Eye, EyeOff, ArrowRight, Shield, Zap, LineChart, ArrowLeft, CheckCircle2, Loader2, KeyRound, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/shared/SEO";
import { useLogin, LoginError } from "@/hooks/auth/login";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useDealerAuth } from "@/contexts/DealerAuthContext";
import { toast } from "sonner";
import { useState } from "react";
import carImg from "@/assets/download.jpg";
import logo from "@/assets/logo.png";
import {
  useCustomerSendOtp,
  useCustomerVerifyOtp,
  useCustomerResetPassword,
} from "@/hooks/auth/resetPassword";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
type FormData = {
  username: string;
  password: string;
};

export default function Login() {
  const { isLoggingIn, login } = useLogin();
  const { setUserFromToken: setAdmin } = useAdminAuth();
  const { setUserFromToken: setDealer } = useDealerAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot Password State
  const [forgotPasswordStep, setForgotPasswordStep] = useState<"none" | "send" | "verify" | "reset">("none");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState("");
  
  const { isPending: sendingOtp, sendOtp } = useCustomerSendOtp();
  const { isPending: verifyingOtp, verifyOtp } = useCustomerVerifyOtp();
  const { isPending: resettingPassword, resetPassword } = useCustomerResetPassword();
  const form = useForm<FormData>({
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await login({
        username: data.username,
        password: data.password,
      });
      if (result.role === "admin") {
        setAdmin(result.data);
      } else {
        setDealer(result.data);
      }

      const payload = result.data as Record<string, any>;
      const dealerName = String(
        payload.businessName ?? payload.ownerName ?? payload.name ?? "Dealer",
      );

      toast.success(
        result.role === "admin"
          ? "Welcome, Admin!"
          : `Welcome back, ${dealerName}!`,
        {
          description:
            result.role === "admin" ? "Admin Dashboard" : "Dealer Dashboard",
        },
      );

      navigate(
        result.role === "admin" ? "/admin/dashboard" : "/dealer/dashboard",
        { replace: true },
      );
    } catch (error) {
      if (error instanceof LoginError) {
        toast.error(error.message, {
          description: "Please check your credentials and try again.",
          duration: 5000,
        });
      } else {
        toast.error("Login failed. Please check your connection.");
      }
    }
  };

  const handleForgotSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return toast.error("Please enter email/mobile");
    try {
      const res = await sendOtp(forgotEmail);
      toast.success(
        typeof res === "string"
          ? res
          : (res?.message || res?.data?.message || "OTP sent successfully")
      );
      setForgotPasswordStep("verify");
    } catch (err: any) {
      toast.error(err?.message || "Failed to send OTP");
    }
  };

  const handleForgotVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotOtp) return toast.error("Please enter OTP");
    try {
      const res = await verifyOtp({ email: forgotEmail, otp: forgotOtp });
      toast.success(
        typeof res === "string"
          ? res
          : (res?.message || res?.data?.message || "OTP verified")
      );
      setForgotPasswordStep("reset");
    } catch (err: any) {
      toast.error(err?.message || "Failed to verify OTP");
    }
  };

  const handleForgotResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotNewPassword !== forgotConfirmPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      const res = await resetPassword({ email: forgotEmail, otp: forgotOtp, newPassword: forgotNewPassword });
      toast.success(
        typeof res === "string"
          ? res
          : (res?.message || res?.data?.message || "Password reset successfully")
      );
      setForgotPasswordStep("none");
      setForgotEmail("");
      setForgotOtp("");
      setForgotNewPassword("");
      setForgotConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.message || "Failed to reset password");
    }
  };

  return (
    <>
      <SEO title="Sign In — Caryanam" />
      <div className="min-h-screen font-sans flex items-center justify-center p-4 sm:p-6 md:p-0 md:grid md:grid-cols-12 relative overflow-hidden text-slate-900 bg-slate-900">
        {/* Background Car Image for Mobile Viewports */}
        <div className="absolute inset-0 block md:hidden z-0">
          <img
            src={carImg}
            alt="Caryanam Background Mobile"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 z-0" />
        </div>
        {/* LEFT PANEL: Rose to Slate Brand Panel */}
        <div className="md:col-span-6 hidden md:flex flex-col justify-between p-12 text-white relative overflow-hidden min-h-screen">
          {/* Background Car Image */}
          <img
            src={carImg}
            alt="Caryanam Background"
            className="absolute inset-0 w-full h-full object-cover animate-fade-in"
          />
          {/* Dark gradient overlay over background image for maximum readability */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/85 via-black/60 to-black/40 z-0" />

          {/* Brand Logo & Header */}
          <Link to="/" className="relative z-10 flex  items-center gap-3">
            <img src={logo} className="h-10 w-10 object-cover rounded-sm" />
            <div
              className="font-logo lg:text-sm xl:text-lg  text-lg tracking-[0.2em] text-white"
              style={{ transform: "scaleY(1.6)" }}
            >
              CARY<span className="text-yellow-400">A</span>NAM
            </div>
          </Link>

          {/* Slogan Text block */}
          <div className="relative z-10 my-auto space-y-3.5 max-w-md">
            <p className="text-base font-normal text-white/90">Hello!</p>
            <h2 className="text-4xl sm:text-5xl font-black font-display tracking-tight leading-none text-white">
              Welcome Back
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black text-rose-500 leading-none">
              Good to see you again
            </h3>
            <p className="text-xs text-white leading-relaxed font-light mt-4">
              Access your dealer portal to manage stock, post listings, track customer inquiries, and verify leads instantly. Connect with active car buyers across the platform and scale your business.
            </p>
          </div>

          {/* Bottom features bar */}
          <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-white/40 pt-6 mt-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 mb-2 shadow-sm">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-xs font-bold text-white tracking-wide">Secure Access</h4>
              <p className="text-[10px] text-white/60 leading-relaxed font-light">Your data is protected with top-grade security</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 mb-2 shadow-sm">
                <LineChart className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-xs font-bold text-white tracking-wide">Manage Efficiently</h4>
              <p className="text-[10px] text-white/60 leading-relaxed font-light">Streamline inventory and lead management</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 mb-2 shadow-sm">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-xs font-bold text-white tracking-wide">Always Fast</h4>
              <p className="text-[10px] text-white/60 leading-relaxed font-light">Quick and seamless experience every time</p>
            </div>
          </div>
        </div>        {/* RIGHT PANEL: Minimalist Onboarding Form Workspace */}
        <div className="w-full max-w-md bg-slate-950/40 backdrop-blur-md border border-white/10 rounded-[32px] p-8 sm:p-10 shadow-none relative overflow-hidden z-10 md:h-full md:min-h-screen md:rounded-none md:max-w-none md:col-span-6 md:p-16 md:flex md:flex-col md:justify-center md:bg-white md:shadow-2xl md:border-0 md:backdrop-blur-none">

          {/* Concentric Circle and Semicircle top right details */}
          <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none select-none">
            <svg className="absolute -top-4 -right-4 w-20 h-20 text-rose-900/10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="0" r="80" stroke="currentColor" strokeWidth="1" strokeOpacity="0.15" />
              <circle cx="100" cy="0" r="60" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
              <circle cx="100" cy="0" r="40" fill="currentColor" fillOpacity="0.1" />
            </svg>
          </div>

          {/* Form Content */}
          <div className="w-full max-w-sm mx-auto text-left relative z-10">

            <h1 className="font-display text-3xl font-extrabold text-white md:text-slate-900 tracking-tight">
              Login
            </h1>
            <p className="text-xs text-white/70 md:text-slate-500 mt-1">
              Welcome back! Please enter your details.
            </p>
            <div className="w-10 h-1 bg-rose-900 mt-3 rounded-full" />

            {forgotPasswordStep === "none" ? (
            <>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-8 space-y-4"
            >
              {/* Username Input Container */}
              <div className="space-y-1.5">
                <Label className="block text-xs font-semibold text-slate-200 md:text-slate-600">
                  Email / Mobile Number
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50 group-focus-within:text-white md:text-rose-900/60 md:group-focus-within:text-rose-900 transition-colors" />
                  <Input
                    type="text"
                    required
                    placeholder="Enter email or 10-digit mobile"
                    onInput={(e: React.FormEvent<HTMLInputElement>) => {
                      const target = e.currentTarget;
                      const val = target.value;
                      if (/^\d+$/.test(val)) {
                        if (/^[6-9]/.test(val)) {
                          target.value = val.slice(0, 10);
                        } else {
                          target.value = "";
                          toast.error("Mobile number must start with 6, 7, 8, or 9");
                        }
                      }
                    }}
                    className="h-11 pl-11 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus-visible:bg-black/40 focus-visible:border-white focus-visible:ring-4 focus-visible:ring-white/10 md:border-rose-900/10 md:bg-rose-900/[0.01] md:text-slate-900 md:placeholder-slate-400 md:focus-visible:bg-white md:focus-visible:border-rose-900 md:focus-visible:ring-rose-900/10 transition-all shadow-sm"
                    {...form.register("username", {
                      required: "Email or Mobile Number is required",
                      validate: (value) => {
                        const trimmed = value.trim();
                        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
                        const isMobile = /^[6-9][0-9]{9}$/.test(trimmed);
                        if (isEmail) return true;
                        if (/^\d+$/.test(trimmed)) {
                          if (!/^[6-9]/.test(trimmed)) {
                            return "Mobile number must start with 6, 7, 8, or 9";
                          }
                          if (trimmed.length < 10) {
                            return "Mobile number must be at least 10 digits";
                          }
                          return true;
                        }
                        return "Please enter a valid email address or 10-digit mobile number";
                      }
                    })}
                  />
                </div>
              </div>

              {/* Password Input Container */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label className="block text-xs font-semibold text-slate-200 md:text-slate-600">
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordStep("send")}
                    className="text-[10px] text-white/50 hover:text-white md:text-slate-400 md:hover:text-slate-600 transition-colors underline-offset-4 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50 group-focus-within:text-white md:text-rose-900/60 md:group-focus-within:text-rose-900 transition-colors" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Your password"
                    className="h-11 pl-11 pr-11 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus-visible:bg-black/40 focus-visible:border-white focus-visible:ring-4 focus-visible:ring-white/10 md:border-rose-900/10 md:bg-rose-900/[0.01] md:text-slate-900 md:placeholder-slate-400 md:focus-visible:bg-white md:focus-visible:border-rose-900 md:focus-visible:ring-rose-900/10 transition-all shadow-sm"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white md:text-rose-900/60 md:hover:text-rose-900 transition-colors cursor-pointer"
                  >
                    {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                </div>
              </div>



              {/* Submit Action Button */}
              <Button
                type="submit"
                disabled={isLoggingIn}

                className="w-full h-11 gradient-primary  text-white rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-900/10 uppercase text-xs tracking-wider border-0 mt-6"
              >
                {isLoggingIn ? "Logging in…" : "Login"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            {/* OR Divider */}
            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-white/10 md:border-slate-100"></div>
              <span className="flex-shrink mx-4 text-white/40 md:text-slate-400 text-[10px] font-bold tracking-wider">OR</span>
              <div className="flex-grow border-t border-white/10 md:border-slate-100"></div>
            </div>

            {/* Create account link */}
            <div className="text-center mt-6 text-xs text-white/50 md:text-slate-400 font-semibold tracking-wide">
              Don't have any account?{" "}
              <Link
                to="/auth/register"
                className="text-rose-400 md:text-rose-900 font-bold hover:text-rose-200 md:hover:text-rose-950 hover:underline transition-colors ml-1"
              >
                Create an account
              </Link>
            </div>
            </>
            ) : forgotPasswordStep === "send" ? (
              <form onSubmit={handleForgotSendOtp} className="mt-8 space-y-4">
                <div className="space-y-1.5">
                  <Label className="block text-xs font-semibold text-slate-200 md:text-slate-600">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50 group-focus-within:text-white md:text-rose-900/60 md:group-focus-within:text-rose-900 transition-colors" />
                    <Input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Enter registered email"
                      className="h-11 pl-11 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus-visible:bg-black/40 focus-visible:border-white md:border-rose-900/10 md:bg-rose-900/[0.01] md:text-slate-900 md:focus-visible:bg-white md:focus-visible:border-rose-900"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-6">
                  <Button
                    type="submit"
                    disabled={sendingOtp || !forgotEmail}
                    className="w-full h-11 gradient-primary text-white rounded-xl font-bold"
                  >
                    {sendingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send OTP"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setForgotPasswordStep("none")}
                    className="w-full text-white/60 hover:text-white md:text-slate-500 md:hover:text-slate-900 text-xs"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
                  </Button>
                </div>
              </form>
            ) : forgotPasswordStep === "verify" ? (
              <form onSubmit={handleForgotVerifyOtp} className="mt-8 space-y-4">
                <div className="space-y-4">
                  <div className="text-center">
                    <Label className="block text-xs font-semibold text-slate-200 md:text-slate-600 mb-2">
                      Enter OTP sent to {forgotEmail}
                    </Label>
                    <div className="flex justify-center mt-4">
                      <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                        value={forgotOtp}
                        onChange={setForgotOtp}
                      >
                        <InputOTPGroup className="gap-2">
                          {[0, 1, 2, 3, 4, 5].map((index) => (
                            <InputOTPSlot 
                              key={index} 
                              index={index} 
                              className="w-12 h-14 rounded-xl border-white/20 bg-white/10 text-white text-xl md:border-rose-900/20 md:bg-white md:text-slate-900"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-8">
                  <Button
                    type="submit"
                    disabled={verifyingOtp || forgotOtp.length < 6}
                    className="w-full h-11 gradient-primary text-white rounded-xl font-bold"
                  >
                    {verifyingOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify OTP"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setForgotPasswordStep("send")}
                    className="w-full text-white/60 hover:text-white md:text-slate-500 md:hover:text-slate-900 text-xs"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotResetPassword} className="mt-8 space-y-4">
                <div className="space-y-1.5">
                  <Label className="block text-xs font-semibold text-slate-200 md:text-slate-600">New Password</Label>
                  <div className="relative group">
                    <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50 group-focus-within:text-white md:text-rose-900/60 md:group-focus-within:text-rose-900" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="h-11 pl-11 pr-11 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus-visible:bg-black/40 focus-visible:border-white md:border-rose-900/10 md:bg-rose-900/[0.01] md:text-slate-900 md:focus-visible:bg-white md:focus-visible:border-rose-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white md:text-rose-900/60 md:hover:text-rose-900"
                    >
                      {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5 mt-4">
                  <Label className="block text-xs font-semibold text-slate-200 md:text-slate-600">Confirm Password</Label>
                  <div className="relative group">
                    <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50 group-focus-within:text-white md:text-rose-900/60 md:group-focus-within:text-rose-900" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="h-11 pl-11 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus-visible:bg-black/40 focus-visible:border-white md:border-rose-900/10 md:bg-rose-900/[0.01] md:text-slate-900 md:focus-visible:bg-white md:focus-visible:border-rose-900"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-6">
                  <Button
                    type="submit"
                    disabled={resettingPassword || !forgotNewPassword || !forgotConfirmPassword}
                    className="w-full h-11 gradient-primary text-white rounded-xl font-bold"
                  >
                    {resettingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Password"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setForgotPasswordStep("none")}
                    className="w-full text-white/60 hover:text-white md:text-slate-500 md:hover:text-slate-900 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

