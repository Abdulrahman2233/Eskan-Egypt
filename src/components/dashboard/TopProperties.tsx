import { Eye, TrendingUp } from "lucide-react";

interface Property {
  id: string;
  name: string;
  location: string;
  views: number;
  trend: number;
}

interface TopPropertiesProps {
  properties?: Array<{
    id: string;
    name: string;
    area: string;
    price?: number;
    rooms?: number;
    images_count?: number;
    featured?: boolean;
  }>;
}

export function TopProperties({ properties: propsProperties }: TopPropertiesProps) {
  const defaultProperties: Property[] = [
    { id: "1", name: "فيلا فاخرة", location: "حي النرجس، الرياض", views: 1250, trend: 12 },
    { id: "2", name: "شقة عصرية", location: "حي الملقا، الرياض", views: 980, trend: 8 },
    { id: "3", name: "دوبلكس راقي", location: "حي الياسمين", views: 756, trend: 15 },
    { id: "4", name: "قصر ملكي", location: "حي حطين", views: 654, trend: 5 },
  ];

  const properties: Property[] = propsProperties && propsProperties.length > 0
    ? propsProperties.map((prop, index) => ({
        id: prop.id,
        name: prop.name,
        location: prop.area,
        views: prop.price || 0,
        trend: prop.rooms || 0
      }))
    : defaultProperties;
  return (
    <div className="card-glow rounded-xl bg-card p-4 lg:p-6 border border-border">
      <div className="mb-4 lg:mb-6 flex items-center justify-between">
        <h3 className="text-base lg:text-lg font-semibold">⭐ الأكثر مشاهدة</h3>
        <button className="text-xs lg:text-sm text-primary hover:underline">عرض الكل</button>
      </div>
      
      <div className="space-y-3">
        {properties.map((property, index) => (
          <div
            key={property.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <span className="text-lg font-bold text-muted-foreground w-5">{index + 1}</span>
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
              {property.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{property.name}</p>
              <p className="text-xs text-muted-foreground truncate">{property.location}</p>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1 text-sm font-medium">
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs">{property.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="h-3 w-3" />
                +{property.trend}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
