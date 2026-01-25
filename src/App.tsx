import { Suspense, lazy } from "react";
import { Toaster as RadixToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ===== Loading Component ===== */
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="mt-4 text-muted-foreground">جاري التحميل...</p>
    </div>
  </div>
);

/* ===== Public Pages (Lazy Loaded) ===== */
const Index = lazy(() => import("./pages/Index"));
const Properties = lazy(() => import("./pages/Properties"));
const PropertyDetails = lazy(() => import("./pages/PropertyDetails"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

/* ===== Dashboard Pages (Lazy Loaded) ===== */
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const AddProperty = lazy(() => import("./pages/dashboard/AddProperty"));
const EditProperty = lazy(() => import("./pages/dashboard/EditProperty"));
const MyProperties = lazy(() => import("./pages/dashboard/MyProperties"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));
const AdminApprovalPanel = lazy(() => import("./pages/dashboard/AdminApprovalPanel"));
const MyRejectedProperties = lazy(() => import("./pages/dashboard/MyRejectedProperties"));
const PropertyApprovals = lazy(() => import("./pages/dashboard/PropertyApprovals"));
const Notes = lazy(() => import("./pages/dashboard/Notes"));

/* ===== Protection ===== */
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/about" element={<About />} />
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
              path="/dashboard/edit-property/:propertyId"
              element={<ProtectedRoute element={<EditProperty />} />}
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
              path="/dashboard/property-approvals"
              element={<ProtectedRoute element={<PropertyApprovals />} />}
            />
            <Route
              path="/dashboard/notes"
              element={<ProtectedRoute element={<Notes />} />}
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
