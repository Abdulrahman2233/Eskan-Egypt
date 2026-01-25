import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/api";

type PendingProperty = {
  id: string;
  name: string;
  area: {
    name: string;
  };
  address: string;
  price: number;
  rooms: number;
  bathrooms: number;
  type: string;
  usage_type_ar: string;
  size?: number;
  furnished: boolean;
  description: string;
  contact: string;
  owner_name: string;
  submitted_at: string;
  images: Array<{
    id: string;
    image_url: string;
  }>;
  status: string;
};

type Statistics = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  draft: number;
};

const AdminApprovalPanel = () => {
  const [properties, setProperties] = useState<PendingProperty[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [approvalNotes, setApprovalNotes] = useState<{ [key: string]: string }>({});
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // جلب العقارات بناءً على الحالة
      const endpoint = `/listings/properties/${activeTab}/`;
      const response = await API.get(endpoint);
      setProperties(response.data);

      // جلب الإحصائيات
      const statsResponse = await API.get("/listings/properties/statistics/");
      setStats(statsResponse.data);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.response?.data?.detail || "حدث خطأ أثناء تحميل البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (propertyId: string) => {
    try {
      setProcessingId(propertyId);
      const notes = approvalNotes[propertyId] || "";

      await API.post(`/listings/properties/${propertyId}/approve/`, {
        approval_notes: notes,
      });

      toast({
        title: "نجح",
        description: "تم الموافقة على العقار بنجاح",
        variant: "default",
      });

      // إزالة من القائمة
      setProperties(properties.filter((p) => p.id !== propertyId));
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.response?.data?.detail || "فشل الموافقة على العقار",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (propertyId: string) => {
    try {
      setProcessingId(propertyId);
      const notes = approvalNotes[propertyId];

      if (!notes?.trim()) {
        toast({
          title: "تنبيه",
          description: "يجب إدخال سبب الرفض",
          variant: "default",
        });
        setProcessingId(null);
        return;
      }

      await API.post(`/listings/properties/${propertyId}/reject/`, {
        approval_notes: notes,
      });

      toast({
        title: "نجح",
        description: "تم رفض العقار",
        variant: "default",
      });

      // إزالة من القائمة
      setProperties(properties.filter((p) => p.id !== propertyId));
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.response?.data?.detail || "فشل رفض العقار",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-amber-500" />;
      case "approved":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-right">
            لوحة الموافقة على العقارات
          </h1>
          <p className="text-gray-600 text-right">
            إدارة وموافقة على العقارات الجديدة المرسلة من المالكين
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg"
            >
              <div className="text-blue-600 text-sm font-semibold mb-2">الإجمالي</div>
              <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg"
            >
              <div className="text-amber-600 text-sm font-semibold mb-2">قيد المراجعة</div>
              <div className="text-3xl font-bold text-amber-900">{stats.pending}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg"
            >
              <div className="text-green-600 text-sm font-semibold mb-2">موافق عليه</div>
              <div className="text-3xl font-bold text-green-900">{stats.approved}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg"
            >
              <div className="text-red-600 text-sm font-semibold mb-2">مرفوض</div>
              <div className="text-3xl font-bold text-red-900">{stats.rejected}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg"
            >
              <div className="text-gray-600 text-sm font-semibold mb-2">مسودة</div>
              <div className="text-3xl font-bold text-gray-900">{stats.draft}</div>
            </motion.div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-3 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === "pending"
                ? "text-amber-600 border-b-2 border-amber-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            قيد المراجعة ({stats?.pending || 0})
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === "approved"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            موافق عليه ({stats?.approved || 0})
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === "rejected"
                ? "text-red-600 border-b-2 border-red-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            مرفوض ({stats?.rejected || 0})
          </button>
        </div>

        {/* Properties List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <Card className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا توجد عقارات في هذه الحالة</p>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {properties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() =>
                      setExpandedId(expandedId === property.id ? null : property.id)
                    }
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(property.status)}
                            <CardTitle className="text-right text-xl">
                              {property.name}
                            </CardTitle>
                          </div>
                          <p className="text-sm text-gray-600 text-right">
                            بواسطة: {property.owner_name} • {property.area_data?.name || property.area?.name || 'غير محدد'}
                          </p>
                          <p className="text-xs text-gray-500 text-right mt-1">
                            تم الإرسال: {new Date(property.submitted_at).toLocaleDateString("ar-EG")}
                          </p>
                        </div>
                        <button className="ml-4">
                          {expandedId === property.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          )}
                        </button>
                      </div>
                    </CardHeader>

                    {/* Quick Info */}
                    <CardContent className="pb-4">
                      <div className="grid grid-cols-4 gap-4 text-right">
                        <div>
                          <p className="text-xs text-gray-600">السعر</p>
                          <p className="font-semibold text-lg text-blue-600">
                            {property.price.toLocaleString("ar-EG")} جنيه
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">الغرف</p>
                          <p className="font-semibold text-lg">{property.rooms}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">الحمامات</p>
                          <p className="font-semibold text-lg">{property.bathrooms}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">النوع</p>
                          <p className="font-semibold text-sm">{property.usage_type_ar}</p>
                        </div>
                      </div>
                    </CardContent>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedId === property.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-gray-200"
                        >
                          <CardContent className="pt-6 space-y-6">
                            {/* Images */}
                            {property.images && property.images.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-3 text-right">الصور</h4>
                                <div className="grid grid-cols-3 gap-3">
                                  {property.images.slice(0, 3).map((img) => (
                                    <img
                                      key={img.id}
                                      src={img.image_url}
                                      alt={property.name}
                                      className="w-full h-24 object-cover rounded-lg"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Description */}
                            <div>
                              <h4 className="font-semibold mb-2 text-right">الوصف</h4>
                              <p className="text-gray-700 text-right bg-gray-50 p-3 rounded-lg">
                                {property.description}
                              </p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-right">
                                <p className="text-sm text-gray-600">العنوان</p>
                                <p className="font-semibold">{property.address}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">الحجم</p>
                                <p className="font-semibold">
                                  {property.size ? `${property.size} متر مربع` : "غير محدد"}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">التأثيث</p>
                                <p className="font-semibold">
                                  {property.furnished ? "مفروش" : "غير مفروش"}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">جهة الاتصال</p>
                                <p className="font-semibold text-blue-600 ltr">{property.contact}</p>
                              </div>
                            </div>

                            {/* Notes Field */}
                            {activeTab === "pending" && (
                              <div>
                                <label className="block text-sm font-semibold mb-2 text-right">
                                  <MessageSquare className="w-4 h-4 inline-block ml-2" />
                                  ملاحظات الموافقة/الرفض
                                </label>
                                <textarea
                                  placeholder="أدخل ملاحظاتك هنا..."
                                  value={approvalNotes[property.id] || ""}
                                  onChange={(e) =>
                                    setApprovalNotes({
                                      ...approvalNotes,
                                      [property.id]: e.target.value,
                                    })
                                  }
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                                  rows={3}
                                />
                              </div>
                            )}

                            {/* Action Buttons */}
                            {activeTab === "pending" && (
                              <div className="flex gap-3 justify-end">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReject(property.id);
                                  }}
                                  disabled={processingId === property.id}
                                  variant="outline"
                                  className="text-red-600 border-red-300 hover:bg-red-50"
                                >
                                  {processingId === property.id ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                                      جاري...
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-4 h-4 ml-2" />
                                      رفض
                                    </>
                                  )}
                                </Button>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApprove(property.id);
                                  }}
                                  disabled={processingId === property.id}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  {processingId === property.id ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin ml-2" />
                                      جاري...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="w-4 h-4 ml-2" />
                                      موافقة
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminApprovalPanel;
