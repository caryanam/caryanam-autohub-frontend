import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  CheckCircle2,
  User,
  LogOut,
  Menu,
  ShieldCheck,
  MapPin,
  Car,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useInspectorAuth } from "@/contexts/InspectorAuthContext";
import logo from "@/assets/logo.png";

const navItems = [
  {
    to: "/inspector/dashboard",
    label: "Area Queue",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    to: "/inspector/history",
    label: "Inspection History",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    to: "/inspector/profile",
    label: "My Profile",
    icon: <User className="h-4 w-4" />,
  },
];

export default function InspectorLayout() {
  const { user, logout } = useInspectorAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login", { replace: true });
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-slate-950 text-white border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80">
        <Link to="/inspector/dashboard" className="flex items-center gap-3">
          <img src={logo} alt="Caryanam AutoHub" className="h-9 w-auto" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-white">Inspector Hub</span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-1.5 py-0.5 rounded">
                VERIFIER
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">Caryanam Certified</p>
          </div>
        </Link>

        {/* Assigned Area Pill */}
        {user?.assignedArea && (
          <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Assigned Area</span>
              <span className="font-semibold text-white">{user.assignedArea}</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-rose-900 text-white shadow-md shadow-rose-950/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="truncate mr-2">
            <p className="text-xs font-semibold text-white truncate">{user?.name || "Inspector"}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Sign out"
            className="text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-30">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72 bg-slate-950 border-r border-slate-800">
                <SidebarContent />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h1 className="text-base font-bold text-slate-900 dark:text-white">
                Vehicle Certification & Inspection
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user?.assignedArea && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <MapPin className="h-3 w-3" /> Area: {user.assignedArea}
              </span>
            )}
            <div className="h-8 w-8 rounded-full bg-slate-900 text-white dark:bg-slate-800 flex items-center justify-center text-xs font-bold uppercase">
              {user?.name ? user.name.charAt(0) : "I"}
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

