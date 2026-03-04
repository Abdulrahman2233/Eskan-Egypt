import { Building2, TrendingUp, Eye, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import API from "@/api";

interface RegionData {
  name: string;
  totalProperties: number;
  avgPrice: number;
  totalValue: number;
  color: string;
}

const colorPalette = [
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-purple-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-red-500",
  "from-indigo-500 to-violet-500",
];

export function RegionalAnalysisCards() {
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAreaStats = async () => {
      try {
        const response = await API.get("/analytics/areas/");
        const areas = response.data || [];
        const mapped: RegionData[] = areas.slice(0, 6).map((area: any, index: number) => ({
          name: area.name,
          totalProperties: area.property_count || 0,
          avgPrice: Math.round(area.avg_price || 0),
          totalValue: Math.round(area.total_value || 0),
          color: colorPalette[index % colorPalette.length],
        }));
        setRegions(mapped);
      } catch (error) {
        console.error("Error fetching area stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAreaStats();
  }, []);

  if (loading) {
    return (
      <div className="card-glow rounded-xl bg-card p-4 lg:p-6 border border-border">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (regions.length === 0) {
    return (
      <div className="card-glow rounded-xl bg-card p-4 lg:p-6 border border-border">
        <h3 className="text-lg font-semibold mb-2">🏢 تحليل العقارات حسب المنطقة</h3>
        <p className="text-sm text-muted-foreground">لا توجد بيانات متاحة</p>
      </div>
    );
  }

  return (
    <div className="card-glow rounded-xl bg-card p-4 lg:p-6 border border-border">
      <div className="mb-4 lg:mb-6">
        <h3 className="text-lg font-semibold">🏢 تحليل العقارات حسب المنطقة</h3>
        <p className="text-sm text-muted-foreground">إحصائيات تفصيلية لكل منطقة</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions.map((region) => (
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
                    <p className="text-xs text-muted-foreground">متوسط السعر</p>
                    <p className="font-semibold text-sm text-emerald-600">{region.avgPrice.toLocaleString()} ج.م</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Eye className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">إجمالي القيمة</p>
                    <p className="font-semibold text-sm">{region.totalValue.toLocaleString()} ج.م</p>
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
