import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Car, ShieldCheck, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/shared/SEO";
import { useLogin, LoginError } from "@/hooks/auth/login";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useDealerAuth } from "@/contexts/DealerAuthContext";
import { toast } from "sonner";
import { useState } from "react";

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const { isLoggingIn, login } = useLogin();
  const { setUserFromToken: setAdmin } = useAdminAuth();
  const { setUserFromToken: setDealer } = useDealerAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<FormData>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await login({
        email: data.email,
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

  return (
    <>
      <SEO title="Sign In — CAPL" />
      <div className="relative min-h-screen bg-blue-100/20 font-sans flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 overflow-x-hidden">


        {/* Center Card Container */}
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden grid lg:grid-cols-2 relative z-10">

          {/* Left decorative panel (Gradient-primary background) */}
          <div className="hidden lg:flex gradient-primary text-white p-12 flex-col justify-between relative overflow-hidden">
            {/* Overlay glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none z-0" />

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 relative z-10 group">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/10 group-hover:bg-white/30 transition-all">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display font-black text-lg">CAPL</div>
                <div className="text-xs text-white/70">
                  Dealer Management Portal
                </div>
              </div>
            </Link>

            {/* Main Content */}
            <div className="max-w-lg relative z-10 my-auto py-8">
              <h2 className="font-display text-3xl font-black leading-tight">
                Grow your dealership
                <br />
                with quality leads
              </h2>

              <p className="mt-4 text-sm text-white/80 leading-relaxed">
                Join 500+ verified dealers reaching 50,000+ buyers every month
                across 150+ Indian cities.
              </p>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-black">500+</div>
                  <div className="mt-1 text-xs text-white/70">
                    Verified dealers
                  </div>
                </div>

                <div>
                  <div className="text-2xl font-black">25K+</div>
                  <div className="mt-1 text-xs text-white/70">
                    Active listings
                  </div>
                </div>

                <div>
                  <div className="text-2xl font-black">100%</div>
                  <div className="mt-1 text-xs text-white/70">KYC verified</div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs text-white/95 backdrop-blur-sm border border-white/5">
                <ShieldCheck className="h-4 w-4" />
                Trusted by leading automobile dealers across India
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-white/50 relative z-10">
              <span>© 2026 CAPL</span>
              <span>Secure • Reliable • Scalable</span>
            </div>
          </div>

          {/* Right form workspace */}
          <div className="flex flex-col justify-center p-8 sm:p-12 bg-slate-50 min-h-[500px]">
            <div className="w-full max-w-sm mx-auto">
              <h1 className="font-display text-2xl font-black text-slate-900">
                Sign in
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Enter your credentials to access your portal.
              </p>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-6 space-y-4"
              >
                {/* Email */}
                <div className="space-y-1.5">
                  <Label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      type="email"
                      required
                      placeholder="Enter your email"
                      className="h-11 pl-11 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus-visible:bg-white focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600/35 transition-all shadow-sm"
                      {...form.register("email")}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      placeholder="Enter your password"
                      className="h-11 pl-11 pr-11 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus-visible:bg-white focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600/35 transition-all shadow-sm"
                      {...form.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full h-11 font-bold gradient-primary text-white rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/35 hover:opacity-95 transition-all duration-200 cursor-pointer mt-2"
                >
                  {isLoggingIn ? "Signing in…" : "Sign in"}
                </Button>
              </form>

              <div className="mt-6 text-sm text-center text-slate-500">
                New dealer?{" "}
                <Link
                  to="/auth/register"
                  className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
