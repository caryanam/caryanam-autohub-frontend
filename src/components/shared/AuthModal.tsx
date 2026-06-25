import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCustomerLogin,
  useCustomerRegister,
  type CustomerUser,
} from "@/hooks/public/useCustomerAuth";
import {
  useCustomerSendOtp,
  useCustomerVerifyOtp,
  useCustomerResetPassword,
} from "@/hooks/auth/resetPassword";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  BadgeCheck,
  Loader2,
} from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: (user: CustomerUser) => void;
}

export function AuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register" | "forgot">("login");
  const [registerDone, setRegisterDone] = useState(false);

  const handleRegisterSuccess = () => {
    setRegisterDone(true);
    setTab("login");
  };

  const handleOpenChange = (v: boolean) => {
    if (!v) setRegisterDone(false);
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 overflow-hidden sm:max-w-4xl border-none bg-background rounded-2xl shadow-premium">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] min-h-[500px]">
          {/* Left Column: Cover Image & Trust Highlights */}
          <div className="relative hidden md:block select-none overflow-hidden bg-slate-950">
            <img
              src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=600&h=800&q=80"
              alt="Premium Car"
              className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay"
            />
            {/* Gradient Mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

            {/* Floating Brand & Highlights */}
            <div className="relative h-full flex flex-col justify-between p-8 text-white z-10">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground font-black text-sm">
                  A
                </div>
                <span className="font-display font-black text-sm tracking-wide">
                  CAPL
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold tracking-wider text-accent uppercase">
                    Verified Listings
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-black leading-tight">
                    Find your dream car from trusted dealers
                  </h3>
                </div>

                <ul className="space-y-3.5 text-sm text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <BadgeCheck className="h-5 w-5 shrink-0 text-accent" />
                    <span>KYC-verified used car dealerships</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-accent" />
                    <span>Inventory checked for authenticity</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                    <span>Direct dealer connect, zero middleman fee</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Forms */}
          <div className="flex flex-col justify-center p-6 sm:p-8 bg-card text-card-foreground">
            <div className="space-y-6 my-auto">
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-black tracking-tight text-foreground">
                  {tab === "login"
                    ? "Welcome back"
                    : tab === "register"
                    ? "Create account"
                    : "Reset password"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {tab === "login"
                    ? "Enter your credentials to access your account."
                    : tab === "register"
                    ? "Register to unlock direct contact and wishlists."
                    : "Follow the steps to reset your account password."}
                </p>
              </div>

              {/* Tabs Toggle */}
              {tab !== "forgot" && (
                <div className="flex rounded-xl bg-muted p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => setTab("login")}
                    className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                      tab === "login"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTab("register");
                      setRegisterDone(false);
                    }}
                    className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                      tab === "register"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Successful registration notice */}
              {registerDone && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3 text-sm text-emerald-800 flex items-start gap-2.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-bold">Registered successfully!</p>
                    <p className="text-xs text-emerald-700/90 mt-0.5">
                      Please login to start exploring.
                    </p>
                  </div>
                </div>
              )}

              {tab === "login" ? (
                <LoginForm
                  onSuccess={(u) => {
                    onSuccess(u);
                    handleOpenChange(false);
                  }}
                  onForgotPassword={() => setTab("forgot")}
                />
              ) : tab === "register" ? (
                <RegisterForm onSuccess={handleRegisterSuccess} />
              ) : (
                <ForgotPasswordForm onBackToLogin={() => setTab("login")} />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LoginForm({
  onSuccess,
  onForgotPassword,
}: {
  onSuccess: (u: CustomerUser) => void;
  onForgotPassword: () => void;
}) {
  const { isLoggingIn, login } = useCustomerLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      const user = await login({ email, password });
      toast.success("Logged in successfully!");
      onSuccess(user);
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="h-11 pl-11 rounded-xl bg-muted/30 focus-visible:ring-offset-0 focus-visible:ring-accent"
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75" />
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-11 pl-11 pr-10 rounded-xl bg-muted/30 focus-visible:ring-offset-0 focus-visible:ring-accent"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex justify-end mt-1">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs font-semibold text-primary hover:underline bg-transparent border-0 cursor-pointer"
        >
          Forgot password?
        </button>
      </div>

      {err && (
        <div className="text-xs font-semibold text-red-500 bg-red-50/50 border border-red-100 rounded-lg p-2.5">
          {err}
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-11 rounded-xl gradient-primary text-white border-0 hover:opacity-90 font-semibold transition-all hover:shadow-md"
        disabled={isLoggingIn}
      >
        {isLoggingIn ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const { isSubmitting, register } = useCustomerRegister();
  const [form, setForm] = useState({
    customerName: "",
    mobile: "",
    customerCity: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      await register(form);
      onSuccess();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3.5">
      <div className="space-y-1">
        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Full Name
        </Label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75" />
          <Input
            value={form.customerName}
            onChange={(e) => set("customerName", e.target.value)}
            placeholder="Aman Verma"
            className="h-11 pl-11 rounded-xl bg-muted/30 focus-visible:ring-offset-0 focus-visible:ring-accent"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Mobile
          </Label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75" />
            <Input
              value={form.mobile}
              onChange={(e) => set("mobile", e.target.value)}
              placeholder="9876543210"
              className="h-11 pl-11 rounded-xl bg-muted/30 focus-visible:ring-offset-0 focus-visible:ring-accent"
              maxLength={10}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            City
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={form.customerCity}
              onChange={(e) => set("customerCity", e.target.value)}
              placeholder="Mumbai"
              className="h-11 pl-11 rounded-xl bg-muted/30 focus-visible:ring-offset-0 focus-visible:ring-accent"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75" />
          <Input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            className="h-11 pl-11 rounded-xl bg-muted/30 focus-visible:ring-offset-0 focus-visible:ring-accent"
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75" />
          <Input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            placeholder="Min. 6 characters"
            className="h-11 pl-11 pr-10 rounded-xl bg-muted/30 focus-visible:ring-offset-0 focus-visible:ring-accent"
            minLength={6}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {err && (
        <div className="text-xs font-semibold text-red-500 bg-red-50/50 border border-red-100 rounded-lg p-2.5">
          {err}
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-11 rounded-xl gradient-primary text-white border-0 hover:opacity-90 font-semibold transition-all hover:shadow-md mt-1"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account…" : "Create Account"}
      </Button>
    </form>
  );
}

function ForgotPasswordForm({ onBackToLogin }: { onBackToLogin: () => void }) {
  const [step, setStep] = useState<"send" | "verify" | "reset">("send");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");

  const { isPending: sendingOtp, sendOtp } = useCustomerSendOtp();
  const { isPending: verifyingOtp, verifyOtp } = useCustomerVerifyOtp();
  const { isPending: resettingPassword, resetPassword } = useCustomerResetPassword();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await sendOtp(email);
      toast.success(
        typeof res === "string"
          ? res
          : (res?.message || res?.data?.message || "OTP sent to your email")
      );
      setStep("verify");
    } catch (error: any) {
      setErr(error.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      const res = await verifyOtp({ email, otp });
      toast.success(
        typeof res === "string"
          ? res
          : (res?.message || res?.data?.message || "OTP verified successfully")
      );
      setStep("reset");
    } catch (error: any) {
      setErr(error.message);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }
    try {
      const res = await resetPassword({ email, otp, newPassword });
      toast.success(
        typeof res === "string"
          ? res
          : (res?.message || res?.data?.message || "Password changed successfully")
      );
      onBackToLogin();
    } catch (error: any) {
      setErr(error.message);
    }
  };

  return (
    <div className="space-y-4">
      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-2">
        {(["send", "verify", "reset"] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === s
                  ? "gradient-primary text-white"
                  : (step === "verify" && i === 0) || (step === "reset" && i <= 1)
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

      {err && (
        <div className="text-xs font-semibold text-red-500 bg-red-50/50 border border-red-100 rounded-lg p-2.5">
          {err}
        </div>
      )}

      {/* Step 1: Send OTP */}
      {step === "send" && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="h-11 pl-11 rounded-xl bg-muted/30 focus-visible:ring-offset-0 focus-visible:ring-accent"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-xl gradient-primary text-white border-0 hover:opacity-90 font-semibold transition-all hover:shadow-md"
            disabled={sendingOtp}
          >
            {sendingOtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send OTP
          </Button>
        </form>
      )}

      {/* Step 2: Verify OTP */}
      {step === "verify" && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            OTP sent to <span className="font-semibold text-foreground">{email}</span>
          </p>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enter OTP
            </Label>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
              maxLength={6}
              className="h-11 rounded-xl tracking-widest text-center text-lg bg-muted/30 focus-visible:ring-offset-0 focus-visible:ring-accent"
              required
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11 rounded-xl"
              onClick={() => setStep("send")}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 rounded-xl gradient-primary text-white border-0 hover:opacity-90 font-semibold"
              disabled={verifyingOtp}
            >
              {verifyingOtp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify OTP
            </Button>
          </div>

          <button
            type="button"
            className="text-xs text-primary underline w-full text-center hover:opacity-80 bg-transparent border-0 cursor-pointer"
            onClick={handleSendOtp as any}
            disabled={sendingOtp}
          >
            Resend OTP
          </button>
        </form>
      )}

      {/* Step 3: Reset Password */}
      {step === "reset" && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75" />
              <Input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 pl-11 pr-10 rounded-xl bg-muted/30 focus-visible:ring-offset-0 focus-visible:ring-accent"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Confirm New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75" />
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 pl-11 pr-10 rounded-xl bg-muted/30 focus-visible:ring-offset-0 focus-visible:ring-accent"
                minLength={6}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-xl gradient-primary text-white border-0 hover:opacity-90 font-semibold"
            disabled={resettingPassword}
          >
            {resettingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </form>
      )}

      {step === "send" && (
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-xs text-primary underline w-full text-center hover:opacity-80 bg-transparent border-0 cursor-pointer mt-2"
        >
          Back to Login
        </button>
      )}
    </div>
  );
}
