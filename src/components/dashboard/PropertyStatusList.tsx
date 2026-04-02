import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Eye, Trash2, Download, Search, Filter, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyDetailsDialog } from "./PropertyDetailsDialog";
import API from "@/api";
import { Input } from "@/components/ui/input";

interface Property {
  id: string;
  name: string;
  owner: string;
  ownerType: "مالك" | "وسيط" | "مكتب";
  region: string;
  addedDate: string;
  deletedDate?: string;
  submitted_at?: string;
  approved_at?: string;
  rejected_at?: string;
  views?: number;
  visitors?: number;
  // بيانات إضافية للـ dialog
  address?: string;
  contactNumber?: string;
  currentPrice?: number;
  originalPrice?: number;
  discountPercentage?: number;
  rooms?: number;
  beds?: number;
  bathrooms?: number;
  area?: number;
  floor?: number;
  type?: string;
  furnished?: boolean;
  featured?: boolean;
  status?: "approved" | "rejected" | "pending";
  latitude?: number;
  longitude?: number;
  description?: string;
  approvalNotes?: string;
  amenities?: Array<{ id: number; name: string; icon: string; description?: string }>;
  images?: Array<{ id: number; image_url: string; order: number }>;
  videos?: Array<{ id: number; video_url: string; order: number }>;
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
  latitude: number;
  longitude: number;
  description: string;
  addedDate: string;
  deletedDate?: string;
  approved_at?: string;
  rejected_at?: string;
  submitted_at?: string;
  approvalNotes?: string;
  views?: number;
  visitors?: number;
  amenities?: Array<{ id: number; name: string; icon: string; description?: string }>;
  images?: Array<{ id: number; image_url: string; order: number }>;
  videos?: Array<{ id: number; video_url: string; order: number }>;
}




function PropertyTable({ 
  properties, 
  status,
  onViewProperty,
  itemsPerPage = 10
}: { 
  properties: Property[]; 
  status: "approved" | "rejected" | "pending" | "deleted";
  onViewProperty: (id: string) => void;
  itemsPerPage?: number;
}) {
  const [displayCount, setDisplayCount] = useState(itemsPerPage);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOwnerType, setFilterOwnerType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date-new" | "date-old">("date-new");

  const ownerTypeColors = {
    "مالك": "bg-green-200 text-green-800",
    "وسيط": "bg-orange-200 text-orange-800",
    "مكتب": "bg-blue-200 text-blue-800",
  };

  // فلترة وبحث
  const filteredProperties = properties.filter(property => {
    const matchSearch = property.name.includes(searchTerm) || 
                       property.owner.includes(searchTerm) ||
                       property.region.includes(searchTerm);
    const matchOwnerType = filterOwnerType === "all" || property.ownerType === filterOwnerType;
    return matchSearch && matchOwnerType;
  }).sort((a, b) => {
    if (sortBy === "date-new") {
      // من الأحدث إلى الأقدم (من فوق لتحت)
      const dateA = new Date(a.addedDate || a.deletedDate || '').getTime();
      const dateB = new Date(b.addedDate || b.deletedDate || '').getTime();
      return dateB - dateA;
    } else {
      // من الأقدم إلى الأحدث (من تحت لفوق)
      const dateA = new Date(a.addedDate || a.deletedDate || '').getTime();
      const dateB = new Date(b.addedDate || b.deletedDate || '').getTime();
      return dateA - dateB;
    }
  });

  const displayedProperties = filteredProperties.slice(0, displayCount);
  const hasMoreItems = displayCount < filteredProperties.length;

  // رسائل مخصصة لكل حالة
  const getEmptyMessage = () => {
    const messages: Record<string, string> = {
      "approved": "لا توجد عقارات موافق عليها",
      "rejected": "لا توجد عقارات مرفوضة",
      "pending": "لا توجد عقارات معلّقة",
      "deleted": "لا توجد عقارات محذوفة",
    };
    return messages[status] || "لا توجد عقارات";
  };

  // دالة تصدير إلى Excel
  const exportToExcel = () => {
    if (filteredProperties.length === 0) {
      alert("لا توجد بيانات للتصدير");
      return;
    }

    const headers = [
      "اسم العقار",
      "المالك / الوسيط",
      "نوع المالك",
      "المنطقة",
      status === 'deleted' ? "تاريخ الحذف" : "تاريخ الإضافة"
    ];

    const rows = filteredProperties.map(property => [
      property.name,
      property.owner,
      property.ownerType,
      property.region,
      status === 'deleted' ? (property.deletedDate || 'غير محدد') : property.addedDate
    ]);

    // إنشاء CSV
    const csv = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    // إضافة BOM لـ UTF-8 (للعربية)
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `العقارات_${status}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (filteredProperties.length === 0 && properties.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">{getEmptyMessage()}</p>
        </div>
      </div>
    );
  }

  if (filteredProperties.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن اسم العقار أو المالك أو المنطقة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterOwnerType}
                onChange={(e) => setFilterOwnerType(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border text-sm bg-background hover:bg-accent cursor-pointer"
              >
                <option value="all">جميع الأنواع</option>
                <option value="مالك">مالك</option>
                <option value="وسيط">وسيط</option>
                <option value="مكتب">مكتب</option>
              </select>
              <button
                onClick={exportToExcel}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-green-100 text-green-700 text-sm font-medium hover:bg-green-200 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">تحميل Excel</span>
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">لا توجد نتائج تطابق البحث</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* الفلاتر والبحث */}
      <div className="space-y-3">
        {/* البحث */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن اسم العقار أو المالك أو المنطقة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 text-sm w-full"
          />
        </div>

        {/* الفلاتر */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
          <select
            value={filterOwnerType}
            onChange={(e) => setFilterOwnerType(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border text-xs sm:text-sm bg-background hover:bg-accent cursor-pointer"
          >
            <option value="all">جميع الأنواع</option>
            <option value="مالك">مالك</option>
            <option value="وسيط">وسيط</option>
            <option value="مكتب">مكتب</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-border text-xs sm:text-sm bg-background hover:bg-accent cursor-pointer"
          >
            <option value="date-new">من الأحدث إلى الأقدم</option>
            <option value="date-old">من الأقدم إلى الأحدث</option>
          </select>

          <button
            onClick={exportToExcel}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-green-100 text-green-700 text-xs sm:text-sm font-medium hover:bg-green-200 transition-colors col-span-2 sm:col-span-1"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">تحميل</span>
          </button>
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">اسم العقار</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">المالك / الوسيط</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground hidden md:table-cell">النوع</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground hidden lg:table-cell">المنطقة</th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground hidden xl:table-cell">تاريخ الإضافة</th>
              {status === 'deleted' && (
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground hidden lg:table-cell">تاريخ الحذف</th>
              )}
              <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">إجراء</th>
            </tr>
          </thead>
          <tbody>
            {displayedProperties.map((property) => (
              <tr key={property.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="py-3 px-4">
                  <span className="font-medium text-sm">{property.name}</span>
                </td>
                <td className="py-3 px-4 text-sm">{property.owner}</td>
                <td className="py-3 px-4 hidden md:table-cell">
                  <span className={cn("text-xs px-2 py-1 rounded-full font-medium", ownerTypeColors[property.ownerType])}>
                    {property.ownerType}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm hidden lg:table-cell">{property.region}</td>
                <td className="py-3 px-4 text-xs text-muted-foreground hidden xl:table-cell">
                  {property.addedDate || 'غير محدد'}
                </td>
                {status === 'deleted' && (
                  <td className="py-3 px-4 text-sm text-muted-foreground hidden lg:table-cell">
                    {property.deletedDate || 'غير محدد'}
                  </td>
                )}
                <td className="py-3 px-4 text-center">
                  <button 
                    onClick={() => onViewProperty(property.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">عرض</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* زر عرض المزيد */}
      {hasMoreItems && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setDisplayCount(prev => Math.min(prev + 10, filteredProperties.length))}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            عرض المزيد
          </button>
        </div>
      )}
    </div>
  );
}

export function PropertyStatusList() {
  const [selectedProperty, setSelectedProperty] = useState<PropertyDetails | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [approvedProperties, setApprovedProperties] = useState<Property[]>([]);
  const [rejectedProperties, setRejectedProperties] = useState<Property[]>([]);
  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
  const [deletedProperties, setDeletedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [successType, setSuccessType] = useState<'approve' | 'reject' | null>(null);
  const [isClosingDialog, setIsClosingDialog] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  // إزالة رسالة النجاح تلقائياً بعد 4 ثوانٍ
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setSuccessType(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // دالة للموافقة مع التأخير الزمني
  const handlePropertyStatusChanged = (type: 'approve' | 'reject', message: string) => {
    // أظهر الرسالة بعد ثانية واحدة من استدعاء النافذة للإغلاق
    setTimeout(() => {
      setSuccessMessage(message);
      setSuccessType(type);
    }, 1200); // 500ms لحركة الإغلاق + 700ms انتظار = 1200ms إجمالي
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // جلب العقارات بحالات مختلفة - استخدام endpoints محددة لكل حالة
      const [approvedRes, rejectedRes, pendingRes, deletedRes] = await Promise.all([
        API.get('/properties/', { params: { ordering: '-created_at' } })
          .catch(() => ({ data: [] })),
        API.get('/properties/rejected/', { params: { ordering: '-submitted_at' } })
          .catch(() => ({ data: [] })),
        API.get('/properties/pending/', { params: { filter: 'all', ordering: '-submitted_at' } })
          .catch(() => ({ data: { results: [] } })),
        API.get('/properties/deleted/', { params: { ordering: '-deleted_at' } })
          .catch(() => ({ data: [] }))
      ]);

      console.log('Approved Response:', approvedRes.data);
      console.log('Rejected Response:', rejectedRes.data);
      console.log('Pending Response:', pendingRes.data);
      console.log('Deleted Response:', deletedRes.data);

      // تحويل البيانات إلى صيغة Property
      const transformProperty = (prop: Record<string, unknown>): Property => {
        const ownerTypeMap: Record<string, "مالك" | "وسيط" | "مكتب"> = {
          'landlord': 'مالك',
          'agent': 'وسيط',
          'office': 'مكتب',
        };

        let ownerName = 'غير معروف';
        if ((prop.owner as any)?.user?.first_name) {
          ownerName = (prop.owner as any).user.first_name;
        } else if ((prop.owner as any)?.name) {
          ownerName = (prop.owner as any).name;
        } else if (prop.owner_name) {
          ownerName = prop.owner_name as string;
        }

        const ownerUserType = prop.owner_type as string || 'landlord';

        let regionName = 'غير معروف';
        if ((prop.area_data as any)?.name) {
          regionName = (prop.area_data as any).name;
        } else if ((prop.area as any)?.name) {
          regionName = (prop.area as any).name;
        } else if (typeof prop.area === 'string') {
          regionName = prop.area;
        } else if (typeof prop.area_data === 'string') {
          regionName = prop.area_data;
        }

        const addedAtRaw = (prop.added_at || prop.approved_at || prop.created_at || prop.submitted_at) as string | undefined;

        const transformedProperty: Property = {
          id: (prop.id || '') as string,
          name: (prop.name || '') as string,
          owner: ownerName,
          ownerType: ownerTypeMap[ownerUserType] || 'مالك',
          region: regionName,
          views: (prop.views || 0) as number,
          visitors: (prop.visitors || 0) as number,
          addedDate: addedAtRaw
            ? new Date(addedAtRaw).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '',
          deletedDate: prop.deleted_at
            ? new Date(prop.deleted_at as string).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })
            : undefined,
          submitted_at: prop.submitted_at,
          approved_at: prop.approved_at,
          rejected_at: prop.rejected_at,
          address: (prop.address || '') as string,
          contactNumber: (prop.contact || '') as string,
          currentPrice: prop.display_price ? parseFloat(prop.display_price as string) : (prop.price ? parseFloat(prop.price as string) : 0),
          originalPrice: prop.original_price ? parseFloat(prop.original_price as string) : undefined,
          discountPercentage: (prop.discount || 0) as number,
          rooms: (prop.rooms || 0) as number,
          beds: (prop.beds || 0) as number,
          bathrooms: (prop.bathrooms || 0) as number,
          area: (prop.size || 0) as number,
          floor: (prop.floor || 0) as number,
          type: (prop.usage_type_ar || prop.usage_type || '') as string,
          furnished: (prop.furnished ?? false) as boolean,
          featured: (prop.featured ?? false) as boolean,
          status: ((prop.status as "approved" | "rejected" | "pending") || 'approved') as "approved" | "rejected" | "pending",
          latitude: prop.latitude ? parseFloat(prop.latitude as string) : 0,
          longitude: prop.longitude ? parseFloat(prop.longitude as string) : 0,
          description: (prop.description || '') as string,
          approvalNotes: (prop.approval_notes || '') as string,
          amenities: (prop.amenities || []) as Array<{ id: number; name: string; icon: string; description?: string }>,
          images: (prop.images || []) as Array<{ id: number; image: string; order: number }>,
          videos: (prop.videos || []) as Array<{ id: number; video: string; order: number }>,
        };
      
        if (transformedProperty.images && transformedProperty.images.length > 0) {
          console.log(`[Debug] Property "${transformedProperty.name}" has ${transformedProperty.images.length} images:`, transformedProperty.images);
        }
        if (transformedProperty.videos && transformedProperty.videos.length > 0) {
          console.log(`[Debug] Property "${transformedProperty.name}" has ${transformedProperty.videos.length} videos:`, transformedProperty.videos);
        }
      
        return transformedProperty;
      };

      // معالجة البيانات المرسلة من API
      const approvedData = Array.isArray(approvedRes.data) 
        ? approvedRes.data.filter((p: Record<string, unknown>) => p.status === 'approved')
        : (approvedRes.data?.results || []).filter((p: Record<string, unknown>) => p.status === 'approved');
      
      const rejectedData = Array.isArray(rejectedRes.data) 
        ? rejectedRes.data 
        : (rejectedRes.data?.results || []);
      
      const pendingData = Array.isArray(pendingRes.data) 
        ? pendingRes.data 
        : (pendingRes.data?.results || []);

      const deletedData = Array.isArray(deletedRes.data)
        ? deletedRes.data
        : (deletedRes.data?.results || []);

      setApprovedProperties(approvedData.map(transformProperty));
      setRejectedProperties(rejectedData.map(transformProperty));
      setPendingProperties(pendingData.map(transformProperty));
      setDeletedProperties(deletedData.map(transformProperty));
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('فشل في جلب بيانات العقارات');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProperty = (id: string) => {
    // البحث في جميع القوائم عن العقار
    const allProperties = [...approvedProperties, ...rejectedProperties, ...pendingProperties, ...deletedProperties];
    const property = allProperties.find(p => p.id === id);
    
    if (property) {
      // تحويل Property إلى PropertyDetails باستخدام البيانات المتاحة
      const details: PropertyDetails = {
        id: property.id || '',
        name: property.name || '',
        region: property.region || '',
        address: property.address || '',
        contactNumber: property.contactNumber || '',
        currentPrice: property.currentPrice || 0,
        originalPrice: property.originalPrice,
        discountPercentage: property.discountPercentage || 0,
        rooms: property.rooms || 0,
        beds: property.beds || 0,
        bathrooms: property.bathrooms || 0,
        area: property.area || 0,
        floor: property.floor || 0,
        type: property.type || '',
        furnished: property.furnished || false,
        featured: property.featured || false,
        status: property.status as "approved" | "rejected" | "pending" || 'approved',
        latitude: property.latitude || 0,
        longitude: property.longitude || 0,
        description: property.description || '',
        addedDate: property.addedDate || '',
        deletedDate: property.deletedDate,
        submitted_at: property.submitted_at,
        approved_at: property.approved_at,
        rejected_at: property.rejected_at,
        approvalNotes: property.approvalNotes,
        views: property.views || 0,
        visitors: property.visitors || 0,
        amenities: property.amenities || [],
        images: property.images || [],
        videos: property.videos || [],
      };
      setSelectedProperty(details);
      setDialogOpen(true);
    } else {
      console.error('Property not found:', id);
    }
  };

  if (loading) {
    return (
      <div className="card-glow rounded-xl bg-card p-4 lg:p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">📋 قوائم حالة العقارات</h3>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-muted-foreground text-sm">جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-glow rounded-xl bg-card p-4 lg:p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">📋 قوائم حالة العقارات</h3>
        <div className="text-center py-8">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-glow rounded-xl bg-card p-4 lg:p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">📋 قوائم حالة العقارات</h3>
      
      <Tabs defaultValue="approved" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span className="hidden sm:inline">موافق عليها</span>
            <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">{approvedProperties.length}</span>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-600" />
            <span className="hidden sm:inline">مرفوضة</span>
            <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">{rejectedProperties.length}</span>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="hidden sm:inline">معلّقة</span>
            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">{pendingProperties.length}</span>
          </TabsTrigger>
          <TabsTrigger value="deleted" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4 text-gray-600" />
            <span className="hidden sm:inline">محذوفة</span>
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">{deletedProperties.length}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="approved">
          <PropertyTable properties={approvedProperties} status="approved" onViewProperty={handleViewProperty} />
        </TabsContent>
        <TabsContent value="rejected">
          <PropertyTable properties={rejectedProperties} status="rejected" onViewProperty={handleViewProperty} />
        </TabsContent>
        <TabsContent value="pending">
          <PropertyTable properties={pendingProperties} status="pending" onViewProperty={handleViewProperty} />
        </TabsContent>
        <TabsContent value="deleted">
          <PropertyTable properties={deletedProperties} status="deleted" onViewProperty={handleViewProperty} />
        </TabsContent>
      </Tabs>

      <PropertyDetailsDialog 
        property={selectedProperty} 
        open={dialogOpen}
        isClosing={isClosingDialog}
        onOpenChange={(open) => {
          if (!open && successMessage) {
            // عند إغلاق النافذة، ابدأ حركة الإغلاق بسلاسة
            setIsClosingDialog(true);
            
            // انتظر 500ms لاكتمال حركة الإغلاق
            setTimeout(() => {
              setDialogOpen(false);
              setIsClosingDialog(false);
              
              // بعد إغلاق النافذة، أعد تحميل البيانات
              setTimeout(() => {
                fetchProperties();
              }, 500);
            }, 500);
          } else {
            setDialogOpen(open);
          }
        }}
        onPropertyStatusChanged={handlePropertyStatusChanged}
      />

      {/* Success Modal - رسالة النجاح الاحترافية */}
      {successMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            @keyframes zoomIn {
              from {
                opacity: 0;
                transform: scale(0.5);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            @keyframes checkmarkDraw {
              from {
                stroke-dasharray: 100;
                stroke-dashoffset: 100;
              }
              to {
                stroke-dasharray: 100;
                stroke-dashoffset: 0;
              }
            }
            @keyframes bounce {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.1);
              }
            }
            @keyframes confetti-fall {
              0% {
                transform: translateY(-10px) rotate(0deg);
                opacity: 1;
              }
              100% {
                transform: translateY(calc(100vh + 100px)) rotate(360deg);
                opacity: 0;
              }
            }
            .success-backdrop {
              animation: fadeIn 0.5s ease-out forwards;
            }
            .success-card {
              animation: zoomIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
            .success-icon-circle {
              animation: bounce 0.6s ease-out 0.3s both;
            }
            .checkmark {
              animation: checkmarkDraw 0.6s ease-out 0.4s forwards;
            }
            .confetti {
              animation: confetti-fall linear forwards;
            }
          `}</style>
          
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 success-backdrop" />
          
          {/* Confetti pieces */}
          {successType === 'approve' && Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="absolute pointer-events-none confetti"
              style={{
                left: Math.random() * 100 + '%',
                top: '-10px',
                width: '8px',
                height: '8px',
                backgroundColor: ['#10b981', '#059669', '#047857', '#34d399', '#6ee7b7'][Math.floor(Math.random() * 5)],
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                animationDuration: (2 + Math.random() * 1) + 's',
                animationDelay: (Math.random() * 0.3) + 's',
              }}
            />
          ))}
          
          {/* Success Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full success-card z-10">
            {/* Icon Circle */}
            <div className={`mx-auto mb-6 success-icon-circle ${
              successType === 'approve' ? 'bg-emerald-100' : 'bg-red-100'
            } rounded-full p-6 w-fit`}>
              {successType === 'approve' ? (
                <svg 
                  className="w-12 h-12 text-emerald-600 checkmark" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  stroke="currentColor" 
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg 
                  className="w-12 h-12 text-red-600" 
                  viewBox="0 0 24 24" 
                  fill="none"
                  stroke="currentColor" 
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )}
            </div>
            
            {/* Title */}
            <h2 className={`text-2xl font-bold text-center mb-2 ${
              successType === 'approve' ? 'text-emerald-900' : 'text-red-900'
            }`}>
              {successType === 'approve' ? 'تم الموافقة بنجاح!' : 'تم الرفض بنجاح'}
            </h2>
            
            {/* Message */}
            <p className={`text-center text-sm ${
              successType === 'approve' ? 'text-emerald-700' : 'text-red-700'
            } mb-6`}>
              {successMessage}
            </p>
            
            {/* Success Details */}
            <div className={`text-center py-4 px-4 rounded-lg mb-6 ${
              successType === 'approve' 
                ? 'bg-emerald-50 border border-emerald-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`${
                successType === 'approve' ? 'text-emerald-600' : 'text-red-600'
              } text-xs font-medium`}>
                {successType === 'approve' 
                  ? '✓ تم تحديث حالة العقار إلى موافق عليه' 
                  : '✓ تم تحديث حالة العقار إلى مرفوض'}
              </p>
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => {
                setSuccessMessage(null);
                setSuccessType(null);
              }}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg ${
                successType === 'approve'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                  : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
              }`}
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
