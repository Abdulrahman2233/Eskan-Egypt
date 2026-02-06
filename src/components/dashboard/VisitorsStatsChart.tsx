import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader, Users } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getVisitorsCount, getVisitorsDailyStats } from "@/api";
import { cn } from "@/lib/utils";

interface VisitorData {
  date: string;
  visitors: number;
}

export function VisitorsStatsChart() {
  const [timeRange, setTimeRange] = useState<"7" | "30" | "90">("7");
  const [data, setData] = useState<VisitorData[]>([]);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVisitorData();
  }, [timeRange]);

  const loadVisitorData = async () => {
    try {
      setIsLoading(true);
      const response = await getVisitorsCount();
      
      // البيانات الحقيقية من API
      const totalUnique = response?.total_unique_visitors || 0;
      const visitsTotal = response?.total_visits || 0;
      setTotalVisitors(totalUnique);
      setTotalVisits(visitsTotal);

      const days = parseInt(timeRange);
      const daily = await getVisitorsDailyStats(days);
      const chartData: VisitorData[] = (daily?.results || []).map((item: any) => ({
        date: item.date,
        visitors: item.visitors || 0,
      }));
      setData(chartData);
    } catch (error) {
      console.error("Error loading visitor data:", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ar-EG").format(num);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground">
            {payload[0].payload.date}
          </p>
          <p className="text-lg font-bold text-orange-600">
            {formatNumber(payload[0].value)} زائر
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-card border border-border p-6 lg:p-8 shadow-lg">
        <div className="flex items-center justify-center h-80">
          <Loader className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-card border border-border p-6 lg:p-8 shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg lg:text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            إحصائيات زوار الموقع
          </h3>
          <div className="text-sm text-muted-foreground mt-2 space-y-1">
            <p>
              الزوار الفريدين: <span className="font-bold text-orange-600">{formatNumber(totalVisitors)}</span>
            </p>
            <p>
              إجمالي الزيارات: <span className="font-bold text-orange-600">{formatNumber(totalVisits)}</span>
            </p>
          </div>
        </div>

        {/* Time Range Buttons */}
        <div className="flex gap-2">
          <Button
            variant={timeRange === "7" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("7")}
            className="text-xs"
          >
            7 أيام
          </Button>
          <Button
            variant={timeRange === "30" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("30")}
            className="text-xs"
          >
            30 يوم
          </Button>
          <Button
            variant={timeRange === "90" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("90")}
            className="text-xs"
          >
            3 شهور
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-72">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#fb923c" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
                opacity={0.5}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#fb923c"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorVisitors)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">لا توجد بيانات متاحة</p>
          </div>
        )}
      </div>
    </div>
  );
}
