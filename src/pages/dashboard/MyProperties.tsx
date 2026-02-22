import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2, Plus, Clock, CheckCircle2, XCircle,
  Eye, Trash2, AlertCircle, Search,
  Filter, MapPin, Bed, Bath, Maximize,
  Sparkles, ArrowUpRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { fetchUserProperties, deleteProperty } from "@/api";

type Property = {
  id: string;
  name: string;
  title: string;
  location: string;
  address?: string;
  price: number;
  bedrooms?: number;
  rooms?: number;
  bathrooms?: number;
  area?: number;
  size?: number;
  status: string;
  admin_notes?: string;
  approval_notes?: string;
  images?: Array<{ image_url: string; id: string; order: number }>;
  is_featured?: boolean;
  featured?: boolean;
  views_count?: number;
  views?: number;
};

const MyProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    let filtered = properties;
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }
    setFilteredProperties(filtered);
  }, [properties, searchQuery, statusFilter]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await fetchUserProperties();
      console.log("Properties fetched:", data); // تشخيص
      setProperties(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error loading properties:", err);
      const errorMsg = err.response?.data?.detail || "خطأ في تحميل البيانات";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;
    try {
      await deleteProperty(propertyToDelete.id);
      const updatedProperties = properties.filter((p) => p.id !== propertyToDelete.id);
      setProperties(updatedProperties);
      toast.success("تم حذف العقار بنجاح");
    } catch (error: any) {
      console.error("Error deleting property:", error);
      const errorMsg = error.response?.data?.detail || "حدث خطأ أثناء الحذف";
      toast.error(errorMsg);
    } finally {
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "approved":
        return {
          label: "موافق عليه",
          color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
          dotColor: "bg-emerald-500",
          icon: CheckCircle2,
          message: "تم الموافقة على العقار وهو معروض الآن"
        };
      case "pending":
        return {
          label: "قيد المراجعة",
          color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
          dotColor: "bg-amber-500",
          icon: Clock,
          message: "العقار قيد المراجعة من الإدارة"
        };
      case "rejected":
        return {
          label: "مرفوض",
          color: "bg-red-500/10 text-red-600 border-red-500/20",
          dotColor: "bg-red-500",
          icon: XCircle,
          message: "تم رفض العقار"
        };
      default:
        return {
          label: status,
          color: "bg-muted text-muted-foreground",
          dotColor: "bg-muted-foreground",
          icon: AlertCircle,
          message: ""
        };
    }
  };

  const stats = [
    { status: "all", label: "الكل", count: properties.length, icon: Building2, gradient: "from-primary/10 to-primary/5", iconColor: "text-primary" },
    { status: "pending", label: "قيد المراجعة", count: properties.filter(p => p.status === "pending").length, icon: Clock, gradient: "from-amber-500/10 to-amber-500/5", iconColor: "text-amber-500" },
    { status: "approved", label: "موافق عليها", count: properties.filter(p => p.status === "approved").length, icon: CheckCircle2, gradient: "from-emerald-500/10 to-emerald-500/5", iconColor: "text-emerald-500" },
    { status: "rejected", label: "مرفوضة", count: properties.filter(p => p.status === "rejected").length, icon: XCircle, gradient: "from-red-500/10 to-red-500/5", iconColor: "text-red-500" },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 lg:p-8 text-primary-foreground">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3" />
              <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <Sparkles className="h-3 w-3 ml-1" />
                    إدارة العقارات
                  </Badge>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold mb-1">
                  عقاراتي
                </h1>
                <p className="text-white/70 text-sm lg:text-base">
                  إدارة ومتابعة حالة العقارات التي أضفتها
                </p>
              </div>
              <Button 
                className="bg-white text-primary hover:bg-white/90 shadow-xl gap-2 rounded-xl font-semibold" 
                asChild
              >
                <Link to="/dashboard/add-property">
                  <Plus className="h-5 w-5" />
                  إضافة عقار جديد
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            const isActive = statusFilter === stat.status;
            return (
              <motion.button
                key={stat.status}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                onClick={() => setStatusFilter(stat.status)}
                className={`relative group p-4 rounded-2xl border text-right transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                    : "bg-card border-border/60 hover:border-primary/30 hover:shadow-md"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                  isActive ? "bg-white/20" : `bg-gradient-to-br ${stat.gradient}`
                }`}>
                  <Icon className={`h-5 w-5 ${isActive ? "text-white" : stat.iconColor}`} />
                </div>
                <p className={`text-2xl font-bold ${isActive ? "" : "text-foreground"}`}>{stat.count}</p>
                <p className={`text-xs font-medium mt-0.5 ${isActive ? "text-white/70" : "text-muted-foreground"}`}>{stat.label}</p>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في العقارات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 rounded-xl border-border/60 bg-card"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 rounded-xl border-border/60 bg-card">
              <Filter className="h-4 w-4 ml-2" />
              <SelectValue placeholder="فلترة حسب الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="pending">قيد المراجعة</SelectItem>
              <SelectItem value="approved">موافق عليها</SelectItem>
              <SelectItem value="rejected">مرفوضة</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Properties List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-14 h-14 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground text-sm">جاري تحميل العقارات...</p>
            </motion.div>
          ) : filteredProperties.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-border/50 border-dashed rounded-2xl">
                <CardContent className="py-20 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl mx-auto mb-5 flex items-center justify-center">
                    <Building2 className="h-10 w-10 text-primary/50" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {searchQuery || statusFilter !== "all"
                      ? "لا توجد نتائج"
                      : "لا توجد عقارات بعد"}
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
                    {searchQuery || statusFilter !== "all"
                      ? "جرب تغيير معايير البحث أو الفلتر"
                      : "ابدأ بإضافة عقارك الأول وسيظهر هنا فوراً"}
                  </p>
                  {!searchQuery && statusFilter === "all" && (
                    <Button className="gap-2 rounded-xl" asChild>
                      <Link to="/dashboard/add-property">
                        <Plus className="h-4 w-4" />
                        إضافة عقار جديد
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
            >
              {filteredProperties.map((property, index) => {
                const statusInfo = getStatusInfo(property.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="group border-border/50 hover:border-primary/20 rounded-2xl hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 overflow-hidden flex flex-col h-full">
                      <CardContent className="p-0 flex flex-col h-full">
                        {/* Image */}
                        <div className="relative w-full h-48 overflow-hidden">
                          {property.images && property.images.length > 0 && property.images[0].image_url ? (
                            <img
                              src={property.images[0].image_url}
                              alt={property.title || property.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                              <Building2 className="h-12 w-12 text-muted-foreground/40" />
                            </div>
                          )}
                          {/* Price overlay on image */}
                          <div className="absolute bottom-3 right-3 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-1.5 rounded-xl text-sm font-bold shadow-lg">
                            {parseFloat(property.price as any).toLocaleString()} ج.م
                          </div>
                          {(property.is_featured || property.featured) && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-secondary text-secondary-foreground shadow-lg gap-1">
                                <Sparkles className="h-3 w-3" />
                                مميز
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4 flex flex-col">
                          <div className="flex-1">
                            {/* Status Badge */}
                            <div className="flex items-center gap-2 mb-3">
                              <Badge
                                variant="outline"
                                className={`${statusInfo.color} flex items-center gap-1.5 rounded-lg text-xs`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor} animate-pulse`} />
                                {statusInfo.label}
                              </Badge>
                            </div>

                            {/* Title */}
                            <h3 className="font-bold text-base text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {property.title || property.name}
                            </h3>

                            {/* Location */}
                            <p className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
                              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                              <span className="truncate">{property.location || property.address}</span>
                            </p>

                            {/* Property Details Pills */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              {(property.bedrooms || property.rooms) && (property.bedrooms || property.rooms) > 0 && (
                                <span className="inline-flex items-center gap-1 text-xs font-medium bg-muted/60 text-muted-foreground px-2 py-1 rounded">
                                  <Bed className="h-3 w-3" />
                                  {property.bedrooms || property.rooms}
                                </span>
                              )}
                              {property.bathrooms && property.bathrooms > 0 && (
                                <span className="inline-flex items-center gap-1 text-xs font-medium bg-muted/60 text-muted-foreground px-2 py-1 rounded">
                                  <Bath className="h-3 w-3" />
                                  {property.bathrooms}
                                </span>
                              )}
                              {(property.area || property.size) && (
                                <span className="inline-flex items-center gap-1 text-xs font-medium bg-muted/60 text-muted-foreground px-2 py-1 rounded">
                                  <Maximize className="h-3 w-3" />
                                  {property.area || property.size}
                                </span>
                              )}
                            </div>

                            {/* Status Message */}
                            <p className="text-xs text-muted-foreground/80 flex items-center gap-1.5 mb-3">
                              <StatusIcon className="h-3.5 w-3.5" />
                              {statusInfo.message}
                            </p>
                          </div>

                          {/* Rejection Reason */}
                          {property.status === "rejected" && (
                            <div className="mb-4 p-3 bg-red-500/15 rounded-lg border-2 border-red-500/30 w-full">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-red-700 mb-1">سبب الرفض</p>
                                  {property.admin_notes || property.approval_notes ? (
                                    <p className="text-sm text-red-600 leading-relaxed">
                                      {property.admin_notes || property.approval_notes}
                                    </p>
                                  ) : (
                                    <p className="text-sm text-red-600 italic">لم يتم تحديد سبب للرفض</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Approval Notes */}
                          {property.status === "approved" && (property.admin_notes || property.approval_notes) && (
                            <div className="mb-4 p-3 bg-emerald-500/15 rounded-lg border-2 border-emerald-500/30 w-full">
                              <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-emerald-700 mb-1">ملاحظات الموافقة</p>
                                  <p className="text-sm text-emerald-600 leading-relaxed">
                                    {property.admin_notes || property.approval_notes}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-4 border-t border-border/50">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 rounded-lg"
                              onClick={() => navigate(`/property/${property.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                              عرض
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-lg hover:bg-red-500/10 hover:text-red-600"
                              onClick={() => {
                                setPropertyToDelete(property);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="h-7 w-7 text-destructive" />
              </div>
              <AlertDialogTitle className="text-center">هل أنت متأكد من الحذف؟</AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                سيتم حذف العقار "{propertyToDelete?.title || propertyToDelete?.name}" نهائياً. هذا الإجراء لا يمكن التراجع عنه.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-2">
              <AlertDialogCancel className="rounded-xl">إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
              >
                نعم، حذف العقار
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default MyProperties;
