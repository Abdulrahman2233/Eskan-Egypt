import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AreaChart } from '@/components/dashboard/AreaChart';
import { PropertiesWithDiscounts } from '@/components/dashboard/PropertiesWithDiscounts';
import { Percent, DollarSign, TrendingUp, Clock } from 'lucide-react';
import API from '@/api';
import { AlertCircle } from 'lucide-react';

interface AnalyticsData {
  offers: {
    active: number;
    total: number;
    avg_discount: number;
  };
}

const salesImpactData = [
  { name: "يناير", value: 80000, value2: 95000 },
  { name: "فبراير", value: 85000, value2: 110000 },
  { name: "مارس", value: 90000, value2: 125000 },
  { name: "أبريل", value: 95000, value2: 140000 },
  { name: "مايو", value: 88000, value2: 135000 },
  { name: "يونيو", value: 100000, value2: 155000 },
];

const Offers = () => {
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
        setError('فشل تحميل بيانات العروض');
        console.error('Offers error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="العروض والخصومات">
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
      <DashboardLayout title="العروض والخصومات">
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
    <DashboardLayout title="العروض والخصومات">
      {/* Sales Impact Chart */}
      <AreaChart 
        title="📈 تأثير الخصومات على المبيعات" 
        subtitle="مقارنة المبيعات بدون خصومات (الأزرق) ومع الخصومات (الأخضر)" 
        data={salesImpactData} 
      />

      {/* Properties with Discounts */}
      <PropertiesWithDiscounts />
    </DashboardLayout>
  );
};

export default Offers;
