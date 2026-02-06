import { Menu, User, LogOut, ChevronDown, Settings, Home, Building2 } from "lucide-react";
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
    { path: "/", label: "الرئيسية" },
    { path: "/properties", label: "العقارات" },
    { path: "/about", label: "من نحن" },
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
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-xs text-muted-foreground">الحساب الشخصي</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      لوحة التحكم
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/my-properties" className="cursor-pointer flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      عقاراتي
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings" className="cursor-pointer flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      الإعدادات
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button
                  className="gap-2 h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all hover:shadow-md"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">تسجيل الدخول</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`text-lg font-medium transition-colors hover:text-primary p-3 rounded-lg ${
                      isActive(link.path) ? "bg-accent text-primary" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 mt-4 border-t pt-4">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="text-center text-sm font-medium px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        لوحة التحكم
                      </Link>
                      <Link
                        to="/dashboard/my-properties"
                        className="text-center text-sm font-medium px-4 py-2 rounded-md bg-accent hover:bg-accent/90 transition-colors"
                      >
                        عقاراتي
                      </Link>
                      <Link
                        to="/dashboard/settings"
                        className="text-center text-sm font-medium px-4 py-2 rounded-md bg-accent hover:bg-accent/90 transition-colors"
                      >
                        الإعدادات
                      </Link>
                      <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className="w-full"
                      >
                        <LogOut className="h-4 w-4 ml-2" />
                        تسجيل الخروج
                      </Button>
                    </>
                  ) : (
                    <Link
                      to="/auth"
                      className="text-center text-sm font-medium px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      تسجيل الدخول
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
