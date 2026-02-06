interface Region {
  name: string;
  count: number;
  intensity: number;
}

interface RegionHeatmapProps {
  areas?: Array<{
    name: string;
    property_count: number;
  }>;
}

export function RegionHeatmap({ areas = [] }: RegionHeatmapProps) {
  // تحويل البيانات وحساب الـ intensity بناءً على أعلى قيمة
  const maxCount = areas.length > 0 ? Math.max(...areas.map(a => a.property_count)) : 100;
  
  const regions: Region[] = areas.length > 0 
    ? areas.map(area => ({
        name: area.name,
        count: area.property_count,
        intensity: Math.round((area.property_count / maxCount) * 100)
      }))
    : [
        { name: "الرياض", count: 450, intensity: 100 },
        { name: "جدة", count: 320, intensity: 71 },
        { name: "الدمام", count: 180, intensity: 40 },
        { name: "مكة", count: 150, intensity: 33 },
        { name: "المدينة", count: 120, intensity: 27 },
        { name: "الخبر", count: 95, intensity: 21 },
      ];
  return (
    <div className="rounded-lg p-6 lg:p-8 bg-white border border-gray-200">
      <div className="mb-6 lg:mb-8">
        <h3 className="text-lg lg:text-xl font-semibold text-gray-900">📍 التوزيع الجغرافي</h3>
        <p className="text-sm text-gray-600 mt-1">حسب المنطقة</p>
      </div>
      
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
    </div>
  );
}
