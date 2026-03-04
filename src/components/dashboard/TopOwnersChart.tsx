import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Crown, Loader, Medal, Award, Trophy } from "lucide-react";
import { fetchTopOwners } from "@/api";

interface Owner {
  name?: string;
  username?: string;
  properties?: number;
  properties_count?: number;
  total_views?: number;
  user_type?: string;
}

const RANK_COLORS = [
  { bar: "#f59e0b", bg: "from-amber-50 to-amber-100/30", badge: "bg-amber-500", icon: Trophy },
  { bar: "#94a3b8", bg: "from-gray-50 to-gray-100/30", badge: "bg-gray-400", icon: Medal },
  { bar: "#d97706", bg: "from-orange-50 to-orange-100/30", badge: "bg-orange-600", icon: Award },
  { bar: "#6366f1", bg: "from-indigo-50 to-indigo-100/30", badge: "bg-indigo-500", icon: Crown },
];

const TABS = [
  { key: "landlord", label: "ملاك" },
  { key: "agent", label: "وسطاء" },
  { key: "office", label: "مكاتب" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-2xl min-w-[180px]">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-100 dark:border-gray-700 pb-2">
          {data.name}
        </p>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">العقارات</span>
            <span className="text-sm font-bold text-indigo-600">{data.properties_count}</span>
          </div>
          {data.total_views > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">المشاهدات</span>
              <span className="text-sm font-bold text-emerald-600">
                {data.total_views?.toLocaleString("ar-EG")}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export function TopOwnersChart() {
  const [activeTab, setActiveTab] = useState("landlord");
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOwners();
  }, [activeTab]);

  const loadOwners = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTopOwners(activeTab, 6);
      const ownersArray = Array.isArray(data) ? data : data?.results || [];
      setOwners(ownersArray);
    } catch {
      setOwners([]);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = owners.map((owner, index) => ({
    name: owner.name || owner.username || `مستخدم ${index + 1}`,
    properties_count: owner.properties || owner.properties_count || 0,
    total_views: owner.total_views || 0,
    rank: index + 1,
  }));

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-200">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-bold text-gray-900">أفضل المعلنين</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">ترتيب حسب عدد العقارات</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 self-start">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-72">
          <Loader className="w-6 h-6 animate-spin text-amber-500" />
        </div>
      ) : chartData.length > 0 ? (
        <div className="space-y-6">
          {/* Leaderboard List */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {chartData.slice(0, 4).map((item, index) => {
              const rankInfo = RANK_COLORS[index] || RANK_COLORS[3];
              const RankIcon = rankInfo.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-4 rounded-xl bg-gradient-to-r ${rankInfo.bg} border border-gray-100 transition-all duration-200 hover:scale-[1.02] hover:shadow-sm`}
                >
                  <div
                    className={`${rankInfo.badge} w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm flex-shrink-0`}
                  >
                    <RankIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
                      {item.properties_count} عقار
                      {item.total_views > 0 && ` • ${item.total_views.toLocaleString("ar-EG")} مشاهدة`}
                    </p>
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-gray-200 flex-shrink-0">
                    #{item.rank}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bar Chart */}
          <div className="h-44 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                barSize={18}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  width={60}
                  tick={{ fill: "#475569", fontSize: 10, fontWeight: 500 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(245, 158, 11, 0.05)" }} />
                <Bar
                  dataKey="properties_count"
                  name="العقارات"
                  radius={[0, 8, 8, 0]}
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={RANK_COLORS[index % RANK_COLORS.length].bar}
                      opacity={0.85 + (index === 0 ? 0.15 : 0)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-72 text-gray-400">
          <Crown className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm">لا توجد بيانات متاحة</p>
        </div>
      )}
    </div>
  );
}
