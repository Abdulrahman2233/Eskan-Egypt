import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fetchTransactionsByAccountType } from "@/api";

interface AccountTypeData {
  account_type: string;
  account_type_display?: string;
  count: number;
  total_profit: number;
  average_profit: number;
}

const accountTypeColors: Record<string, string> = {
  landlord: "#0ea5e9",
  owner: "#0ea5e9",
  agent: "#22c55e",
  office: "#f59e0b",
  admin: "#ec4899",
};

const accountTypeLabels: Record<string, string> = {
  landlord: "ملاك عقارات",
  owner: "ملاك عقارات",
  agent: "وسطاء",
  office: "مكاتب عقارات",
  admin: "مسؤولون",
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: {
    name: string;
    transactions: number;
    profit: number;
  }}>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload[0]) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-xl">
      <p className="font-bold text-foreground mb-2">{data.name}</p>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">عدد الصفقات:</span>
          <span className="font-semibold text-primary">{data.transactions}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">إجمالي الربح:</span>
          <span className="font-semibold text-green-600">
            {new Intl.NumberFormat("ar-EG").format(data.profit)} ج.م
          </span>
        </div>
      </div>
    </div>
  );
};

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: CustomLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-semibold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function TopAccountsChartComponent() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAccountTypeData();
  }, []);

  const loadAccountTypeData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchTransactionsByAccountType();
      
      if (Array.isArray(response) && response.length > 0) {
        // تحويل البيانات إلى الصيغة المطلوبة
        const chartData = response.map((item: any) => ({
          name: accountTypeLabels[item.account_type] || item.account_type,
          transactions: item.count,
          profit: item.total_profit,
          average_profit: item.average_profit,
          color: accountTypeColors[item.account_type] || "#6366f1",
          account_type: item.account_type,
        }));

        // ترتيب تنازلي حسب الربح
        chartData.sort((a: any, b: any) => b.profit - a.profit);
        
        setData(chartData);
      } else {
        // إذا لم توجد بيانات، استخدم بيانات فارغة
        setData([]);
      }
    } catch (error) {
      console.error("Error loading account type data:", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const displayData = data.length > 0 ? data : [];

  return (
    <div className="card-glow rounded-2xl bg-card p-5 lg:p-6 border border-border shadow-lg h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg lg:text-xl font-bold text-foreground flex items-center gap-2">
            <span>🏆</span>
            أفضل الحسابات مبيعًا
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            ترتيب تنازلي حسب إجمالي الأرباح
          </p>
        </div>


      </div>

      <div className="h-72">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">جاري تحميل البيانات...</p>
          </div>
        ) : displayData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">لا توجد بيانات حتى الآن</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                innerRadius={50}
                dataKey="profit"
                stroke="hsl(var(--card))"
                strokeWidth={3}
              >
                {displayData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={index === 0 ? 1 : 0.8}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-border">
        {displayData.length > 0 ? (
          displayData.map((item, index) => (
            <div key={item.account_type} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">{item.name}</span>
              {index === 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  الأعلى
                </span>
              )}
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">لا توجد بيانات للعرض</p>
        )}
      </div>
    </div>
  );
}

export const TopAccountsChart = React.memo(TopAccountsChartComponent);
