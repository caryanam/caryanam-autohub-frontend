import { useState, useRef } from "react";
import { useAdminOffers, useSendDealerOffer, AdminOffer, DealerLog } from "@/hooks/admin/useAdminOffers";
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
import { Loader2, Plus, Gift, Image as ImageIcon, X, History, CheckCircle2, AlertCircle, Users, XCircle, Phone, Info, Sparkles } from "lucide-react";
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
  const sendOfferMutation = useSendDealerOffer();

  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<number | null>(null);

  const selectedOffer = offers.find(o => o.offerId === selectedOfferId);
  const selectedLogs = selectedOffer?.dealerLogs;

  // Form state
  const [offerImage, setOfferImage] = useState<File | null>(null);
  const [offerTitle, setOfferTitle] = useState("");
  const [dealerGreetingName, setDealerGreetingName] = useState("");
  const [offerDetails, setOfferDetails] = useState("");
  const [benefits, setBenefits] = useState("");
  const [contactInfo, setContactInfo] = useState("8483079733");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file (JPG, PNG, etc.)");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setOfferImage(file);
    }
  };

  const resetForm = () => {
    setOfferImage(null);
    setOfferTitle("");
    setDealerGreetingName("");
    setOfferDetails("");
    setBenefits("");
    setContactInfo("8483079733");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerImage) {
      toast.error("Please select an offer image.");
      return;
    }

    const formData = new FormData();
    formData.append("offerImage", offerImage);
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
              
              {/* Left Side: Image & Title */}
              <div 
                className="relative md:w-2/5 min-h-[300px] flex flex-col justify-between bg-slate-950 p-6 overflow-hidden"
                style={offer.imageUrl ? { backgroundImage: `url(${offer.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              >
                {!offer.imageUrl && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <Gift className="w-32 h-32 text-white" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent z-0" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 to-transparent z-0" />
                
                <div className="relative z-10 flex justify-between items-start">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-rose-500/20 backdrop-blur-md text-rose-300 text-[10px] font-bold uppercase tracking-wider border border-rose-500/30">
                    ID: {offer.offerId}
                  </span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="dealerGreetingName">Greeting Name <span className="text-red-500">*</span></Label>
                <Input
                  id="dealerGreetingName"
                  value={dealerGreetingName}
                  onChange={(e) => setDealerGreetingName(e.target.value)}
                  placeholder="e.g. Valued Partner"
                  required
                />
              </div>
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
                <Label className="text-slate-700 font-medium">Offer Image (.jpg or .png) <span className="text-red-500">*</span></Label>
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
              <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2 h-8" disabled={isLoading}>
                <Loader2 className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Logs
              </Button>
            </div>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 mt-4 pr-2">
            {selectedLogs && selectedLogs.length > 0 ? (
              <div className="space-y-3">
                {selectedLogs.map((log, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border ${log.status === 'SUCCESS' ? 'bg-emerald-50/30 border-emerald-100' : 'bg-red-50/30 border-red-100'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-800">{log.dealerName}</h4>
                        <p className="text-sm text-slate-500">+{log.mobileNumber}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {log.status}
                      </span>
                    </div>
                    {log.status === 'FAILED' && log.errorMessage && (
                      <div className="mt-2 bg-white/60 p-2 rounded-lg border border-red-100 text-xs text-red-600 flex items-start gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        <span className="break-all">{log.errorMessage}</span>
                      </div>
                    )}
                    <div className="mt-2 flex justify-between items-center text-xs text-slate-400">
                      <span>Attempted: {new Date(log.sentAt).toLocaleString()}</span>
                      {log.whatsappMessageId && <span className="truncate max-w-[200px]" title={log.whatsappMessageId}>ID: {log.whatsappMessageId}</span>}
                    </div>
                  </div>
                ))}
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
