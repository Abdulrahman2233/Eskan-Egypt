import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DonutChart } from '@/components/dashboard/DonutChart';
import { TopProperties } from '@/components/dashboard/TopProperties';
import { RegionHeatmap } from '@/components/dashboard/RegionHeatmap';
import { PropertyStatusList } from '@/components/dashboard/PropertyStatusList';
import { Building2, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import API from '@/api';

interface AreaData {
  name: string;
  property_count: number;
  avg_price: number;
  total_value: number;
}

interface TopProperty {
  id: string;
  name: string;
  area: string;
  price: number;
  rooms: number;
  images_count: number;
  featured: boolean;
}

interface RoomDistribution {
  name: string;
  value: number;
  color: string;
}

interface PropertyType {
  name: string;
  value: number;
  color?: string;
  avg_price?: number;
}

interface AnalyticsData {
  properties: {
    total: number;
    approved: number;
    pending: number;
    draft: number;
    rejected: number;
    total_value: number;
    avg_price: number;
  };
  areas: AreaData[];
  top_properties?: TopProperty[];
  rooms_distribution?: RoomDistribution[];
}

const defaultRoomData: RoomDistribution[] = [
  { name: "غرفة", value: 120, color: "#0ea5e9" },
  { name: "غرفتين", value: 280, color: "#14b8a6" },
  { name: "3 غرف", value: 350, color: "#22c55e" },
  { name: "4+ غرف", value: 200, color: "#f59e0b" },
];

const defaultPropertyTypeData: PropertyType[] = [
  { name: "طلاب", value: 0, color: "#0ea5e9" },
  { name: "عائلات", value: 0, color: "#14b8a6" },
  { name: "استوديو", value: 0, color: "#22c55e" },
  { name: "مصيفين", value: 0, color: "#f59e0b" },
  { name: "حجز يومي", value: 0, color: "#8b5cf6" },
];

const PropertiesAdmin = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>(defaultPropertyTypeData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [summaryResponse, typesResponse] = await Promise.all([
          API.get('/analytics/summary/'),
          API.get('/analytics/property_types/')
        ]);
        
        setData(summaryResponse.data);
        
        // معالجة بيانات الأنواع وإضافة ألوان
        const colors = ["#0ea5e9", "#14b8a6", "#22c55e", "#f59e0b", "#8b5cf6"];
        const typesWithColors = typesResponse.data.map((type: any, index: number) => ({
          ...type,
          color: type.color || colors[index % colors.length]
        }));
        setPropertyTypes(typesWithColors);
        setError(null);
      } catch (err) {
        setError('فشل تحميل بيانات العقارات');
        console.error('Properties error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="تحليل العقارات">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">جاري تحميل البيانات...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout title="تحليل العقارات">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <p className="text-destructive">{error || 'حدث خطأ ما'}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const approvalData = [
    { name: "موافق", value: data.properties.approved, color: "#22c55e" },
    { name: "معلق", value: data.properties.pending, color: "#f59e0b" },
  ];

  return (
    <DashboardLayout title="تحليل العقارات">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm p-4 border border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي العقارات</p>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">{data.properties.total.toLocaleString()}</p>

            </div>
            <div className="p-2 bg-blue-200 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm p-4 border border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">العقارات المعتمدة</p>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">{data.properties.approved.toLocaleString()}</p>

            </div>
            <div className="p-2 bg-green-200 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-sm p-4 border border-yellow-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">العقارات المعلقة</p>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">{data.properties.pending.toLocaleString()}</p>

            </div>
            <div className="p-2 bg-yellow-200 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-sm p-4 border border-red-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">العقارات المرفوضة</p>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2">{data.properties.rejected.toLocaleString()}</p>

            </div>
            <div className="p-2 bg-red-200 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Property Status List - قوائم حالة العقارات */}
      <PropertyStatusList />

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <DonutChart
          title="✅ نسبة الموافقات مقابل المعلّق"
          subtitle="مقارنة العقارات المعتمدة بالمعلّقة"
          data={approvalData}
          centerValue={(data.properties.approved + data.properties.pending).toString()}
          centerLabel="إجمالي"
        />
        <DonutChart title="🏢 أنواع العقارات" subtitle="توزيع حسب النوع" data={propertyTypes} centerValue={data.properties.total.toString()} centerLabel="عقار" />
      </div>

      {/* Additional Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <TopProperties />
        <RegionHeatmap />
      </div>
    </DashboardLayout>
  );
};

export default PropertiesAdmin;
