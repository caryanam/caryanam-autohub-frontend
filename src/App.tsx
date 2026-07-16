import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { DealerAuthProvider } from "@/contexts/DealerAuthContext";
import { Toaster } from "@/components/ui/sonner";
import { SessionExpiredModal } from "@/components/shared/SessionExpiredModal";
import { useEffect } from "react";

import PublicLayout from "@/layouts/PublicLayout";
import DealerLayout from "@/layouts/DealerLayout";
import AdminLayout from "@/layouts/AdminLayout";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

import Home from "@/pages/public/Home";
import Cars from "@/pages/public/Cars";
import PremiumCars from "@/pages/public/PremiumCars";
import CarDetails from "@/pages/public/CarDetails";
import Wishlist from "@/pages/public/Wishlist";
import CustomerChat from "@/pages/public/Chat";

import About from "@/pages/public/About";
import PrivacyPolicy from "@/pages/public/PrivacyPolicy";
import TermsAndConditions from "@/pages/public/TermsAndConditions";
import RefundPolicy from "@/pages/public/RefundPolicy";
import RTOForm from "@/pages/public/RTOForm";
import DeleteAccount from "@/pages/public/DeleteAccount";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import NotFound from "@/pages/NotFound";

import DealerDashboard from "@/pages/dealer/Dashboard";
import DealerVehicles from "@/pages/dealer/vehicle/Vehicles";
import DealerVehicleDetails from "@/pages/dealer/vehicle/VehicleDetails";
import DealerLeads from "@/pages/dealer/Leads";
import DealerProfile from "@/pages/dealer/Profile";
import DealerWishlist from "@/pages/dealer/CustomerWishlist";
import DealerChat from "@/pages/dealer/Chat";

import DealerSubscription from "@/pages/dealer/subscription/Subscription";

import AdminDashboard from "@/pages/admin/Dashboard";
import AdminDealers from "@/pages/admin/Dealers";
import AdminDealerDetails from "@/pages/admin/DealerDetails";
import AdminVehicles from "@/pages/admin/Vehicles";
import AdminOffers from "@/pages/admin/Offers";
import AdminLeads from "@/pages/admin/Leads";
import AdminSubscriptions from "@/pages/admin/Subscriptions";

import AdminReports from "@/pages/admin/Reports";
import AdminChat from "@/pages/admin/Chat";

import DealerFacebookRequests from "@/pages/dealer/FacebookRequests";
import AdminFacebookDealerSummary from "@/pages/admin/facebook/FacebookDealerSummary";
import AdminFacebookDealerRequests from "@/pages/admin/facebook/FacebookDealerRequests";
import AdminFacebookBatchProgress from "@/pages/admin/facebook/FacebookBatchProgress";

export default function App() {
  return (
    <AdminAuthProvider>
      <DealerAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="/cars" element={<Cars />} />
              <Route path="/premium" element={<PremiumCars />} />
              <Route path="/car/:id" element={<CarDetails />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/rto-form" element={<RTOForm />} />
              <Route path="/delete-account" element={<DeleteAccount />} />

              {/* Customer Protected */}
              <Route element={<ProtectedRoute allow={["customer"]} />}>
                <Route path="/chat" element={<CustomerChat />} />
              </Route>
            </Route>

            {/* Auth */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />

            {/* Dealer */}
            <Route element={<ProtectedRoute allow={["dealer"]} />}>
              <Route path="/dealer" element={<DealerLayout />}>
                <Route
                  index
                  element={<Navigate to="/dealer/dashboard" replace />}
                />
                <Route path="dashboard" element={<DealerDashboard />} />
                <Route path="vehicles" element={<DealerVehicles />} />
                <Route
                  path="vehicles/:vehicleId"
                  element={<DealerVehicleDetails />}
                />
                <Route path="leads" element={<DealerLeads />} />
                <Route path="wishlist" element={<DealerWishlist />} />
                <Route path="profile" element={<DealerProfile />} />
                <Route path="chat" element={<DealerChat />} />
                <Route path="subscription" element={<DealerSubscription />} />
                <Route path="facebook-requests" element={<DealerFacebookRequests />} />
              </Route>
            </Route>

            {/* Admin */}
            <Route element={<ProtectedRoute allow={["admin"]} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route
                  index
                  element={<Navigate to="/admin/dashboard" replace />}
                />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="dealers" element={<AdminDealers />} />
                <Route path="dealers/:id" element={<AdminDealerDetails />} />
                <Route path="vehicles" element={<AdminVehicles />} />
                <Route path="offers" element={<AdminOffers />} />
                <Route path="leads" element={<AdminLeads />} />
                <Route path="subscriptions" element={<AdminSubscriptions />} />
                <Route path="chat" element={<AdminChat />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="facebook-requests" element={<AdminFacebookDealerSummary />} />
                <Route path="facebook-requests/dealer/:dealerId" element={<AdminFacebookDealerRequests />} />
                <Route path="facebook-requests/batch/:batchId" element={<AdminFacebookBatchProgress />} />
              </Route>
            </Route>

            {/* 404 inside the public layout shell */}
            <Route element={<PublicLayout />}>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-left" richColors expand />
        <SessionExpiredModal />
      </DealerAuthProvider>
    </AdminAuthProvider>
  );
}
