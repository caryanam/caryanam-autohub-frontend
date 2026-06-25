import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

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
  X,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SEO } from "@/components/shared/SEO";
import { useRegister, ApiError } from "@/hooks/auth/register";
import { toast } from "sonner";
import heroVideo from "@/assets/hero1.mp4";

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

      const res = await registerDealer(payload, dealerLogo, showroomImage);

      toast.success(res?.message || "Dealer Registration Successfully");

      navigate("/auth/login");
    } catch (error) {
      console.error(error);

      if (error instanceof ApiError) {
        if (error.fieldErrors && Object.keys(error.fieldErrors).length > 0) {
          Object.entries(error.fieldErrors).forEach(([field, message]) => {
            const label = field
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (s) => s.toUpperCase());
            toast.error(`${label}: ${message}`, { duration: 6005 });
          });
        } else {
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
      description: "Provide your company details",
    },
    {
      label: "Contact",
      icon: Phone,
      description: "How buyers can reach you",
    },
    {
      label: "Location",
      icon: MapPin,
      description: "Where your showroom operates",
    },
    {
      label: "Media",
      icon: ImageIcon,
      description: "Showcase logo & showroom visuals",
    },
  ];

  return (
    <>
      <SEO
        title="Dealer Registration - CAPL"
        description="Register your dealership and start receiving quality leads."
      />

      <div className="relative min-h-screen bg-blue-100/20 font-sans flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 overflow-x-hidden">


        {/* Center Card-in-Card Container */}
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden grid lg:grid-cols-2 relative z-10">

          {/* LEFT COLUMN: Ambient Dark Media Sidebar (Hidden on mobile/tablet, shown on lg) */}
          <div className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden gradient-primary">
            {/* Background Video */}
            {/* <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-25 z-0"
            >
              <source src={heroVideo} type="video/mp4" />
            </video> */}

            {/* Overlay Gradient & Glow */}
            {/* <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-900/85 to-slate-950/95 z-0" />
            <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-blue-600/10 rounded-full blur-[60px] pointer-events-none z-0" />
            <div className="absolute bottom-1/4 right-1/4 w-[150px] h-[150px] bg-sky-500/10 rounded-full blur-[50px] pointer-events-none z-0" /> */}

            <div className="relative z-10 flex flex-col justify-between h-full min-h-[480px]">
              {/* Logo / Header */}
              <Link to="/" className="flex items-center gap-3 group">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 border border-white/10 backdrop-blur-md group-hover:bg-white/20 transition-all">
                  <span className="font-display font-black text-white text-lg">C</span>
                </div>
                <div>
                  <div className="font-display font-black text-lg tracking-wider text-white">CAPL</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Dealer Network
                  </div>
                </div>
              </Link>

              {/* Central Copy and Bullet points */}
              <div className="my-auto py-8">
                <span className="inline-flex items-center rounded-full bg-blue-500/15 border border-blue-500/30 px-3.5 py-1 text-[10px] font-bold text-blue-400 tracking-widest uppercase mb-4">
                  Partnership Program
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight font-display">
                  Grow your digital dealership.
                </h2>
                <p className="mt-3 text-slate-300 text-sm leading-relaxed max-w-sm">
                  Join India's most trusted auto network, list your stock, and capture verified buyer leads directly.
                </p>

                {/* Features List */}
                <ul className="mt-8 space-y-5">
                  {[
                    { title: "High-Intent Leads", desc: "Get direct phone & WhatsApp connections." },
                    { title: "Smart Stock Tools", desc: "Manage your inventory via a sleek dashboard." },
                    { title: "Showroom Branding", desc: "Display logo, details, and showroom visual." },
                    { title: "Zero Commissions", desc: "Flat subscription model. Keep all your profits." },
                  ].map((item) => (
                    <li key={item.title} className="flex gap-3 items-start">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 mt-0.5 shadow-inner">
                        <CheckCircle2 className="h-3 w-3" />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-slate-100">{item.title}</span>
                        <span className="block text-xs text-slate-400 mt-0.5">{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>


            </div>
          </div>

          {/* RIGHT COLUMN: Clean Light Workspace with form elements rendered directly */}
          <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 bg-slate-50 relative z-10 min-h-[580px]">

            <div className="relative z-10 w-full max-w-xl mx-auto flex-1 flex flex-col justify-center">

              {/* Stepper Indicator */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {steps.map((item, index) => {
                    const Icon = item.icon;
                    const active = step === index;
                    const completed = step > index;
                    return (
                      <React.Fragment key={item.label}>
                        <div className="flex flex-col items-center gap-1.5 text-center w-16 sm:w-auto relative group">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-bold transition-all duration-300
                              ${active
                                ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105"
                                : completed
                                  ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
                                  : "border-slate-200 bg-slate-200/50 text-slate-400"
                              }`}
                          >
                            {completed ? (
                              <CheckCircle2 size={16} />
                            ) : (
                              <Icon size={15} />
                            )}
                          </div>
                          <span
                            className={`hidden sm:block text-[9px] font-bold uppercase tracking-widest ${active
                              ? "text-blue-600"
                              : completed
                                ? "text-emerald-600"
                                : "text-slate-400"
                              }`}
                          >
                            {item.label}
                          </span>
                        </div>
                        {index < steps.length - 1 && (
                          <div className="flex-1 px-1">
                            <div className="h-[2px] w-full bg-slate-200/50 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 ${step > index ? "bg-emerald-500 w-full" : "bg-slate-200/50 w-0"
                                  }`}
                              />
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Thin Segmented Progress Bar */}
                <div className="mt-6 flex gap-1 h-1 bg-slate-200/50 rounded-full overflow-hidden">
                  {steps.map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-full rounded-full transition-all duration-500 ${step >= i
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600"
                        : "bg-slate-300/30"
                        }`}
                    />
                  ))}
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-semibold tracking-wide">
                  <span>{steps[step].description}</span>
                  <span>Step {step + 1} of {steps.length}</span>
                </div>
              </div>

              <form
                ref={formRef}
                onSubmit={(e) => e.preventDefault()}
                className="space-y-6"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step === 0 && (
                      <div className="space-y-5">
                        <div className="border-l-4 border-blue-600 pl-3.5 py-0.5">
                          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                            Business Identity
                          </h2>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Enter your company particulars to list on the marketplace.
                          </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Business Name <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative group">
                              <Building2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                              <Input
                                required
                                placeholder="e.g. Mumbai Premium Motors"
                                className="h-11 pl-11 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus-visible:bg-white focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600/35 transition-all shadow-sm"
                                {...form.register("businessName")}
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Owner Name <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative group">
                              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                              <Input
                                required
                                placeholder="Full name"
                                className="h-11 pl-11 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus-visible:bg-white focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600/35 transition-all shadow-sm"
                                {...form.register("ownerName")}
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              GST Number <span className="text-slate-400 font-normal">(optional)</span>
                            </Label>
                            <div className="relative group">
                              <ReceiptText className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                              <Input
                                placeholder="22AAAAA0000A1Z5"
                                className="h-11 pl-11 rounded-xl uppercase border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus-visible:bg-white focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600/35 transition-all shadow-sm"
                                {...form.register("gstNumber")}
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Years in Business <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative group">
                              <BriefcaseBusiness className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                              <Input
                                type="number"
                                required
                                min={0}
                                placeholder="5"
                                className="h-11 pl-11 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus-visible:bg-white focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600/35 transition-all shadow-sm"
                                {...form.register("yearsInBusiness")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 1 && (
                      <div className="space-y-5">
                        <div className="border-l-4 border-blue-600 pl-3.5 py-0.5">
                          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                            Contact & Credentials
                          </h2>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Configure reachability details and sign-in credentials.
                          </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Mobile Number <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative group">
                              <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                              <Input
                                required
                                maxLength={10}
                                placeholder="9876543210"
                                className="h-11 pl-11 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus-visible:bg-white focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600/35 transition-all shadow-sm"
                                {...form.register("mobile")}
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              WhatsApp Number <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative group">
                              <MessageCircle className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                              <Input
                                required
                                maxLength={10}
                                placeholder="9876543210"
                                className="h-11 pl-11 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus-visible:bg-white focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600/35 transition-all shadow-sm"
                                {...form.register("whatsapp")}
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Email Address <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                              <Input
                                type="email"
                                required
                                placeholder="you@example.com"
                                className="h-11 pl-11 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus-visible:bg-white focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600/35 transition-all shadow-sm"
                                {...form.register("email")}
                              />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Password <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative group">
                              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                              <Input
                                type={showPassword ? "text" : "password"}
                                required
                                minLength={6}
                                placeholder="Min. 6 characters"
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
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-5">
                        <div className="border-l-4 border-blue-600 pl-3.5 py-0.5">
                          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                            Showroom Location
                          </h2>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Accurate showroom address helps nearby buyers discover you.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Full Address <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative group">
                              <MapPinned className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                              <Textarea
                                rows={3}
                                required
                                placeholder="Enter complete showroom building/area details"
                                className="pl-11 pr-4 py-3 rounded-xl resize-none border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus-visible:bg-white focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600/35 transition-all shadow-sm"
                                {...form.register("address")}
                              />
                            </div>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                City <span className="text-red-500">*</span>
                              </Label>
                              <div className="relative group">
                                <Building className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <Input
                                  required
                                  placeholder="e.g. Mumbai"
                                  className="h-11 pl-11 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus-visible:bg-white focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600/35 transition-all shadow-sm"
                                  {...form.register("city")}
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                State <span className="text-red-500">*</span>
                              </Label>
                              <div className="relative group">
                                <Map className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <Input
                                  required
                                  placeholder="e.g. Maharashtra"
                                  className="h-11 pl-11 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus-visible:bg-white focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600/35 transition-all shadow-sm"
                                  {...form.register("state")}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="sm:max-w-[50%] space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Pin Code <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative group">
                              <LocateFixed className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                              <Input
                                required
                                maxLength={6}
                                placeholder="400001"
                                className="h-11 pl-11 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus-visible:bg-white focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600/35 transition-all shadow-sm"
                                {...form.register("pinCode")}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-5">
                        <div className="border-l-4 border-blue-600 pl-3.5 py-0.5">
                          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                            Brand Visuals
                          </h2>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Upload quality files. Visible branding builds 4x buyer engagement.
                          </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          {/* Logo Upload */}
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Dealer Logo <span className="text-red-500">*</span>
                            </Label>

                            {!dealerLogo ? (
                              <label
                                htmlFor="dealer-logo-input"
                                className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-7 px-4 text-center transition-all duration-200 hover:border-blue-500 hover:bg-blue-50/10 shadow-sm"
                              >
                                <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shadow-sm">
                                  <Upload className="h-4.5 w-4.5" />
                                </div>
                                <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                                  Click to upload logo
                                </span>
                                <span className="mt-1 text-[10px] text-slate-400 font-medium">
                                  PNG, JPG · Square
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
                            ) : (
                              <div className="relative flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm h-[126px]">
                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                                  <img
                                    src={URL.createObjectURL(dealerLogo)}
                                    alt="Logo preview"
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate">{dealerLogo.name}</p>
                                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                    {(dealerLogo.size / 1024).toFixed(0)} KB
                                  </p>
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-1.5">
                                    Selected
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setDealerLogo(null)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer self-start animate-fade-in"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Showroom Image Upload */}
                          <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                              Showroom Image <span className="text-red-500">*</span>
                            </Label>

                            {!showroomImage ? (
                              <label
                                htmlFor="showroom-image-input"
                                className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white py-7 px-4 text-center transition-all duration-200 hover:border-blue-500 hover:bg-blue-50/10 shadow-sm"
                              >
                                <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shadow-sm">
                                  <Upload className="h-4.5 w-4.5" />
                                </div>
                                <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                                  Click to upload showroom
                                </span>
                                <span className="mt-1 text-[10px] text-slate-400 font-medium">
                                  PNG, JPG · Landscape
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
                            ) : (
                              <div className="relative flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm h-[126px]">
                                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                                  <img
                                    src={URL.createObjectURL(showroomImage)}
                                    alt="Showroom preview"
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate">{showroomImage.name}</p>
                                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                    {(showroomImage.size / 1024).toFixed(0)} KB
                                  </p>
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-1.5">
                                    Selected
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setShowroomImage(null)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer self-start animate-fade-in"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Footer */}
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-6 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={step === 0}
                    onClick={() => setStep(step - 1)}
                    className="h-11 px-5 font-bold border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 text-slate-700 rounded-xl transition-all duration-200 disabled:opacity-40 cursor-pointer shadow-sm"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                  </Button>

                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={() => {
                        if (formRef.current?.reportValidity())
                          setStep(step + 1);
                      }}
                      disabled={isSubmitting}
                      className="h-11 px-5 font-bold gradient-primary text-white rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/35 hover:opacity-95 transition-all duration-200 cursor-pointer"
                    >
                      Continue <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      disabled={isSubmitting}
                      onClick={form.handleSubmit(onSubmit)}
                      className="h-11 px-7 font-bold gradient-primary text-white rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/35 hover:opacity-95 transition-all duration-200 min-w-[130px] cursor-pointer"
                    >
                      {isSubmitting ? "Registering…" : "Register Now"}
                    </Button>
                  )}
                </div>

                <p className="text-center text-sm text-slate-500 font-medium pt-2">
                  Already registered?{" "}
                  <Link
                    to="/auth/login"
                    className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>


          </div>
        </div>
      </div>
    </>
  );
}
