import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Users, Home, Radio, Waves } from "lucide-react";

interface QuickFiltersProps {
  onFilterSelect: (usageType: string) => void;
  activeFilter?: string | null;
}

const QUICK_FILTER_OPTIONS = [
  {
    id: "students",
    label: "طلاب",
    icon: Users,
    activeColor: "bg-blue-600 hover:bg-blue-700",
    inactiveColor: "bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
    textColor: "text-slate-700",
    activeTextColor: "text-white",
  },
  {
    id: "families",
    label: "عائلات",
    icon: Home,
    activeColor: "bg-blue-600 hover:bg-blue-700",
    inactiveColor: "bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
    textColor: "text-slate-700",
    activeTextColor: "text-white",
  },
  {
    id: "studio",
    label: "استوديو",
    icon: Radio,
    activeColor: "bg-blue-600 hover:bg-blue-700",
    inactiveColor: "bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
    textColor: "text-slate-700",
    activeTextColor: "text-white",
  },
  {
    id: "vacation",
    label: "مصيفين / حجز يومي",
    icon: Waves,
    activeColor: "bg-blue-600 hover:bg-blue-700",
    inactiveColor: "bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
    textColor: "text-slate-700",
    activeTextColor: "text-white",
  },
];

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  onFilterSelect,
  activeFilter,
}) => {
  return (
    <div className="mb-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {QUICK_FILTER_OPTIONS.map((filter, index) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.id;

          return (
            <motion.div
              key={filter.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                onClick={() => onFilterSelect(filter.id)}
                className={`w-full h-auto flex flex-col items-center justify-center gap-1.5 py-3 px-3 rounded-lg transition-all duration-200 font-medium text-xs ${
                  isActive
                    ? `${filter.activeColor} ${filter.activeTextColor} shadow-md`
                    : `${filter.inactiveColor} ${filter.textColor}`
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{filter.label}</span>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
