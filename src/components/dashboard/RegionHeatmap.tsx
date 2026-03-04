import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import API from "@/api";

interface Region {
  name: string;
  count: number;
  intensity: number;
}

export function RegionHeatmap() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await API.get("/analytics/areas/");
        const areas = response.data || [];
        const maxCount = areas.length > 0 ? Math.max(...areas.map((a: any) => a.property_count)) : 1;
        const mapped: Region[] = areas.map((area: any) => ({
          name: area.name,
          count: area.property_count,
          intensity: Math.round((area.property_count / maxCount) * 100),
        }));
        setRegions(mapped);
      } catch (error) {
        console.error("Error fetching areas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAreas();
  }, []);

  return (
    <div className="rounded-lg p-6 lg:p-8 bg-white border border-gray-200">
      <div className="mb-6 lg:mb-8">
        <h3 className="text-lg lg:text-xl font-semibold text-gray-900">📍 التوزيع الجغرافي</h3>
        <p className="text-sm text-gray-600 mt-1">حسب المنطقة</p>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : regions.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">لا توجد بيانات مناطق</p>
      ) : (
        <div className="grid grid-cols-2 gap-2 lg:gap-3">
          {regions.map((region) => (
            <div
              key={region.name}
              className="relative overflow-hidden rounded-lg p-3 lg:p-4 transition-transform hover:scale-105 border border-border"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(14, 165, 233, ${region.intensity / 100 * 0.15}) 0%, 
                  rgba(20, 184, 166, ${region.intensity / 100 * 0.08}) 100%)`,
              }}
            >
              <p className="font-medium text-sm">{region.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {region.count.toLocaleString()} عقار
              </p>
              <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all"
                  style={{ width: `${region.intensity}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
