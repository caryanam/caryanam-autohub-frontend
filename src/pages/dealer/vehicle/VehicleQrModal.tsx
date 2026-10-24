import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Download,
  Share2,
  MessageCircle,
  Phone,
  Building2,
  User,
  Printer,
  QrCode,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { useGetVehicleQr } from "@/hooks/dealer/useGetVehicleQr";
import { formatINR, formatKM } from "@/utils/helpers";

interface VehicleQrModalProps {
  vehicleId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function VehicleQrModal({
  vehicleId,
  isOpen,
  onClose,
}: VehicleQrModalProps) {
  const { data: qrData, isLoading, error } = useGetVehicleQr(
    isOpen ? vehicleId : null
  );
  // Generate public page URL if not present
  const vehicleUrl =
    qrData?.vehiclePageUrl ||
    (typeof window !== "undefined" && vehicleId
      ? `${window.location.origin}/car/${vehicleId}`
      : "");

  const handleCopyLink = async () => {
    if (!vehicleUrl) return;
    try {
      await navigator.clipboard.writeText(vehicleUrl);
      toast.success("Vehicle link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleDownloadPng = () => {
    if (!qrData?.qrCodeBase64) {
      toast.error("QR Code image not ready");
      return;
    }
    try {
      const fileName = `${(qrData.brand || "vehicle").replace(/\s+/g, "_")}_${(qrData.model || "").replace(/\s+/g, "_")}_QR.png`;
      const link = document.createElement("a");
      link.href = `data:image/png;base64,${qrData.qrCodeBase64}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("QR Code downloaded successfully!");
    } catch {
      toast.error("Failed to download QR Code");
    }
  };

  const handleWhatsAppShare = () => {
    if (!qrData) return;
    const title = `${qrData.registrationYear || ""} ${qrData.brand || ""} ${qrData.model || ""} ${qrData.variant || ""}`.trim();
    const price = formatINR(qrData.askingPrice);
    const km = formatKM(qrData.kilometerDriven);
    const fuel = qrData.fuelType || "N/A";
    const city = qrData.city || "N/A";
    const dealerBusiness = qrData.dealerBusinessName || "Auto Dealer";
    const dealerName = qrData.dealerName || "";
    const dealerPhone = qrData.dealerContactNumber || "";
    const dealerWhatsapp = qrData.dealerWhatsappNumber || dealerPhone;

    const messageLines = [
      `🚗 *${title}*`,
      `💰 *Price:* ${price}`,
      `🛣️ *KM Driven:* ${km}`,
      `⛽ *Fuel:* ${fuel} | 📍 *City:* ${city}`,
      "",
      `🏢 *Dealership:* ${dealerBusiness}`,
      dealerName ? `👤 *Contact Person:* ${dealerName}` : "",
      dealerPhone ? `📞 *Call:* ${dealerPhone}` : "",
      dealerWhatsapp ? `💬 *WhatsApp:* ${dealerWhatsapp}` : "",
      "",
      `📱 *Scan QR Code or Click Link to View Full Details:*`,
      vehicleUrl,
    ].filter(Boolean);

    const fullMessage = messageLines.join("\n");
    const waUrl = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;
    window.open(waUrl, "_blank");
  };

  const handleNativeShare = async () => {
    if (!qrData) return;
    const title = `${qrData.registrationYear || ""} ${qrData.brand || ""} ${qrData.model || ""}`.trim();
    const text = `Check out this ${title} for ${formatINR(qrData.askingPrice)} on Caryanam!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: vehicleUrl,
        });
        toast.success("Shared successfully!");
      } catch (err: any) {
        if (err.name !== "AbortError") {
          toast.error("Sharing failed");
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handlePrint = () => {
    if (!qrData) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow popups to print the QR code.");
      return;
    }

    const title = `${qrData.registrationYear || ""} ${qrData.brand || ""} ${qrData.model || ""} ${qrData.variant || ""}`.trim();
    const price = formatINR(qrData.askingPrice);
    const km = formatKM(qrData.kilometerDriven);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - QR Code</title>
          <style>
            @page { size: auto; margin: 15mm; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #1e293b;
              margin: 0;
              padding: 24px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              box-sizing: border-box;
              background: #fff;
            }
            .card {
              max-width: 480px;
              width: 100%;
              border: 2px solid #e2e8f0;
              border-radius: 24px;
              padding: 32px;
              text-align: center;
              box-shadow: 0 4px 20px rgba(0,0,0,0.06);
            }
            .brand-badge {
              display: inline-block;
              background: #0f172a;
              color: #fff;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 1px;
              text-transform: uppercase;
              padding: 4px 12px;
              border-radius: 100px;
              margin-bottom: 16px;
            }
            h1 {
              font-size: 22px;
              margin: 0 0 6px;
              color: #0f172a;
            }
            .price {
              font-size: 26px;
              font-weight: 800;
              color: #e11d48;
              margin: 8px 0;
            }
            .specs {
              display: flex;
              justify-content: center;
              gap: 16px;
              font-size: 13px;
              color: #64748b;
              margin-bottom: 24px;
            }
            .specs span {
              background: #f1f5f9;
              padding: 4px 10px;
              border-radius: 8px;
            }
            .qr-wrapper {
              display: inline-block;
              padding: 16px;
              background: #fff;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              margin: 8px 0 20px;
            }
            .qr-wrapper img {
              display: block;
              width: 260px;
              height: 260px;
            }
            .scan-callout {
              font-size: 13px;
              font-weight: 600;
              color: #475569;
              margin-bottom: 20px;
            }
            .dealer-box {
              border-top: 1px dashed #cbd5e1;
              padding-top: 18px;
              margin-top: 10px;
              text-align: left;
            }
            .dealer-title {
              font-size: 14px;
              font-weight: 700;
              color: #0f172a;
              margin-bottom: 4px;
            }
            .dealer-detail {
              font-size: 12px;
              color: #64748b;
              line-height: 1.6;
            }
            .footer {
              margin-top: 20px;
              font-size: 10px;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="brand-badge">CARYANAM AUTOHUB</div>
            <h1>${title}</h1>
            <div class="price">${price}</div>
            <div class="specs">
              <span>🛣️ ${km}</span>
              <span>⛽ ${qrData.fuelType || "Petrol"}</span>
              <span>📍 ${qrData.city || ""}</span>
            </div>

            <div class="qr-wrapper">
              <img src="data:image/png;base64,${qrData.qrCodeBase64}" alt="Vehicle QR Code" />
            </div>

            <div class="scan-callout">📷 Scan with any phone camera to view full vehicle details & specs</div>

            <div class="dealer-box">
              <div class="dealer-title">🏢 ${qrData.dealerBusinessName || "Dealership"}</div>
              ${qrData.dealerName ? `<div class="dealer-detail">👤 Contact: <b>${qrData.dealerName}</b></div>` : ""}
              ${qrData.dealerContactNumber ? `<div class="dealer-detail">📞 Call: <b>${qrData.dealerContactNumber}</b></div>` : ""}
              ${qrData.dealerWhatsappNumber ? `<div class="dealer-detail">💬 WhatsApp: <b>${qrData.dealerWhatsappNumber}</b></div>` : ""}
            </div>

            <div class="footer">Powered by Caryanam • Verified Dealer Inventory</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const vehicleTitle = qrData
    ? `${qrData.registrationYear || ""} ${qrData.brand || ""} ${qrData.model || ""} ${qrData.variant || ""}`.trim()
    : "Vehicle QR Code";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl sm:max-w-3xl p-0 overflow-hidden rounded-3xl border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-900 text-white p-6 pb-5 relative">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Unique Vehicle QR
                </Badge>
                {qrData?.city && (
                  <Badge variant="outline" className="text-slate-400 border-slate-700 text-[10px] font-medium">
                    {qrData.city}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                {isLoading ? (
                  <Skeleton className="h-7 w-64 bg-slate-800" />
                ) : (
                  vehicleTitle
                )}
              </DialogTitle>
              <p className="text-xs text-slate-400">
                Customers can scan this code to see full vehicle specs & dealer contact info
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                <Skeleton className="h-64 w-64 rounded-xl" />
                <Skeleton className="h-10 w-44 rounded-xl" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
              </div>
            </div>
          ) : error || !qrData ? (
            <div className="text-center py-12 space-y-3">
              <div className="h-12 w-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                <QrCode className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                Failed to load QR code
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {error?.message || "Could not retrieve QR code for this vehicle."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onClose()}
                className="mt-2 rounded-xl"
              >
                Close
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-12 gap-6">
              {/* Left Column: QR Code Display Card */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="w-full bg-gradient-to-b from-slate-50 to-white rounded-2xl border-2 border-slate-100 p-5 shadow-sm flex flex-col items-center text-center">
                  <div className="relative group bg-white p-3 rounded-2xl border border-slate-200 shadow-md">
                    <img
                      src={`data:image/png;base64,${qrData.qrCodeBase64}`}
                      alt={`${vehicleTitle} QR Code`}
                      className="w-56 h-56 sm:w-60 sm:h-60 object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 bg-slate-900/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                      <Button
                        size="sm"
                        onClick={handleDownloadPng}
                        className="bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl text-xs gap-1.5 shadow-lg"
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <QrCode className="h-3.5 w-3.5 text-emerald-600" /> High-Resolution PNG
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Scan with any iOS or Android camera
                    </p>
                  </div>

                  {/* QR Direct Actions */}
                  <div className="mt-4 grid grid-cols-2 gap-2 w-full">
                    <Button
                      onClick={handleDownloadPng}
                      className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs gap-1.5 h-10 shadow-sm"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handlePrint}
                      className="w-full rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs gap-1.5 h-10"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Print Card
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column: Vehicle & Dealer Details */}
              <div className="md:col-span-7 space-y-4">
                {/* Vehicle Quick Highlight */}
                <div className="bg-slate-50/80 rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Asking Price
                      </span>
                      <div className="text-2xl font-black text-rose-600">
                        {formatINR(qrData.askingPrice)}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Kilometers
                      </span>
                      <div className="text-base font-bold text-slate-900">
                        {formatKM(qrData.kilometerDriven)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-2 flex-wrap text-xs text-slate-600 font-medium">
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      Year: <b>{qrData.registrationYear}</b>
                    </span>
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      Fuel: <b>{qrData.fuelType}</b>
                    </span>
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      City: <b>{qrData.city}</b>
                    </span>
                  </div>
                </div>

                {/* Dealership Information */}
                <div className="bg-emerald-50/40 rounded-2xl border border-emerald-100 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-emerald-600" /> Dealership Information
                    </span>
                    <Badge className="bg-emerald-100 text-emerald-800 border-0 text-[10px] font-bold">
                      Verified
                    </Badge>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100/80">
                      <span className="text-[10px] text-slate-400 font-semibold block">Dealership</span>
                      <span className="font-bold text-slate-900 truncate block">
                        {qrData.dealerBusinessName || "Sharma Motors"}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100/80">
                      <span className="text-[10px] text-slate-400 font-semibold block">Owner / Contact</span>
                      <span className="font-bold text-slate-900 truncate block flex items-center gap-1">
                        <User className="h-3 w-3 text-slate-400" />
                        {qrData.dealerName || "Dealer Representative"}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100/80">
                      <span className="text-[10px] text-slate-400 font-semibold block">Contact Number</span>
                      {qrData.dealerContactNumber ? (
                        <a
                          href={`tel:${qrData.dealerContactNumber}`}
                          className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3 text-emerald-600" />
                          {qrData.dealerContactNumber}
                        </a>
                      ) : (
                        <span className="text-slate-400 font-medium">Not provided</span>
                      )}
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-emerald-100/80">
                      <span className="text-[10px] text-slate-400 font-semibold block">WhatsApp</span>
                      {qrData.dealerWhatsappNumber ? (
                        <a
                          href={`https://wa.me/91${qrData.dealerWhatsappNumber.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-green-600 hover:underline flex items-center gap-1"
                        >
                          <MessageCircle className="h-3 w-3 text-green-600" />
                          {qrData.dealerWhatsappNumber}
                        </a>
                      ) : (
                        <span className="text-slate-400 font-medium">Not provided</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Share Actions */}
                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={handleWhatsAppShare}
                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2 h-11 shadow-sm"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Share on WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleNativeShare}
                    className="rounded-xl border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs gap-2 h-11 px-4"
                  >
                    <Share2 className="h-4 w-4" />
                    Share QR
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
