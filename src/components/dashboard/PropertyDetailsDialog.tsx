import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Home, DollarSign, Building2, Settings2, MapPin, FileText, Clock } from "lucide-react";

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
  deletedDate?: string;
  approvalNotes?: string;
}

interface PropertyDetailsDialogProps {
  property: PropertyDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusLabels: Record<string, { label: string; class: string }> = {
  approved: { label: "موافق عليه", class: "bg-emerald-100 text-emerald-700" },
  rejected: { label: "مرفوض", class: "bg-red-100 text-red-700" },
  pending: { label: "قيد المراجعة", class: "bg-amber-100 text-amber-700" },
  deleted: { label: "محذوف", class: "bg-gray-100 text-gray-700" },
};

export function PropertyDetailsDialog({ property, open, onOpenChange }: PropertyDetailsDialogProps) {
  if (!property) return null;

  const statusInfo = statusLabels[property.status] || { label: property.status || 'غير معروف', class: 'bg-gray-100 text-gray-700' };

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

          {/* Location */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-slate-100">
                <span className="text-muted-foreground">تاريخ الإضافة:</span>
                <p className="font-medium" dir="ltr">{property.addedDate}</p>
              </div>
              {property.deletedDate && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <span className="text-destructive">تاريخ الحذف:</span>
                  <p className="font-medium text-destructive" dir="ltr">{property.deletedDate}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}