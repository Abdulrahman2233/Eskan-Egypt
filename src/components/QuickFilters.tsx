import React from "react";
import { motion } from "framer-motion";
import { Users, Home, Radio, Waves } from "lucide-react";

interface QuickFiltersProps {
  onFilterSelect: (usageType: string) => void;
  activeFilter?: string | null;
  className?: string;
  align?: "start" | "center";
}

const QUICK_FILTER_OPTIONS = [
  {
    id: "students",
    label: "طلاب",
    mobileLabel: "طلاب",
    icon: Users,
    activeColor: "bg-blue-600 hover:bg-blue-700",
    inactiveColor: "bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
    textColor: "text-slate-700",
    activeTextColor: "text-white",
  },
  {
    id: "families",
    label: "عائلات",
    mobileLabel: "عائلات",
    icon: Home,
    activeColor: "bg-blue-600 hover:bg-blue-700",
    inactiveColor: "bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
    textColor: "text-slate-700",
    activeTextColor: "text-white",
  },
  {
    id: "studio",
    label: "استوديو",
    mobileLabel: "استوديو",
    icon: Radio,
    activeColor: "bg-blue-600 hover:bg-blue-700",
    inactiveColor: "bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
    textColor: "text-slate-700",
    activeTextColor: "text-white",
  },
  {
    id: "vacation",
    label: "مصيفين / حجز يومي",
    mobileLabel: "مصيفين/يومي",
    icon: Waves,
    activeColor: "bg-blue-600 hover:bg-blue-700",
    inactiveColor: "bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
    textColor: "text-slate-700",
    activeTextColor: "text-white",
  },
];

const QuickFiltersComponent: React.FC<QuickFiltersProps> = ({
  onFilterSelect,
  activeFilter,
  className,
  align = "start",
}) => {
  const justifyClass = align === "center" ? "justify-center" : "justify-start";

  return (
    <div className={className}>
      <div className={`flex flex-wrap items-center gap-2 ${justifyClass}`}>
        {QUICK_FILTER_OPTIONS.map((filter, index) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;

          return (
            <motion.button
              key={filter.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onFilterSelect(filter.id)}
              className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-full border px-3 text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? `${filter.activeColor} ${filter.activeTextColor} shadow-md`
                  : `${filter.inactiveColor} ${filter.textColor}`
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="sm:hidden">{filter.mobileLabel}</span>
              <span className="hidden sm:inline">{filter.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export const QuickFilters = React.memo(QuickFiltersComponent);
