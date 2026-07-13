import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Car, LogOut, Menu, Wallet, Info, RefreshCw, Plus } from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { useDealerAuth } from "@/contexts/DealerAuthContext";
import logo from "@/assets/logo.png";
export interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

interface Props {
  title: string;
  nav: NavItem[];
  accentLabel: string;
}

export default function DashboardLayout({ title, nav, accentLabel }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isAdmin = pathname.startsWith("/admin");
  const adminAuth = useAdminAuth();
  const dealerAuth = useDealerAuth();
  const { user, logout } = isAdmin ? adminAuth : dealerAuth;
  const displayName = user?.name ?? "";
  const email = user?.email ?? "";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login", { replace: true });
  };

  const SidebarBody = () => (
    <div
      className="flex h-full flex-col font-sans text-left bg-black"

    >
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-white/5">
        <div className="flex items-center gap-2">
          {/* Logo Circle Badge */}
          <img src={logo} alt="Logo" className="h-8 w-8 rounded-sm" />

          <div className="font-display font-black text-base text-white tracking-tight ml-1 flex items-center">

            <span className="font-logo   text-sm tracking-[0.2em] text-white"
              style={{ transform: "scaleY(1.6)" }}
            >
              CARY<span className="text-yellow-400">A</span>NAM
            </span>

          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                ? "bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-500/15 border border-rose-400/20"
                : "text-slate-400 hover:text-white hover:border-rose-400 hover:border hover:shadow-lg hover:bg-white/5"
              }`
            }
          >
            <span className="shrink-0">{n.icon}</span>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Session Footer */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-500">
          Signed in as
          <br />
          <span className="font-semibold text-slate-300 normal-case text-xs tracking-normal block mt-0.5 truncate">
            {email}
          </span>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-rose-400 hover:text-rose-300 hover:bg-white/5 rounded-xl mt-3 cursor-pointer h-10 font-bold text-xs uppercase tracking-wider"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 shrink-0" /> Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      {/* Sidebar Static (lg+) */}
      <aside className="hidden lg:block w-64 shrink-0 shadow-xl z-20">
        <div className="sticky top-0 h-screen">
          <SidebarBody />
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Navbar header */}
        <header className="h-16 border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center px-3 sm:px-6 gap-2 sm:gap-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
                <Menu className="h-5 w-5 text-slate-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-0">
              <SidebarBody />
            </SheetContent>
          </Sheet>

          {/* Breadcrumb Info */}
          <div className="inline-flex flex-col text-left shrink">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-500 truncate">
              {title}
            </span>
            <h1 className="font-display text-sm sm:text-base font-black capitalize text-slate-900 tracking-tight mt-0.5 truncate">
              {displayName}
            </h1>
          </div>

          {/* Business Wallet Widget */}
          {!isAdmin && (
            <div className="ml-auto bg-slate-950 p-0.5 sm:p-1 rounded-lg sm:rounded-xl shadow-sm flex items-center shrink-0">
              <div className="bg-white rounded-md sm:rounded-lg flex items-center pl-2 sm:pl-3 pr-1 sm:pr-2 py-1 sm:py-1.5 gap-2 sm:gap-5">
                
                <div className="flex items-center gap-1.5 sm:gap-3">
                  <Wallet className="h-4 w-4 sm:h-6 sm:w-6 text-slate-800 stroke-[1.5]" />
                  <div className="flex flex-col">
                    <span className="hidden sm:block text-[11px] font-bold text-slate-900 leading-none mb-1">Business Wallet</span>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span className="text-[13px] sm:text-[17px] font-bold text-slate-900 leading-none tracking-tight">953.60</span>
                      <Info className="hidden sm:block h-[18px] w-[18px] text-slate-900 stroke-[1.5] cursor-pointer hover:text-slate-600 transition-colors ml-0.5" />
                      <RefreshCw className="h-3 w-3 sm:h-[18px] sm:w-[18px] text-slate-800 stroke-[1.5] cursor-pointer hover:text-slate-600 transition-colors" />
                    </div>
                  </div>
                </div>

                <button className="bg-rose-950 hover:bg-rose-900 transition-colors text-white text-[11px] sm:text-[13px] font-medium rounded-full sm:rounded-[20px] px-2 sm:px-4 py-1 sm:py-1.5 flex items-center gap-1">
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 stroke-[2]" /> 
                  <span className="hidden sm:inline">Add Fund</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Dynamic page transition wrapper */}
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
