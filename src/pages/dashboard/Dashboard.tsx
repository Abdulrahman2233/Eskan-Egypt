import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Building2,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowUpRight,
  Plus,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { fetchUserProperties } from "@/api";
import { useToast } from "@/hooks/use-toast";

type Property = {
  id: string;
  name: string;
  address: string;
  price: number;
  status: string;
  images?: { image_url: string }[];
  views?: number;
  approval_notes?: string | null;
};

const Dashboard = () => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUserProperties();
      setProperties(Array.isArray(data) ? data : [data]);
    } catch (err: any) {
      console.error("Error loading properties:", err);
      const errorMsg = err.response?.data?.detail || "خطأ في تحميل البيانات";
      setError(errorMsg);
      toast({
        title: "خطأ",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "إجمالي العقارات",
      value: properties.length,
      icon: Building2,
      color: "bg-primary/10 text-primary",
      trend: "+12%",
    },
    {
      label: "قيد المراجعة",
      value: properties.filter((p) => p.status === "pending").length,
      icon: Clock,
      color: "bg-yellow-500/10 text-yellow-600",
    },
    {
      label: "تمت الموافقة",
      value: properties.filter((p) => p.status === "approved").length,
      icon: CheckCircle2,
      color: "bg-green-500/10 text-green-600",
    },
    {
      label: "مرفوضة",
      value: properties.filter((p) => p.status === "rejected").length,
      icon: XCircle,
      color: "bg-red-500/10 text-red-600",
    },
  ];

  const totalViews = properties.reduce(
    (acc, p) => acc + (p.views || 0),
    0
  );
  const recentProperties = properties.slice(0, 5);

  const getStatusInfo = (status: string) => {
    const statusMap: { [key: string]: any } = {
      approved: {
        label: "موافق عليه",
        color: "bg-green-500/10 text-green-600 border-green-500/20",
        icon: CheckCircle2,
      },
      pending: {
        label: "قيد المراجعة",
        color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        icon: Clock,
      },
      rejected: {
        label: "مرفوض",
        color: "bg-red-500/10 text-red-600 border-red-500/20",
        icon: XCircle,
      },
      draft: {
        label: "مسودة",
        color: "bg-gray-500/10 text-gray-600 border-gray-500/20",
        icon: AlertCircle,
      },
    };
    return statusMap[status] || statusMap.draft;
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
            لوحة التحكم 👋
          </h1>
          <p className="text-muted-foreground">
            مرحباً بك! إليك نظرة عامة على عقاراتك
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2.5 lg:p-3 rounded-xl ${stat.color}`}>
                        <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                      </div>
                      {stat.trend && (
                        <span className="text-xs font-semibold text-green-600 bg-green-500/10 px-2 py-1 rounded-lg">
                          {stat.trend}
                        </span>
                      )}
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>


        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 flex flex-col sm:flex-row gap-3"
        >
          <Button
            size="lg"
            className="shadow-lg shadow-primary/20 gap-2"
            asChild
          >
            <Link to="/dashboard/add-property">
              <Plus className="h-5 w-5" />
              إضافة عقار جديد
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2"
            asChild
          >
            <Link to="/contact">
              <MessageCircle className="h-5 w-5" />
              تواصل معنا
            </Link>
          </Button>
        </motion.div>

        {/* Recent Properties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-border/50">
            <CardHeader className="border-b border-border/50 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5 text-primary" />
                  آخر العقارات
                </CardTitle>
                {properties.length > 5 && (
                  <Button variant="ghost" size="sm" asChild className="gap-1">
                    <Link to="/dashboard/my-properties">
                      عرض الكل
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                  <p className="text-red-600 font-medium">{error}</p>
                  <Button onClick={loadProperties} className="mt-4">
                    إعادة محاولة
                  </Button>
                </div>
              ) : recentProperties.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 bg-muted rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    لا توجد عقارات بعد
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    ابدأ بإضافة عقارك الأول الآن
                  </p>
                  <Button asChild>
                    <Link to="/dashboard/add-property">
                      <Plus className="h-4 w-4 ml-2" />
                      إضافة عقار
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {recentProperties.map((property, index) => {
                    const statusInfo = getStatusInfo(property.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <motion.div
                        key={property.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 + index * 0.05 }}
                        className="p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">
                              {property.name}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {property.address} • {property.price.toLocaleString()} ج.م
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">
                                {property.views || 0} مشاهدة
                              </p>
                              <div
                                className={`text-xs font-semibold px-2 py-1 rounded-lg border ${getStatusInfo(property.status).color}`}
                              >
                                {getStatusInfo(property.status).label}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
