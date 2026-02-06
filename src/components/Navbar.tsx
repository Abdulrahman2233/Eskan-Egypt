import { Menu, User, LogOut, ChevronDown, Settings, Home, Building2, BarChart3, ArrowLeft, Users } from "lucide-react";
import logo from "../assets/logo1.png";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const user = localStorage.getItem("user");
    
    if (token && user) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(user);
        setUserName(userData.full_name || "حسابي");
      } catch {
        setUserName("حسابي");
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;
  const navLinks = [
    { path: "/", label: "الرئيسية", icon: Home },
    { path: "/properties", label: "العقارات", icon: Building2 },
    { path: "/about", label: "من نحن", icon: Users },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img
              src={logo}
              alt="Eskan Egypt Logo"
              className="h-11 w-8 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-primary">
                Eskan Egypt
              </span>
              <span className="text-xs text-muted-foreground">اسكان مصر</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.path) ? "text-primary" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="gap-2 h-10 px-3 hover:bg-accent/50 transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{userName}</span>
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="bottom" sideOffset={8} className="w-56 mt-2">
                  <div className="px-3 py-2 border-b border-border/50">
                    <p className="text-xs text-muted-foreground font-semibold">الحساب الشخصي</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer flex items-center gap-2 py-2.5 px-3 hover:bg-accent rounded-sm transition-colors">
                      <Home className="h-4 w-4 flex-shrink-0" />
                      <span>لوحة التحكم</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/my-properties" className="cursor-pointer flex items-center gap-2 py-2.5 px-3 hover:bg-accent rounded-sm transition-colors">
                      <Building2 className="h-4 w-4 flex-shrink-0" />
                      <span>عقاراتي</span>
                    </Link>
                  </DropdownMenuItem>
                  {localStorage.getItem('user_role') === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="cursor-pointer flex items-center gap-2 py-2.5 px-3 hover:bg-accent rounded-sm transition-colors">
                        <BarChart3 className="h-4 w-4 flex-shrink-0" />
                        <span>التحليلات</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings" className="cursor-pointer flex items-center gap-2 py-2.5 px-3 hover:bg-accent rounded-sm transition-colors">
                      <Settings className="h-4 w-4 flex-shrink-0" />
                      <span>الإعدادات</span>
                    </Link>
                  </DropdownMenuItem>
                  <div className="border-t border-border/50 my-1"></div>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2 py-2.5 px-3 rounded-sm transition-colors">
                    <LogOut className="h-4 w-4 flex-shrink-0" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button
                  className="gap-2 h-10 px-4 bg-white hover:bg-gray-100 text-gray-800 shadow-md transition-all hover:shadow-lg border border-gray-200 font-medium"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">تسجيل الدخول</span>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-accent/50">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="bg-gradient-to-b from-primary/5 to-transparent p-6 border-b">
                  <h2 className="text-xl font-bold text-primary">القائمة</h2>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto p-6 space-y-2">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center gap-3 text-sm font-medium px-4 py-3 rounded-lg transition-all duration-300 ${
                          isActive(link.path)
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-foreground hover:bg-accent/50"
                        }`}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Auth Section */}
                <div className="border-t p-6 space-y-3">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
                      >
                        <Home className="h-4 w-4" />
                        لوحة التحكم
                      </Link>
                      <Link
                        to="/dashboard/my-properties"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent/80 font-medium text-sm transition-colors"
                      >
                        <Building2 className="h-4 w-4" />
                        عقاراتي
                      </Link>
                      <Link
                        to="/dashboard/settings"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent/80 font-medium text-sm transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        الإعدادات
                      </Link>
                      {localStorage.getItem('user_role') === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent/80 font-medium text-sm transition-colors"
                        >
                          <BarChart3 className="h-4 w-4" />
                          التحليلات
                        </Link>
                      )}
                      <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className="w-full gap-2 h-11 font-semibold"
                      >
                        <LogOut className="h-5 w-5" />
                        تسجيل الخروج
                      </Button>
                    </>
                  ) : (
                    <Link to="/auth">
                      <Button className="w-full gap-2 h-11 bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 font-semibold shadow-md">
                        <User className="h-5 w-5" />
                        <span>تسجيل الدخول</span>
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
