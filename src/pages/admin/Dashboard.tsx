import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { VisitorsStatsChart } from "@/components/dashboard/VisitorsStatsChart";
import { DeviceStatsCard } from "@/components/dashboard/DeviceStatsCard";
import { AdvancedStatCard } from "@/components/dashboard/AdvancedStatCard";
import { AreaChart } from "@/components/dashboard/AreaChart";
import { AdvancedDonutChart } from "@/components/dashboard/AdvancedDonutChart";
import { Building2, Users, Mail, CheckCircle, Clock, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchDashboardSummary, fetchPropertyDistributionByUsage, fetchPropertyStatusDistribution } from "@/api";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [propertyDistribution, setPropertyDistribution] = useState<any[]>([]);
  const [propertyStatusData, setPropertyStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [summaryData, distributionData, statusData] = await Promise.all([
          fetchDashboardSummary(),
          fetchPropertyDistributionByUsage(),
          fetchPropertyStatusDistribution()
        ]);
        setDashboardData(summaryData);
        setPropertyDistribution(distributionData);
        setPropertyStatusData(statusData);
        setError(null);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("فشل تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const propertiesStats = dashboardData?.properties || {};
  const usersStats = dashboardData?.users || {};
  const messagesStats = dashboardData?.contact_messages || {};
  const dailyActivity = dashboardData?.daily_activity || [];

  const dailyActivityData = dailyActivity
    .slice(-7)
    .map((item: any) => ({
      name: new Date(item.date).toLocaleDateString("ar-EG", { month: "short", day: "numeric" }),
      value: item.count || 0,
    }));

  return (
    <DashboardLayout title="لوحة التحكم الرئيسية">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Key Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <AdvancedStatCard 
          title="إجمالي العقارات" 
          value={loading ? "..." : (propertiesStats.total || 0).toString()} 
          subtitle="كل العقارات"
          change={{ value: 0, trend: "up" }} 
          icon={Building2} 
          color="blue"
        />
        <AdvancedStatCard 
          title="قيد المراجعة" 
          value={loading ? "..." : (propertiesStats.pending || 0).toString()} 
          subtitle="بانتظار الموافقة"
          change={{ value: 0, trend: "up" }} 
          icon={Clock} 
          color="orange"
        />
        <AdvancedStatCard 
          title="الزوار اليوم" 
          value={loading ? "..." : (usersStats.visitors_today || 0).toString()} 
          subtitle="زوار الموقع اليوم"
          change={{ value: 0, trend: "up" }} 
          icon={Users} 
          color="green"
        />
        <AdvancedStatCard 
          title="الرسائل اليوم" 
          value={loading ? "..." : (messagesStats.today || 0).toString()} 
          subtitle="رسائل التواصل"
          change={{ value: 0, trend: "up" }} 
          icon={Mail} 
          color="purple"
        />
      </div>

      {/* Visitors Statistics Chart */}
      <VisitorsStatsChart />

      {/* Activity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <AreaChart 
          title="📊 النشاط اليومي" 
          subtitle="آخر 7 أيام" 
          data={dailyActivityData} 
        />
        <DeviceStatsCard />
      </div>

      {/* Donut Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <AdvancedDonutChart
          title="توزيع العقارات"
          subtitle="حسب نوع الاستخدام"
          data={propertyDistribution}
          centerValue={propertyDistribution.reduce((sum: number, item: any) => sum + item.value, 0).toString()}
          centerLabel="إجمالي العقارات"
        />
        <AdvancedDonutChart
          title="حالة العقارات"
          subtitle="الحالات الحالية"
          data={propertyStatusData}
          centerValue={propertyStatusData.reduce((sum: number, item: any) => sum + item.value, 0).toString()}
          centerLabel="إجمالي العقارات"
        />
      </div>

    </DashboardLayout>
  );
};

export default AdminDashboard;
