import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Users,
  Car,
  Eye,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Sparkles,
  Building,
  Landmark,
} from "lucide-react";
import { useAdminDealerDetails } from "@/hooks/admin/useAdminDealerDetails";
import { useAdminDealers } from "@/hooks/admin/useAdminDealers";
import { formatDate, formatINR } from "@/utils/helpers";
import { SEO } from "@/components/shared/SEO";

const leadStatusStyle: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800 border-none font-semibold",
  CONTACTED: "bg-yellow-100 text-yellow-800 border-none font-semibold",
  SOLD: "bg-emerald-100 text-emerald-800 border-none font-semibold",
  LOST: "bg-red-100 text-red-800 border-none font-semibold",
};

const vehicleStatusStyle: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800 border-none font-semibold",
  PENDING: "bg-yellow-100 text-yellow-800 border-none font-semibold",
  SOLD: "bg-slate-100 text-slate-800 border-none font-semibold",
  INACTIVE: "bg-red-100 text-red-800 border-none font-semibold",
};

export default function DealerDetails() {
  const { id } = useParams<{ id: string }>();
  const dealerId = Number(id);

  const [activeTab, setActiveTab] = useState<"leads" | "vehicles">("leads");

  // Fetch dealer dashboard, leads and vehicles
  const { data: details, isLoading: isDetailsLoading } =
    useAdminDealerDetails(dealerId);

  // Fetch full list of dealers to resolve metadata (logo, address, registration info, status)
  const { data: dealers = [], isLoading: isDealersLoading } = useAdminDealers();
  const dealerInfo = dealers.find((d) => d.id === dealerId);

  const getImageUrl = (path?: string | null) => {
    if (!path) return "";
    const cleanPath = path.trim();
    if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
      return cleanPath;
    }
    return `${import.meta.env.VITE_API_BASE_URL}/${cleanPath}`;
  };

  const isLoading = isDetailsLoading || isDealersLoading;

  return (
    <div className="space-y-6">
      <SEO title={dealerInfo ? `${dealerInfo.businessName} Details — Admin` : "Dealer Details — Admin"} />

      {/* Back button */}
      <div>
        <Link
          to="/admin/dealers"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dealers
        </Link>
      </div>

      {/* Hero Header Section */}
      {isLoading ? (
        <Card className="border border-slate-100 shadow-premium rounded-2xl overflow-hidden bg-white">
          <div className="h-44 bg-slate-100 animate-pulse" />
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-6 w-48 rounded" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-4 w-40 rounded" />
            </div>
          </CardContent>
        </Card>
      ) : dealerInfo ? (
        <Card className="border border-slate-100 shadow-premium rounded-2xl overflow-hidden bg-white">
          {/* Showroom Banner */}
          <div className="relative h-44 bg-slate-100 overflow-hidden shrink-0">
            {dealerInfo.showroomImage ? (
              <img
                src={getImageUrl(dealerInfo.showroomImage)}
                alt="Showroom"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-900 to-indigo-950 flex items-center justify-center text-white/10">
                <Building className="h-20 w-20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
            <div className="absolute bottom-4 left-6 flex items-center gap-4">
              {dealerInfo.dealerLogo ? (
                <img
                  src={getImageUrl(dealerInfo.dealerLogo)}
                  alt="Logo"
                  className="h-16 w-16 rounded-2xl object-cover border-2 border-white bg-white shadow-md"
                />
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold border-2 border-white shadow-md">
                  {dealerInfo.businessName?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <div className="text-white space-y-0.5">
                <h3 className="text-xl font-black capitalize leading-none">
                  {dealerInfo.businessName}
                </h3>
                <p className="text-xs text-white/80 leading-none capitalize">
                  Owner: {dealerInfo.ownerName}
                </p>
              </div>
            </div>
            <div className="absolute bottom-4 right-6">
              <Badge className="bg-slate-950/75 text-white border-0 font-bold px-3 py-1 rounded-full text-xs shadow-md">
                {dealerInfo.dealerAccountStatus}
              </Badge>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Business Identity */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <Landmark className="h-4 w-4" /> Business Identity
                </h4>
                <div className="space-y-1.5 text-sm">
                  <div>
                    <span className="text-slate-400 font-medium text-xs block">GST Number</span>
                    <span className="font-bold text-slate-800">{dealerInfo.gstNumber || "—"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium text-xs block">Years In Business</span>
                    <span className="font-bold text-slate-800">{dealerInfo.yearsInBusiness ?? "—"} years</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <Phone className="h-4 w-4" /> Contact Info
                </h4>
                <div className="space-y-1.5 text-sm">
                  <div>
                    <span className="text-slate-400 font-medium text-xs block">Email Address</span>
                    <span className="font-semibold text-slate-800 block truncate" title={dealerInfo.email}>
                      {dealerInfo.email || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium text-xs block">Dealer Mobile / WhatsApp</span>
                    <span className="font-bold text-slate-800">
                      {dealerInfo.dealerMobile} {dealerInfo.whatsapp && ` / ${dealerInfo.whatsapp}`}
                    </span>
                    {dealerInfo.executiveMobile && (
                      <div className="mt-1">
                        <span className="text-slate-400 font-medium text-xs block">Executive Mobile</span>
                        <span className="font-bold text-slate-800">{dealerInfo.executiveMobile}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-blue-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                  <MapPin className="h-4 w-4" /> Showroom Address
                </h4>
                <div className="space-y-1.5 text-sm">
                  <p className="font-semibold text-slate-800 leading-relaxed capitalize">{dealerInfo.address || "—"}</p>
                  <p className="text-xs text-slate-400 capitalize">{dealerInfo.city}, {dealerInfo.state} {dealerInfo.pinCode}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="p-8 text-center text-slate-500 font-medium border-slate-100 rounded-2xl shadow-sm bg-white">
          Dealer details not found.
        </Card>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="border border-slate-100 shadow-premium rounded-2xl bg-white p-5">
              <Skeleton className="h-10 w-10 rounded-xl mb-3" />
              <Skeleton className="h-7 w-20 rounded mb-1" />
              <Skeleton className="h-3 w-16 rounded" />
            </Card>
          ))
        ) : (
          <>
            {/* Total Leads */}
            <Card className="border border-slate-100 shadow-premium rounded-2xl bg-white p-5 hover:border-slate-200 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100 mb-3.5">
                <Users className="h-5 w-5" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                {details?.dashboard?.totalLeads ?? 0}
              </h4>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                Total Leads
              </p>
            </Card>

            {/* Total Vehicles */}
            <Card className="border border-slate-100 shadow-premium rounded-2xl bg-white p-5 hover:border-slate-200 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100 mb-3.5">
                <Car className="h-5 w-5" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                {details?.dashboard?.totalVehicles ?? 0}
              </h4>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                Total Vehicles
              </p>
            </Card>

            {/* Vehicle Views */}
            <Card className="border border-slate-100 shadow-premium rounded-2xl bg-white p-5 hover:border-slate-200 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100 mb-3.5">
                <Eye className="h-5 w-5" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                {details?.dashboard?.vehicleViews ?? 0}
              </h4>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                Vehicle Views
              </p>
            </Card>

            {/* Featured Vehicles */}
            <Card className="border border-slate-100 shadow-premium rounded-2xl bg-white p-5 hover:border-slate-200 transition-colors">
              <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-100 mb-3.5">
                <Sparkles className="h-5 w-5" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                {details?.dashboard?.featuredVehicles ?? 0}
              </h4>
              <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                Featured Cars
              </p>
            </Card>
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-150 pb-px">
        <Button
          variant="ghost"
          onClick={() => setActiveTab("leads")}
          className={`h-11 rounded-none px-6 font-bold text-sm border-b-2 transition-all cursor-pointer ${activeTab === "leads"
            ? "border-rose-900 text-rose-900 hover:text-rose-950"
            : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
        >
          <FileText className="h-4 w-4 mr-2" /> Leads ({details?.leads?.length ?? 0})
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveTab("vehicles")}
          className={`h-11 rounded-none px-6 font-bold text-sm border-b-2 transition-all cursor-pointer ${activeTab === "vehicles"
            ? "border-rose-900 text-rose-900 hover:text-rose-950"
            : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
        >
          <Car className="h-4 w-4 mr-2" /> Vehicles ({details?.vehicles?.length ?? 0})
        </Button>
      </div>

      {/* Lists */}
      <Card className="border border-slate-100 shadow-premium rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center space-y-4">
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-10 w-full rounded" />
              <Skeleton className="h-10 w-full rounded" />
            </div>
          ) : activeTab === "leads" ? (
            <Table className="min-w-[1000px]">
              <TableHeader className="bg-black border-b border-black">
                <TableRow className="bg-black hover:bg-black border-none">
                  <TableHead className="w-16 text-center text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Sr No
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pl-6">
                    Lead ID
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Customer Name
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Customer Contact
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Enquired Vehicle
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Date
                  </TableHead>
                  <TableHead className="text-right text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pr-6 w-32">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!details?.leads || details.leads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground font-medium">
                      No leads received yet by this dealer.
                    </TableCell>
                  </TableRow>
                ) : (
                  details.leads.map((lead, idx) => (
                    <TableRow key={lead.id} className="hover:bg-slate-50 border-b border-slate-200 last:border-none">
                      <TableCell className="text-center text-slate-400 text-sm font-medium py-4">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-semibold py-4 pl-6 text-slate-600">
                        {lead.uniqueLeadId}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900 text-sm py-4 capitalize">
                        {lead.customerName}
                      </TableCell>
                      <TableCell className="py-4 text-xs font-semibold text-slate-700">
                        <div>{lead.customerMobile}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-medium flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400" /> {lead.customerCity}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-800 text-sm py-4 capitalize">
                        {lead.vehicleName}
                      </TableCell>
                      <TableCell className="text-slate-450 text-xs py-4">
                        {formatDate(lead.enquiryDate)}
                      </TableCell>
                      <TableCell className="text-right py-4 pr-6">
                        <Badge className={`${leadStatusStyle[lead.leadStatus] ?? ""} text-[11px] px-2.5 py-0.5 rounded-full`}>
                          {lead.leadStatus}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          ) : (
            <Table className="min-w-[1000px]">
              <TableHeader className="bg-black border-b border-black">
                <TableRow className="bg-black hover:bg-black border-none">
                  <TableHead className="w-16 text-center text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Sr No
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pl-6">
                    Car Details
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Asking Price
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Kms Driven
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Spec Details
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-100 uppercase tracking-wider py-4">
                    Created Date
                  </TableHead>
                  <TableHead className="text-right text-xs font-bold text-slate-100 uppercase tracking-wider py-4 pr-6 w-32">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!details?.vehicles || details.vehicles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground font-medium">
                      No vehicles listed yet by this dealer.
                    </TableCell>
                  </TableRow>
                ) : (
                  details.vehicles.map((v, idx) => {
                    const carImage = v.images?.[0] || "/placeholder-car.jpg";
                    return (
                      <TableRow key={v.id} className="hover:bg-slate-50 border-b border-slate-200 last:border-none">
                        <TableCell className="text-center text-slate-400 text-sm font-medium py-4">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="py-4 pl-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={getImageUrl(carImage)}
                              className="h-10 w-14 object-cover rounded-lg border border-slate-100 shadow-sm shrink-0"
                              alt=""
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder-car.jpg";
                              }}
                            />
                            <div>
                              <div className="font-bold text-slate-900 text-sm capitalize">
                                {v.brand} {v.model}
                              </div>
                              <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 capitalize font-medium">
                                <span>{v.variant}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-extrabold text-slate-900 text-sm py-4">
                          {formatINR(v.askingPrice)}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-700 text-sm py-4">
                          {v.kilometerDriven.toLocaleString("en-IN")} km
                        </TableCell>
                        <TableCell className="py-4 text-xs font-semibold text-slate-600">
                          <div className="capitalize">{v.fuelType} · {v.registrationYear}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 font-medium flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400" /> {v.city}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-450 text-xs py-4">
                          {formatDate(v.createdAt)}
                        </TableCell>
                        <TableCell className="text-right py-4 pr-6">
                          <Badge className={`${vehicleStatusStyle[v.vehicleStatus] ?? ""} text-[11px] px-2.5 py-0.5 rounded-full`}>
                            {v.vehicleStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
