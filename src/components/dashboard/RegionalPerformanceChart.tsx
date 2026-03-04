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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { MapPin, Loader, BarChart3 } from "lucide-react";
import { fetchTransactionsByRegion } from "@/api";

const GRADIENT_COLORS = [
  { start: "#6366f1", end: "#818cf8" },
  { start: "#0ea5e9", end: "#38bdf8" },
  { start: "#10b981", end: "#34d399" },
  { start: "#f59e0b", end: "#fbbf24" },
  { start: "#ef4444", end: "#f87171" },
  { start: "#8b5cf6", end: "#a78bfa" },
  { start: "#ec4899", end: "#f472b6" },
  { start: "#14b8a6", end: "#2dd4bf" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-2xl">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 border-b pb-2 border-gray-100">
          📍 {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mt-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-500">{entry.name}:</span>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {typeof entry.value === "number"
                ? entry.value.toLocaleString("ar-EG")
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function RegionalPerformanceChart() {
  const [regionData, setRegionData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"bar" | "radar">("bar");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTransactionsByRegion();
      const formatted = Array.isArray(data)
        ? data.map((item: any) => ({
            name: item.region || item.area || item.name || "غير محدد",
            amount: item.total_amount || item.amount || 0,
            count: item.count || item.transaction_count || 0,
          }))
        : [];
      setRegionData(formatted);
    } catch {
      setRegionData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Find max for highlighting
  const maxAmount = Math.max(...regionData.map((d) => d.amount), 0);

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-200">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-bold text-gray-900">الأداء حسب المنطقة</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">توزيع الإيرادات الجغرافي</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode("bar")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "bar"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("radar")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "radar"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
              <polygon points="12,6 18,10 18,14 12,18 6,14 6,10" />
            </svg>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-80">
          <Loader className="w-6 h-6 animate-spin text-emerald-500" />
        </div>
      ) : regionData.length > 0 ? (
        <div className="h-60 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === "bar" ? (
              <BarChart
                data={regionData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                barSize={24}
              >
                <defs>
                  {regionData.map((_, index) => {
                    const colors = GRADIENT_COLORS[index % GRADIENT_COLORS.length];
                    return (
                      <linearGradient
                        key={`regionGrad-${index}`}
                        id={`regionGrad-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor={colors.start} stopOpacity={1} />
                        <stop offset="100%" stopColor={colors.end} stopOpacity={0.5} />
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#475569", fontSize: 9, fontWeight: 500 }}
                  angle={-30}
                  textAnchor="end"
                  height={55}
                  interval={0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  width={40}
                  tickFormatter={(val) =>
                    val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toString()
                  }
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(16, 185, 129, 0.05)" }} />
                <Bar
                  dataKey="amount"
                  name="الإيرادات"
                  radius={[10, 10, 0, 0]}
                  animationBegin={0}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {regionData.map((item, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#regionGrad-${index})`}
                      strokeWidth={item.amount === maxAmount ? 2 : 0}
                      stroke={item.amount === maxAmount ? GRADIENT_COLORS[index % GRADIENT_COLORS.length].start : "none"}
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <RadarChart data={regionData} margin={{ top: 10, right: 15, bottom: 10, left: 15 }}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="name"
                  tick={{ fill: "#475569", fontSize: 9, fontWeight: 500 }}
                />
                <PolarRadiusAxis
                  tick={{ fill: "#94a3b8", fontSize: 9 }}
                  axisLine={false}
                />
                <Radar
                  name="الإيرادات"
                  dataKey="amount"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.2}
                  strokeWidth={2}
                  animationBegin={0}
                  animationDuration={1200}
                />
                <Radar
                  name="المعاملات"
                  dataKey="count"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  animationBegin={200}
                  animationDuration={1200}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            )}
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-80 text-gray-400">
          <MapPin className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm">لا توجد بيانات مناطق متاحة</p>
        </div>
      )}
    </div>
  );
}
