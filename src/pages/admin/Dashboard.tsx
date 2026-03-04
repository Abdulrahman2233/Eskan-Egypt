import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { VisitorsStatsChart } from "@/components/dashboard/VisitorsStatsChart";
import { DeviceStatsCard } from "@/components/dashboard/DeviceStatsCard";
import { AdvancedDonutChart } from "@/components/dashboard/AdvancedDonutChart";
import { DashboardQuickInsights } from "@/components/dashboard/DashboardQuickInsights";
import { TopOwnersChart } from "@/components/dashboard/TopOwnersChart";
import { ApprovalPipelineChart } from "@/components/dashboard/ApprovalPipelineChart";
import { PropertyTypeRevenueChart } from "@/components/dashboard/PropertyTypeRevenueChart";
import { useEffect, useState } from "react";
import { fetchPropertyDistributionByUsage, fetchPropertyStatusDistribution } from "@/api";

const AdminDashboard = () => {
  const [propertyDistribution, setPropertyDistribution] = useState<any[]>([]);
  const [propertyStatusData, setPropertyStatusData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const [distributionData, statusData] = await Promise.all([
          fetchPropertyDistributionByUsage(),
          fetchPropertyStatusDistribution()
        ]);
        setPropertyDistribution(distributionData);
        setPropertyStatusData(statusData);
        setError(null);
      } catch (err) {
        console.error("Error loading chart data:", err);
        setError("فشل تحميل بعض البيانات");
      }
    };
    loadChartData();
  }, []);

  return (
    <DashboardLayout title="لوحة التحكم الرئيسية">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center gap-2">
          <span className="text-red-500">⚠️</span>
          {error}
        </div>
      )}

      {/* ─── Quick Insights with Sparklines ─── */}
      <DashboardQuickInsights />

      {/* ─── Property Type Revenue (Composed Chart) ─── */}
      <PropertyTypeRevenueChart />

      {/* ─── Approval Pipeline & Top Owners ─── */}
      <div className="grid grid-cols-1 gap-4 lg:gap-6 xl:grid-cols-2">
        <ApprovalPipelineChart />
        <TopOwnersChart />
      </div>

      {/* ─── Visitors Statistics ─── */}
      <VisitorsStatsChart />

      {/* ─── Device Stats ─── */}
      <DeviceStatsCard />

      {/* ─── Donut Charts ─── */}
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
