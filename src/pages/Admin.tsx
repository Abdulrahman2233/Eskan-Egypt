import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, Eye, Pencil, Trash2, Plus, TrendingUp, 
  CheckCircle2, Clock, AlertCircle, Loader
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchApprovalStatistics, fetchPendingProperties, approveProperty, rejectProperty } from "@/api";
import {
  Textarea,
} from "@/components/ui/textarea";

interface Property {
  id: string;
  name: string;
  address: string;
  price: number;
  owner: {
    user: {
      first_name: string;
      email: string;
    };
  };
  status: string;
  rooms?: number;
  images?: { image_url: string }[];
}

interface Statistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const Admin = () => {
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState<{ [key: string]: string }>({});
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      loadDashboardData();
    }
  }, [isLoggedIn]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, properties] = await Promise.all([
        fetchApprovalStatistics(),
        fetchPendingProperties(),
      ]);
      setStatistics(stats);
      setPendingProperties(Array.isArray(properties) ? properties : []);
    } catch (err: any) {
      console.error("Error loading data:", err);
      toast({
        title: "خطأ",
        description: err.response?.data?.detail || "خطأ في تحميل البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (propertyId: string) => {
    try {
      setApprovingId(propertyId);
      await approveProperty(propertyId);
      await loadDashboardData();
      toast({
        title: "تم قبول العقار",
        description: "تم قبول العقار بنجاح وتم إرسال إشعار للمالك",
      });
    } catch (err: any) {
      console.error("Error approving property:", err);
      toast({
        title: "خطأ",
        description: err.response?.data?.detail || "خطأ في قبول العقار",
        variant: "destructive",
      });
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (propertyId: string) => {
    const notes = rejectNotes[propertyId] || "";
    if (!notes.trim()) {
      toast({
        title: "نرجو منك",
        description: "يرجى إدخال ملاحظات للرفض",
        variant: "destructive",
      });
      return;
    }

    try {
      setRejectingId(propertyId);
      await rejectProperty(propertyId, notes);
      await loadDashboardData();
      setRejectNotes({ ...rejectNotes, [propertyId]: "" });
      setSelectedProperty(null);
      toast({
        title: "تم رفض العقار",
        description: "تم رفض العقار بنجاح وتم إرسال الملاحظات للمالك",
      });
    } catch (err: any) {
      console.error("Error rejecting property:", err);
      toast({
        title: "خطأ",
        description: err.response?.data?.detail || "خطأ في رفض العقار",
        variant: "destructive",
      });
    } finally {
      setRejectingId(null);
    }
  };

  // باقي صفحة لوحة التحكم
  return (
    <div className="min-h-screen flex flex-col bg-muted/30" dir="rtl">
      <Navbar />
      
      <main className="flex-1 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">لوحة التحكم الإدارية</h1>
              <p className="text-muted-foreground">إدارة وموافقة على العقارات</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsLoggedIn(false);
                localStorage.removeItem("token");
              }}
            >
              تسجيل الخروج
            </Button>
          </div>

          {/* Statistics Cards */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="inline-flex flex-col items-center gap-2">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-slate-500">جاري تحميل البيانات...</p>
              </div>
            </div>
          ) : statistics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">إجمالي العقارات</p>
                      <p className="text-3xl font-bold">{statistics.total}</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">قيد المراجعة</p>
                      <p className="text-3xl font-bold">{statistics.pending}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">موافق عليها</p>
                      <p className="text-3xl font-bold text-green-600">{statistics.approved}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">مرفوضة</p>
                      <p className="text-3xl font-bold text-red-600">{statistics.rejected}</p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-full">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {/* Pending Properties Tab */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                العقارات المعلقة للموافقة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : pendingProperties.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  لا توجد عقارات معلقة للموافقة عليها
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingProperties.map((property) => (
                    <div
                      key={property.id}
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{property.name}</h3>
                          <p className="text-sm text-muted-foreground">{property.address}</p>
                          <div className="flex gap-4 mt-2 text-sm">
                            <span>السعر: {property.price.toLocaleString()} ج.م</span>
                            {property.rooms && <span>غرف: {property.rooms}</span>}
                          </div>
                          {property.owner?.user && (
                            <div className="mt-2 text-sm">
                              <p>المالك: {property.owner.user.first_name}</p>
                              <p className="text-xs text-muted-foreground">
                                {property.owner.user.email}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 w-full md:w-auto">
                          <Button
                            onClick={() => handleApprove(property.id)}
                            disabled={approvingId !== null}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {approvingId === property.id && (
                              <Loader className="h-4 w-4 ml-2 animate-spin" />
                            )}
                            قبول
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => setSelectedProperty(property)}
                          >
                            رفض
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reject Dialog */}
          {selectedProperty && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>رفض العقار</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    أدخل ملاحظات الرفض للمالك:
                  </p>
                  <Textarea
                    placeholder="ملاحظات الرفض..."
                    value={rejectNotes[selectedProperty.id] || ""}
                    onChange={(e) =>
                      setRejectNotes({
                        ...rejectNotes,
                        [selectedProperty.id]: e.target.value,
                      })
                    }
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setSelectedProperty(null)}
                      variant="outline"
                      className="flex-1"
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedProperty.id)}
                      disabled={rejectingId !== null}
                      variant="destructive"
                      className="flex-1"
                    >
                      {rejectingId === selectedProperty.id && (
                        <Loader className="h-4 w-4 ml-2 animate-spin" />
                      )}
                      تأكيد الرفض
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
