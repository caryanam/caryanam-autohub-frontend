import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Star, Loader2, Clock, Copy, CheckCheck } from "lucide-react";
import { useDealerAuth } from "@/contexts/DealerAuthContext";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useGetSubscriptionPlans,
  useGetCurrentPlan,
  usePurchaseSubscription,
} from "@/hooks/dealer/useSubscription";
import logo from "@/assets/logo.png";

const UPI_ID = "pratikshashitole29-3@okaxis";

function getQrUrl(amount: number) {
  const upiString = `upi://pay?pa=${UPI_ID}&pn=Caryanam&am=${amount}&cu=INR`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(upiString)}`;
}

const PLAN_ORDER = ["BASIC", "STANDARD", "PREMIUM"];

export default function DealerSubscription() {
  const { user } = useDealerAuth();
  const dealerId = user?.id?.toString() || "";

  const { data: plans = [], isLoading: plansLoading } =
    useGetSubscriptionPlans();

  const { data: currentPlan, isLoading: currentLoading } =
    useGetCurrentPlan(dealerId);

  const purchaseMutation = usePurchaseSubscription(dealerId);

  const activePlan = currentPlan?.plan;
  const currentMessage = currentPlan?.message ?? "";

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [qrDialog, setQrDialog] = useState<{ planName: string; amount: number } | null>(null);

  const handleOpenQr = (planName: string, amount: number) => {
    setQrDialog({ planName, amount });
  };

  const handlePurchase = async () => {
    if (!qrDialog) return;
    try {
      const res = await purchaseMutation.mutateAsync(qrDialog.planName);
      toast.success(
        `${res.data?.subscriptionPlan ?? qrDialog.planName} plan purchased! Transaction ID: ${res.data?.transactionId ?? ""}`,
      );
      setQrDialog(null);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
        (err instanceof Error ? err.message : "Purchase failed"),
      );
    }
  };

  const sortedPlans = [...plans].sort(
    (a, b) => PLAN_ORDER.indexOf(a.planName) - PLAN_ORDER.indexOf(b.planName),
  );

  const isLoading = plansLoading || currentLoading;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-9 w-40 rounded-lg" />
          <Skeleton className="h-4 w-60 mt-2 rounded" />
        </div>

        {/* Active plan card skeleton */}
        <Card className="border border-slate-100 shadow-premium rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row lg:items-center">
              <div className="flex items-center gap-4 p-6 lg:w-[35%] border-b lg:border-b-0 lg:border-r">
                <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-7 w-32 rounded" />
                  <Skeleton className="h-4 w-20 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-3 flex-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-6 text-center border-r last:border-0 space-y-2"
                  >
                    <Skeleton className="h-3 w-16 mx-auto rounded" />
                    <Skeleton className="h-8 w-12 mx-auto rounded" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plans skeletons */}
        <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              className="border border-slate-100 shadow-sm rounded-2xl"
            >
              <CardContent className="p-6 flex flex-col space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-24 rounded" />
                  <Skeleton className="h-10 w-36 rounded" />
                </div>
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                </div>
                <Skeleton className="h-10 w-full rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Subscription</h1>
        <p className="text-muted-foreground">Manage your subscription plan</p>
      </div>

      {/* Active Subscription */}

      {activePlan ? (
        <Card className="border-0 shadow-md">
          <CardContent className="p-0">
            <div className="flex flex-col lg:flex-row lg:items-center">
              {/* Plan Info */}

              <div className="flex items-center gap-4 p-6 lg:w-[35%] border-b lg:border-b-0 lg:border-r">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Star className="h-7 w-7 text-primary fill-primary" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">
                      {activePlan.subscriptionPlan}
                    </h2>

                    <Badge className="bg-green-600 text-white hover:bg-green-600">
                      Active
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    ₹{activePlan.amount.toLocaleString("en-IN")}
                    /month
                  </p>
                </div>
              </div>

              {/* Stats */}

              <div className="grid grid-cols-3 flex-1">
                <div className="p-6 text-center border-r">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Vehicle Limit
                  </p>

                  <p className="text-3xl font-black mt-2">
                    {activePlan.vehicleLimit}
                  </p>
                </div>

                <div className="p-6 text-center border-r">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Remaining
                  </p>

                  <p
                    className={`text-3xl font-black mt-2 ${activePlan.remainingDays <= 7
                        ? "text-red-600"
                        : "text-green-600"
                      }`}
                  >
                    {activePlan.remainingDays}
                  </p>

                  <p className="text-xs text-muted-foreground">Days</p>
                </div>

                <div className="p-6 text-center">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Expires On
                  </p>

                  <p className="text-lg font-bold mt-2">
                    {new Date(
                      activePlan.subscriptionEndDate,
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",

                      month: "short",

                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {activePlan.remainingDays <= 7 && (
              <div className="border-t bg-red-50 px-6 py-3">
                <p className="text-sm text-red-600 font-medium">
                  Subscription expires in {activePlan.remainingDays} days.
                  Please renew your plan.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>

            <p className="text-sm text-muted-foreground">{currentMessage}</p>
          </CardContent>
        </Card>
      )}

      {/* Plans */}
      <div className="grid xl:grid-cols-3  md:grid-cols-2 gap-6">
        {sortedPlans.map((plan) => {
          const isPopular = plan.planName === "STANDARD";

          const isCurrent = activePlan?.subscriptionPlan === plan.planName;

          const isPending =
            purchaseMutation.isPending &&
            purchaseMutation.variables === plan.planName;

          return (
            <Card
              key={plan.planName}
              className={`relative transition-all duration-300 hover:shadow-xl ${isCurrent
                  ? "border-2 border-green-500 shadow-lg"
                  : isPopular
                    ? "border-primary shadow-lg"
                    : ""
                }`}
            >
              {isPopular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gradient-primary text-white border-0 gap-1 px-3">
                    <Star className="h-3 w-3 fill-current" />
                    Most Popular
                  </Badge>
                </div>
              )}

              {isCurrent && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-600 text-white">
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardContent className="p-6 flex flex-col h-full">
                <h3 className="font-black text-xl">{plan.planName}</h3>

                <div className="mt-2">
                  <span className="text-4xl font-black">
                    ₹{plan.amount.toLocaleString("en-IN")}
                  </span>

                  <span className="text-sm text-muted-foreground">/month</span>
                </div>

                <ul className="mt-6 space-y-3 text-sm flex-1">
                  <li className="flex gap-2 items-center">
                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                    Up to {plan.vehicleLimit} vehicle listings
                  </li>

                  <li className="flex gap-2 items-center">
                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                    {plan.validityMonths} month validity
                  </li>
                </ul>

                <Button
                  onClick={() => handleOpenQr(plan.planName, plan.amount)}
                  disabled={isCurrent || purchaseMutation.isPending}
                  variant="default"
                  className={`w-full mt-6 ${isCurrent
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : isPopular
                        ? "gradient-primary text-white border-0"
                        : ""
                    }`}
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}

                  {isCurrent ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Active Plan
                    </>
                  ) : (
                    `Get ${plan.planName}`
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* QR Payment Dialog */}
      <Dialog open={!!qrDialog} onOpenChange={(open) => { if (!open) setQrDialog(null); }}>
        <DialogContent className="max-w-[340px] rounded-3xl p-0 border-none shadow-2xl bg-white text-slate-900 overflow-hidden">
          {qrDialog && (
            <>
              {/* Header */}
              <div className="gradient-primary px-5 pt-5 pb-5">
                <DialogHeader>
                  <DialogTitle className="text-white text-base font-black tracking-tight leading-none">
                    Complete Payment
                  </DialogTitle>
                </DialogHeader>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">{qrDialog.planName} Plan</span>
                  <span className="text-xl font-black text-white">₹{qrDialog.amount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3 px-5 py-4">
                {/* QR with logo overlay */}
                <div className="relative w-[180px] h-[180px] rounded-xl overflow-hidden border-2 border-slate-100 shadow-md bg-white">
                  <img src={getQrUrl(qrDialog.amount)} alt="UPI QR" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-9 h-9 rounded-lg bg-white shadow border border-slate-100 flex items-center justify-center p-1">
                      <img src={logo} alt="Caryanam" className="w-full h-full object-contain rounded-md" />
                    </div>
                  </div>
                </div>

                {/* UPI ID copy row */}
                <div className="w-full flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">UPI ID</p>
                    <p className="text-sm font-bold text-slate-800 font-mono truncate">{UPI_ID}</p>
                  </div>
                  <button type="button" onClick={handleCopy} className="shrink-0 p-1.5 rounded-lg bg-white border border-slate-200 hover:border-rose-900 hover:text-rose-900 text-slate-500 transition-colors cursor-pointer">
                    {copied ? <CheckCheck size={14} className="text-green-600" /> : <Copy size={14} />}
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 text-center">
                  Scan QR or copy UPI ID, then click <span className="font-bold text-slate-600">Confirm Purchase</span>.
                </p>

                <Button
                  onClick={handlePurchase}
                  disabled={purchaseMutation.isPending}
                  className="w-full h-10 gradient-primary text-white border-0 font-bold rounded-xl shadow-md cursor-pointer text-sm"
                >
                  {purchaseMutation.isPending
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing…</>
                    : "Confirm Purchase"
                  }
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
