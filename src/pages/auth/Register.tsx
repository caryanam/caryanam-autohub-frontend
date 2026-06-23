import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  Building2,
  Phone,
  MapPin,
  ImageIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Upload,
  User,
  ReceiptText,
  BriefcaseBusiness,
  MessageCircle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  MapPinned,
  Building,
  Map,
  LocateFixed,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SEO } from "@/components/shared/SEO";
import { useRegister, ApiError } from "@/hooks/auth/register";
import { toast } from "sonner";
type FormData = {
  businessName: string;
  ownerName: string;
  gstNumber: string;
  yearsInBusiness: string;
  email: string;
  mobile: string;
  whatsapp: string;
  password: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
};

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [dealerLogo, setDealerLogo] = useState<File | null>(null);
  const [showroomImage, setShowroomImage] = useState<File | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const { isSubmitting, registerDealer } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<FormData>({
    defaultValues: {
      businessName: "",
      ownerName: "",
      gstNumber: "",
      yearsInBusiness: "",
      email: "",
      mobile: "",
      whatsapp: "",
      password: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
    },
  });

  const {
    formState: { errors },
  } = form;

  const progress = ((step + 1) / 4) * 100;

  const onSubmit = async (data: FormData) => {
    try {
      if (!dealerLogo) {
        toast.error("Please upload a dealer logo.");
        return;
      }
      if (!showroomImage) {
        toast.error("Please upload a showroom image.");
        return;
      }

      const payload: any = {
        businessName: data.businessName,
        ownerName: data.ownerName,
        yearsInBusiness: Number(data.yearsInBusiness),
        mobile: data.mobile,
        whatsapp: data.whatsapp,
        email: data.email,
        password: data.password,
        address: data.address,
        city: data.city,
        state: data.state,
        pinCode: data.pinCode,
      };

      if (data.gstNumber && data.gstNumber.trim() !== "") {
        payload.gstNumber = data.gstNumber;
      }

      await registerDealer(payload, dealerLogo, showroomImage);

      toast.success("Registration Successful! 🎉", {
        description:
          "Status: Pending Approval. We'll email you within 24 hours.",
      });

      navigate("/auth/login");
    } catch (error) {
      console.error(error);

      if (error instanceof ApiError) {
        if (error.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
          // Show each field validation error as a separate toast
          Object.entries(error.fieldErrors).forEach(([field, message]) => {
            const label = field
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (s) => s.toUpperCase());
            toast.error(`${label}: ${message}`, { duration: 6000 });
          });
        } else {
          // Single API-level error (e.g. "Mobile Number Already Exists")
          toast.error(error.message, {
            duration: 6000,
          });
        }
      } else {
        toast.error(
          "Registration failed. Please check your connection and try again.",
        );
      }
    }
  };

  const steps = [
    {
      label: "Business",
      icon: Building2,
      description: "Your company details",
    },
    {
      label: "Contact",
      icon: Phone,
      description: "How buyers reach you",
    },
    {
      label: "Location",
      icon: MapPin,
      description: "Where you operate",
    },
    {
      label: "Media",
      icon: ImageIcon,
      description: "Showcase your showroom",
    },
  ];

  return (
    <>
      <SEO
        title="Dealer Registration - CAPL"
        description="Register your dealership and start receiving quality leads."
      />

      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* ── Top nav: back link ── */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              type="button"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          </div>

          {/* ── Page header ── */}
          <div className="mb-8">
            <span className="inline-flex items-center rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-xs font-semibold text-sky-700 tracking-wide uppercase">
              Dealer Registration
            </span>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-950">
                  Grow your dealership with CAPL
                </h1>
                <p className="mt-2 text-slate-500 text-base">
                  Get verified, list inventory and start receiving quality buyer
                  leads in under 24 hours.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-sky-500" /> KYC
                  verified
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-slate-400" /> 25k+
                  listings
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
            {/* ── Main form card ── */}
            <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6 sm:p-8">
                {/* Step indicator */}
                <div className="mb-8">
                  <div className="flex items-start">
                    {steps.map((item, index) => {
                      const Icon = item.icon;
                      const active = step === index;
                      const completed = step > index;
                      return (
                        <React.Fragment key={item.label}>
                          <div className="flex flex-col items-center gap-1 text-center w-16 sm:w-auto">
                            <div
                              className={`flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all
                                ${active
                                  ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200"
                                  : completed
                                    ? "border-green-500 bg-green-50 text-green-600"
                                    : "border-slate-200 bg-white text-slate-400"
                                }`}
                            >
                              {completed ? (
                                <CheckCircle2 size={16} />
                              ) : (
                                <Icon size={15} />
                              )}
                            </div>
                            <span
                              className={`hidden sm:block text-xs font-medium ${active ? "text-blue-600" : completed ? "text-green-600" : "text-slate-400"}`}
                            >
                              {item.label}
                            </span>
                          </div>
                          {index < steps.length - 1 && (
                            <div
                              className={`flex-1 mt-4 mx-2 h-0.5 transition-colors ${step > index ? "bg-green-400" : "bg-slate-200"}`}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  {/* Progress bar */}
                  <div className="mt-5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-primary transition-all duration-500 ease-out"
                      style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-400 text-right">
                    Step {step + 1} of {steps.length}
                  </p>
                </div>

                <form
                  ref={formRef}
                  onSubmit={(e) => e.preventDefault()}
                  className="space-y-8"
                >
                  {step === 0 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          Tell us about your business
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Your dealership identity on CAPL.
                        </p>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <Label className="mb-2 block text-sm font-medium text-slate-700">
                            Business Name{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              required
                              placeholder="e.g. Mumbai Premium Motors"
                              className="h-11 pl-10 rounded-xl"
                              {...form.register("businessName")}
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="mb-2 block text-sm font-medium text-slate-700">
                            Owner Name <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              required
                              placeholder="Full name"
                              className="h-11 pl-10 rounded-xl"
                              {...form.register("ownerName")}
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="mb-2 block text-sm font-medium text-slate-700">
                            GST Number{" "}
                            <span className="text-slate-400 font-normal">
                              (optional)
                            </span>
                          </Label>
                          <div className="relative">
                            <ReceiptText className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              placeholder="22AAAAA0000A1Z5"
                              className="h-11 pl-10 rounded-xl uppercase"
                              {...form.register("gstNumber")}
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="mb-2 block text-sm font-medium text-slate-700">
                            Years in Business{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <BriefcaseBusiness className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              type="number"
                              required
                              min={0}
                              placeholder="5"
                              className="h-11 pl-10 rounded-xl"
                              {...form.register("yearsInBusiness")}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          Contact details
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          How customers can reach you.
                        </p>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <Label className="mb-2 block text-sm font-medium text-slate-700">
                            Mobile Number{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              required
                              maxLength={10}
                              placeholder="9876543210"
                              className="h-11 pl-10 rounded-xl"
                              {...form.register("mobile")}
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="mb-2 block text-sm font-medium text-slate-700">
                            WhatsApp Number{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <MessageCircle className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              required
                              maxLength={10}
                              placeholder="9876543210"
                              className="h-11 pl-10 rounded-xl"
                              {...form.register("whatsapp")}
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="mb-2 block text-sm font-medium text-slate-700">
                            Email <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              type="email"
                              required
                              placeholder="you@example.com"
                              className="h-11 pl-10 rounded-xl"
                              {...form.register("email")}
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="mb-2 block text-sm font-medium text-slate-700">
                            Password <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              required
                              minLength={6}
                              placeholder="Min. 6 characters"
                              className="h-11 pl-10 pr-10 rounded-xl"
                              {...form.register("password")}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          Dealership location
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          Tell buyers where you operate.
                        </p>
                      </div>
                      <div className="space-y-5">
                        <div>
                          <Label className="mb-2 block text-sm font-medium text-slate-700">
                            Address <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <MapPinned className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <Textarea
                              rows={3}
                              required
                              placeholder="Enter complete business address"
                              className="pl-10 rounded-xl resize-none"
                              {...form.register("address")}
                            />
                          </div>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <Label className="mb-2 block text-sm font-medium text-slate-700">
                              City <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                              <Building className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                              <Input
                                required
                                placeholder="e.g. Pune"
                                className="h-11 pl-10 rounded-xl"
                                {...form.register("city")}
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="mb-2 block text-sm font-medium text-slate-700">
                              State <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                              <Map className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                              <Input
                                required
                                placeholder="e.g. Maharashtra"
                                className="h-11 pl-10 rounded-xl"
                                {...form.register("state")}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="sm:max-w-[50%]">
                          <Label className="mb-2 block text-sm font-medium text-slate-700">
                            Pin Code <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <LocateFixed className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                              required
                              maxLength={6}
                              placeholder="411004"
                              className="h-11 pl-10 rounded-xl"
                              {...form.register("pinCode")}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          Brand visuals
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          A great logo &amp; showroom photo build trust with
                          buyers.
                        </p>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <Label className="mb-2 block text-sm font-medium text-slate-700">
                            Dealer Logo <span className="text-red-500">*</span>
                          </Label>
                          <label
                            htmlFor="dealer-logo-input"
                            className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/40"
                          >
                            {dealerLogo ? (
                              <CheckCircle2 className="mb-2 h-6 w-6 text-green-500" />
                            ) : (
                              <Upload className="mb-2 h-6 w-6 text-slate-400" />
                            )}
                            <span className="text-sm font-medium text-slate-600 truncate max-w-full">
                              {dealerLogo?.name || "Click to upload logo"}
                            </span>
                            <span className="mt-1 text-xs text-slate-400">
                              PNG / JPG · Square · min 256 px
                            </span>
                            <input
                              id="dealer-logo-input"
                              type="file"
                              accept=".png,.jpg,.jpeg"
                              className="sr-only"
                              onChange={(e) =>
                                setDealerLogo(e.target.files?.[0] ?? null)
                              }
                            />
                          </label>
                        </div>
                        <div>
                          <Label className="mb-2 block text-sm font-medium text-slate-700">
                            Showroom Image{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <label
                            htmlFor="showroom-image-input"
                            className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/40"
                          >
                            {showroomImage ? (
                              <CheckCircle2 className="mb-2 h-6 w-6 text-green-500" />
                            ) : (
                              <Upload className="mb-2 h-6 w-6 text-slate-400" />
                            )}
                            <span className="text-sm font-medium text-slate-600 truncate max-w-full">
                              {showroomImage?.name || "Click to upload photo"}
                            </span>
                            <span className="mt-1 text-xs text-slate-400">
                              PNG / JPG · Landscape · min 1200 px
                            </span>
                            <input
                              id="showroom-image-input"
                              type="file"
                              accept=".png,.jpg,.jpeg"
                              className="sr-only"
                              onChange={(e) =>
                                setShowroomImage(e.target.files?.[0] ?? null)
                              }
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation footer */}
                  <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={step === 0}
                      onClick={() => setStep(step - 1)}
                      className="gap-2 border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" /> Back
                    </Button>

                    {step < 3 ? (
                      <Button
                        type="button"
                        onClick={() => {
                          if (formRef.current?.reportValidity())
                            setStep(step + 1);
                        }}
                        disabled={isSubmitting}
                        className="gap-2 gradient-primary text-white hover:opacity-90"
                      >
                        Continue <ChevronRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        disabled={isSubmitting}
                        onClick={form.handleSubmit(onSubmit)}
                        className="gradient-primary text-white hover:opacity-90 min-w-[110px]"
                      >
                        {isSubmitting ? "Registering…" : "Register →"}
                      </Button>
                    )}
                  </div>

                  <p className="text-center text-sm text-slate-400">
                    Already registered?{" "}
                    <Link
                      to="/auth/login"
                      className="font-semibold text-sky-600 hover:text-sky-700 transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* ── Sidebar ── */}
            <div className="space-y-4">
              <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <CardContent className="p-5">
                  <h3 className="text-base font-bold text-slate-900">
                    Why dealers love CAPL
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {[
                      "Quality verified buyer leads",
                      "Manage inventory easily",
                      "Featured & boosted listings",
                      "Transparent pricing",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-sky-500" />
                        <span className="text-sm text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="rounded-2xl bg-slate-950 text-white shadow-sm overflow-hidden">
                <CardContent className="p-5">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500">
                    Trusted by
                  </p>
                  <p className="mt-2 text-4xl font-black">500+</p>
                  <p className="mt-0.5 text-base font-semibold text-slate-200">
                    dealers across India
                  </p>
                  <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                    Reach 50,000+ monthly buyers across 150+ Indian cities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
