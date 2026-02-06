import { TrendingUp, TrendingDown, DollarSign, Calendar, CalendarDays, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
  performance: "excellent" | "good" | "warning" | "poor";
  subtitle: string;
}

const getPerformanceColor = (performance: StatCard["performance"]) => {
  switch (performance) {
    case "excellent":
      return "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30";
    case "good":
      return "from-green-500/20 to-green-600/10 border-green-500/30";
    case "warning":
      return "from-orange-500/20 to-orange-600/10 border-orange-500/30";
    case "poor":
      return "from-red-500/20 to-red-600/10 border-red-500/30";
  }
};

const getPerformanceIconBg = (performance: StatCard["performance"]) => {
  switch (performance) {
    case "excellent":
      return "bg-emerald-500";
    case "good":
      return "bg-green-500";
    case "warning":
      return "bg-orange-500";
    case "poor":
      return "bg-red-500";
  }
};

const getPerformanceTextColor = (performance: StatCard["performance"]) => {
  switch (performance) {
    case "excellent":
      return "text-emerald-600 dark:text-emerald-400";
    case "good":
      return "text-green-600 dark:text-green-400";
    case "warning":
      return "text-orange-600 dark:text-orange-400";
    case "poor":
      return "text-red-600 dark:text-red-400";
  }
};

interface ProfitStatsCardsProps {
  transactions?: Transaction[];
}

export function ProfitStatsCards({ transactions = [] }: ProfitStatsCardsProps) {
  // حساب الإحصائيات من البيانات الفعلية
  const totalProfit = transactions.reduce((sum, t) => sum + t.profit, 0);
  
  // حساب أرباح الشهر الحالي
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthProfit = transactions
    .filter((t) => {
      const transDate = new Date(t.date);
      return transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.profit, 0);
  
  // حساب أرباح الأسبوع الحالي
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekProfit = transactions
    .filter((t) => new Date(t.date) >= weekAgo)
    .reduce((sum, t) => sum + t.profit, 0);
  
  // حساب أرباح اليوم
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayProfit = transactions
    .filter((t) => new Date(t.date) >= todayStart)
    .reduce((sum, t) => sum + t.profit, 0);

  // تحديد الأداء بناءً على الأرقام
  const getPerformance = (value: number, threshold: number): StatCard["performance"] => {
    if (value >= threshold * 0.8) return "excellent";
    if (value >= threshold * 0.5) return "good";
    if (value >= threshold * 0.2) return "warning";
    return "poor";
  };

  const stats: StatCard[] = [
    {
      title: "إجمالي أرباح الموقع",
      value: totalProfit,
      icon: <DollarSign className="h-5 w-5" />,
      performance: "excellent",
      subtitle: "جميع الصفقات المسجلة",
    },
    {
      title: "أرباح الشهر",
      value: monthProfit,
      icon: <Calendar className="h-5 w-5" />,
      trend: monthProfit > 0 ? 12.5 : -5.2,
      performance: getPerformance(monthProfit, 100000),
      subtitle: "من أول الشهر حتى اليوم",
    },
    {
      title: "أرباح الأسبوع",
      value: weekProfit,
      icon: <CalendarDays className="h-5 w-5" />,
      trend: weekProfit > 15000 ? 8.3 : -5.2,
      performance: getPerformance(weekProfit, 30000),
      subtitle: "آخر 7 أيام",
    },
    {
      title: "أرباح اليوم",
      value: todayProfit,
      icon: <Clock className="h-5 w-5" />,
      performance: getPerformance(todayProfit, 5000),
      subtitle: "الصفقات المكتملة اليوم",
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ar-EG", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={cn(
            "relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 lg:p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] aspect-square sm:aspect-auto",
            getPerformanceColor(stat.performance)
          )}
        >
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-x-16 -translate-y-16" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg",
                  getPerformanceIconBg(stat.performance)
                )}
              >
                {stat.icon}
              </div>
              
              {stat.trend !== undefined && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded-full",
                    stat.trend >= 0
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  )}
                >
                  {stat.trend >= 0 ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  <span>{Math.abs(stat.trend)}%</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p
                className={cn(
                  "text-2xl lg:text-3xl font-bold",
                  getPerformanceTextColor(stat.performance)
                )}
              >
                {formatCurrency(stat.value)}
              </p>
              <p className="text-xs text-muted-foreground mt-2">{stat.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
