import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  propertyName: string;
  region: string;
  accountType: string;
  propertyType: string;
  rentPrice: number;
  commission: number;
  profit: number;
  date: string;
}

// ترجمة أنواع العقارات من الإنجليزية إلى العربية
const propertyTypeMap: Record<string, string> = {
  students: "طلاب",
  families: "عائلات",
  vacation: "مصيفين",
  daily: "حجز يومي",
  studio: "استوديو",
};

const generateData = (days: number, transactions: Transaction[] = []) => {
  const data: Record<string, any> = {};
  const now = new Date();
  
  // إنشء البيانات الأساسية للأيام
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    
    data[dateKey] = {
      date: date.toLocaleDateString("ar-EG", { month: "short", day: "numeric" }),
      طلاب: 0,
      عائلات: 0,
      مصيفين: 0,
      "حجز يومي": 0,
      استوديو: 0,
    };
  }
  
  // إضافة بيانات الصفقات الفعلية
  transactions.forEach((transaction) => {
    const transDate = new Date(transaction.date);
    const dateKey = transDate.toISOString().split('T')[0];
    
    // فقط إذا كانت الصفقة ضمن الفترة المطلوبة
    if (data[dateKey]) {
      // ترجمة نوع العقار من الإنجليزية إلى العربية
      const propertyTypeArabic = propertyTypeMap[transaction.propertyType] || transaction.propertyType;
      if (propertyTypeArabic in data[dateKey]) {
        data[dateKey][propertyTypeArabic] += transaction.profit;
      } else {
        // إذا لم توجد الترجمة، أضف القيمة الأصلية
        console.warn(`نوع عقار غير معروف: ${transaction.propertyType}`);
      }
    }
  });
  
  return Object.values(data);
};

const clientTypes = [
  { key: "طلاب", color: "#0ea5e9", label: "طلاب" },
  { key: "عائلات", color: "#22c55e", label: "عائلات" },
  { key: "مصيفين", color: "#f59e0b", label: "مصيفين" },
  { key: "حجز يومي", color: "#ec4899", label: "حجز يومي" },
  { key: "استوديو", color: "#8b5cf6", label: "استوديو" },
];

const timeFilters = [
  { label: "7 أيام", value: 7 },
  { label: "30 يوم", value: 30 },
  { label: "3 شهور", value: 90 },
];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; color: string; name: string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload) return null;

  const totalProfit = payload.reduce((sum: number, entry) => sum + entry.value, 0);
  const totalTransactions = payload.filter((p) => p.value > 0).length;

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-xl">
      <p className="font-bold text-foreground mb-3 border-b border-border pb-2">{label}</p>
      <div className="space-y-2">
        {payload.map((entry, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">{entry.name}</span>
            </div>
            <span className="font-semibold text-foreground">
              {new Intl.NumberFormat("ar-EG").format(entry.value)} ج.م
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-border mt-3 pt-3 space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">عدد الأنواع:</span>
          <span className="font-bold text-primary">{totalTransactions}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">إجمالي الربح:</span>
          <span className="font-bold text-green-600">
            {new Intl.NumberFormat("ar-EG").format(totalProfit)} ج.م
          </span>
        </div>
      </div>
    </div>
  );
};

interface ProfitLineChartProps {
  transactions?: Transaction[];
}

export function ProfitLineChart({ transactions = [] }: ProfitLineChartProps) {
  const [activeFilter, setActiveFilter] = useState(30);
  const data = generateData(activeFilter, transactions);

  return (
    <div className="card-glow rounded-2xl bg-card p-5 lg:p-6 border border-border shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg lg:text-xl font-bold text-foreground flex items-center gap-2">
            <span>📈</span>
            الصفقات حسب نوع العميل
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            مقارنة الأداء حسب أنواع العملاء المختلفة
          </p>
        </div>
        
        <div className="flex gap-2">
          {timeFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={activeFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(filter.value)}
              className="text-xs"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="h-80 lg:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <defs>
              {clientTypes.map((type) => (
                <linearGradient
                  key={type.key}
                  id={`gradient-${type.key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={type.color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={type.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              opacity={0.5}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: 20 }}
              iconType="circle"
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
            {clientTypes.map((type) => (
              <Line
                key={type.key}
                type="monotone"
                dataKey={type.key}
                stroke={type.color}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
