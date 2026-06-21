import type { FuelType, Transmission, Ownership } from "@/types";

export const BUDGET_BANDS = [
  { label: "Under ₹3 Lakh", min: 0, max: 300000 },
  { label: "₹3-5 Lakh", min: 300000, max: 500000 },
  { label: "₹5-10 Lakh", min: 500000, max: 1000000 },
  { label: "₹10-15 Lakh", min: 1000000, max: 1500000 },
  { label: "Above ₹15 Lakh", min: 1500000, max: 100000000 },
];
export const QUICK_BRANDS = [
  "Hyundai",
  "Maruti Suzuki",
  "Tata",
  "Mahindra",
  "Toyota",
  "Honda",
  "Kia",
  "MG",
];

export const CITIES = ["Pune", "PCMC"];
export const FUELS: FuelType[] = [
  "Petrol",
  "Diesel",
  "CNG",
  "Electric",
  "Hybrid",
];
export const TRANSMISSIONS: Transmission[] = ["Manual", "Automatic"];
export const OWNERSHIPS: Ownership[] = ["1st Owner", "2nd Owner", "3rd Owner"];
