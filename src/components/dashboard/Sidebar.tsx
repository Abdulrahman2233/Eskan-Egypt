import { useState } from "react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "../../assets/logo1.png";
import {
  LayoutDashboard,
  Building2,
  Users,
  Percent,
  Settings,
  Menu,
  X,
  MessageCircle,
  DollarSign,
  Bell,
  LogOut,
  FileText,
} from "lucide-react";

const navItems = [
  { title: "الرئيسية", icon: LayoutDashboard, path: "/admin/dashboard" },
  { title: "تحليل العقارات", icon: Building2, path: "/admin/properties" },
  { title: "تحليل المستخدمين", icon: Users, path: "/admin/users" },
  { title: "بيانات العملاء", icon: FileText, path: "/admin/customer-data" },
  { title: "العروض والخصومات", icon: Percent, path: "/admin/offers" },
  { title: "إدارة الأرباح", icon: DollarSign, path: "/admin/profits" },
  { title: "الإشعارات", icon: Bell, path: "/admin/notifications" },
  { title: "رسائل العملاء", icon: MessageCircle, path: "/admin/messages" },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setIsOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-3 right-4 z-50 lg:hidden p-2.5 rounded-xl bg-card border border-border shadow-lg"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-40 h-screen bg-card border-l border-border transition-transform duration-300 w-64",
          isOpen ? "translate-x-0" : "translate-x-full",
          "lg:relative lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <Link 
          to="/" 
          className="flex h-16 items-center gap-3 px-6 border-b border-border hover:opacity-80 transition-opacity"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={logo}
            alt="Eskan Egypt Logo"
            className="h-10 w-8 object-contain"
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg gradient-text">Eskan Egypt</span>
            <span className="text-xs text-muted-foreground">اسكان مصر</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{item.title}</span>
              </NavLink>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">تسجيل الخروج</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
