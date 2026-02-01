import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import API from '@/api';
import { AlertCircle, Eye, Users } from 'lucide-react';

interface PropertyStatus {
  id: string;
  name: string;
  status: 'approved' | 'pending' | 'rejected' | 'draft';
  views: number;
  visitors: number;
  price: number;
  area: string;
}

const statusConfig = {
  approved: { label: 'موافق عليه', className: 'bg-green-100 text-green-700 border-green-200' },
  pending: { label: 'معلق', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  rejected: { label: 'مرفوض', className: 'bg-red-100 text-red-700 border-red-200' },
  draft: { label: 'مسودة', className: 'bg-gray-100 text-gray-700 border-gray-200' },
};

export function PropertiesStatusList() {
  const [properties, setProperties] = useState<PropertyStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // جلب جميع العقارات بغض النظر عن الحالة
        const response = await API.get('/properties/');
        
        // معالجة البيانات
        const data = Array.isArray(response.data) ? response.data : response.data.results || [];
        
        // استخدام البيانات الحقيقية من الـ API
        const enrichedData = data.map((property: any) => ({
          id: property.id,
          name: property.name,
          status: property.status || 'draft',
          views: property.views || 0,
          visitors: property.visitors || 0,
          price: property.price,
          area: property.area_data?.name || property.area || 'غير محدد',
        }));
        
        setProperties(enrichedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('فشل تحميل بيانات العقارات');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="card-glow rounded-xl bg-card border border-border overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-border">
          <h3 className="text-base lg:text-lg font-semibold">📊 جميع العقارات والمشاهدات</h3>
        </div>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-glow rounded-xl bg-card border border-border overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-border">
          <h3 className="text-base lg:text-lg font-semibold">📊 جميع العقارات والمشاهدات</h3>
        </div>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const approvedCount = properties.filter(p => p.status === 'approved').length;
  const pendingCount = properties.filter(p => p.status === 'pending').length;
  const rejectedCount = properties.filter(p => p.status === 'rejected').length;
  const draftCount = properties.filter(p => p.status === 'draft').length;
  const totalViews = properties.reduce((sum, p) => sum + p.views, 0);
  const totalVisitors = properties.reduce((sum, p) => sum + p.visitors, 0);

  return (
    <div className="card-glow rounded-xl bg-card border border-border overflow-hidden">
      <div className="p-4 lg:p-6 border-b border-border">
        <h3 className="text-base lg:text-lg font-semibold mb-4">📊 جميع العقارات والمشاهدات</h3>
        
        {/* Status Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-xs text-muted-foreground mb-1">موافق عليه</p>
            <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-xs text-muted-foreground mb-1">معلق</p>
            <p className="text-2xl font-bold text-blue-600">{pendingCount}</p>
          </div>
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-xs text-muted-foreground mb-1">مرفوض</p>
            <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-xs text-muted-foreground mb-1">مسودة</p>
            <p className="text-2xl font-bold text-gray-600">{draftCount}</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-muted-foreground mb-1">الإجمالي</p>
            <p className="text-2xl font-bold text-primary">{properties.length}</p>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden p-4 space-y-3">
        {properties.map((property) => (
          <div key={property.id} className="p-4 rounded-lg bg-secondary/30 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium mb-1">{property.name}</h4>
                <p className="text-xs text-muted-foreground">{property.area}</p>
              </div>
              <Badge 
                variant="outline" 
                className={cn("border text-xs", statusConfig[property.status].className)}
              >
                {statusConfig[property.status].label}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">المشاهدات</p>
                  <p className="font-semibold">{property.views}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">الزيارات</p>
                  <p className="font-semibold">{property.visitors}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">السعر</p>
              <p className="font-semibold text-lg">{Number(property.price).toLocaleString('ar-SA')} ج.م</p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground w-2/5">اسم العقار</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">المنطقة</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">الحالة</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">المشاهدات</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">الزيارات</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">السعر</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4 font-medium">{property.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{property.area}</td>
                <td className="px-6 py-4">
                  <Badge 
                    variant="outline" 
                    className={cn("border text-xs", statusConfig[property.status].className)}
                  >
                    {statusConfig[property.status].label}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold">{property.views}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="font-semibold">{property.visitors}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-primary">
                  {Number(property.price).toLocaleString('ar-SA')} ج.م
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 lg:p-6 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">إجمالي المشاهدات</p>
          <p className="text-2xl font-bold flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            {totalViews.toLocaleString('ar-SA')}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">إجمالي الزيارات</p>
          <p className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            {totalVisitors.toLocaleString('ar-SA')}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">متوسط المشاهدات</p>
          <p className="text-2xl font-bold">
            {Math.round(totalViews / properties.length || 0)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">متوسط الزيارات</p>
          <p className="text-2xl font-bold">
            {Math.round(totalVisitors / properties.length || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
