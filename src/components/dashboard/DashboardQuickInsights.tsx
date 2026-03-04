import { useState, useEffect, useCallback, useMemo } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Loader, Activity, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { fetchDashboardSummary } from "@/api";

interface QuickInsight {
  title: string;
  value: number;
  previousValue?: number;
  sparkData: number[];
  color: string;
  gradient: { from: string; to: string };
  suffix?: string;
}

const MiniTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded-md shadow-lg">
        {payload[0].value}
      </div>
    );
  }
  return null;
};

export function DashboardQuickInsights() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await fetchDashboardSummary();
      setData(res);
    } catch {
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const insights: QuickInsight[] = useMemo(() => {
    if (!data) return [];

    const props = data.properties || {};
    const users = data.users || {};
    const messages = data.contact_messages || {};
    const dailyActivity = data.daily_activity || [];

    // Generate sparkline data from daily activity
    const sparkValues = dailyActivity.slice(-10).map((d: any) => d.count || 0);
    const defaultSpark = sparkValues.length > 0 ? sparkValues : [0, 2, 4, 3, 5, 7, 6, 8, 10, 9];

    return [
      {
        title: "إجمالي العقارات",
        value: props.total || 0,
        sparkData: defaultSpark,
        color: "#6366f1",
        gradient: { from: "#6366f1", to: "#818cf8" },
        suffix: "عقار",
      },
      {
        title: "العقارات المعتمدة",
        value: props.approved || 0,
        sparkData: defaultSpark.map((v: number) => Math.max(0, v - 1)),
        color: "#10b981",
        gradient: { from: "#10b981", to: "#34d399" },
        suffix: "عقار",
      },
      {
        title: "إجمالي المستخدمين",
        value: users.total || 0,
        sparkData: defaultSpark.map((v: number) => v + 2),
        color: "#0ea5e9",
        gradient: { from: "#0ea5e9", to: "#38bdf8" },
        suffix: "مستخدم",
      },
      {
        title: "الرسائل الجديدة",
        value: messages.total || messages.today || 0,
        sparkData: defaultSpark.map((v: number) => Math.max(0, Math.round(v / 2))),
        color: "#f59e0b",
        gradient: { from: "#f59e0b", to: "#fbbf24" },
        suffix: "رسالة",
      },
    ];
  }, [data]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white border border-gray-100 p-5 animate-pulse">
            <div className="h-3 bg-gray-200 rounded w-20 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-16 mb-3" />
            <div className="h-12 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {insights.map((insight, index) => {
        const sparkData = insight.sparkData.map((value, i) => ({ value, index: i }));
        const lastValue = insight.sparkData[insight.sparkData.length - 1] || 0;
        const prevValue = insight.sparkData[insight.sparkData.length - 2] || 0;
        const trend = lastValue > prevValue ? "up" : lastValue < prevValue ? "down" : "neutral";

        return (
          <div
            key={index}
            className="group relative rounded-xl sm:rounded-2xl bg-white border border-gray-100 p-3 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            {/* Decorative accent */}
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.06] blur-2xl transition-all duration-500 group-hover:opacity-[0.12] group-hover:scale-150"
              style={{ backgroundColor: insight.color }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wide leading-tight">
                  {insight.title}
                </p>
                <div
                  className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    trend === "up"
                      ? "bg-emerald-50 text-emerald-600"
                      : trend === "down"
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  {trend === "up" ? (
                    <ArrowUp className="w-2.5 h-2.5" />
                  ) : trend === "down" ? (
                    <ArrowDown className="w-2.5 h-2.5" />
                  ) : (
                    <Minus className="w-2.5 h-2.5" />
                  )}
                </div>
              </div>

              <div className="flex items-end gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                <p className="text-xl sm:text-3xl font-black text-gray-900" style={{ fontFeatureSettings: "'tnum'" }}>
                  {insight.value.toLocaleString("ar-EG")}
                </p>
                <span className="text-[10px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">{insight.suffix}</span>
              </div>

              {/* Sparkline */}
              <div className="h-8 sm:h-12 -mx-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparkData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                    <defs>
                      <linearGradient id={`spark-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={insight.gradient.from} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={insight.gradient.to} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Tooltip content={<MiniTooltip />} cursor={false} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={insight.color}
                      strokeWidth={2}
                      fill={`url(#spark-${index})`}
                      dot={false}
                      activeDot={{ r: 3, fill: insight.color, stroke: "#fff", strokeWidth: 1.5 }}
                      animationBegin={index * 200}
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
