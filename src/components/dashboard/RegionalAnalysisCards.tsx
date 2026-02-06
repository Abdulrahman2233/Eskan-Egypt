import { Building2, TrendingUp, Eye, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface RegionData {
  name: string;
  totalProperties: number;
  growth: number;
  views: number;
  avgSellTime: string;
  color: string;
}

const regionsData: RegionData[] = [
  { name: "الرياض", totalProperties: 450, growth: 15, views: 12500, avgSellTime: "18 يوم", color: "from-blue-500 to-cyan-500" },
  { name: "جدة", totalProperties: 320, growth: 12, views: 8900, avgSellTime: "22 يوم", color: "from-emerald-500 to-teal-500" },
  { name: "الدمام", totalProperties: 180, growth: 8, views: 4500, avgSellTime: "25 يوم", color: "from-purple-500 to-pink-500" },
  { name: "مكة", totalProperties: 150, growth: 20, views: 6200, avgSellTime: "15 يوم", color: "from-amber-500 to-orange-500" },
  { name: "المدينة", totalProperties: 120, growth: 10, views: 3800, avgSellTime: "28 يوم", color: "from-rose-500 to-red-500" },
  { name: "الخبر", totalProperties: 95, growth: 18, views: 2900, avgSellTime: "20 يوم", color: "from-indigo-500 to-violet-500" },
];

export function RegionalAnalysisCards() {
  return (
    <div className="card-glow rounded-xl bg-card p-4 lg:p-6 border border-border">
      <div className="mb-4 lg:mb-6">
        <h3 className="text-lg font-semibold">🏢 تحليل العقارات حسب المنطقة</h3>
        <p className="text-sm text-muted-foreground">إحصائيات تفصيلية لكل منطقة</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {regionsData.map((region) => (
          <div
            key={region.name}
            className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-background to-secondary/30 p-4 hover:shadow-lg transition-all duration-300"
          >
            {/* Gradient accent */}
            <div className={cn("absolute top-0 right-0 w-24 h-24 opacity-20 rounded-bl-full bg-gradient-to-br", region.color)} />
            
            <div className="relative">
              {/* Region name */}
              <h4 className="text-lg font-bold mb-3">{region.name}</h4>
              
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">العقارات</p>
                    <p className="font-semibold text-sm">{region.totalProperties}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">النمو</p>
                    <p className="font-semibold text-sm text-emerald-600">+{region.growth}%</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Eye className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">المشاهدات</p>
                    <p className="font-semibold text-sm">{region.views.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">متوسط البيع</p>
                    <p className="font-semibold text-sm">{region.avgSellTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
