import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Bed, Bath, Maximize2, MapPin, Tag, Eye, Calendar, ChevronLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const backendUrl = "https://abdo238923.pythonanywhere.com";

// 🔹 دالة تحويل نوع الاستخدام من الإنجليزية إلى العربية
const getUsageTypeInArabic = (type: string | null | undefined): string => {
  if (!type) return "";
  const typeMapping: Record<string, string> = {
    families: "عائلات",
    students: "طلاب",
    studio: "استوديو",
    vacation: "مصيفين",
    daily: "حجز يومي",
  };
  return typeMapping[type] || type;
};

interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    price: number;
    original_price?: number;
    discount?: number;
    images?: Array<{ image_url: string }>;
    rooms?: number;
    bathrooms?: number;
    size?: number;
    area?: { name: string } | string;
    area_data?: { name: string };
    usage_type?: string;
    type?: string;
    featured?: boolean;
    furnished?: boolean;
    floor?: number;
  };
  variant?: "grid" | "list";
}

export const PropertyCard = ({ property, variant = "grid" }: PropertyCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const isListView = variant === "list";
  const areaName =
    typeof property.area_data === "object" && property.area_data !== null
      ? property.area_data.name
      : typeof property.area === "object" && property.area !== null
      ? property.area.name
      : property.area || "غير محدد";
  
  // دالة لاستخراج رابط الصورة الصحيح
  const getImageUrl = () => {
    const img = property.images?.[0]?.image_url;
    if (!img) return "/default.jpg";
    if (img.startsWith("http")) return img;
    return `${backendUrl}${img}`;
  };

  return (
    <div className="h-full">
      <Card className={cn(
        "group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 bg-card h-full hover:-translate-y-1",
        isListView && "flex flex-col sm:flex-row"
      )}>
        {/* Image Section */}
        <div className={cn(
          "relative overflow-hidden",
          isListView ? "h-48 sm:h-auto sm:w-72 lg:w-80 flex-shrink-0" : "h-52 sm:h-56"
        )}>
          {/* Skeleton Loader */}
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
          
          <img 
            src={getImageUrl()}
            alt={property.name}
            className={cn(
              "w-full h-full object-cover transition-all duration-700 group-hover:scale-110",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
          
          {/* Top Badges Row */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {/* Right Side: Discount & Featured */}
            <div className="flex flex-col gap-2">
              {/* Discount Badge */}
              {property.discount && property.discount > 0 && (
                <div>
                  <Badge className="bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-lg px-2.5 py-1 text-xs font-bold flex items-center gap-1.5 rounded-full">
                    <Tag className="h-3 w-3" />
                    <span>خصم {property.discount}%</span>
                  </Badge>
                </div>
              )}
              
              {/* Featured Badge */}
              {property.featured && (
                <Badge className="bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 border-0 shadow-lg px-2.5 py-1 text-xs font-bold flex items-center gap-1.5 rounded-full">
                  <Sparkles className="h-3 w-3" />
                  <span>مميز</span>
                </Badge>
              )}
            </div>
            
            {/* Left Side: Usage Type */}
            <div className="flex flex-col gap-2">
              {/* Usage Type Badge */}
              {property.usage_type && (
                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg px-2.5 py-1 text-xs font-bold rounded-full">
                  {getUsageTypeInArabic(property.usage_type)}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Image Count Indicator */}
          {property.images && property.images.length > 1 && (
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{property.images.length} صور</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className={cn(
          "flex flex-col",
          isListView ? "flex-1 p-4 sm:p-5" : "p-4"
        )}>
          {/* Price Section */}
          <div className="mb-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                {/* Original Price if discount exists */}
                {property.original_price && property.discount && (
                  <span className="text-sm text-muted-foreground line-through block">
                    {property.original_price.toLocaleString()} جنيه
                  </span>
                )}
                <div className="flex items-baseline gap-1.5">
                  <span className={cn(
                    "text-2xl sm:text-3xl font-bold",
                    property.discount ? "text-red-500" : "text-primary"
                  )}>
                    {property.price?.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">جنيه/شهر</span>
                </div>
              </div>
              
              {/* Savings Badge */}
              {property.original_price && property.discount && (
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 px-2.5 py-1 rounded-lg">
                  <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                    وفّر {(property.original_price - property.price).toLocaleString()} جنيه
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Title & Location */}
          <div className="mb-3">
            <h3 className="font-bold text-lg leading-tight line-clamp-1 mb-1.5 group-hover:text-primary transition-colors">
              {property.name}
            </h3>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0 text-primary/70" />
              <span className="text-sm truncate">{areaName}</span>
            </div>
          </div>

          {/* Property Features */}
          <div className={cn(
            "grid gap-2 mb-4",
            isListView ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"
          )}>
            <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2">
              <Bed className="h-4 w-4 text-primary" />
              <div className="text-sm">
                <span className="font-semibold">{property.rooms}</span>
                <span className="text-muted-foreground mr-1">غرف</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2">
              <Bath className="h-4 w-4 text-primary" />
              <div className="text-sm">
                <span className="font-semibold">{property.bathrooms}</span>
                <span className="text-muted-foreground mr-1">حمام</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2">
              <Maximize2 className="h-4 w-4 text-primary" />
              <div className="text-sm">
                <span className="font-semibold">{property.size}</span>
                <span className="text-muted-foreground mr-1">م²</span>
              </div>
            </div>
            {isListView && property.floor && (
              <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2">
                <Calendar className="h-4 w-4 text-primary" />
                <div className="text-sm">
                  <span className="font-semibold">الطابق {property.floor}</span>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {property.discount && (
              <Badge variant="destructive" className="text-xs rounded-full px-2.5 animate-pulse">
                عرض خاص
              </Badge>
            )}
            <Badge variant="outline" className="text-xs rounded-full px-2.5 bg-background">
              {property.furnished ? "مفروشة" : "غير مفروشة"}
            </Badge>
            {!isListView && property.floor && (
              <Badge variant="outline" className="text-xs rounded-full px-2.5 bg-background">
                الطابق {property.floor}
              </Badge>
            )}
          </div>

          {/* Spacer for list view */}
          {isListView && <div className="flex-1" />}

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            <Button asChild className="flex-1 h-11 text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all group/btn">
              <Link to={`/property/${property.id}`} className="flex items-center justify-center gap-2">
                عرض التفاصيل
                <ChevronLeft className="h-4 w-4 transition-transform group-hover/btn:-translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
