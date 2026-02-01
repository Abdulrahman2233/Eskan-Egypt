import React, { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import API from '@/api';
import { AlertCircle, Percent } from 'lucide-react';

interface PropertyWithDiscount {
  id: string;
  name: string;
  price: number;
  discount: number;
  original_price?: number;
}

export function PropertiesWithDiscounts() {
  const [properties, setProperties] = useState<PropertyWithDiscount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await API.get('/properties/');
        
        // فلترة العقارات التي بها خصم أكثر من 0
        const filteredData = Array.isArray(response.data) 
          ? response.data.filter((property: any) => property.discount > 0)
          : response.data.results?.filter((property: any) => property.discount > 0) || [];
        
        setProperties(filteredData);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties with discounts:', err);
        setError('فشل تحميل العقارات الخاصة بها خصم');
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
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-primary" />
            <h3 className="text-base lg:text-lg font-semibold">العقارات ذات الخصومات</h3>
          </div>
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
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-primary" />
            <h3 className="text-base lg:text-lg font-semibold">العقارات ذات الخصومات</h3>
          </div>
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

  if (properties.length === 0) {
    return (
      <div className="card-glow rounded-xl bg-card border border-border overflow-hidden">
        <div className="p-4 lg:p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-primary" />
            <h3 className="text-base lg:text-lg font-semibold">العقارات ذات الخصومات</h3>
          </div>
        </div>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <p className="text-muted-foreground">لا توجد عقارات بها خصومات في الوقت الحالي</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-glow rounded-xl bg-card border border-border overflow-hidden">
      <div className="p-4 lg:p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-primary" />
            <h3 className="text-base lg:text-lg font-semibold">العقارات ذات الخصومات</h3>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {properties.length} عقار
          </Badge>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden p-4 space-y-3">
        {properties.map((property) => (
          <div key={property.id} className="p-4 rounded-lg bg-secondary/30 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium mb-1">{property.name}</h4>
                <p className="text-xs text-muted-foreground">معرّف: {property.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">السعر الحالي</p>
                <p className="font-semibold text-lg">{Number(property.price).toLocaleString('ar-SA')} ج.م</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">السعر الأصلي</p>
                <p className="text-sm line-through text-muted-foreground">
                  {Number(property.original_price || property.price).toLocaleString('ar-SA')} ج.م
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 border-0 text-white">
                <Percent className="w-3 h-3 ml-1" />
                خصم {property.discount}%
              </Badge>
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
              <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">السعر الحالي</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">السعر الأصلي</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">نسبة الخصم</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">التوفير</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => {
              const savings = (Number(property.original_price || property.price) - Number(property.price));
              return (
                <tr key={property.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 font-medium">{property.name}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-primary">
                      {Number(property.price).toLocaleString('ar-SA')} ج.م
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-muted-foreground line-through">
                      {Number(property.original_price || property.price).toLocaleString('ar-SA')} ج.م
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={cn(
                      "border-0 text-white font-semibold",
                      property.discount >= 20 ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gradient-to-r from-blue-500 to-cyan-500"
                    )}>
                      <Percent className="w-3 h-3 ml-1" />
                      {property.discount}%
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-green-600">
                      {savings.toLocaleString('ar-SA')} ج.م
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 lg:p-6 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">إجمالي العقارات</p>
          <p className="text-2xl font-bold">{properties.length}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">متوسط الخصم</p>
          <p className="text-2xl font-bold">
            {(properties.reduce((sum, p) => sum + p.discount, 0) / properties.length).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">أعلى خصم</p>
          <p className="text-2xl font-bold text-orange-600">
            {Math.max(...properties.map(p => p.discount))}%
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">إجمالي التوفير</p>
          <p className="text-lg font-bold text-green-600">
            {properties.reduce((sum, p) => sum + (Number(p.original_price || p.price) - Number(p.price)), 0).toLocaleString('ar-SA')} ج.م
          </p>
        </div>
      </div>
    </div>
  );
}
