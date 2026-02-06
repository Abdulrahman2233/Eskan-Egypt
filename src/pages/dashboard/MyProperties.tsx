import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, Trash2, CheckCircle2, Clock, XCircle, AlertCircle, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { fetchUserProperties, deleteProperty, resubmitRejectedProperty } from "@/api";

type Property = {
  id: string;
  name: string;
  address: string;
  price: number;
  rooms?: number;
  bathrooms?: number;
  size?: number;
  status: string;
  approval_notes?: string;
};

const MyProperties = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    let filtered = properties;

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    setFilteredProperties(filtered);
  }, [properties, searchQuery, statusFilter]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await fetchUserProperties();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error loading properties:", err);
      const errorMsg = err.response?.data?.detail || "خطأ في تحميل البيانات";
      toast({
        title: "خطأ",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;

    try {
      setDeleting(true);
      await deleteProperty(propertyToDelete.id);
      setProperties((prev) => prev.filter((p) => p.id !== propertyToDelete.id));
      toast({
        title: "تم الحذف",
        description: "تم حذف العقار بنجاح",
      });
    } catch (err: any) {
      console.error("Error deleting property:", err);
      toast({
        title: "خطأ",
        description: err.response?.data?.detail || "خطأ في حذف العقار",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

  const handleResubmit = async (propertyId: string) => {
    try {
      await resubmitRejectedProperty(propertyId);
      await loadProperties();
      toast({
        title: "تم إعادة التقديم",
        description: "تم إعادة تقديم العقار للمراجعة بنجاح",
      });
    } catch (err: any) {
      console.error("Error resubmitting property:", err);
      toast({
        title: "خطأ",
        description: err.response?.data?.detail || "خطأ في إعادة التقديم",
        variant: "destructive",
      });
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: { [key: string]: any } = {
      approved: {
        label: "موافق عليه",
        color: "bg-green-500/10 text-green-600 border-green-500/20",
        icon: CheckCircle2,
        message: "تم الموافقة على العقار وهو معروض الآن",
      },
      pending: {
        label: "قيد المراجعة",
        color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        icon: Clock,
        message: "العقار قيد المراجعة من الإدارة",
      },
      rejected: {
        label: "مرفوض",
        color: "bg-red-500/10 text-red-600 border-red-500/20",
        icon: XCircle,
        message: "تم رفض العقار",
      },
      draft: {
        label: "مسودة",
        color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
        icon: AlertCircle,
        message: "العقار لم يتم تقديمه بعد",
      },
    };
    return statusMap[status] || statusMap.draft;
  };

  const stats = [
    { status: "all", label: "الكل", count: properties.length, color: "text-foreground" },
    { status: "pending", label: "قيد المراجعة", count: properties.filter(p => p.status === "pending").length, color: "text-yellow-600" },
    { status: "approved", label: "موافق عليها", count: properties.filter(p => p.status === "approved").length, color: "text-green-600" },
    { status: "rejected", label: "مرفوضة", count: properties.filter(p => p.status === "rejected").length, color: "text-red-600" },
  ];

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                عقاراتي
              </h1>
              <p className="text-muted-foreground">
                إدارة ومتابعة حالة العقارات التي أضفتها
              </p>
            </div>
            <Button className="gap-2 shadow-lg shadow-primary/20" asChild>
              <Link to="/dashboard/add-property">
                <span>+</span>
                إضافة عقار جديد
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Status Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {stats.map((stat) => (
            <button
              key={stat.status}
              onClick={() => setStatusFilter(stat.status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                statusFilter === stat.status
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-card border border-border hover:border-primary/30"
              }`}
            >
              <span className={statusFilter !== stat.status ? stat.color : ""}>
                {stat.label}
              </span>
              <span className={`ml-2 ${statusFilter === stat.status ? "bg-white/20" : "bg-muted"} px-2 py-0.5 rounded-full text-xs`}>
                {stat.count}
              </span>
            </button>
          ))}
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
              className="pr-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <Card className="border-border/50">
              <CardContent className="p-8 text-center">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
              </CardContent>
            </Card>
          ) : filteredProperties.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 bg-muted rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  لا توجد عقارات
                </h3>
                <p className="text-muted-foreground mb-4">
                  ابدأ بإضافة عقارك الأول الآن
                </p>
                <Button asChild>
                  <Link to="/dashboard/add-property">
                    <span>+</span> إضافة عقار
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredProperties.map((property, index) => {
                const statusInfo = getStatusInfo(property.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <Card className="border-border/50 overflow-hidden">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-foreground truncate mb-1">
                              {property.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {property.address} • {property.price.toLocaleString()} ج.م
                            </p>
                            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                              {property.rooms && (
                                <span>غرف: {property.rooms}</span>
                              )}
                              {property.bathrooms && (
                                <span>حمامات: {property.bathrooms}</span>
                              )}
                              {property.size && (
                                <span>المساحة: {property.size} م²</span>
                              )}
                            </div>
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${getStatusInfo(property.status).color}`}
                            >
                              <StatusIcon className="h-4 w-4" />
                              {getStatusInfo(property.status).label}
                            </div>
                            {property.approval_notes && (
                              <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                                ملاحظات الإدارة: {property.approval_notes}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => {
                                setPropertyToDelete(property);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>هل أنت متأكد من الحذف؟</AlertDialogTitle>
              <AlertDialogDescription>
                سيتم حذف العقار "{propertyToDelete?.name}" نهائياً ولا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? "جاري الحذف..." : "حذف العقار"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default MyProperties;
