import { useState, useRef, DragEvent } from "react";
import {
  useAdminPromoVideo,
  useUploadPromoVideo,
} from "@/hooks/admin/useAdminPromoVideo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Video,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  ExternalLink,
  Copy,
  Trash2,
  Film,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export default function PromoVideoManagement() {
  const { data: promoVideo, isLoading, isError, refetch } = useAdminPromoVideo();
  const uploadMutation = useUploadPromoVideo();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validate MP4 format
    const isMp4 =
      file.type === "video/mp4" ||
      file.name.toLowerCase().endsWith(".mp4");

    if (!isMp4) {
      toast.error("Invalid file format. Please select an MP4 (.mp4) video file.");
      return;
    }

    // Limit to 100MB
    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File is too large. Maximum allowed size is 100 MB.");
      return;
    }

    // Revoke previous preview URL if any
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
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

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an MP4 video file to upload.");
      return;
    }

    try {
      await uploadMutation.mutateAsync(selectedFile);
      toast.success("Promo video uploaded successfully!");
      clearSelectedFile();
    } catch (error: any) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload promo video. Please try again.";
      toast.error(errMsg);
    }
  };

  const copyVideoUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Video URL copied to clipboard");
  };

  return (
    <div className="space-y-8">
      {/* Header Description */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Promotion & Branding
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Promo Video Management
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Upload and manage the active promotional video showcased across the customer app and portal.
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
        {/* Left Column: Current Active Video */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Film className="h-5 w-5 text-rose-950" />
              Current Active Promo Video
            </h3>
            {promoVideo?.active && (
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs px-2.5 py-0.5 shadow-sm">
                ● ACTIVE
              </Badge>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex-1 flex flex-col justify-between">
            {isLoading ? (
              <div className="h-80 flex flex-col items-center justify-center text-slate-400 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-rose-950" />
                <p className="text-sm font-medium">Fetching promo video...</p>
              </div>
            ) : isError ? (
              <div className="h-80 flex flex-col items-center justify-center text-center p-6 gap-3">
                <AlertCircle className="h-10 w-10 text-rose-500" />
                <p className="text-sm font-medium text-slate-700">
                  Unable to load promo video
                </p>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : promoVideo && promoVideo.videoUrl ? (
              <div className="space-y-4">
                {/* Video Player Wrapper */}
                <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video shadow-inner border border-slate-800 group">
                  <video
                    key={promoVideo.videoUrl}
                    src={promoVideo.videoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Metadata & Actions */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      Created on:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {promoVideo.createdAt
                        ? new Date(promoVideo.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                        : "N/A"}
                    </span>
                  </div>



                </div>
              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <Film className="h-7 w-7" />
                </div>
                <h4 className="text-base font-semibold text-slate-800">
                  No Active Promo Video
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Upload an MP4 promotional video using the section on the right to publish it.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Upload New Promo Video */}
        <div className="lg:col-span-6 flex flex-col space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-rose-950" />
            Upload New Promo Video
          </h3>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex-1 flex flex-col justify-between space-y-5">
            <div>
              {/* Dropzone */}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${isDragging
                    ? "border-rose-950 bg-rose-50/70 scale-[0.99]"
                    : "border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-slate-400"
                    }`}
                  style={{ minHeight: "240px" }}
                >
                  <div className="h-16 w-16 rounded-full bg-rose-100/60 text-rose-950 flex items-center justify-center mb-4 shadow-sm">
                    <UploadCloud className="h-8 w-8" />
                  </div>
                  <h4 className="text-base font-semibold text-slate-800">
                    Click to browse or drag & drop video
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Supports <span className="font-semibold text-slate-700">.mp4</span> format up to 100 MB.
                  </p>
                  <div className="mt-4 px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] font-medium text-slate-600 shadow-2xs">
                    Standard 16:9 or 9:16 aspect ratio recommended
                  </div>
                </div>
              ) : (
                /* Selected File Preview */
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video shadow-sm border border-slate-200">
                    {previewUrl && (
                      <video
                        src={previewUrl}
                        controls
                        playsInline
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="h-10 w-10 rounded-lg bg-rose-100 text-rose-950 flex items-center justify-center shrink-0">
                        <Video className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-slate-800 truncate" title={selectedFile.name}>
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • MP4 Video
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearSelectedFile}
                      disabled={uploadMutation.isPending}
                      className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 h-9 px-3 gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Change
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                {selectedFile ? (
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Ready for upload
                  </span>
                ) : (
                  <span>No video selected</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedFile && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearSelectedFile}
                    disabled={uploadMutation.isPending}
                    className="rounded-xl"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadMutation.isPending}
                  className="bg-rose-950 hover:bg-rose-900 text-white font-medium rounded-xl shadow-md min-w-[160px] gap-2"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading Video...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4" />
                      Publish Promo Video
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
