import { useState, useEffect } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { Home, Loader, TrendingUp } from "lucide-react";
import { fetchTransactionsByPropertyType } from "@/api";

const TYPE_COLORS: Record<string, string> = {
  students: "#6366f1",
  families: "#0ea5e9",
  studio: "#10b981",
  vacation: "#f59e0b",
  daily: "#ef4444",
  commercial: "#8b5cf6",
};

const TYPE_LABELS: Record<string, string> = {
  students: "طلاب",
  families: "عائلات",
  studio: "ستوديو",
  vacation: "إجازات",
  daily: "يومي",
  commercial: "تجاري",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-2xl min-w-[190px]">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-100 dark:border-gray-700 pb-2">
          🏠 {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-3 mt-1.5">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-gray-500">{entry.name}</span>
            </div>
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

export function PropertyTypeRevenueChart() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await fetchTransactionsByPropertyType();
      const formatted = Array.isArray(res)
        ? res.map((item: any) => ({
            name: TYPE_LABELS[item.property_type] || item.property_type || "غير محدد",
            amount: item.total_profit || item.total_amount || item.amount || 0,
            count: item.count || 0,
            type: item.property_type || "",
          }))
        : [];
      setData(formatted);
    } catch {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start gap-2.5 sm:gap-3 mb-5 sm:mb-6">
        <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-200">
          <Home className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h3 className="text-base sm:text-xl font-bold text-gray-900">الإيرادات حسب نوع العقار</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">مقارنة الإيرادات وعدد المعاملات</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-80">
          <Loader className="w-6 h-6 animate-spin text-sky-500" />
        </div>
      ) : data.length > 0 ? (
        <>
          {/* Quick Stats Row */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-3 sm:pb-4 mb-3 sm:mb-4 scrollbar-hide -mx-1 px-1">
            {data.map((item, index) => {
              const color = TYPE_COLORS[item.type] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
              return (
                <div
                  key={index}
                  className="flex-shrink-0 min-w-[110px] sm:min-w-[140px] p-2.5 sm:p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-[10px] sm:text-xs font-medium text-gray-600 truncate">{item.name}</span>
                  </div>
                  <p className="text-sm sm:text-lg font-bold text-gray-900 truncate">
                    {item.amount.toLocaleString("ar-EG")}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-400">{item.count} معاملة</p>
                </div>
              );
            })}
          </div>

          {/* Composed Chart */}
          <div className="h-56 sm:h-72 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 10, right: 5, left: 0, bottom: 10 }}
                barSize={24}
              >
                <defs>
                  {data.map((_, index) => {
                    const color = TYPE_COLORS[data[index]?.type] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
                    return (
                      <linearGradient
                        key={`typeGrad-${index}`}
                        id={`typeGrad-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.4} />
                      </linearGradient>
                    );
                  })}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#475569", fontSize: 10, fontWeight: 500 }}
                  dy={8}
                  interval={0}
                />
                <YAxis
                  yAxisId="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  width={40}
                  tickFormatter={(val) =>
                    val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toString()
                  }
                />
                <YAxis
                  yAxisId="right"
                  orientation="left"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#c084fc", fontSize: 11 }}
                  width={40}
                  hide
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(14, 165, 233, 0.05)" }} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-xs text-gray-600 font-medium">{value}</span>
                  )}
                />
                <Bar
                  yAxisId="left"
                  dataKey="amount"
                  name="الإيرادات (ج.م)"
                  radius={[10, 10, 0, 0]}
                  animationBegin={0}
                  animationDuration={1200}
                >
                  {data.map((item, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#typeGrad-${index})`}
                    />
                  ))}
                </Bar>
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="count"
                  name="عدد المعاملات"
                  stroke="#c084fc"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#c084fc", stroke: "#fff", strokeWidth: 2 }}
                  activeDot={{ r: 7, stroke: "#c084fc", strokeWidth: 2, fill: "#fff" }}
                  animationBegin={300}
                  animationDuration={1200}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-80 text-gray-400">
          <Home className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm">لا توجد بيانات متاحة</p>
        </div>
      )}
    </div>
  );
}

const FALLBACK_COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
