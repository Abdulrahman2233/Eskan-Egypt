import { Suspense, lazy } from "react";
import { Toaster as RadixToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import logoImg from "./assets/logo1.webp";

/* ===== Loading Component ===== */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-primary/5">
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border border-primary/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary/60 animate-spin" />
        <div className="absolute inset-[9px] rounded-full bg-background shadow-sm border border-border/70 flex items-center justify-center">
          <img src={logoImg} alt="إقامتك EQAMTAK" className="h-7 w-5 object-contain" />
        </div>
      </div>
      <p className="text-xs font-medium text-muted-foreground/90 tracking-wide">جاري التحميل...</p>
    </div>
  </div>
);

/* ===== Public Pages (Lazy Loaded) ===== */
const Index = lazy(() => import("./pages/Index"));
const Properties = lazy(() => import("./pages/Properties"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const About = lazy(() => import("./pages/About"));
const ForOwners = lazy(() => import("./pages/ForOwners"));
const Contact = lazy(() => import("./pages/Contact"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

/* ===== Dashboard Pages (Lazy Loaded) ===== */
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const AddProperty = lazy(() => import("./pages/dashboard/AddProperty"));
const MyProperties = lazy(() => import("./pages/dashboard/MyProperties"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));
const AdminApprovalPanel = lazy(() => import("./pages/dashboard/AdminApprovalPanel"));
const MyRejectedProperties = lazy(() => import("./pages/dashboard/MyRejectedProperties"));
const Notes = lazy(() => import("./pages/dashboard/Notes"));
const Earnings = lazy(() => import("./pages/dashboard/Earnings"));

/* ===== Analytics Pages (Lazy Loaded) ===== */
const Profits = lazy(() => import("./pages/profits"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProperties = lazy(() => import("./pages/admin/Properties"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminOffers = lazy(() => import("./pages/admin/Offers"));
const AdminNotifications = lazy(() => import("./pages/admin/Notifications"));
const AdminMessages = lazy(() => import("./pages/admin/Messages"));
const CustomerData = lazy(() => import("./pages/admin/CustomerData"));

/* ===== Protection ===== */
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useEffect } from "react";
import { recordVisitorVisit } from "@/api";

const queryClient = new QueryClient();

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      recordVisitorVisit();
    }
  }, [location.pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <RouteTracker />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/user/:username" element={<UserProfile />} />
            <Route path="/about" element={<About />} />
            <Route path="/for-owners" element={<ForOwners />} />
            <Route path="/publish" element={<ForOwners />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />

            {/* Admin */}
            <Route path="/admin" element={<Admin />} />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute element={<Dashboard />} />}
            />
            <Route
              path="/dashboard/add-property"
              element={<ProtectedRoute element={<AddProperty />} />}
            />
            <Route
              path="/dashboard/my-properties"
              element={<ProtectedRoute element={<MyProperties />} />}
            />
            <Route
              path="/dashboard/settings"
              element={<ProtectedRoute element={<Settings />} />}
            />
            <Route
              path="/dashboard/admin-approval"
              element={<ProtectedRoute element={<AdminApprovalPanel />} />}
            />
            <Route
              path="/dashboard/my-rejected"
              element={<ProtectedRoute element={<MyRejectedProperties />} />}
            />
            <Route
              path="/dashboard/notes"
              element={<ProtectedRoute element={<Notes />} />}
            />
            <Route
              path="/dashboard/earnings"
              element={<ProtectedRoute element={<Earnings />} />}
            />

            {/* Analytics - Removed */}
            
            {/* Profits - Admin Only */}
            <Route
              path="/admin/profits"
              element={<ProtectedRoute element={<Profits />} requiredRole="admin" />}
            />

            {/* Admin Dashboard Pages */}
            <Route
              path="/admin/dashboard"
              element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />}
            />
            <Route
              path="/admin/properties"
              element={<ProtectedRoute element={<AdminProperties />} requiredRole="admin" />}
            />
            <Route
              path="/admin/users"
              element={<ProtectedRoute element={<AdminUsers />} requiredRole="admin" />}
            />
            <Route
              path="/admin/offers"
              element={<ProtectedRoute element={<AdminOffers />} requiredRole="admin" />}
            />
            <Route
              path="/admin/notifications"
              element={<ProtectedRoute element={<AdminNotifications />} requiredRole="admin" />}
            />
            <Route
              path="/admin/messages"
              element={<ProtectedRoute element={<AdminMessages />} requiredRole="admin" />}
            />
            <Route
              path="/admin/customer-data"
              element={<ProtectedRoute element={<CustomerData />} requiredRole="admin" />}
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

        <RadixToaster />
        <SonnerToaster />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
