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

  useEffect(() => {
    fetchProperties();
  }, []);

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

        // الحصول على اسم المالك بشكل صحيح
        let ownerName = 'غير معروف';
        if (prop.owner?.user?.first_name) {
          ownerName = prop.owner.user.first_name;
        } else if (prop.owner?.name) {
          ownerName = prop.owner.name;
        } else if (prop.owner_name) {
          ownerName = prop.owner_name;
        }

        // الحصول على نوع المالك - استخدام الحقل المُرجع مباشرة من API
        const ownerUserType = prop.owner_type || 'landlord';

        // Debug log
        // console.log(`Property: ${prop.name}, Owner Type: ${ownerUserType}, Owner Data:`, prop.owner);

        // الحصول على المنطقة - يمكن أن تكون area أو area_data
        let regionName = 'غير معروف';
        if (prop.area_data?.name) {
          regionName = prop.area_data.name;
        } else if (prop.area?.name) {
          regionName = prop.area.name;
        } else if (typeof prop.area === 'string') {
          regionName = prop.area;
        } else if (typeof prop.area_data === 'string') {
          regionName = prop.area_data;
        }

        // ضمان القيم الافتراضية لجميع الحقول المطلوبة
        return {
          id: prop.id || '',
          name: prop.name || '',
          owner: ownerName,
          ownerType: ownerTypeMap[ownerUserType] || 'مالك',
          region: regionName,
          views: prop.views || 0,
          visitors: prop.visitors || 0,
          addedDate: prop.created_at
            ? new Date(prop.created_at).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })
            : (prop.submitted_at
              ? new Date(prop.submitted_at).toLocaleDateString('ar-SA', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''),
          deletedDate: prop.deleted_at
            ? new Date(prop.deleted_at).toLocaleDateString('ar-SA', {
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
          // بيانات إضافية
          address: prop.address || '',
          contactNumber: prop.contact || '',
          currentPrice: prop.price ? parseFloat(prop.price) : 0,
          originalPrice: prop.original_price ? parseFloat(prop.original_price) : undefined,
          discountPercentage: prop.discount || 0,
          rooms: prop.rooms || 0,
          beds: prop.beds || 0,
          bathrooms: prop.bathrooms || 0,
          area: prop.size || 0,
          floor: prop.floor || 0,
          type: prop.usage_type_ar || prop.usage_type || '',
          furnished: prop.furnished ?? false,
          featured: prop.featured ?? false,
          status: (prop.status as "approved" | "rejected" | "pending") || 'approved',
          latitude: prop.latitude ? parseFloat(prop.latitude) : 0,
          longitude: prop.longitude ? parseFloat(prop.longitude) : 0,
          description: prop.description || '',
          approvalNotes: prop.approval_notes || '',
        };
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
        onOpenChange={setDialogOpen}
        onStatusChange={() => {
          // إعادة تحميل البيانات بعد تغيير الحالة
          fetchProperties();
        }}
      />
    </div>
  );
}
