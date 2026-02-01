import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: "up" | "down";
  };
  icon: LucideIcon;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "cyan";
  loading?: boolean;
}

export function StatCard({ title, value, change, icon: Icon, color = "blue", loading = false }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    red: "bg-red-50 text-red-600 border-red-200",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-200",
  };

  const iconClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
    cyan: "bg-cyan-100 text-cyan-600",
  };

  const trendClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
    red: "text-red-600",
    cyan: "text-cyan-600",
  };

  return (
    <div className={cn("rounded-lg p-6 lg:p-8 bg-white border", colorClasses[color])}>
      <div className="flex items-start justify-between">
        <div className="text-left">
          <p className="text-sm text-gray-600 font-normal">{title}</p>
          {loading ? (
            <div className="h-10 w-24 mt-3 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-3xl lg:text-4xl font-bold mt-3 text-gray-900">{value}</p>
          )}
          {change && !loading && (
            <div className={cn("mt-2 flex items-center gap-1", change.trend === "up" ? trendClasses[color] : "text-red-600")}>
              {change.trend === "up" ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="text-xs lg:text-sm font-medium">
                {change.trend === "up" ? "+" : "-"}{change.value}%
              </span>
            </div>
          )}
        </div>
        <div className={cn("flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl", iconClasses[color])}>
          <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
        </div>
      </div>
    </div>
  );
}

