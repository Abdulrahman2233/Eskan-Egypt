import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { Search, X, MapPin, Home, DoorOpen, Sofa, Coins } from "lucide-react";

interface SearchFiltersProps {
  onSearch: (filters: Record<string, unknown> | Filters) => void;
  initialArea?: string;
  areas?: { id: number; name: string }[];
}

interface Filters {
  area: string;
  priceRange: number[];
  rooms: string;
  usageType: string;
  furnished: string;
}

// 🔹 الخيارات الثابتة لأنواع الاستخدام (نفس القديمة)
const USAGE_TYPES = [
  { value: "students", label: "طلاب" },
  { value: "families", label: "عائلات" },
  { value: "studio", label: "استوديو" },
  { value: "vacation", label: "مصيفين" },
  { value: "daily", label: "حجز يومي" },
];

export const SearchFilters = React.memo(({ onSearch, initialArea, areas = [] }: SearchFiltersProps) => {
  const [area, setArea] = useState(initialArea || "");
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [rooms, setRooms] = useState("");
  const [usageType, setUsageType] = useState("");   // بدل propertyType
  const [furnished, setFurnished] = useState("");

  const handleSearch = () => {
    onSearch({
      area,
      priceRange,
      rooms,
      usageType,   // إرسال usageType في الفلاتر
      furnished,
    });
  };

  const handleReset = () => {
    setArea("");
    setPriceRange([0, 20000]);
    setRooms("");
    setUsageType("");
    setFurnished("");
    onSearch({});
  };

  const hasActiveFilters =
    area ||
    rooms ||
    usageType ||
    furnished ||
    priceRange[0] > 0 ||
    priceRange[1] < 20000;

  return (
    <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold">بحث متقدم</h3>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-destructive hover:text-destructive"
              >
                <X className="h-4 w-4 ml-1" />
                مسح الكل
              </Button>
            )}
          </div>

          {/* Filters */}
          <div className="space-y-4">
            {/* المنطقة */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                المنطقة
              </Label>
              {areas.length === 0 ? (
                <div className="h-11 bg-background/50 rounded-md flex items-center justify-center">
                  <p className="text-gray-500 text-sm">جارٍ تحميل المناطق...</p>
                </div>
              ) : (
                <Select value={area} onValueChange={setArea}>
                  <SelectTrigger className="h-11 bg-background/50">
                    <SelectValue placeholder="اختر المنطقة" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((a) => (
                        <SelectItem key={a.id} value={a.name}>
                          {a.name}
                        </SelectItem>
                      ))}

                  </SelectContent>
                </Select>
              )}
            </div>

            {/* نوع الاستخدام (طلاب / عائلات ...إلخ) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Home className="h-4 w-4 text-muted-foreground" />
                نوع العقار
              </Label>
              <Select value={usageType} onValueChange={setUsageType}>
                <SelectTrigger className="h-11 bg-background/50">
                  <SelectValue placeholder="اختر نوع العقار" />
                </SelectTrigger>
                <SelectContent>
                  {USAGE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* عدد الغرف */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <DoorOpen className="h-4 w-4 text-muted-foreground" />
                عدد الغرف
              </Label>
              <Select value={rooms} onValueChange={setRooms}>
                <SelectTrigger className="h-11 bg-background/50">
                  <SelectValue placeholder="اختر عدد الغرف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 غرفة</SelectItem>
                  <SelectItem value="2">2 غرفة</SelectItem>
                  <SelectItem value="3">3 غرف</SelectItem>
                  <SelectItem value="4">4 غرف</SelectItem>
                  <SelectItem value="5+">5+ غرف</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* حالة الأثاث */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Sofa className="h-4 w-4 text-muted-foreground" />
                حالة الأثاث
              </Label>
              <Select value={furnished} onValueChange={setFurnished}>
                <SelectTrigger className="h-11 bg-background/50">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">مفروشة</SelectItem>
                  <SelectItem value="false">غير مفروشة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* السعر */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Coins className="h-4 w-4 text-muted-foreground" />
                نطاق السعر
              </Label>
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-primary">
                    {priceRange[0].toLocaleString()} جنيه
                  </span>
                  <span className="text-xs text-muted-foreground">إلى</span>
                  <span className="text-sm font-medium text-primary">
                    {priceRange[1].toLocaleString()} جنيه
                  </span>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={20000}
                  step={500}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  الإيجار الشهري
                </p>
              </div>
            </div>
          </div>

          {/* زر البحث */}
          <Button
            onClick={handleSearch}
            className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Search className="h-5 w-5 ml-2" />
            ابحث الآن
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});
