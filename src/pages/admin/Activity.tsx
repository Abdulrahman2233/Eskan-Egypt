import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AreaChart } from "@/components/dashboard/AreaChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { PropertiesStatusList } from "@/components/dashboard/PropertiesStatusList";
import { Activity as ActivityIcon, Eye, MessageSquare, Building2, Users } from "lucide-react";

const dailyActivityData = [
  { name: "السبت", value: 120 },
  { name: "الأحد", value: 98 },
  { name: "الاثنين", value: 150 },
  { name: "الثلاثاء", value: 130 },
  { name: "الأربعاء", value: 180 },
  { name: "الخميس", value: 145 },
  { name: "الجمعة", value: 85 },
];

const ActivityPage = () => {
  return (
    <DashboardLayout title="سجل النشاط">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
        <StatCard title="إجمالي الأنشطة" value="1,456" change={{ value: 15, trend: "up" }} icon={ActivityIcon} />
        <StatCard title="المشاهدات اليوم" value="234" change={{ value: 8, trend: "up" }} icon={Eye} />
        <StatCard title="الرسائل الجديدة" value="24" change={{ value: 5, trend: "down" }} icon={MessageSquare} />
        <StatCard title="عقارات جديدة" value="12" change={{ value: 20, trend: "up" }} icon={Building2} />
        <StatCard title="مستخدمين جدد" value="8" change={{ value: 10, trend: "up" }} icon={Users} />
      </div>

      {/* Activity Chart */}
      <AreaChart title="🕐 الأنشطة اليومية" subtitle="رسم بياني للأنشطة خلال الأسبوع" data={dailyActivityData} />

      {/* Properties Status List */}
      <PropertiesStatusList />
    </DashboardLayout>
  );
};

export default ActivityPage;
