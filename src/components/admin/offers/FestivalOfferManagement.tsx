import { useState, useRef, useEffect, DragEvent } from "react";
import {
  useAdminFestivalOffer,
  useUploadFestivalOffer,
  useDisableFestivalOffer,
} from "@/hooks/admin/useAdminFestivalOffer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Sparkles,
  Calendar,
  Clock,
  UploadCloud,
  Image as ImageIcon,
  Video,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Ban,
  Eye,
  RefreshCw,
  Timer,
  ExternalLink,
} from "lucide-react";

/**
 * Calculates remaining time string from an ISO expiry date.
 */
function getRemainingTime(expiresAt: string | null | undefined): {
  text: string;
  isExpired: boolean;
} {
  if (!expiresAt) {
    return { text: "No expiry set", isExpired: true };
  }

  const expiryTime = new Date(expiresAt).getTime();
  const now = new Date().getTime();
  const diff = expiryTime - now;

  if (isNaN(diff) || diff <= 0) {
    return { text: "Offer Expired", isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (days > 0) {
    return { text: `${days}d ${hours}h ${minutes}m remaining`, isExpired: false };
  }
  if (hours > 0) {
    return { text: `${hours}h ${minutes}m ${seconds}s remaining`, isExpired: false };
  }
  return { text: `${minutes}m ${seconds}s remaining`, isExpired: false };
}

export default function FestivalOfferManagement() {
  const { data: festivalOffer, isLoading, isError, refetch } = useAdminFestivalOffer();
  const uploadMutation = useUploadFestivalOffer();
  const disableMutation = useDisableFestivalOffer();

  // Selected file and media info
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detectedType, setDetectedType] = useState<"IMAGE" | "VIDEO">("IMAGE");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Expiry date input state: YYYY-MM-DDTHH:mm
  const [expiryInput, setExpiryInput] = useState<string>("");

  // Disable confirmation dialog
  const [isDisableDialogOpen, setIsDisableDialogOpen] = useState(false);

  // Live countdown state
  const [countdown, setCountdown] = useState<{ text: string; isExpired: boolean }>({
    text: "Calculating...",
    isExpired: false,
  });

  useEffect(() => {
    if (festivalOffer?.expiresAt) {
      setCountdown(getRemainingTime(festivalOffer.expiresAt));
      const interval = setInterval(() => {
        setCountdown(getRemainingTime(festivalOffer.expiresAt));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [festivalOffer?.expiresAt]);

  const handleFileSelect = (file: File) => {
    const isImage =
      file.type.startsWith("image/") ||
      /\.(jpg|jpeg|png|webp)$/i.test(file.name);
    const isVideo =
      file.type.startsWith("video/") ||
      /\.(mp4)$/i.test(file.name);

    if (!isImage && !isVideo) {
      toast.error("Unsupported file type. Please upload a .jpg, .png, .webp image or .mp4 video.");
      return;
    }

    const maxImageSize = 10 * 1024 * 1024; // 10MB
    const maxVideoSize = 100 * 1024 * 1024; // 100MB

    if (isImage && file.size > maxImageSize) {
      toast.error("Image file is too large. Maximum allowed size is 10 MB.");
      return;
    }

    if (isVideo && file.size > maxVideoSize) {
      toast.error("Video file is too large. Maximum allowed size is 100 MB.");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    setDetectedType(isVideo ? "VIDEO" : "IMAGE");
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const clearSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Please upload an offer banner image or video.");
      return;
    }

    if (!expiryInput) {
      toast.error("Please set the festival offer expiry date & time.");
      return;
    }

    const selectedExpiryDate = new Date(expiryInput);
    if (isNaN(selectedExpiryDate.getTime())) {
      toast.error("Invalid expiry date format.");
      return;
    }

    if (selectedExpiryDate.getTime() <= Date.now()) {
      toast.error("Expiry date & time must be in the future.");
      return;
    }

    // Format to ISO 8601 string: "YYYY-MM-DDTHH:mm:ss"
    const pad = (n: number) => String(n).padStart(2, "0");
    const formattedExpiresAt = `${selectedExpiryDate.getFullYear()}-${pad(
      selectedExpiryDate.getMonth() + 1
    )}-${pad(selectedExpiryDate.getDate())}T${pad(
      selectedExpiryDate.getHours()
    )}:${pad(selectedExpiryDate.getMinutes())}:${pad(
      selectedExpiryDate.getSeconds()
    )}`;

    try {
      await uploadMutation.mutateAsync({
        file: selectedFile,
        expiresAt: formattedExpiresAt,
      });
      toast.success("Festival Special Offer published successfully!");
      clearSelectedFile();
      setExpiryInput("");
    } catch (error: any) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to publish festival offer. Please try again.";
      toast.error(errMsg);
    }
  };

  const handleDisableOffer = async () => {
    if (!festivalOffer?.id) return;

    try {
      await disableMutation.mutateAsync(festivalOffer.id);
      toast.success("Festival offer disabled successfully.");
      setIsDisableDialogOpen(false);
    } catch (error: any) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to disable festival offer.";
      toast.error(errMsg);
    }
  };

  const isOfferActive =
    festivalOffer &&
    festivalOffer.enabled &&
    !countdown.isExpired &&
    !!festivalOffer.mediaUrl;

  return (
    <div className="space-y-8">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Special Events & Festivals
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Festival Special Offer Management
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Showcase limited-time festive discounts, banners, or video promotions with real-time expiration countdown.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
            className="self-start md:self-auto bg-white/10 hover:bg-white/20 text-white border-white/20 gap-2 rounded-xl backdrop-blur-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Current Active Festival Offer */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose-950" />
              Current Active Festival Offer
            </h3>
            {isOfferActive ? (
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs px-2.5 py-0.5 shadow-sm">
                ● ACTIVE
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-slate-100 text-slate-600 font-semibold text-xs px-2.5 py-0.5">
                ● INACTIVE / EXPIRED
              </Badge>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex-1 flex flex-col justify-between">
            {isLoading ? (
              <div className="h-80 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-rose-950" />
                <p className="text-sm font-medium">Loading festival offer...</p>
              </div>
            ) : isError ? (
              <div className="h-80 flex flex-col items-center justify-center text-center p-6 gap-3">
                <AlertCircle className="h-10 w-10 text-rose-500" />
                <p className="text-sm font-medium text-slate-700">
                  Unable to load festival offer
                </p>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : festivalOffer && festivalOffer.mediaUrl ? (
              <div className="space-y-4">
                {/* Media Preview Card */}
                <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video shadow-inner border border-slate-800 group flex items-center justify-center">
                  {festivalOffer.mediaType === "VIDEO" ||
                  festivalOffer.mediaUrl.endsWith(".mp4") ? (
                    <video
                      key={festivalOffer.mediaUrl}
                      src={festivalOffer.mediaUrl}
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={festivalOffer.mediaUrl}
                      alt="Festival Special Offer"
                      className="w-full h-full object-contain"
                    />
                  )}

                  {/* Media Type Badge Overlay */}
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20">
                      {festivalOffer.mediaType === "VIDEO" ? (
                        <>
                          <Video className="h-3.5 w-3.5 text-indigo-400" />
                          Video Offer
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-3.5 w-3.5 text-amber-400" />
                          Banner Image
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Offer Details Box */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                  {/* Status & Expiry */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-200">
                    <div className="space-y-1">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Expires At
                      </span>
                      <p className="text-sm font-bold text-slate-800">
                        {festivalOffer.expiresAt
                          ? new Date(festivalOffer.expiresAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "No Expiry Date"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1">
                        <Timer className="h-3.5 w-3.5" />
                        Remaining Time
                      </span>
                      <p
                        className={`text-sm font-black ${
                          countdown.isExpired
                            ? "text-rose-600"
                            : "text-amber-600"
                        }`}
                      >
                        {countdown.text}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      Created on:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {festivalOffer.createdAt
                        ? new Date(festivalOffer.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-medium">Status:</span>
                    {isOfferActive ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Active in Customer App
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        <Ban className="h-3.5 w-3.5 text-slate-400" /> Disabled / Expired
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="flex-1 text-xs gap-1.5 h-9 bg-white hover:bg-slate-50 text-slate-700"
                    >
                      <a
                        href={festivalOffer.mediaUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        View Full Media
                      </a>
                    </Button>

                    {festivalOffer.enabled && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsDisableDialogOpen(true)}
                        className="text-xs gap-1.5 h-9 border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                      >
                        <Ban className="h-3.5 w-3.5" />
                        Disable Offer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <Sparkles className="h-7 w-7 text-slate-400" />
                </div>
                <h4 className="text-base font-semibold text-slate-800">
                  No Active Festival Offer
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Upload an image banner or video and set an expiry date to activate a special festival offer.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Upload / Replace Form */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-rose-950" />
            Create / Replace Festival Offer
          </h3>

          <form
            onSubmit={handlePublish}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex-1 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              {/* Dropzone */}
              <div>
                <Label className="text-slate-700 font-semibold text-sm flex items-center justify-between mb-2">
                  <span>
                    Offer Media File <span className="text-red-500">*</span>
                  </span>
                  {selectedFile && (
                    <Badge
                      variant="outline"
                      className="bg-slate-50 text-slate-700 text-[11px] font-semibold"
                    >
                      Detected: {detectedType}
                    </Badge>
                  )}
                </Label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,video/mp4"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                {!selectedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                      isDragging
                        ? "border-rose-950 bg-rose-50/70 scale-[0.99]"
                        : "border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-400"
                    }`}
                    style={{ minHeight: "180px" }}
                  >
                    <div className="h-14 w-14 rounded-full bg-rose-100/60 text-rose-950 flex items-center justify-center mb-3 shadow-sm">
                      <UploadCloud className="h-7 w-7" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800">
                      Click to browse or drag & drop media
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm">
                      Supports Images (<span className="font-medium text-slate-700">.jpg, .png, .webp</span> up to 10MB) and Videos (<span className="font-medium text-slate-700">.mp4</span> up to 100MB).
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video shadow-sm border border-slate-200 flex items-center justify-center">
                      {detectedType === "VIDEO" ? (
                        <video
                          src={previewUrl!}
                          controls
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img
                          src={previewUrl!}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="h-9 w-9 rounded-lg bg-rose-100 text-rose-950 flex items-center justify-center shrink-0">
                          {detectedType === "VIDEO" ? (
                            <Video className="h-4 w-4" />
                          ) : (
                            <ImageIcon className="h-4 w-4" />
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-semibold text-slate-800 truncate" title={selectedFile.name}>
                            {selectedFile.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {detectedType}
                          </p>
                        </div>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearSelectedFile}
                        disabled={uploadMutation.isPending}
                        className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 h-8 px-2.5 gap-1 text-xs"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Expiry Date & Time Picker */}
              <div className="space-y-2">
                <Label htmlFor="expiryInput" className="text-slate-700 font-semibold text-sm flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-rose-950" />
                  Offer Expiry Date & Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="expiryInput"
                  type="datetime-local"
                  value={expiryInput}
                  onChange={(e) => setExpiryInput(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  required
                  className="rounded-xl border-slate-300 focus:border-rose-950 focus:ring-rose-950 h-11"
                />
                <p className="text-[11px] text-slate-500">
                  When this time is reached, the offer banner will automatically expire and be hidden.
                </p>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                {selectedFile && expiryInput ? (
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Ready to publish
                  </span>
                ) : (
                  <span>Select media & set expiry time</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedFile && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      clearSelectedFile();
                      setExpiryInput("");
                    }}
                    disabled={uploadMutation.isPending}
                    className="rounded-xl"
                  >
                    Reset
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={!selectedFile || !expiryInput || uploadMutation.isPending}
                  className="bg-rose-950 hover:bg-rose-900 text-white font-medium rounded-xl shadow-md min-w-[170px] gap-2"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Publishing Offer...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Publish Festival Offer
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Disable Confirmation Dialog */}
      <Dialog open={isDisableDialogOpen} onOpenChange={setIsDisableDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 text-rose-950">
              <AlertCircle className="h-5 w-5 text-rose-600" />
              Disable Festival Special Offer?
            </DialogTitle>
            <DialogDescription className="pt-2 text-slate-600">
              Are you sure you want to deactivate this festival special offer? It will no longer be visible to customers in the app.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDisableDialogOpen(false)}
              disabled={disableMutation.isPending}
              className="rounded-xl"
            >
              Keep Active
            </Button>
            <Button
              type="button"
              onClick={handleDisableOffer}
              disabled={disableMutation.isPending}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md gap-2"
            >
              {disableMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Yes, Disable Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
