import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { fetchTransactionsByPropertyType } from "@/api";

interface PropertyTypeData {
  property_type: string;
  count: number;
  total_profit: number;
  average_profit: number;
}

const propertyTypeColors: Record<string, string> = {
  families: "#3b82f6",
  students: "#10b981",
  summer: "#f59e0b",
  daily: "#ef4444",
  studio: "#8b5cf6",
};

const propertyTypeLabels: Record<string, string> = {
  families: "عائلات",
  students: "طلاب",
  summer: "مصيفين",
  daily: "حجز يومي",
  studio: "استوديو",
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      transactions: number;
      profit: number;
    };
  }>;
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

export function PropertyTypeChart() {
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPropertyTypeData();
  }, []);

  const loadPropertyTypeData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchTransactionsByPropertyType();

      if (Array.isArray(response) && response.length > 0) {
        // تحويل البيانات إلى الصيغة المطلوبة
        const chartData = response.map((item: any) => ({
          name:
            propertyTypeLabels[item.property_type] || item.property_type,
          transactions: item.count,
          profit: item.total_profit,
          average_profit: item.average_profit,
          color:
            propertyTypeColors[item.property_type] || "#6366f1",
          property_type: item.property_type,
        }));

        // ترتيب تنازلي حسب الربح
        chartData.sort((a: any, b: any) => b.profit - a.profit);

        setData(chartData);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error loading property type data:", error);
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
            <span>🏠</span>
            الصفقات حسب نوع العقار
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            توزيع الصفقات والأرباح حسب الفئة العقارية
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={chartType === "line" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType("line")}
            className="text-xs"
          >
            خطوط
          </Button>
          <Button
            variant={chartType === "bar" ? "default" : "outline"}
            size="sm"
            onClick={() => setChartType("bar")}
            className="text-xs"
          >
            أعمدة
          </Button>
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
        ) : chartType === "line" ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={displayData}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                }}
                formatter={(value) =>
                  value === "profit" ? "إجمالي الربح" : value
                }
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{
                  fill: "#3b82f6",
                  r: 6,
                }}
                activeDot={{
                  r: 8,
                  strokeWidth: 2,
                }}
              />
              <Line
                type="monotone"
                dataKey="transactions"
                stroke="#10b981"
                strokeWidth={3}
                dot={{
                  fill: "#10b981",
                  r: 6,
                }}
                activeDot={{
                  r: 8,
                  strokeWidth: 2,
                }}
                yAxisId="right"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={displayData}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                opacity={0.5}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                }}
              />
              <Bar
                dataKey="profit"
                name="إجمالي الربح"
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              >
                {displayData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={index === 0 ? 1 : 0.7}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-border">
        {displayData.length > 0 ? (
          displayData.map((item, index) => (
            <div
              key={item.property_type}
              className="flex items-center gap-2"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name}
              </span>
              {index === 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  الأكثر استخداماً
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
