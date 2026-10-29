export type FuelType = "PETROL" | "DIESEL" | "CNG" | "LPG" | "ELECTRIC" | "HYBRID";
export type Transmission = "Manual" | "Automatic";
export type Ownership = 1 | 2 | 3 | 4;
export type LeadStatus = "New" | "Contacted" | "Converted";
export type DealerStatus = "Pending" | "Approved" | "Suspended" | "Rejected";
export type SubscriptionTier = "Basic" | "Standard" | "Premium";

export interface Vehicle {
  id: number;
  vehicleId?: string;
  dealerId: number;
  brand: string;
  model: string;
  variant: string;
  registrationYear: number;
  askingPrice: number;
  kilometerDriven: number;
  fuelType: string;
  transmission?: Transmission;
  ownershipDetails: number;
  city: string;
  vehicleDescription: string;
  vehicleStatus: string;
  createdAt: string;
  dealerContactName?: string;
  dealerContactNumber?: string;
  dealerContactEmail?: string;
  dealerWhatsappNumber?: string;
  dealerBusinessName?: string;
  dealerLogo?: string;
  dealerShowroomImage?: string;
  dealerYearsInBusiness?: number;
  vehicleType?: string;
  images?: string[];
  videos?: string[];
  financeAvailability?: boolean;
  executiveMobile?: string | null;

  // Certification attributes
  certifyRequested?: boolean;
  isCertified?: boolean;
  inspectionStatus?: "NONE" | "PENDING" | "VERIFIED" | "REJECTED";
  certifiedAt?: string;
  certifiedByInspectorId?: number;
  certifiedByInspectorName?: string;
  inspectionNotes?: string;
}

export interface Dealer {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  mobile: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  logo: string;
  showroomImage: string;
  verified: boolean;
  status: DealerStatus;
  rating: number;
  totalListings: number;
  joinedAt: string;
  subscription: SubscriptionTier;
}

export interface Lead {
  id: string;
  customerName: string;
  uniqueLeadId: string;
  mobile: string;
  vehicleId: string;
  vehicleTitle: string;
  dealerId: string;
  status: LeadStatus;
  createdAt: string;
  customerCity?: string;
  socialMediaPlatform?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: SubscriptionTier;
  price: number;
  listings: number | "Unlimited";
  featured: boolean;
  highlight?: boolean;
  features: string[];
}

export type AuthRole = "guest" | "dealer" | "admin" | "customer" | "inspector";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  dealerId?: string;
  assignedArea?: string;
  mobile?: string;
}

export interface Inspector {
  id: number;
  fullName: string;
  email: string;
  mobile: string;
  assignedArea: string;
  isActive: boolean;
  role: string;
  createdByAdminId?: number;
  createdAt?: string;
  updatedAt?: string;
  totalCompletedInspections?: number;
  totalPendingInspections?: number;
}

export interface VehicleInspectionRequest {
  id: number;
  vehicleId: number;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleVariant: string;
  registrationYear: number;
  askingPrice: number;
  kilometerDriven: number;
  fuelType: string;
  vehicleCity: string;
  vehicleType: string;
  vehicleThumbnail?: string;
  vehicleImages?: string[];

  dealerId: number;
  dealerBusinessName: string;
  dealerOwnerName: string;
  dealerMobile: string;
  dealerWhatsapp?: string;
  dealerEmail?: string;
  dealerAddress?: string;
  dealerCity?: string;

  inspectorId?: number;
  inspectorName?: string;
  inspectorMobile?: string;
  inspectorEmail?: string;
  inspectorAssignedArea?: string;

  area: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  requestDate: string;
  completedDate?: string;
  inspectionNotes?: string;
  overallRating?: number;
  isCertified?: boolean;
}

export interface VehicleQrData {
  vehicleId: number;
  brand: string;
  model: string;
  variant: string;
  askingPrice: number;
  fuelType: string;
  city: string;
  registrationYear: number;
  kilometerDriven: number;
  dealerBusinessName?: string;
  dealerName?: string;
  dealerContactNumber?: string;
  dealerWhatsappNumber?: string;
  vehiclePageUrl?: string;
  qrCodeBase64?: string;
}
