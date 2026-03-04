import { Building2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import API from "@/api";

interface TopProperty {
  id: string;
  name: string;
  area: string;
  price: number;
  rooms: number;
  images_count: number;
  featured: boolean;
}

export function TopProperties() {
  const [properties, setProperties] = useState<TopProperty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProperties = async () => {
      try {
        const response = await API.get("/analytics/top_properties/", { params: { limit: 5 } });
        setProperties(response.data || []);
      } catch (error) {
        console.error("Error fetching top properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopProperties();
  }, []);

  return (
    <div className="card-glow rounded-xl bg-card p-4 lg:p-6 border border-border">
      <div className="mb-4 lg:mb-6 flex items-center justify-between">
        <h3 className="text-base lg:text-lg font-semibold">⭐ أبرز العقارات</h3>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : properties.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">لا توجد عقارات</p>
      ) : (
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
                <p className="text-xs text-muted-foreground truncate">{property.area}</p>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs">{property.price.toLocaleString()} ج.م</span>
                </div>
                <p className="text-xs text-muted-foreground">{property.rooms} غرف</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
