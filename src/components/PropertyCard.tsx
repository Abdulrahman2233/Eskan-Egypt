import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Bed, Bath, Maximize2, MapPin, Percent, Heart } from "lucide-react";

const backendUrl = "https://abdo238923.pythonanywhere.com";

// 🔹 دالة تحويل نوع الاستخدام من الإنجليزية إلى العربية
const getUsageTypeInArabic = (type: string | null | undefined): string => {
  if (!type) return "";
  const typeMapping: Record<string, string> = {
    families: "عائلات",
    students: "طلاب",
    studio: "استوديو",
    vacation: "مصيفي",
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
    usage_type?: string;
  };
}

export const PropertyCard = ({ property }: PropertyCardProps) => {
  // معالجة المنطقة
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
    <Card className="property-card overflow-hidden group">
      <div className="relative h-64 overflow-hidden">
        {/* عرض الصورة */}
        <img
          src={getImageUrl()}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.onerror = null;
            const parent = e.currentTarget.parentElement;
            e.currentTarget.style.display = "none";
            if (parent) {
              parent.innerHTML = `
                <div style="width:100%; height:100%; background:#f3f3f3; display:flex; flex-direction:column; justify-content:center; align-items:center; color:#666;">
                  <span>الصورة غير متاحة</span>
                </div>
              `;
            }
          }}
        />
        
        {/* طبقة التظليل */}
        <div className="card-gradient-overlay absolute inset-0" />
        
        {/* شارة الخصم */}
        {property.discount && property.discount > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-lg px-2 py-1 text-xs font-bold flex items-center gap-1">
              <Percent className="h-3 w-3" />
              <span>خصم {property.discount}%</span>
            </Badge>
          </div>
        )}
        
        {/* 🔹 شارة نوع الاستخدام (بدل مميز) */}
        {property.usage_type && (
          <Badge className={`absolute ${property.discount ? 'top-10' : 'top-4'} left-4 bg-primary text-primary-foreground font-bold`}>
            {getUsageTypeInArabic(property.usage_type) || property.usage_type_ar || property.usage_type}
          </Badge>
        )}
        
        {/* السعر */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="bg-background/95 backdrop-blur-sm px-4 py-2 rounded-lg">
            <div className="flex flex-col">
              {/* السعر الأصلي إذا كان هناك خصم */}
              {property.original_price && property.discount && (
                <span className="text-xs text-muted-foreground line-through">
                  {property.original_price.toLocaleString()} جنيه
                </span>
              )}
              <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-bold ${property.discount ? 'text-red-500' : 'text-primary'}`}>
                  {property.price?.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">جنيه/شهر</span>
              </div>
            </div>
          </div>
          
          {/* شارة المدخرات */}
          {property.original_price && property.discount && (
            <div className="bg-green-500/90 backdrop-blur-sm px-2 py-1 rounded-lg">
              <span className="text-xs text-white font-medium">
                وفّر {(property.original_price - property.price).toLocaleString()} جنيه
              </span>
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* العنوان والمنطقة */}
          <div>
            <h3 className="font-bold text-lg mb-1 line-clamp-1">
              {property.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" style={{ color: "#fbbd23" }} />
              <span>{areaName}</span>
            </div>
          </div>
          
          {/* تفاصيل العقار */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4 text-muted-foreground" />
              <span>{property.rooms} غرف</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4 text-muted-foreground" />
              <span>{property.bathrooms} حمام</span>
            </div>
            <div className="flex items-center gap-1">
              <Maximize2 className="h-4 w-4 text-muted-foreground" />
              <span>{property.size} م²</span>
            </div>
          </div>
          
          {/* 🔹 الوسوم - بدون usage_type (لأنه في الأعلى الآن) */}
          <div className="flex gap-2 flex-wrap">
            {/* نوع العقار الأساسي */}
            {property.type && (
              <Badge variant="outline">
                {property.type}
              </Badge>
            )}
            
            {/* حالة الأثاث */}
            <Badge variant="outline">
              {property.furnished ? "مفروشة" : "غير مفروشة"}
            </Badge>
            
            {/* الطابق */}
            {property.floor && (
              <Badge variant="outline">الطابق {property.floor}</Badge>
            )}
            
        {/* مميز (إذا كان featured = true) */}
              {property.featured && (
                <Badge className="bg-[#ffb914] text-black hover:bg-[#e6a813] transition-colors">
                  مميز
                </Badge>
              )}
          </div>
          
          {/* الأزرار */}
          <div className="flex gap-2 pt-2">
            <Button asChild className="flex-1">
              <Link to={`/property/${property.id}`}>عرض التفاصيل</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
