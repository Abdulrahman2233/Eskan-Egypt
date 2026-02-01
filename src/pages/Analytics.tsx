import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AreaChart } from '@/components/dashboard/AreaChart';
import { BarChart } from '@/components/dashboard/BarChart';
import { DonutChart } from '@/components/dashboard/DonutChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { TopProperties } from '@/components/dashboard/TopProperties';
import { RegionHeatmap } from '@/components/dashboard/RegionHeatmap';
import { OffersTable } from '@/components/dashboard/OffersTable';
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Eye,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import API from '@/api';

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
  users: {
    total: number;
    new_today: number;
    by_type: Record<string, number>;
    active_users: number;
  };
  areas: Array<{
    name: string;
    property_count: number;
    avg_price: number;
    total_value: number;
  }>;
  property_types: Array<{
    name: string;
    value: number;
    avg_price: number;
  }>;
  offers: {
    active: number;
    total: number;
    avg_discount: number;
  };
  contact_messages: {
    total: number;
    today: number;
    avg_per_day: number;
  };
  price_distribution: Array<{
    label: string;
    value: number;
  }>;
  recent_activities: Array<{
    id: number;
    user: string;
    action: string;
    object_name: string;
    timestamp: string;
    description: string;
  }>;
  top_properties: Array<{
    id: string;
    name: string;
    area: string;
    price: number;
    rooms: number;
    images_count: number;
    featured: boolean;
  }>;
  daily_activity: Array<{
    date: string;
    count: number;
  }>;
}

const revenueData = [
  { name: "يناير", value: 40000, value2: 24000 },
  { name: "فبراير", value: 30000, value2: 13980 },
  { name: "مارس", value: 20000, value2: 98000 },
  { name: "أبريل", value: 30000, value2: 39800 },
  { name: "مايو", value: 20000, value2: 48000 },
  { name: "يونيو", value: 30000, value2: 40000 },
];

const propertyTypeData = [
  { name: "فلل", value: 340, color: "#0ea5e9" },
  { name: "شقق", value: 220, color: "#14b8a6" },
  { name: "أراضي", value: 180, color: "#f59e0b" },
  { name: "دوبلكس", value: 120, color: "#ef4444" },
  { name: "أخرى", value: 74, color: "#8b5cf6" },
];

export const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await API.get('/analytics/summary/');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('فشل تحميل بيانات التحليلات');
        console.error('Analytics error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="لوحة التحكم">
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
      <DashboardLayout title="لوحة التحكم">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
            <p className="text-destructive">{error || 'حدث خطأ ما'}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="لوحة التحكم">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
        <StatCard 
          title="إجمالي العقارات" 
          value={data.properties.total.toLocaleString()}
          change={{ value: 12, trend: "up" }} 
          icon={Building2} 
        />
        <StatCard 
          title="المستخدمين النشطين" 
          value={data.users.total.toLocaleString()}
          change={{ value: 8, trend: "up" }} 
          icon={Users} 
        />
        <StatCard 
          title="إجمالي الإيرادات" 
          value={`${(data.properties.total_value / 1000).toFixed(0)} ألف`}
          change={{ value: 23, trend: "up" }} 
          icon={DollarSign} 
        />
        <StatCard 
          title="رسائل جديدة" 
          value={data.contact_messages.today.toString()}
          change={{ value: 5, trend: "down" }} 
          icon={MessageSquare} 
        />
        <StatCard 
          title="نسبة الاعتماد" 
          value={`${((data.properties.approved / data.properties.total) * 100).toFixed(0)}%`}
          change={{ value: 3, trend: "up" }} 
          icon={CheckCircle2} 
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <AreaChart 
          title="📈 تحليل الإيرادات" 
          subtitle="مقارنة بالعام السابق" 
          data={revenueData} 
        />
        <DonutChart 
          title="🏢 أنواع العقارات" 
          subtitle="توزيع حسب النوع" 
          data={propertyTypeData} 
          centerValue={data.properties.total.toString()} 
          centerLabel="عقار" 
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <BarChart 
          title="🏆 العقارات بحسب المناطق" 
          subtitle="الأكثر طلباً" 
          data={data.areas.map(area => ({
            name: area.name,
            value: area.property_count
          }))} 
        />
        <TopProperties />
        <RegionHeatmap />
      </div>

      {/* Offers Table */}
      <OffersTable />

      {/* Daily Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <ActivityFeed />
        <AreaChart 
          title="🕐 النشاط اليومي" 
          subtitle="خلال الأسبوع" 
          data={data.daily_activity.map(d => ({
            name: d.date,
            value: d.count
          }))} 
        />
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
