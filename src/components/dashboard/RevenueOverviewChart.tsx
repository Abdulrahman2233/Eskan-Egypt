import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { DollarSign, Loader, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { fetchTransactionStatistics, fetchTransactionsByAccountType } from "@/api";

interface TransactionStats {
  total_transactions?: number;
  total_amount?: number;
  average_amount?: number;
  this_month_amount?: number;
  last_month_amount?: number;
}

const COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-100 dark:border-gray-700 pb-2">
          {label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mt-1.5">
            <div
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-500">{entry.name}:</span>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {typeof entry.value === "number"
                ? entry.value.toLocaleString("ar-EG")
                : entry.value}{" "}
              ج.م
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function RevenueOverviewChart() {
  const [stats, setStats] = useState<TransactionStats>({});
  const [accountData, setAccountData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, accountRes] = await Promise.all([
        fetchTransactionStatistics().catch(() => ({})),
        fetchTransactionsByAccountType().catch(() => []),
      ]);
      setStats(statsRes || {});
      setAccountData(
        Array.isArray(accountRes)
          ? accountRes.map((item: any) => ({
              name: item.account_type || item.name || "غير محدد",
              amount: item.total_amount || item.amount || 0,
              count: item.count || 0,
            }))
          : []
      );
    } catch {
      setStats({});
      setAccountData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const monthChange =
    stats.last_month_amount && stats.last_month_amount > 0
      ? (((stats.this_month_amount || 0) - stats.last_month_amount) /
          stats.last_month_amount) *
        100
      : 0;

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white border border-gray-100 p-6 lg:p-8 shadow-sm">
        <div className="flex items-center justify-center h-80">
          <Loader className="w-6 h-6 animate-spin text-indigo-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-5 sm:mb-8">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-bold text-gray-900">
              نظرة عامة على الإيرادات
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              تحليل الإيرادات حسب نوع الحساب
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-3 sm:p-4 border border-indigo-100">
          <p className="text-[10px] sm:text-xs font-medium text-indigo-600/80 mb-1">إجمالي الإيرادات</p>
          <p className="text-lg sm:text-2xl font-bold text-indigo-900 truncate">
            {(stats.total_amount || 0).toLocaleString("ar-EG")}
          </p>
          <p className="text-[10px] sm:text-xs text-indigo-500 mt-0.5 sm:mt-1">ج.م</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-3 sm:p-4 border border-emerald-100">
          <p className="text-[10px] sm:text-xs font-medium text-emerald-600/80 mb-1">هذا الشهر</p>
          <p className="text-lg sm:text-2xl font-bold text-emerald-900 truncate">
            {(stats.this_month_amount || 0).toLocaleString("ar-EG")}
          </p>
          <div className="flex items-center gap-1 mt-1">
            {monthChange >= 0 ? (
              <ArrowUpRight className="w-3 h-3 text-emerald-600" />
            ) : (
              <ArrowDownRight className="w-3 h-3 text-red-500" />
            )}
            <span
              className={`text-xs font-semibold ${
                monthChange >= 0 ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {Math.abs(monthChange).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-3 sm:p-4 border border-amber-100">
          <p className="text-[10px] sm:text-xs font-medium text-amber-600/80 mb-1">متوسط المعاملة</p>
          <p className="text-lg sm:text-2xl font-bold text-amber-900 truncate">
            {(stats.average_amount || 0).toLocaleString("ar-EG")}
          </p>
          <p className="text-[10px] sm:text-xs text-amber-500 mt-0.5 sm:mt-1">ج.م</p>
        </div>
        <div className="bg-gradient-to-br from-sky-50 to-sky-100/50 rounded-xl p-3 sm:p-4 border border-sky-100">
          <p className="text-[10px] sm:text-xs font-medium text-sky-600/80 mb-1">عدد المعاملات</p>
          <p className="text-lg sm:text-2xl font-bold text-sky-900 truncate">
            {(stats.total_transactions || 0).toLocaleString("ar-EG")}
          </p>
          <p className="text-[10px] sm:text-xs text-sky-500 mt-0.5 sm:mt-1">معاملة</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-56 sm:h-72 lg:h-80">
        {accountData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={accountData}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              barSize={28}
            >
              <defs>
                {COLORS.map((color, index) => (
                  <linearGradient
                    key={`grad-${index}`}
                    id={`barGrad-${index}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
                dy={8}
                interval={0}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                width={45}
                tickFormatter={(val) =>
                  val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val
                }
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99, 102, 241, 0.05)" }} />
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
                dataKey="amount"
                name="الإيرادات (ج.م)"
                radius={[12, 12, 0, 0]}
                animationBegin={0}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {accountData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#barGrad-${index % COLORS.length})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <TrendingUp className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">لا توجد بيانات إيرادات متاحة</p>
          </div>
        )}
      </div>
    </div>
  );
}
