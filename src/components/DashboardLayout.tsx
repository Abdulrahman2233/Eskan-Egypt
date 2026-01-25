import { ReactNode, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  Plus,
  List,
  Settings,
  LogOut,
  User,
  ChevronLeft,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import logo from "../assets/logo1.png";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface User {
  full_name: string;
  email: string;
  id: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  user_type?: string;
}

const menuItems = [
  {
    path: "/dashboard",
    label: "لوحة التحكم",
    icon: LayoutDashboard,
    description: "نظرة عامة على عقاراتك",
  },
  {
    path: "/dashboard/add-property",
    label: "إضافة عقار",
    icon: Plus,
    description: "أضف عقار جديد",
  },
  {
    path: "/dashboard/my-properties",
    label: "عقاراتي",
    icon: List,
    description: "إدارة عقاراتك",
  },
  {
    path: "/dashboard/property-approvals",
    label: "إدارة العقارات",
    icon: CheckCircle2,
    description: "مراجعة وموافقة على العقارات",
    adminOnly: true,
  },
  {
    path: "/dashboard/notes",
    label: "ملاحظات",
    icon: BookOpen,
    description: "خطة التسويق والعمل",
  },
  {
    path: "/dashboard/settings",
    label: "الإعدادات",
    icon: Settings,
    description: "إعدادات الحساب",
  },
];

const getStoredUser = (): User | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = getStoredUser();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    toast.success("تم تسجيل الخروج بنجاح");
    navigate("/");
  };

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      {/* Mobile Header */}
      <header className="lg:hidden bg-primary text-primary-foreground sticky top-0 z-50">
        <div className="flex items-center justify-between h-14 px-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-white/10"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>

          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Eskan Egypt Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="font-bold">Eskan Egypt</span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-white/10"
            onClick={() => navigate("/")}
          >
            <Home className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-72 bg-card z-50 lg:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Sidebar Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {user?.full_name || "مستخدم"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                  {menuItems.map((item: typeof menuItems[0]) => {
                    // التحقق من الصلاحيات
                    if (item.adminOnly && !user?.is_staff && !user?.is_superuser) {
                      return null;
                    }

                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          active
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <div className="flex-1">
                          <span className="font-medium block">{item.label}</span>
                          {!active && (
                            <span className="text-xs opacity-70">
                              {item.description}
                            </span>
                          )}
                        </div>
                        {active && <ChevronLeft className="h-4 w-4" />}
                      </Link>
                    );
                  })}
                </nav>

                {/* Footer Actions */}
                <div className="p-3 border-t border-border space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setSidebarOpen(false);
                      navigate("/");
                    }}
                  >
                    <Home className="h-5 w-5" />
                    الصفحة الرئيسية
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    تسجيل الخروج
                  </Button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 min-h-screen bg-card border-l border-border sticky top-0">
          {/* Logo */}
          <div className="p-4 border-b border-border">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="Eskan Egypt Logo"
                className="h-10 w-auto object-contain"
              />
              <div>
                <span className="font-bold text-lg text-foreground">
                  Eskan Egypt
                </span>
                <p className="text-xs text-muted-foreground">لوحة التحكم</p>
              </div>
            </Link>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-lg">
                {user?.full_name?.[0] || "م"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">
                  {user?.full_name || "مستخدم"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {menuItems.map((item: typeof menuItems[0]) => {
              // التحقق من الصلاحيات
              if (item.adminOnly && !user?.is_staff && !user?.is_superuser) {
                return null;
              }

              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      active ? "" : "group-hover:scale-110"
                    } transition-transform`}
                  />
                  <div className="flex-1">
                    <span className="font-medium block">{item.label}</span>
                    {!active && (
                      <span className="text-xs opacity-70">
                        {item.description}
                      </span>
                    )}
                  </div>
                  {active && <ChevronLeft className="h-4 w-4" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-border space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
              onClick={() => navigate("/")}
            >
              <Home className="h-5 w-5" />
              الصفحة الرئيسية
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              تسجيل الخروج
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
