import { Card, CardContent } from "./ui/card";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface Area {
  id: number;
  name: string;
  property_count: number;
}

interface AreaCardProps {
  area: Area;
}

export const AreaCard = ({ area }: AreaCardProps) => {
  return (
    <Link to={`/properties?area=${encodeURIComponent(area.name)}`}>
      <Card className="property-card overflow-hidden hover:shadow-lg transition-all cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{area.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {area.property_count} عقار متاح
                </p>
              </div>
            </div>
            <div className="text-2xl text-primary">←</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
