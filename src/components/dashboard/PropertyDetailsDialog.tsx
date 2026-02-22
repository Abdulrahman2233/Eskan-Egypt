import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Home, DollarSign, Building2, Settings2, MapPin, FileText, Clock, Eye, Users, CheckCircle, XCircle, Wind, Coffee, Wifi, Car, Shield, Droplets, Tv, Zap, Droplet, Thermometer, Flame, Filter, UtensilsCrossed, Waves, Dumbbell, Leaf, Refrigerator, Fuel, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import API from "@/api";

interface Amenity {
  id: number;
  name: string;
  icon: string;
  description?: string;
}

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
  price_unit?: string;
  is_daily_pricing?: boolean;
  amenities?: Amenity[];
  images?: Array<{ id: number; image_url: string; order: number }>;
  videos?: Array<{ id: number; video_url: string; order: number }>;
}

interface PropertyDetailsDialogProps {
  property: PropertyDetails | null;
  open: boolean;
  isClosing?: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (propertyId: string, newStatus: string) => void;
  onPropertyStatusChanged?: (type: 'approve' | 'reject', message: string) => void;
}

const statusLabels: Record<string, { label: string; class: string }> = {
  approved: { label: "موافق عليه", class: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "مرفوض", class: "bg-red-100 text-red-700" },
  pending: { label: "قيد المراجعة", class: "bg-amber-100 text-amber-700" },
  deleted: { label: "محذوف", class: "bg-gray-100 text-gray-700" },
};

export function PropertyDetailsDialog({ property, open, isClosing, onOpenChange, onStatusChange, onPropertyStatusChanged }: PropertyDetailsDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [approveNotes, setApproveNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [successType, setSuccessType] = useState<'approve' | 'reject' | 'update' | null>(null);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [editingContact, setEditingContact] = useState(false);
  const [newContactNumber, setNewContactNumber] = useState('');
  const [contactUpdateError, setContactUpdateError] = useState<string | null>(null);
  const [contactUpdateSuccess, setContactUpdateSuccess] = useState<string | null>(null);

  // خريطة الأيقونات للمميزات والخدمات
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    wind: Wind,
    coffee: UtensilsCrossed,
    wifi: Wifi,
    car: Car,
    shield: Shield,
    dooropen: Building2,
    droplets: Droplets,
    tv: Tv,
    sofa: Building2,
    bath: Droplet,
    washing: Droplets,
    microwave: Coffee,
    fridge: Refrigerator,
    ac: Wind,
    heater: Flame,
    balcony: Building2,
    garden: Leaf,
    parking: Car,
    gym: Dumbbell,
    pool: Waves,
    zap: Zap,
    water_card: Droplets,
    droplet: Droplet,
    receipt: FileText,
    thermometer: Thermometer,
    filter: Filter,
    flame: Flame,
    bottle: Fuel,
  };
  
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
      
      // استدعاء callback الأب بدلاً من إظهار رسالة داخل النافذة
      const message = `تمت الموافقة على "${property.name}" بنجاح`;
      onPropertyStatusChanged?.('approve', message);
      
      // إغلاق النافذة بعد 1 ثانية (بدون رسالة داخلها)
      setTimeout(() => {
        onOpenChange(false);
        setShowApproveForm(false);
        setApproveNotes('');
      }, 1000);
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
      
      // استدعاء callback الأب بدلاً من إظهار رسالة داخل النافذة
      const message = `تم رفض "${property.name}" بنجاح`;
      onPropertyStatusChanged?.('reject', message);
      
      // إغلاق النافذة بعد 1 ثانية (بدون رسالة داخلها)
      setTimeout(() => {
        onOpenChange(false);
        setShowRejectForm(false);
        setRejectReason('');
      }, 1000);
    } catch (err) {
      setError('فشل في رفض العقار');
      console.error('Error rejecting property:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateContact = async () => {
    if (!newContactNumber.trim()) {
      setContactUpdateError('يجب إدخال رقم الاتصال');
      return;
    }

    if (!/^[0-9]+$/.test(newContactNumber)) {
      setContactUpdateError('رقم الاتصال يجب أن يحتوي على أرقام فقط');
      return;
    }

    if (newContactNumber.length < 11 || newContactNumber.length > 15) {
      setContactUpdateError('رقم الاتصال يجب أن يكون بين 11 و 15 رقم');
      return;
    }

    try {
      setIsSubmitting(true);
      setContactUpdateError(null);
      setContactUpdateSuccess(null);

      // استدعاء API لتحديث رقم الاتصال
      await API.patch(`/properties/${property.id}/`, {
        contact: newContactNumber
      });

      setContactUpdateSuccess('✓ تم تحديث رقم الاتصال بنجاح يرجي تحيث الصفحه لرؤية التغييرات');
      
      // إغلاق وضع التعديل بعد ثانيتين
      setTimeout(() => {
        setEditingContact(false);
        setNewContactNumber('');
        setContactUpdateSuccess(null);
      }, 4000);
    } catch (err) {
      setContactUpdateError('✗ فشل في تحديث رقم الاتصال');
      console.error('Error updating contact:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl max-h-[95vh] overflow-y-auto"
        style={{
          opacity: isClosing ? 0 : 1,
          transform: isClosing ? 'translate(-50%, -50%) scale(0.95)' : 'translate(-50%, -50%) scale(1)',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.6, 1)',
          width: '90%',
          maxWidth: '1000px',
        }}
      >
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
                {editingContact ? (
                  <div className="space-y-2 mt-2">
                    <input
                      type="text"
                      value={newContactNumber}
                      onChange={(e) => setNewContactNumber(e.target.value)}
                      placeholder={property.contactNumber}
                      className={`w-full px-2 py-1 rounded border focus:outline-none focus:ring-2 text-sm transition-colors ${
                        contactUpdateError
                          ? 'border-red-300 focus:ring-red-500'
                          : 'border-primary/30 focus:ring-primary'
                      }`}
                      disabled={isSubmitting}
                      dir="ltr"
                    />
                    {contactUpdateError && (
                      <p className="text-xs text-red-600 font-medium">{contactUpdateError}</p>
                    )}
                    {contactUpdateSuccess && (
                      <p className="text-xs text-green-600 font-medium">{contactUpdateSuccess}</p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateContact}
                        disabled={isSubmitting}
                        className="flex-1 px-2 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        حفظ
                      </button>
                      <button
                        onClick={() => {
                          setEditingContact(false);
                          setNewContactNumber('');
                          setContactUpdateError(null);
                          setContactUpdateSuccess(null);
                        }}
                        disabled={isSubmitting}
                        className="flex-1 px-2 py-1.5 bg-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-400 transition-colors disabled:opacity-50"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-medium" dir="ltr">{property.contactNumber}</p>
                    <button
                      onClick={() => {
                        setEditingContact(true);
                        setNewContactNumber(property.contactNumber);
                        setContactUpdateError(null);
                        setContactUpdateSuccess(null);
                      }}
                      className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      تعديل
                    </button>
                  </div>
                )}
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
                <span className="text-muted-foreground">السعر الحالي ({property.price_unit || (property.is_daily_pricing ? 'يوم' : 'شهر')}):</span>
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

          {/* Images and Videos Section */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2 text-primary">
              📸 الصور والفديوهات
            </h4>

            {/* Debug: Check if images exist */}
            {/* Images Section */}
            {property.images && property.images.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span>📷</span> الصور ({property.images.length})
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {property.images.map((img, idx) => (
                      <div
                        key={img.id}
                        className="group relative overflow-hidden rounded-lg border border-gray-200 hover:border-primary transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedImageIndex(idx);
                          setShowImageViewer(true);
                        }}
                      >
                        <img
                          src={img.image_url}
                          alt={`صورة ${img.order + 1}`}
                          className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            console.error('Error loading image:', img.image_url);
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" font-size="14" fill="%23999" text-anchor="middle" dy=".3em"%3EImage Error%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <span className="text-white text-sm font-medium bg-black/70 px-3 py-1 rounded">
                            اضغط للعرض
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Videos Section */}
            {property.videos && property.videos.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span>🎬</span> الفديوهات ({property.videos.length})
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.videos.map((video) => (
                    <div
                      key={video.id}
                      className="group relative overflow-hidden rounded-lg border border-gray-200 bg-black/5"
                    >
                      <video
                        src={video.video_url}
                        className="w-full h-40 object-cover"
                        controls
                        controlsList="nodownload"
                        onError={(e) => {
                          console.error('Error loading video:', video.video_url);
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-primary/90 text-white text-xs px-2 py-1 rounded">
                        فيديو {video.order + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Media Message */}
            {(!property.images || property.images.length === 0) && (!property.videos || property.videos.length === 0) && (
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 text-center">
                <p className="text-gray-600 text-sm">لا توجد صور أو فديوهات</p>
              </div>
            )}
          </div>

          <Separator />
          {property.amenities && property.amenities.length > 0 && (
            <>
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2 text-primary">
                  <Building2 className="h-4 w-4" />
                  المميزات والخدمات 📋
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => {
                    const IconComponent = iconMap[amenity.icon.toLowerCase()] || Wind;
                    return (
                      <div
                        key={amenity.id}
                        className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{amenity.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />
            </>
          )}

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

          {/* Actions */}
          {property.status === 'pending' && !error && (
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

      {/* Image Viewer Modal */}
      {showImageViewer && property.images && property.images.length > 0 && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 pointer-events-auto">
          <div className="relative w-full max-w-4xl h-auto pointer-events-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowImageViewer(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 active:text-gray-400 transition-colors z-[10000] p-2 cursor-pointer pointer-events-auto touch-none"
              title="إغلاق"
            >
              <X className="h-8 w-8 sm:h-10 sm:w-10" />
            </button>

            {/* Image Container */}
            <div className="relative bg-black rounded-lg overflow-hidden w-full pointer-events-auto">
              <img
                src={property.images[selectedImageIndex]?.image_url}
                alt={`صورة ${selectedImageIndex + 1}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '70vh',
                  backgroundColor: '#000',
                  objectFit: 'contain',
                }}
                loading="eager"
              />
            </div>

            {/* Navigation Buttons */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImageIndex(
                      selectedImageIndex === 0
                        ? property.images!.length - 1
                        : selectedImageIndex - 1
                    )
                  }
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 active:bg-white/50 text-white p-2.5 sm:p-3 rounded-full transition-colors z-[10001] cursor-pointer pointer-events-auto touch-none"
                  title="السابقة"
                >
                  <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" />
                </button>
                <button
                  onClick={() =>
                    setSelectedImageIndex(
                      selectedImageIndex === property.images!.length - 1
                        ? 0
                        : selectedImageIndex + 1
                    )
                  }
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 active:bg-white/50 text-white p-2.5 sm:p-3 rounded-full transition-colors z-[10001] cursor-pointer pointer-events-auto touch-none"
                  title="التالية"
                >
                  <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-medium">
              {selectedImageIndex + 1} / {property.images.length}
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}