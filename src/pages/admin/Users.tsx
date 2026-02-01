import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { AreaChart } from "@/components/dashboard/AreaChart";
import { DonutChart } from "@/components/dashboard/DonutChart";
import { RecentAccountsList } from "@/components/dashboard/RecentAccountsList";
import { Users as UsersIcon, Home, Users2, Building2, Trophy, MapPin, Briefcase, TrendingUp, Search, Filter } from "lucide-react";
import { fetchUserStatistics, fetchTopOwners } from "@/api";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const registrationData = [
  { name: "يناير", value: 120 },
  { name: "فبراير", value: 150 },
  { name: "مارس", value: 180 },
  { name: "أبريل", value: 220 },
  { name: "مايو", value: 190 },
  { name: "يونيو", value: 250 },
];

// سيتم تحديثها بالبيانات الحقيقية من الـ API
const getAccountTypeData = (byType: Record<string, number> | undefined) => {
  if (!byType) {
    return [
      { name: "ملاك", value: 0, color: "#10b981" },
      { name: "وسطاء", value: 0, color: "#3b82f6" },
      { name: "مكاتب", value: 0, color: "#ec4899" },
      { name: "مشرفين", value: 0, color: "#ef4444" },
    ];
  }

  return [
    { name: "ملاك", value: byType.landlord || 0, color: "#10b981" },
    { name: "وسطاء", value: byType.agent || 0, color: "#3b82f6" },
    { name: "مكاتب", value: byType.office || 0, color: "#ec4899" },
    { name: "مشرفين", value: byType.admin || 0, color: "#ef4444" },
  ];
};

interface UserStats {
  total: number;
  new_today: number;
  active_users: number;
  by_type?: Record<string, number>;
}

interface Owner {
  id: string;
  name: string;
  properties: number;
  avatar: string;
  user_type: string;
}

const TopOwnersSection = ({ title, icon: Icon, userType, color }: { 
  title: string; 
  icon: any; 
  userType: string;
  color: "blue" | "green" | "purple" | "pink" | "red" | "indigo";
}) => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    const loadOwners = async () => {
      try {
        const data = await fetchTopOwners(userType, 100);
        setOwners(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(`Failed to load ${userType}:`, error);
        setOwners([]);
      } finally {
        setLoading(false);
      }
    };

    loadOwners();
  }, [userType]);

  const colorClasses = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
    pink: "bg-pink-100 text-pink-700",
    red: "bg-red-100 text-red-700",
    indigo: "bg-indigo-100 text-indigo-700",
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filteredOwners = owners.filter((owner) => {
    if (!normalizedQuery) return true;
    return owner.name.toLowerCase().includes(normalizedQuery);
  });
  const visibleOwners = filteredOwners.slice(0, visibleCount);
  const canShowMore = visibleCount < filteredOwners.length;

  return (
    <div className="card-glow rounded-xl bg-card p-4 lg:p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base lg:text-lg font-semibold flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </h3>
        <span className="text-xs text-muted-foreground">{filteredOwners.length} {userType === 'landlord' ? 'مالك' : userType === 'agent' ? 'وسيط' : 'مكتب'}</span>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisibleCount(10);
            }}
            placeholder="ابحث بالاسم"
            className="pr-9"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => {
            setQuery("");
            setVisibleCount(10);
          }}
        >
          <Filter className="h-4 w-4 ml-2" />
          إعادة
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">جاري تحميل البيانات...</div>
      ) : filteredOwners.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">لا توجد بيانات حالياً</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">الاسم</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">عدد العقارات</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">الترتيب</th>
              </tr>
            </thead>
            <tbody>
              {visibleOwners.map((owner, index) => (
                <tr key={owner.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("h-10 w-10 rounded-full flex items-center justify-center text-white font-bold", colorClasses[color])}>
                        {owner.avatar}
                      </div>
                      <span className="font-medium text-sm">{owner.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      {owner.properties}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn("text-xs px-2 py-1 rounded-full font-bold inline-flex items-center justify-center w-8 h-8", colorClasses[color])}>
                      #{index + 1}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && filteredOwners.length > 0 && (
        <div className="mt-4 flex items-center justify-center">
          {canShowMore ? (
            <Button type="button" variant="outline" onClick={() => setVisibleCount((prev) => prev + 10)}>
              عرض المزيد
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
};

const UsersPage = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchUserStatistics();
        setStats(data);
      } catch (error) {
        console.error("Failed to load user statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // حساب عدد الملاك والوسطاء والمكاتب من البيانات المتاحة
  const ownerCount = stats?.by_type?.['landlord'] || 0;
  const brokerCount = stats?.by_type?.['agent'] || 0;
  const officeCount = stats?.by_type?.['office'] || 0;

  return (
    <DashboardLayout title="تحليل المستخدمين">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard 
          title="إجمالي المستخدمين" 
          value={stats?.total?.toString() || "0"} 
          change={{ value: 12, trend: "up" }} 
          icon={UsersIcon}
          color="blue"
          loading={loading}
        />
        <StatCard 
          title="عدد الملاك" 
          value={ownerCount?.toString() || "0"} 
          change={{ value: 8, trend: "up" }} 
          icon={Home}
          color="green"
          loading={loading}
        />
        <StatCard 
          title="عدد الوسطاء" 
          value={brokerCount?.toString() || "0"} 
          change={{ value: 15, trend: "up" }} 
          icon={Users2}
          color="purple"
          loading={loading}
        />
        <StatCard 
          title="عدد المكاتب" 
          value={officeCount?.toString() || "0"} 
          change={{ value: 5, trend: "up" }} 
          icon={Building2}
          color="orange"
          loading={loading}
        />
      </div>

      {/* Recent Accounts List */}
      <RecentAccountsList />

      {/* Top Owners, Agents, and Offices */}
      <div className="grid grid-cols-1 gap-4 lg:gap-6">
        <TopOwnersSection 
          title="🏆 أفضل المالكين" 
          icon={Home}
          userType="landlord"
          color="green"
        />
        <TopOwnersSection 
          title="💼 أفضل الوسطاء" 
          icon={Briefcase}
          userType="agent"
          color="blue"
        />
        <TopOwnersSection 
          title="🏢 أفضل المكاتب" 
          icon={Building2}
          userType="office"
          color="pink"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <AreaChart title="📅 التسجيلات الجديدة" subtitle="خلال الأشهر الماضية" data={registrationData} />
        <DonutChart title="👥 توزيع أنواع الحسابات" subtitle="ملاك، وسطاء، مكاتب، مشرفين" data={getAccountTypeData(stats?.by_type)} centerValue={stats?.total?.toString() || "0"} centerLabel="حساب" />
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;
