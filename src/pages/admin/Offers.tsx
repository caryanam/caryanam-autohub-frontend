import { useState, useRef } from "react";
import { useAdminOffers, useSendDealerOffer, AdminOffer, useOfferDeliverySummary, useOfferGlobalStats } from "@/hooks/admin/useAdminOffers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, Gift, Image as ImageIcon, X, History, CheckCircle2, AlertCircle, Users, XCircle, Phone, Info, Sparkles, RefreshCw, Video } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminOffers() {
  const { data: offers = [], isLoading, isError, refetch } = useAdminOffers();
  const { data: globalStats, isLoading: isStatsLoading } = useOfferGlobalStats();
  const sendOfferMutation = useSendDealerOffer();

  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);

  const selectedOffer = offers.find(o => o.offerId === selectedOfferId);
  const { data: deliverySummary, isLoading: isLogsLoading, refetch: refetchLogs } = useOfferDeliverySummary(selectedOfferId);
  const selectedLogs = deliverySummary?.dealerBreakdown;

  // Form state
  const [templateType, setTemplateType] = useState<"IMAGE" | "VIDEO">("IMAGE");
  const [offerImage, setOfferImage] = useState<File | null>(null);
  const [offerVideo, setOfferVideo] = useState<File | null>(null);
  const [offerTitle, setOfferTitle] = useState("");
  const [dealerGreetingName, setDealerGreetingName] = useState("Valued Partner");
  const [offerDetails, setOfferDetails] = useState("");
  const [benefits, setBenefits] = useState("");
  const [contactInfo, setContactInfo] = useState("8483079733");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file (JPG, PNG, etc.)");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file size must be less than 5MB");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setOfferImage(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith("video/")) {
        toast.error("Please upload a valid video file (MP4, 3GP, etc.)");
        if (videoInputRef.current) videoInputRef.current.value = "";
        return;
      }

      if (file.size > 16 * 1024 * 1024) {
        toast.error("Video file size must be less than 16MB");
        if (videoInputRef.current) videoInputRef.current.value = "";
        return;
      }
      setOfferVideo(file);
    }
  };

  const resetForm = () => {
    setTemplateType("IMAGE");
    setOfferImage(null);
    setOfferVideo(null);
    setOfferTitle("");
    setDealerGreetingName("Valued Partner");
    setOfferDetails("");
    setBenefits("");
    setContactInfo("8483079733");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (templateType === "IMAGE" && !offerImage) {
      toast.error("Please select an offer image.");
      return;
    }
    if (templateType === "VIDEO" && !offerVideo) {
      toast.error("Please select an offer video.");
      return;
    }

    const formData = new FormData();
    formData.append("templateType", templateType);
    if (templateType === "IMAGE" && offerImage) {
      formData.append("offerImage", offerImage);
    } else if (templateType === "VIDEO" && offerVideo) {
      formData.append("offerVideo", offerVideo);
    }
    formData.append("offerTitle", offerTitle);
    formData.append("dealerGreetingName", dealerGreetingName);
    formData.append("offerDetails", offerDetails);
    formData.append("benefits", benefits);
    formData.append("contactInfo", contactInfo);

    try {
      await sendOfferMutation.mutateAsync(formData);
      toast.success("Offer sent to dealers successfully!");
      setIsSendModalOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to send offer.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Failed to load offers.</p>
        <Button onClick={() => refetch()} variant="outline">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
            <Gift className="h-6 w-6 text-rose-950" />
            Offers Management
          </h2>
          <p className="text-muted-foreground mt-1">Send marketing offers to all active dealers and track delivery.</p>
        </div>
        <Button onClick={() => setIsSendModalOpen(true)} className="gap-2 bg-rose-950 hover:bg-rose-900 text-white rounded-xl shadow-md px-6">
          <Plus className="h-4 w-4" />
          Send New Offer
        </Button>
      </div>

      {/* Global WhatsApp Stats */}
      {!isStatsLoading && globalStats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
             <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center mb-2">
               <History className="h-4 w-4 text-slate-600" />
             </div>
             <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Sent</p>
             <p className="text-3xl font-black text-slate-800">{globalStats.totalSent ?? globalStats.sent ?? 0}</p>
          </div>
          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
             <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mb-2">
               <RefreshCw className="h-4 w-4 text-amber-600" />
             </div>
             <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-1">Queued</p>
             <p className="text-3xl font-black text-amber-700">{globalStats.totalQueued ?? globalStats.queued ?? globalStats.totalAccepted ?? globalStats.accepted ?? 0}</p>
          </div>
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
             <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
               <CheckCircle2 className="h-4 w-4 text-emerald-600" />
             </div>
             <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Delivered</p>
             <p className="text-3xl font-black text-emerald-700">{globalStats.totalDelivered ?? globalStats.delivered ?? 0}</p>
          </div>
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
             <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mb-2">
               <Users className="h-4 w-4 text-blue-600" />
             </div>
             <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">Read</p>
             <p className="text-3xl font-black text-blue-700">{globalStats.totalRead ?? globalStats.read ?? 0}</p>
          </div>
          <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
             <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center mb-2">
               <XCircle className="h-4 w-4 text-rose-600" />
             </div>
             <p className="text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-1">Failed</p>
             <p className="text-3xl font-black text-rose-700">{globalStats.totalFailed ?? globalStats.failed ?? 0}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {offers.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-slate-300">
            <Gift className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800">No offers sent yet</h3>
            <p className="text-slate-500 text-sm mt-1">Click "Send New Offer" to get started.</p>
          </div>
        ) : (
          offers.map((offer) => (
            <div key={offer.offerId} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row group">
              
              {/* Left Side: Image/Video & Title */}
              <div 
                className="relative md:w-2/5 min-h-[300px] flex flex-col justify-between bg-slate-950 p-6 overflow-hidden"
                style={offer.templateType === "IMAGE" && offer.imageUrl ? { backgroundImage: `url(${offer.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              >
                {offer.templateType === "VIDEO" && offer.videoUrl ? (
                  <video 
                    src={offer.videoUrl} 
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                  />
                ) : !offer.imageUrl ? (
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <Gift className="w-32 h-32 text-white" />
                  </div>
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent z-0" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 to-transparent z-0" />
                
                <div className="relative z-10 flex justify-between items-start">
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-rose-500/20 backdrop-blur-md text-rose-300 text-[10px] font-bold uppercase tracking-wider border border-rose-500/30">
                      ID: {offer.offerId}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30">
                      {offer.templateType === "VIDEO" ? <Video className="h-3 w-3 mr-1" /> : <ImageIcon className="h-3 w-3 mr-1" />}
                      {offer.templateType}
                    </span>
                  </div>
                </div>

                <div className="relative z-10 mt-auto">
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-lg tracking-tight">
                    {offer.offerTitle}
                  </h3>
                  <p className="text-slate-300 text-sm mt-2 font-medium tracking-wide">
                    Sent: {new Date(offer.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Right Side: Details & Stats */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between bg-white">
                <div>
                  {/* Stats Row */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full mb-6">
                    <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Targeted</p>
                        <p className="text-xl font-black text-slate-800 leading-none mt-1">{offer.totalDealersTargeted}</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Success</p>
                        <p className="text-xl font-black text-emerald-700 leading-none mt-1">{offer.totalSentSuccess}</p>
                      </div>
                    </div>

                    <div className="flex-1 bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                        <XCircle className="h-5 w-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">Failed</p>
                        <p className="text-xl font-black text-rose-700 leading-none mt-1">{offer.totalSentFailed}</p>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-1.5 text-rose-900/80 mb-2">
                        <Users className="h-4 w-4" />
                        <p className="text-[11px] font-bold uppercase tracking-wider">Greeting</p>
                      </div>
                      <span className="font-semibold text-slate-800">{offer.dealerGreetingName}</span>
                    </div>

                    <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-1.5 text-rose-900/80 mb-2">
                        <Phone className="h-4 w-4" />
                        <p className="text-[11px] font-bold uppercase tracking-wider">Contact</p>
                      </div>
                      <span className="font-semibold text-slate-800">{offer.contactInfo}</span>
                    </div>

                    <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-1.5 text-rose-900/80 mb-2">
                        <Info className="h-4 w-4" />
                        <p className="text-[11px] font-bold uppercase tracking-wider">Details</p>
                      </div>
                      <p className="text-slate-600 line-clamp-3 text-sm italic">
                        "{offer.offerDetails}"
                      </p>
                    </div>
                    
                    <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-1.5 text-emerald-700 mb-2">
                        <Sparkles className="h-4 w-4" />
                        <p className="text-[11px] font-bold uppercase tracking-wider">Benefits</p>
                      </div>
                      <p className="text-slate-700 font-medium line-clamp-3 text-sm">
                        {offer.benefits}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Action Button */}
                <Button
                  onClick={() => setSelectedOfferId(offer.offerId)}
                  className="w-full sm:w-auto self-end bg-rose-50 hover:bg-rose-100 text-rose-950 border border-rose-200 shadow-sm gap-2 rounded-xl h-11 px-8 transition-all"
                >
                  <History className="h-4 w-4" /> 
                  View Detailed Logs
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Send Offer Modal */}
      <Dialog open={isSendModalOpen} onOpenChange={(open) => {
        setIsSendModalOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 text-slate-950">
              <Gift className="h-5 w-5 text-rose-950" /> Send Offer to Dealers
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSendOffer} className="space-y-5 mt-4">
            {/* Template Type Selection */}
            <div className="space-y-2">
              <Label className="text-slate-700 font-medium">Select Template Type <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`border-2 rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer transition-all ${templateType === "IMAGE" ? 'border-rose-950 bg-rose-50 text-rose-950 font-semibold' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                  onClick={() => setTemplateType("IMAGE")}
                >
                  <ImageIcon className="h-5 w-5" /> Image Template
                </div>
                <div 
                  className={`border-2 rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer transition-all ${templateType === "VIDEO" ? 'border-rose-950 bg-rose-50 text-rose-950 font-semibold' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                  onClick={() => setTemplateType("VIDEO")}
                >
                  <Video className="h-5 w-5" /> Video Template
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="offerTitle">Offer Title <span className="text-red-500">*</span></Label>
              <Input
                id="offerTitle"
                value={offerTitle}
                onChange={(e) => setOfferTitle(e.target.value)}
                placeholder="e.g. Dealer Festival Offer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="offerDetails">Offer Details <span className="text-red-500">*</span></Label>
              <Textarea
                id="offerDetails"
                value={offerDetails}
                onChange={(e) => setOfferDetails(e.target.value)}
                placeholder="Brief description of the offer..."
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits <span className="text-red-500">*</span></Label>
              <Textarea
                id="benefits"
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                placeholder="List benefits separated by commas..."
                rows={2}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactInfo">Contact Info <span className="text-red-500">*</span></Label>
                <Input
                  id="contactInfo"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  required
                  disabled
                  className="bg-slate-100 cursor-not-allowed opacity-70"
                />
              </div>
              <div className="space-y-2 col-span-1 md:col-span-2">
                <Label className="text-slate-700 font-medium">
                  {templateType === "IMAGE" ? "Offer Image (.jpg or .png)" : "Offer Video (.mp4 or .3gp)"} <span className="text-red-500">*</span>
                </Label>
                
                {templateType === "IMAGE" ? (
                  <div 
                    className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ease-in-out flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
                      offerImage ? 'border-rose-300 bg-rose-50/50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    style={{ minHeight: '160px' }}
                  >
                    <Input
                      id="offerImage"
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    
                    {offerImage ? (
                      <div className="flex flex-col items-center z-10 w-full">
                        <div className="relative w-full max-h-48 rounded-lg overflow-hidden mb-3 border border-slate-200 shadow-sm flex items-center justify-center bg-white">
                          <img 
                            src={URL.createObjectURL(offerImage)} 
                            alt="Offer Preview" 
                            className="max-h-48 object-contain"
                          />
                        </div>
                        <div className="flex items-center justify-between w-full px-2">
                          <p className="text-sm text-emerald-700 font-medium truncate flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md shadow-sm border border-emerald-100">
                            <CheckCircle2 className="h-4 w-4" /> 
                            {offerImage.name} <span className="text-emerald-500 text-xs ml-1">({(offerImage.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </p>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOfferImage(null);
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                          >
                            <X className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center p-4">
                        <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center mb-3 text-indigo-500 shadow-sm border border-indigo-100">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                        <p className="text-slate-700 font-semibold text-sm mb-1">Click to upload banner image</p>
                        <p className="text-slate-400 text-xs max-w-xs">High resolution JPG or PNG up to 5MB. This will be sent directly to dealers.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 ease-in-out flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
                      offerVideo ? 'border-indigo-300 bg-indigo-50/50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
                    }`}
                    onClick={() => videoInputRef.current?.click()}
                    style={{ minHeight: '160px' }}
                  >
                    <Input
                      id="offerVideo"
                      type="file"
                      accept="video/mp4, video/3gpp"
                      onChange={handleVideoChange}
                      ref={videoInputRef}
                      className="hidden"
                    />
                    
                    {offerVideo ? (
                      <div className="flex flex-col items-center z-10 w-full">
                        <div className="relative w-full max-h-48 rounded-lg overflow-hidden mb-3 border border-slate-200 shadow-sm flex items-center justify-center bg-black/5">
                          <video 
                            src={URL.createObjectURL(offerVideo)} 
                            controls
                            className="max-h-48 object-contain"
                          />
                        </div>
                        <div className="flex items-center justify-between w-full px-2">
                          <p className="text-sm text-emerald-700 font-medium truncate flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-md shadow-sm border border-emerald-100">
                            <CheckCircle2 className="h-4 w-4" /> 
                            {offerVideo.name} <span className="text-emerald-500 text-xs ml-1">({(offerVideo.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </p>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 h-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOfferVideo(null);
                              if (videoInputRef.current) videoInputRef.current.value = "";
                            }}
                          >
                            <X className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center p-4">
                        <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center mb-3 text-indigo-500 shadow-sm border border-indigo-100">
                          <Video className="h-6 w-6" />
                        </div>
                        <p className="text-slate-700 font-semibold text-sm mb-1">Click to upload offer video</p>
                        <p className="text-slate-400 text-xs max-w-xs">MP4 or 3GP up to 16MB. This will be sent directly to dealers.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsSendModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-rose-950 hover:bg-rose-900 text-white shadow-md" disabled={sendOfferMutation.isPending}>
                {sendOfferMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Blast Offer
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Logs Modal */}
      <Dialog open={!!selectedOfferId} onOpenChange={(open) => !open && setSelectedOfferId(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center justify-between pr-8">
              <DialogTitle>Offer Delivery Logs</DialogTitle>
              <Button variant="outline" size="sm" onClick={() => refetchLogs()} className="gap-2 h-8" disabled={isLogsLoading}>
                <Loader2 className={`h-3.5 w-3.5 ${isLogsLoading ? 'animate-spin' : ''}`} />
                Refresh Logs
              </Button>
            </div>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 mt-4 pr-2">
            {isLogsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-rose-950" />
              </div>
            ) : deliverySummary ? (
              <div className="space-y-6">
                {/* Aggregated Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Targeted</p>
                    <p className="text-lg font-black text-slate-800">{deliverySummary.totalDealers}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Accepted</p>
                    <p className="text-lg font-black text-blue-700">{deliverySummary.accepted}</p>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Sent</p>
                    <p className="text-lg font-black text-indigo-700">{deliverySummary.sent}</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Delivered</p>
                    <p className="text-lg font-black text-emerald-700">{deliverySummary.delivered}</p>
                  </div>
                  <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] uppercase font-bold text-teal-600 tracking-wider">Read</p>
                    <p className="text-lg font-black text-teal-700">{deliverySummary.read}</p>
                  </div>
                  <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">Failed</p>
                    <p className="text-lg font-black text-rose-700">{deliverySummary.failed}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-800 border-b pb-2">Dealer Logs</h3>
                  {selectedLogs && selectedLogs.length > 0 ? (
                    selectedLogs.map((log, idx) => {
                      const isSuccess = log.deliveryStatus !== 'FAILED';
                      return (
                      <div key={idx} className={`p-4 rounded-xl border ${isSuccess ? 'bg-emerald-50/30 border-emerald-100' : 'bg-red-50/30 border-red-100'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-slate-800">{log.dealerName}</h4>
                            <p className="text-sm text-slate-500">+{log.mobileNumber}</p>
                          </div>
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${isSuccess ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {log.deliveryStatus}
                          </span>
                        </div>
                        <div className="mt-2 flex justify-between items-center text-xs text-slate-400">
                          <span>Attempted: {new Date(log.sentAt).toLocaleString()}</span>
                          {log.whatsappMessageId && <span className="truncate max-w-[200px]" title={log.whatsappMessageId}>ID: {log.whatsappMessageId}</span>}
                        </div>
                      </div>
                      );
                    })
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No specific dealer logs available.</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No logs available for this offer.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
