import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Home, DollarSign, Building2, Settings2, MapPin, FileText, Clock, Eye, Users, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import API from "@/api";

interface PropertyDetails {
  id: string;
  name: string;
  region: string;
  address: string;
  contactNumber: string;
  currentPrice: number;
  originalPrice?: number;
  discountPercentage: number;
  rooms: number;
  beds: number;
  bathrooms: number;
  area: number;
  floor: number;
  type: string;
  furnished: boolean;
  featured: boolean;
  status: "approved" | "rejected" | "pending";
  // allow deleted status for removed properties
  // (this is rendered as "محذوفة" in the dialog)
  // note: other unexpected values will be handled safely
  // at runtime via a fallback
  // end
  latitude: number;
  longitude: number;
  description: string;
  addedDate: string;
  created_at?: string;
  deletedDate?: string;
  deleted_at?: string;
  submitted_at?: string;
  approved_at?: string;
  rejected_at?: string;
  approvalNotes?: string;
  approval_notes?: string;
  views?: number;
  visitors?: number;
}

interface PropertyDetailsDialogProps {
  property: PropertyDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (propertyId: string, newStatus: string) => void;
}

const statusLabels: Record<string, { label: string; class: string }> = {
  approved: { label: "موافق عليه", class: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "مرفوض", class: "bg-red-100 text-red-700" },
  pending: { label: "قيد المراجعة", class: "bg-amber-100 text-amber-700" },
  deleted: { label: "محذوف", class: "bg-gray-100 text-gray-700" },
};

export function PropertyDetailsDialog({ property, open, onOpenChange, onStatusChange }: PropertyDetailsDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [approveNotes, setApproveNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [successType, setSuccessType] = useState<'approve' | 'reject' | null>(null);
  
  if (!property) return null;

  const statusInfo = statusLabels[property.status] || { label: property.status || 'غير معروف', class: 'bg-gray-100 text-gray-700' };

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);
      
      // استدعاء API للموافقة على العقار مع الملاحظات
      await API.post(`/properties/${property.id}/approve/`, {
        approval_notes: approveNotes
      });
      
      setSuccess('تم الموافقة على العقار بنجاح');
      setSuccessType('approve');
      onStatusChange?.(property.id, 'approved');
      
      // إغلاق النافذة بعد 2 ثانية
      setTimeout(() => {
        onOpenChange(false);
        setShowApproveForm(false);
        setApproveNotes('');
        setSuccessType(null);
      }, 2000);
    } catch (err) {
      setError('فشل في الموافقة على العقار');
      console.error('Error approving property:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError('يجب إدخال سبب الرفض');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);
      
      // استدعاء API لرفض العقار مع سبب الرفض
      await API.post(`/properties/${property.id}/reject/`, {
        approval_notes: rejectReason
      });
      
      setSuccess('تم رفض العقار بنجاح');
      setSuccessType('reject');
      onStatusChange?.(property.id, 'rejected');
      
      // إغلاق النافذة بعد 2 ثانية
      setTimeout(() => {
        onOpenChange(false);
        setShowRejectForm(false);
        setRejectReason('');
        setSuccessType(null);
      }, 2000);
    } catch (err) {
      setError('فشل في رفض العقار');
      console.error('Error rejecting property:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Home className="h-5 w-5 text-primary" />
            تفاصيل العقار
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-primary">
              <Home className="h-4 w-4" />
              معلومات العقار الأساسية
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-slate-100">
                <span className="text-muted-foreground">الاسم:</span>
                <p className="font-medium">{property.name}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-100">
                <span className="text-muted-foreground">المنطقة:</span>
                <p className="font-medium">{property.region}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-100 sm:col-span-2">
                <span className="text-muted-foreground">العنوان:</span>
                <p className="font-medium">{property.address}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-100">
                <span className="text-muted-foreground">رقم الاتصال:</span>
                <p className="font-medium" dir="ltr">{property.contactNumber}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Price Info */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-primary">
              <DollarSign className="h-4 w-4" />
              معلومات السعر
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-slate-100">
                <span className="text-muted-foreground">السعر الحالي:</span>
                <p className="font-medium text-primary">{property.currentPrice.toLocaleString()} مصرى</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-100">
                <span className="text-muted-foreground">السعر الأصلي:</span>
                <p className="font-medium">{property.originalPrice ? `${property.originalPrice.toLocaleString()} مصرى` : "بدون"}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-100">
                <span className="text-muted-foreground">نسبة الخصم:</span>
                <p className="font-medium">{property.discountPercentage}%</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Space Details */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-primary">
              <Building2 className="h-4 w-4" />
              تفاصيل المساحة
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-slate-100 text-center">
                <span className="text-muted-foreground text-xs">الغرف</span>
                <p className="font-bold text-lg">{property.rooms}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-100 text-center">
                <span className="text-muted-foreground text-xs">الأسرّة</span>
                <p className="font-bold text-lg">{property.beds}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-100 text-center">
                <span className="text-muted-foreground text-xs">الحمامات</span>
                <p className="font-bold text-lg">{property.bathrooms}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-100 text-center">
                <span className="text-muted-foreground text-xs">المساحة</span>
                <p className="font-bold text-lg">{property.area} م²</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-100 text-center">
                <span className="text-muted-foreground text-xs">الطابق</span>
                <p className="font-bold text-lg">{property.floor}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Specifications */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-primary">
              <Settings2 className="h-4 w-4" />
              المواصفات
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-slate-100">
                <span className="text-muted-foreground">النوع:</span>
                <p className="font-medium">{property.type}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-100">
                <span className="text-muted-foreground">مفروش:</span>
                <p className="font-medium">{property.furnished ? "نعم" : "لا"}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-100">
                <span className="text-muted-foreground">مميز:</span>
                <p className="font-medium">{property.featured ? "نعم" : "لا"}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-100">
                <span className="text-muted-foreground">الحالة:</span>
                <Badge className={statusInfo.class}>{statusInfo.label}</Badge>
              </div>
            </div>
            
            {/* Approval Notes */}
            {property.approvalNotes && (
              <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <span className="text-blue-700 font-medium text-sm">ملاحظات :</span>
                <p className="text-blue-600 text-sm mt-1">{property.approvalNotes}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Analytics */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-primary">
              <Eye className="h-4 w-4" />
              إحصائيات الأداء
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-blue-700 font-medium">المشاهدات</span>
                </div>
                <p className="font-bold text-2xl text-blue-900">{property.views || 0}</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="text-purple-700 font-medium">الزيارات</span>
                </div>
                <p className="font-bold text-2xl text-purple-900">{property.visitors || 0}</p>
              </div>
            </div>
          </div>

          <Separator />
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-primary">
              <MapPin className="h-4 w-4" />
              الموقع الجغرافي
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-slate-100">
                <span className="text-muted-foreground">خط العرض:</span>
                <p className="font-medium" dir="ltr">{property.latitude}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-100">
                <span className="text-muted-foreground">خط الطول:</span>
                <p className="font-medium" dir="ltr">{property.longitude}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-primary">
              <FileText className="h-4 w-4" />
              الوصف
            </h4>
            <p className="text-sm p-3 rounded-lg bg-slate-100">{property.description || "لا يوجد وصف"}</p>
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-primary">
              <Clock className="h-4 w-4" />
              التواريخ
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm space-y-3 sm:space-y-0">
              {/* تاريخ الإضافة */}
              {(property.addedDate || property.created_at) && (
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <span className="text-blue-700 font-medium">تاريخ الإضافة:</span>
                  <p className="font-medium text-blue-600" dir="ltr">
                    {property.addedDate ? 
                      property.addedDate 
                      : (property.created_at ? 
                        new Date(property.created_at).toLocaleDateString('en-CA') + ' ' + 
                        new Date(property.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
                        : 'لا توجد بيانات'
                      )
                    }
                  </p>
                </div>
              )}

              {/* تاريخ الموافقة */}
              {property.approved_at && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="text-emerald-700 font-medium">تاريخ الموافقة:</span>
                  <p className="font-medium text-emerald-600" dir="ltr">
                    {new Date(property.approved_at).toLocaleDateString('en-CA') + ' ' + 
                     new Date(property.approved_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}

              {/* تاريخ الرفض */}
              {property.rejected_at && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <span className="text-red-700 font-medium">تاريخ الرفض:</span>
                  <p className="font-medium text-red-600" dir="ltr">
                    {new Date(property.rejected_at).toLocaleDateString('en-CA') + ' ' + 
                     new Date(property.rejected_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}

              {/* تاريخ الحذف */}
              {(property.deletedDate || property.deleted_at) && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <span className="text-destructive font-medium">تاريخ الحذف:</span>
                  <p className="font-medium text-destructive" dir="ltr">
                    {property.deletedDate ? 
                      property.deletedDate 
                      : (property.deleted_at ? 
                        new Date(property.deleted_at).toLocaleDateString('en-CA') + ' ' + 
                        new Date(property.deleted_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
                        : 'لا توجد بيانات'
                      )
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Messages and Success State */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && successType === 'approve' && (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <div className="mb-4 relative">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="h-12 w-12 text-emerald-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-emerald-700 mb-2">تم الموافقة بنجاح! ✓</h3>
              <p className="text-emerald-600 text-sm text-center">{property.name}</p>
              <p className="text-muted-foreground text-xs mt-2">يتم إغلاق النافذة...</p>
            </div>
          )}

          {success && successType === 'reject' && (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <div className="mb-4">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-bounce">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-red-700 mb-2">تم الرفض بنجاح</h3>
              <p className="text-red-600 text-sm text-center">{property.name}</p>
              <p className="text-muted-foreground text-xs mt-2">يتم إغلاق النافذة...</p>
            </div>
          )}

          {/* Actions */}
          {property.status === 'pending' && !success && (
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">الإجراءات</h4>
              
              {/* Approve Form */}
              {showApproveForm && (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 space-y-3">
                  <label className="block">
                    <span className="text-sm font-medium text-emerald-700 mb-2 block">ملاحظات الموافقة (اختياري)</span>
                    <textarea
                      value={approveNotes}
                      onChange={(e) => setApproveNotes(e.target.value)}
                      placeholder="أدخل أي ملاحظات أو تعليقات..."
                      className="w-full px-3 py-2 rounded-lg border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      rows={3}
                      disabled={isSubmitting}
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={handleApprove}
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>تأكيد الموافقة</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowApproveForm(false);
                        setApproveNotes('');
                        setError(null);
                      }}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}

              {/* Reject Form */}
              {showRejectForm && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 space-y-3">
                  <label className="block">
                    <span className="text-sm font-medium text-red-700 mb-2 block">سبب الرفض *</span>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="أدخل سبب رفض العقار..."
                      className="w-full px-3 py-2 rounded-lg border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      rows={3}
                      disabled={isSubmitting}
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={handleReject}
                      disabled={isSubmitting || !rejectReason.trim()}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>تأكيد الرفض</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowRejectForm(false);
                        setRejectReason('');
                        setError(null);
                      }}
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}

              {/* Buttons */}
              {!showApproveForm && !showRejectForm && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowApproveForm(true)}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-100 text-emerald-700 font-medium hover:bg-emerald-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>موافقة</span>
                  </button>
                  <button
                    onClick={() => setShowRejectForm(true)}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>رفض</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}