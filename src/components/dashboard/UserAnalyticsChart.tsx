import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Users, Loader, UserCheck, UserPlus, Building } from "lucide-react";
import { fetchUserStatistics } from "@/api";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-2xl">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-100 pb-2">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mt-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-500">{entry.name}:</span>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {entry.value?.toLocaleString("ar-EG") || 0}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface UserStats {
  total_users?: number;
  active_users?: number;
  new_users_this_month?: number;
  user_types?: Record<string, number>;
  monthly_registrations?: Array<{ month: string; count: number }>;
  [key: string]: any;
}

export function UserAnalyticsChart() {
  const [stats, setStats] = useState<UserStats>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await fetchUserStatistics();
      setStats(data || {});
    } catch {
      setStats({});
    } finally {
      setIsLoading(false);
    }
  };

  const userTypes = stats.user_types || {};
  const totalUsers = stats.total_users || 0;
  const monthlyData = stats.monthly_registrations || [];

  const typeData = Object.entries(userTypes).map(([type, count]) => ({
    name: getUserTypeLabel(type),
    count: count as number,
  }));

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white border border-gray-100 p-6 lg:p-8 shadow-sm">
        <div className="flex items-center justify-center h-80">
          <Loader className="w-6 h-6 animate-spin text-violet-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start gap-2.5 sm:gap-3 mb-5 sm:mb-6">
        <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-200">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h3 className="text-base sm:text-xl font-bold text-gray-900">تحليل المستخدمين</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">نظرة عامة على قاعدة المستخدمين</p>
        </div>
      </div>

      {/* User Summary Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 p-3 sm:p-4 text-white">
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
          <Users className="w-4 h-4 sm:w-5 sm:h-5 opacity-80 mb-1.5 sm:mb-2" />
          <p className="text-xl sm:text-3xl font-black">{totalUsers.toLocaleString("ar-EG")}</p>
          <p className="text-[10px] sm:text-xs text-white/70 mt-0.5 sm:mt-1">إجمالي المستخدمين</p>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 p-3 sm:p-4 text-white">
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
          <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 opacity-80 mb-1.5 sm:mb-2" />
          <p className="text-xl sm:text-3xl font-black">
            {(stats.active_users || 0).toLocaleString("ar-EG")}
          </p>
          <p className="text-[10px] sm:text-xs text-white/70 mt-0.5 sm:mt-1">نشط</p>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-sky-500 to-cyan-600 p-3 sm:p-4 text-white">
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
          <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 opacity-80 mb-1.5 sm:mb-2" />
          <p className="text-xl sm:text-3xl font-black">
            {(stats.new_users_this_month || 0).toLocaleString("ar-EG")}
          </p>
          <p className="text-[10px] sm:text-xs text-white/70 mt-0.5 sm:mt-1">جديد هذا الشهر</p>
        </div>

        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-3 sm:p-4 text-white">
          <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
          <Building className="w-4 h-4 sm:w-5 sm:h-5 opacity-80 mb-1.5 sm:mb-2" />
          <p className="text-xl sm:text-3xl font-black">{typeData.length}</p>
          <p className="text-[10px] sm:text-xs text-white/70 mt-0.5 sm:mt-1">أنواع الحسابات</p>
        </div>
      </div>

      {/* User Types Segmentation */}
      {typeData.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">توزيع أنواع المستخدمين</h4>
          <div className="grid grid-cols-2 sm:flex gap-2 sm:flex-wrap">
            {typeData.map((item, index) => {
              const percent = totalUsers > 0 ? ((item.count / totalUsers) * 100).toFixed(1) : "0";
              const colors = ["bg-violet-500", "bg-sky-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];
              return (
                <div
                  key={index}
                  className="sm:flex-1 sm:min-w-[120px] p-2.5 sm:p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0 ${colors[index % colors.length]}`} />
                    <span className="text-[10px] sm:text-xs font-medium text-gray-600 truncate">{item.name}</span>
                  </div>
                  <p className="text-base sm:text-xl font-bold text-gray-900">{item.count.toLocaleString("ar-EG")}</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-full rounded-full ${colors[index % colors.length]} transition-all duration-1000`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{percent}%</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Monthly Registrations Chart */}
      {monthlyData.length > 0 && (
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">التسجيلات الشهرية</h4>
          <div className="h-44 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#7c3aed" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#475569", fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  name="التسجيلات"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  fill="url(#userGradient)"
                  dot={{ r: 4, fill: "#7c3aed", stroke: "#fff", strokeWidth: 2 }}
                  activeDot={{ r: 6, stroke: "#7c3aed", strokeWidth: 2, fill: "#fff" }}
                  animationBegin={0}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function getUserTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    landlord: "مالك عقار",
    agent: "وسيط عقاري",
    office: "مكتب عقاري",
    admin: "مدير",
    user: "مستخدم",
  };
  return labels[type] || type;
}
