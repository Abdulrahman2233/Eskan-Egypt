import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

interface AdvancedStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: number;
    trend: "up" | "down";
  };
  icon: LucideIcon;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "cyan";
  loading?: boolean;
  accentColor?: string;
}

export function AdvancedStatCard({ 
  title, 
  value, 
  subtitle,
  change, 
  icon: Icon, 
  color = "blue", 
  loading = false,
  accentColor
}: AdvancedStatCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses = {
    blue: { bg: "bg-gradient-to-br from-blue-500/10 to-blue-600/5", border: "border-blue-200", icon: "bg-blue-100 text-blue-600", text: "text-blue-600" },
    green: { bg: "bg-gradient-to-br from-green-500/10 to-green-600/5", border: "border-green-200", icon: "bg-green-100 text-green-600", text: "text-green-600" },
    purple: { bg: "bg-gradient-to-br from-purple-500/10 to-purple-600/5", border: "border-purple-200", icon: "bg-purple-100 text-purple-600", text: "text-purple-600" },
    orange: { bg: "bg-gradient-to-br from-orange-500/10 to-orange-600/5", border: "border-orange-200", icon: "bg-orange-100 text-orange-600", text: "text-orange-600" },
    red: { bg: "bg-gradient-to-br from-red-500/10 to-red-600/5", border: "border-red-200", icon: "bg-red-100 text-red-600", text: "text-red-600" },
    cyan: { bg: "bg-gradient-to-br from-cyan-500/10 to-cyan-600/5", border: "border-cyan-200", icon: "bg-cyan-100 text-cyan-600", text: "text-cyan-600" },
  };

  const selectedColor = colorClasses[color];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative rounded-xl border transition-all duration-300 overflow-hidden
        ${selectedColor.bg} ${selectedColor.border}
        ${isHovered ? "shadow-lg scale-105" : "shadow-md"}
        bg-white/60 backdrop-blur-sm p-5 lg:p-6
      `}
    >
      {/* Decorative gradient background */}
      <div className={`absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 rounded-full opacity-20 blur-2xl transition-all duration-300 ${
        isHovered ? "scale-150" : "scale-100"
      }`} style={{ background: accentColor || `linear-gradient(135deg, var(--color-${color}), var(--color-${color}-light))` }}></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs lg:text-sm text-gray-500 font-medium uppercase tracking-wide">{title}</p>
            {loading ? (
              <div className="h-10 w-32 mt-3 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <h3 className="text-3xl lg:text-4xl font-bold mt-2 text-gray-900 tracking-tight">{value}</h3>
            )}
            {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
          </div>
          <div className={`${selectedColor.icon} p-3 rounded-lg transition-all duration-300 ${isHovered ? "scale-110 shadow-lg" : ""}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>

        {change && !loading && (
          <div className={`flex items-center gap-2 mt-4 ${change.trend === "up" ? "text-green-600" : "text-red-600"}`}>
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium ${
              change.trend === "up" 
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}>
              {change.trend === "up" ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{change.trend === "up" ? "+" : ""}{change.value}%</span>
            </div>
            <span className="text-xs text-gray-500">مقارنة بالشهر السابق</span>
          </div>
        )}
      </div>

      {/* Bottom accent bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
        change?.trend === "up" ? "from-green-400 to-emerald-600" : "from-orange-400 to-red-600"
      } transition-all duration-300`}></div>
    </div>
  );
}
