import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Textarea, 
} from "@/components/ui/textarea";
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
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Loader,
  ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_URL } from "@/config";

interface Property {
  id: string;
  name: string;
  name_en?: string;
  address: string;
  price: number;
  rooms: number;
  bathrooms: number;
  size: number;
  floor: number;
  furnished: boolean;
  type: string;
  usage_type: string;
  usage_type_ar: string;
  description: string;
  area?: {
    name: string;
  };
  images?: { image_url: string }[];
  owner: {
    id: string;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
  status: string;
  submitted_at: string;
  approval_notes?: string;
}

const PropertyApprovals = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadPendingProperties();
  }, [filterType]);

  const loadPendingProperties = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("filter", filterType);
      if (searchTerm.trim()) {
        params.append("search", searchTerm.trim());
      }
      
      const response = await fetch(
        `${API_URL}listings/properties/pending/?${params}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("فشل تحميل العقارات");
      }

      const data = await response.json();
      setProperties(Array.isArray(data.results) ? data.results : []);
    } catch (error: any) {
      console.error("Error loading properties:", error);
      toast({
        title: "خطأ",
        description: error.message || "خطأ في تحميل العقارات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (propertyId: string) => {
    try {
      setProcessingId(propertyId);
      const response = await fetch(
        `${API_URL}listings/properties/${propertyId}/approve/`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            approval_notes: "تمت الموافقة على العقار",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("فشل الموافقة على العقار");
      }

      toast({
        title: "✓ تم الموافقة",
        description: "تم الموافقة على العقار وإرسال إشعار للمالك",
      });

      await loadPendingProperties();
      setSelectedProperty(null);
      setPreviewOpen(false);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "خطأ في الموافقة على العقار",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectNotes.trim()) {
      toast({
        title: "تنبيه",
        description: "يجب إدخال سبب الرفض",
        variant: "destructive",
      });
      return;
    }

    if (!selectedProperty) return;

    try {
      setProcessingId(selectedProperty.id);
      const response = await fetch(
        `${API_URL}listings/properties/${selectedProperty.id}/reject/`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            approval_notes: rejectNotes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("فشل رفض العقار");
      }

      toast({
        title: "✓ تم الرفض",
        description: "تم رفض العقار وإرسال الملاحظات للمالك",
      });

      setRejectNotes("");
      setRejectDialogOpen(false);
      await loadPendingProperties();
      setSelectedProperty(null);
      setPreviewOpen(false);
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message || "خطأ في رفض العقار",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadPendingProperties();
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-muted/30" dir="rtl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                إدارة العقارات
              </h1>
              <p className="text-muted-foreground">
                مراجعة وموافقة على العقارات المضافة
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary mb-1">
                {properties.length}
              </div>
              <p className="text-sm text-muted-foreground">عقار معلق</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">اليوم</p>
                    <p className="text-2xl font-bold">
                      {properties.filter((p) => {
                        const submitted = new Date(p.submitted_at);
                        const today = new Date();
                        return submitted.toDateString() === today.toDateString();
                      }).length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">هذا الأسبوع</p>
                    <p className="text-2xl font-bold">
                      {properties.filter((p) => {
                        const submitted = new Date(p.submitted_at);
                        const today = new Date();
                        const weekStart = new Date(today);
                        weekStart.setDate(today.getDate() - today.getDay());
                        return submitted >= weekStart;
                      }).length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">الكل</p>
                    <p className="text-2xl font-bold">{properties.length}</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">البحث والفلترة</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-4 flex-col sm:flex-row">
                <div className="flex-1">
                  <Input
                    placeholder="ابحث عن اسم العقار أو المنطقة..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">جميع العقارات</SelectItem>
                    <SelectItem value="today">اليوم</SelectItem>
                    <SelectItem value="this_week">هذا الأسبوع</SelectItem>
                    <SelectItem value="this_month">هذا الشهر</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" className="h-10 w-full sm:w-auto">
                  <Search className="w-4 h-4 ml-2" />
                  بحث
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Properties Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>قائمة العقارات المعلقة</CardTitle>
              <CardDescription>
                {loading && "جاري التحميل..."}
                {!loading && properties.length === 0 && "لا توجد عقارات معلقة"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">العقار</TableHead>
                        <TableHead className="text-right">المالك</TableHead>
                        <TableHead className="text-right">السعر</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-center">الإجراء</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {properties.map((property) => (
                        <motion.tr
                          key={property.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="border-b hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {property.images?.[0]?.image_url ? (
                                <img
                                  src={property.images[0].image_url}
                                  alt={property.name}
                                  className="w-10 h-10 rounded object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                                  <ImageIcon className="w-5 h-5 text-muted-foreground" />
                                </div>
                              )}
                              <div>
                                <p className="font-semibold">{property.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {property.area?.name}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {property.owner.user.first_name}{" "}
                                {property.owner.user.last_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {property.owner.user.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {property.price.toLocaleString()} ريال
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(property.submitted_at).toLocaleDateString("ar-SA")}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex gap-2 justify-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedProperty(property);
                                  setPreviewOpen(true);
                                }}
                                className="gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                عرض
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleApprove(property.id)}
                                disabled={processingId === property.id}
                              >
                                {processingId === property.id ? (
                                  <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    قبول
                                  </>
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                  setSelectedProperty(property);
                                  setRejectDialogOpen(true);
                                }}
                                disabled={processingId === property.id}
                              >
                                {processingId === property.id ? (
                                  <Loader className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4" />
                                    رفض
                                  </>
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>

                  {properties.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">لا توجد عقارات معلقة</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Property Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>{selectedProperty?.name}</DialogTitle>
              <DialogDescription>
                تفاصيل العقار
              </DialogDescription>
            </DialogHeader>

            {selectedProperty && (
              <div className="space-y-6">
                {/* Images */}
                {selectedProperty.images && selectedProperty.images.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">الصور</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                      {selectedProperty.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img.image_url}
                          alt={`صورة ${idx + 1}`}
                          className="w-full h-40 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Basic Info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">السعر</p>
                    <p className="font-bold text-lg">
                      {selectedProperty.price.toLocaleString()} ريال
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الغرف</p>
                    <p className="font-bold text-lg">{selectedProperty.rooms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">الحمامات</p>
                    <p className="font-bold text-lg">
                      {selectedProperty.bathrooms}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">المساحة</p>
                    <p className="font-bold text-lg">
                      {selectedProperty.size} م²
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">المنطقة</p>
                    <p className="font-bold">{selectedProperty.area?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">النوع</p>
                    <p className="font-bold">{selectedProperty.usage_type_ar}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">الوصف</p>
                  <p className="text-sm leading-relaxed">
                    {selectedProperty.description}
                  </p>
                </div>

                {/* Owner Info */}
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-semibold mb-2">معلومات المالك</p>
                  <p>
                    {selectedProperty.owner.user.first_name}{" "}
                    {selectedProperty.owner.user.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedProperty.owner.user.email}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(selectedProperty.id)}
                    disabled={processingId === selectedProperty.id}
                  >
                    {processingId === selectedProperty.id ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 ml-2" />
                        الموافقة
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setRejectDialogOpen(true)}
                  >
                    <XCircle className="w-4 h-4 ml-2" />
                    الرفض
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <AlertDialogContent dir="rtl">
            <AlertDialogHeader>
              <AlertDialogTitle>رفض العقار</AlertDialogTitle>
              <AlertDialogDescription>
                يرجى إدخال سبب الرفض. سيتم إرسال هذه الملاحظات للمالك.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <Textarea
              placeholder="أدخل ملاحظات الرفض..."
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              className="min-h-[120px]"
            />

            <div className="flex gap-3 justify-end">
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReject}
                className="bg-red-600 hover:bg-red-700"
                disabled={!rejectNotes.trim() || processingId === selectedProperty?.id}
              >
                {processingId === selectedProperty?.id ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  "تأكيد الرفض"
                )}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default PropertyApprovals;
