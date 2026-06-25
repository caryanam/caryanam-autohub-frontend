import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  Car,
  X,
  Phone,
  Mail,
  MapPin,
  Heart,
  User,
  LogOut,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthModal } from "@/components/shared/AuthModal";
import {
  useCustomer,
  clearCustomer,
  type CustomerUser,
} from "@/hooks/public/useCustomerAuth";
import apiClient from "@/lib/customerApiClient";
import { toast } from "sonner";
import footerBg from "@/assets/footer-bg.png";
const nav = [
  { to: "/", label: "Home" },
  { to: "/cars", label: "Browse Cars" },
  { to: "/premium", label: "Premium Cars" },
  { to: "/about", label: "About" },

];

export default function PublicLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const customer = useCustomer();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleAuthSuccess = (user: CustomerUser) => {
    // State updates automatically via useCustomer hook
  };

  const handleWishlistClick = () => {
    if (!customer) {
      setAuthOpen(true);
    } else {
      navigate("/wishlist");
    }
  };

  const handleUserClick = () => {
    if (!customer) {
      setAuthOpen(true);
    } else {
      setUserMenuOpen((v) => !v);
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      clearCustomer();
      setUserMenuOpen(false);
      toast.success("Logged out");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 glass border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4 relative">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-white">
              <Car className="h-5 w-5" />
            </div>
            <div className="font-display font-black text-lg leading-none">
              CAPL <span className="text-accent"></span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-md font-medium transition-colors ${isActive ? "text-accent bg-accent/10" : "text-foreground/70 hover:text-foreground hover:bg-muted"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* Customer user icon */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={handleUserClick}
                className={`h-9 w-9 flex items-center justify-center rounded-full transition-colors overflow-hidden ${customer
                  ? "gradient-primary text-white hover:opacity-90"
                  : "bg-muted hover:bg-accent/10"
                  }`}
                title={
                  customer ? customer.customerName || customer.email : "Login"
                }
              >
                {customer ? (
                  <span className="text-sm font-bold uppercase leading-none">
                    {(customer.customerName || customer.email || "U")
                      .trim()
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                ) : (
                  <User className="h-5 w-5 text-foreground/70" />
                )}
              </button>

              {/* Dropdown */}
              {userMenuOpen && customer && (
                <div className="absolute right-0 top-11 w-52 bg-background border border-border rounded-xl shadow-premium z-50 py-2">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-semibold truncate capitalize">
                      {customer.customerName || customer.email}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {customer.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/wishlist");
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <Heart className="h-4 w-4" /> My Wishlist
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Dealer buttons */}

            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex gradient-primary text-white border-0 hover:opacity-90"
            >
              <Link to="/auth/login">Dealer Login</Link>
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-1 mt-8">
                  {nav.map((n) => (
                    <Link
                      key={n.to}
                      to={n.to}
                      className="px-3 py-3 rounded-lg hover:bg-muted font-medium"
                    >
                      {n.label}
                    </Link>
                  ))}

                  <div className="h-px bg-border my-3" />
                  <Button asChild variant="outline" className="justify-start">
                    <Link to="/auth/login">Dealer Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="justify-start gradient-primary text-white border-0"
                  >
                    <Link to="/auth/register">Register Dealer</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1"
        >
          <Outlet />
        </motion.main>

      </AnimatePresence>

      <footer className="relative text-white mt-16 overflow-hidden bg-[#0c1328]">
        {/* Giant watermark background spanning the bottom */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center pointer-events-none select-none z-0">
          <span className="text-[18vw] font-black uppercase tracking-[0.2em] text-white/[0.015] leading-none translate-y-[15%]">
            CAPL
          </span>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

          {/* Top Explore bar */}
          <div className="mb-8">
            <span className="text-xs font-bold text-white/95 uppercase tracking-wider flex items-center gap-1.5">
              <span className="text-blue-400 font-extrabold text-sm">+</span> Explore more on CAPL
            </span>
          </div>

          {/* 4-Column Grid */}
          <div className="grid gap-10 md:grid-cols-4">
            {/* Col 1: Logo & Description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-white">
                  <Car className="h-5 w-5" />
                </div>
                <div className="font-display font-black text-lg">CAPL</div>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                India's most trusted used-car dealer marketplace. Verified
                inventory across 150+ cities.
              </p>
            </div>

            {/* Col 2: Explore */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Explore</h4>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li>
                  <Link to="/cars" className="transition-colors duration-200 hover:text-blue-400">
                    Browse Cars
                  </Link>
                </li>
                <li>
                  <Link to="/premium" className="transition-colors duration-200 hover:text-blue-400">
                    Premium Cars
                  </Link>
                </li>
                <li>
                  <Link to="/auth/register" className="transition-colors duration-200 hover:text-blue-400">
                    Dealer Registration
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Company */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm text-white/70">

                <li>
                  <Link to="/about" className="transition-colors duration-200 hover:text-blue-400">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="transition-colors duration-200 hover:text-blue-400">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="transition-colors duration-200 hover:text-blue-400">
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Reach us */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Reach us</h4>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-blue-400 shrink-0" /> +91 1800 123 4567
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-blue-400 shrink-0" /> hello@CAPL.in
                </li>
                <li className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-blue-400 shrink-0" /> Mumbai · Delhi · Bangalore
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 border-t border-white/10 py-8">
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
            <span>
              Copyright © {new Date().getFullYear()} CAPL. All Rights Reserved.
            </span>
            <span className="flex items-center gap-1.5">
              Made by team <span className="font-bold text-white">CAPL</span> with <span className="text-red-500">❤️</span>
            </span>
          </div>
        </div>
      </footer>

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
