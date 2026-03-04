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
  const gradientClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-amber-500",
    red: "from-red-500 to-red-600",
    cyan: "from-cyan-500 to-cyan-600",
  };

  const glowClasses = {
    blue: "shadow-blue-500/20",
    green: "shadow-emerald-500/20",
    purple: "shadow-purple-500/20",
    orange: "shadow-orange-500/20",
    red: "shadow-red-500/20",
    cyan: "shadow-cyan-500/20",
  };

  const iconBgClasses = {
    blue: "bg-white/20",
    green: "bg-white/20",
    purple: "bg-white/20",
    orange: "bg-white/20",
    red: "bg-white/20",
    cyan: "bg-white/20",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-5 lg:p-6 bg-gradient-to-br text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5",
        gradientClasses[color],
        glowClasses[color]
      )}
    >
      {/* Decorative background circles */}
      <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-white/10 blur-sm" />
      <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-white/[0.07]" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-white/80">{title}</p>
          {loading ? (
            <div className="h-9 w-20 mt-1 bg-white/20 rounded-lg animate-pulse" />
          ) : (
            <p className="text-3xl lg:text-4xl font-extrabold tracking-tight">{value}</p>
          )}
          {change && !loading && (
            <div
              className={cn(
                "mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                change.trend === "up"
                  ? "bg-white/20 text-white"
                  : "bg-red-400/30 text-red-100"
              )}
            >
              {change.trend === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>
                {change.trend === "up" ? "+" : "-"}{change.value}%
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-2xl backdrop-blur-sm",
            iconBgClasses[color]
          )}
        >
          <Icon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
        </div>
      </div>
    </div>
  );
}

