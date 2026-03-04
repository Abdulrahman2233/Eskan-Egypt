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
  LabelList,
} from "recharts";
import { CheckCircle, Loader, Clock, XCircle, Shield, AlertTriangle } from "lucide-react";
import { fetchApprovalStatistics, fetchDashboardSummary } from "@/api";

const PIPELINE_COLORS = {
  pending: { color: "#f59e0b", bg: "bg-amber-50", text: "text-amber-700", icon: Clock, label: "قيد المراجعة" },
  approved: { color: "#10b981", bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle, label: "معتمد" },
  rejected: { color: "#ef4444", bg: "bg-red-50", text: "text-red-700", icon: XCircle, label: "مرفوض" },
  deleted: { color: "#94a3b8", bg: "bg-gray-50", text: "text-gray-700", icon: AlertTriangle, label: "محذوف" },
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-2xl min-w-[170px]">
        <div className="flex items-center gap-2 mb-2 border-b border-gray-100 pb-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="text-sm font-bold text-gray-900">{data.label}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">العدد</span>
          <span className="text-lg font-black text-gray-900">{data.value}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">النسبة</span>
          <span className="text-sm font-bold" style={{ color: data.color }}>
            {data.percentage}%
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function ApprovalPipelineChart() {
  const [pipelineData, setPipelineData] = useState<any[]>([]);
  const [approvalStats, setApprovalStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [summaryData, statsData] = await Promise.all([
        fetchDashboardSummary().catch(() => null),
        fetchApprovalStatistics().catch(() => null),
      ]);

      const properties = summaryData?.properties || {};
      const total = properties.total || 1;

      const data = [
        {
          name: "قيد المراجعة",
          label: "قيد المراجعة",
          value: properties.pending || 0,
          percentage: ((properties.pending || 0) / total * 100).toFixed(1),
          color: PIPELINE_COLORS.pending.color,
          status: "pending",
        },
        {
          name: "معتمد",
          label: "معتمد",
          value: properties.approved || 0,
          percentage: ((properties.approved || 0) / total * 100).toFixed(1),
          color: PIPELINE_COLORS.approved.color,
          status: "approved",
        },
        {
          name: "مرفوض",
          label: "مرفوض",
          value: properties.rejected || 0,
          percentage: ((properties.rejected || 0) / total * 100).toFixed(1),
          color: PIPELINE_COLORS.rejected.color,
          status: "rejected",
        },
        {
          name: "محذوف",
          label: "محذوف",
          value: properties.deleted || 0,
          percentage: ((properties.deleted || 0) / total * 100).toFixed(1),
          color: PIPELINE_COLORS.deleted.color,
          status: "deleted",
        },
      ];

      setPipelineData(data);
      setApprovalStats(statsData);
    } catch {
      setPipelineData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const totalProperties = pipelineData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start gap-2.5 sm:gap-3 mb-5 sm:mb-6">
        <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-200">
          <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h3 className="text-base sm:text-xl font-bold text-gray-900">خط سير الموافقات</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">حالة مراجعة العقارات</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-52 sm:h-72">
          <Loader className="w-6 h-6 animate-spin text-violet-500" />
        </div>
      ) : (
        <>
          {/* Pipeline Visual */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 mb-6 sm:mb-8">
            {pipelineData.map((item, index) => {
              const config = PIPELINE_COLORS[item.status as keyof typeof PIPELINE_COLORS];
              const Icon = config.icon;
              const widthPercent = totalProperties > 0 ? (item.value / totalProperties) * 100 : 25;
              return (
                <div
                  key={index}
                  className="relative group sm:flex-1"
                  style={{ minWidth: 0 }}
                >
                  <div
                    className={`${config.bg} rounded-xl p-3 sm:p-4 border-2 transition-all duration-300 hover:scale-[1.03] hover:shadow-md cursor-default`}
                    style={{ borderColor: `${item.color}30` }}
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" style={{ color: item.color }} />
                      <span className={`text-[10px] sm:text-xs font-bold ${config.text} truncate`}>{item.label}</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-gray-900">{item.value}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">{item.percentage}%</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bar Chart */}
          <div className="h-44 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pipelineData}
                margin={{ top: 20, right: 10, left: 0, bottom: 10 }}
                barSize={32}
              >
                <defs>
                  {pipelineData.map((item, index) => (
                    <linearGradient
                      key={`pipelineGrad-${index}`}
                      id={`pipelineGrad-${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={item.color} stopOpacity={1} />
                      <stop offset="100%" stopColor={item.color} stopOpacity={0.4} />
                    </linearGradient>
                  ))}
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
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(139, 92, 246, 0.05)" }} />
                <Bar
                  dataKey="value"
                  name="العقارات"
                  radius={[10, 10, 0, 0]}
                  animationBegin={0}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  <LabelList
                    dataKey="value"
                    position="top"
                    fill="#475569"
                    fontSize={13}
                    fontWeight={700}
                    offset={8}
                  />
                  {pipelineData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#pipelineGrad-${index})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
