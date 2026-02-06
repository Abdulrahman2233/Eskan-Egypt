import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  RefreshCw,
  Eye,
  Loader2,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import API from "@/api";

type RejectedProperty = {
  id: string;
  name: string;
  area: {
    name: string;
  };
  price: number;
  rooms: number;
  bathrooms: number;
  status: string;
  approval_notes: string;
  submitted_at: string;
  updated_at: string;
  images: Array<{
    id: string;
    image_url: string;
  }>;
  description: string;
  address: string;
};

const MyRejectedProperties = () => {
  const [rejectedProperties, setRejectedProperties] = useState<RejectedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resubmittingId, setResubmittingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRejectedProperties();
  }, []);

  const fetchRejectedProperties = async () => {
    try {
      setLoading(true);
      const response = await API.get("/listings/properties/rejected_by_me/");
      setRejectedProperties(response.data);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.response?.data?.detail || "فشل تحميل البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResubmit = async (propertyId: string) => {
    try {
      setResubmittingId(propertyId);
      await API.post(`/listings/properties/${propertyId}/resubmit/`);

      toast({
        title: "نجح",
        description: "تم إعادة إرسال العقار بنجاح",
        variant: "default",
      });

      // إزالة من القائمة
      setRejectedProperties(
        rejectedProperties.filter((p) => p.id !== propertyId)
      );
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.response?.data?.detail || "فشلت إعادة الإرسال",
        variant: "destructive",
      });
    } finally {
      setResubmittingId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-right">
            العقارات المرفوضة
          </h1>
          <p className="text-gray-600 text-right">
            اطلع على تفاصيل العقارات المرفوضة وأسباب الرفض
          </p>
        </div>

        {/* Empty State */}
        {rejectedProperties.length === 0 ? (
          <Card className="text-center py-12">
            <div className="flex flex-col items-center">
              <AlertCircle className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ممتاز! 🎉
              </h3>
              <p className="text-gray-600">
                ليس لديك أي عقارات مرفوضة. جميع عقاراتك بحالة جيدة.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {rejectedProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-red-200"
                    onClick={() =>
                      setExpandedId(expandedId === property.id ? null : property.id)
                    }
                  >
                    <CardHeader className="pb-3 bg-red-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-5 h-5 text-red-500" />
                            <CardTitle className="text-right text-xl">
                              {property.name}
                            </CardTitle>
                          </div>
                          <p className="text-sm text-gray-600 text-right">
                            {property.area.name} • {property.address}
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
                      <div className="grid grid-cols-3 gap-4 text-right">
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
                            {/* Rejection Reason */}
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                              <div className="flex gap-3">
                                <MessageSquare className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div className="text-right flex-1">
                                  <h4 className="font-semibold text-red-900 mb-2">
                                    سبب الرفض
                                  </h4>
                                  <p className="text-red-800">
                                    {property.approval_notes ||
                                      "لم يتم تحديد سبب الرفض"}
                                  </p>
                                </div>
                              </div>
                            </div>

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

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleResubmit(property.id);
                                }}
                                disabled={resubmittingId === property.id}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                {resubmittingId === property.id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                                    جاري...
                                  </>
                                ) : (
                                  <>
                                    <RefreshCw className="w-4 h-4 ml-2" />
                                    إعادة الإرسال
                                  </>
                                )}
                              </Button>
                            </div>

                            {/* Info */}
                            <div className="bg-blue-50 p-3 rounded-lg text-right">
                              <p className="text-sm text-blue-800">
                                <strong>ملاحظة:</strong> لا يمكن تعديل العقار بعد الرفض. يمكنك حذفه وإضافة عقار جديد.
                              </p>
                            </div>
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

export default MyRejectedProperties;
