import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { SearchFilters } from "@/components/SearchFilters";
import { QuickFilters } from "@/components/QuickFilters";
import { useSearchParams, Link } from "react-router-dom";
import { API_URL } from "@/config";
import { fetchProperties } from "@/api";

import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  MapPin,
  Grid3X3,
  LayoutList,
  SlidersHorizontal,
  Home,
  TrendingUp,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// ----------- Interfaces -----------
interface Area {
  id: number;
  name: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
  price: number;
  area?: Area | string;
  area_data?: Area;
  rooms?: number;
  bathrooms?: number;
  size?: number;
  type?: string;
  usage_type?: string;
  usage_type_ar?: string;
  furnished?: boolean;
  floor?: number;
  featured?: boolean;
  images: { image_url: string }[];
}

interface Filters {
  area: string;
  rooms: string;
  usageType: string;
  furnished: string;
  priceRange: number[];
}

// ----------- Usage Type Labels -----------
const USAGE_TYPE_LABELS: { [key: string]: string } = {
  students: "طلاب",
  families: "عائلات",
  studio: "استوديو",
  vacation: "مصيفين",
  daily: "حجز يومي",
};

// EmptyState Component
const EmptyState = ({
  title,
  message,
  fullScreen = false,
}: {
  title: string;
  message: string;
  fullScreen?: boolean;
}) => (
  <motion.div
    key="no-results"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    className={`text-center ${fullScreen ? "py-24" : "py-16 sm:py-24"}`}
  >
    <div className="bg-muted/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
      <Building2 className="h-10 w-10 text-muted-foreground" />
    </div>
    <h3 className="text-xl sm:text-2xl font-bold mb-3">{title}</h3>
    <p className="text-muted-foreground max-w-md mx-auto">{message}</p>
  </motion.div>
);

const Properties: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialArea = searchParams.get("area") || "";

  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentFilters, setCurrentFilters] = useState<Filters | null>(null);
  const [areaError, setAreaError] = useState<string | null>(null);

  // واجهة جديدة
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [displayCount, setDisplayCount] = useState(6); // عدد العقارات المعروضة
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);

  // ----------- Fetch Properties -----------
  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      try {
        const data = await fetchProperties();
        setProperties(data);

        const initialFiltered = initialArea
          ? data.filter((p: Property) => {
              const pArea =
                typeof p.area_data === "object" && p.area_data?.name
                  ? p.area_data.name
                  : typeof p.area === "object" && p.area?.name
                  ? p.area.name
                  : p.area;
              return pArea === initialArea;
            })
          : data;

        setFilteredProperties(initialFiltered);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [initialArea]);

  // ----------- Handle Search (area required like old code) -----------
  const handleSearch = (filters: Filters) => {
    setCurrentFilters(filters);

    let filterCount = 0;

    // المنطقة إلزامية
    if (!filters.area) {
      setAreaError("من فضلك اختر المنطقة أولاً");
      setFilteredProperties([]);
      setActiveFilters(0);
      return;
    }

    setAreaError(null);

    let filtered = [...properties];

    // Area
    filtered = filtered.filter((p) => {
      const pArea =
        typeof p.area_data === "object" && p.area_data?.name
          ? p.area_data.name
          : typeof p.area === "object" && p.area?.name
          ? p.area.name
          : p.area;
      return pArea === filters.area;
    });
    filterCount++;

    // Rooms
    if (filters.rooms) {
      const roomCount = filters.rooms === "5+" ? 5 : Number(filters.rooms);
      filtered = filtered.filter((p) => {
        const propertyRooms = Number(p.rooms ?? 0);
        return filters.rooms === "5+"
          ? propertyRooms >= roomCount
          : propertyRooms === roomCount;
      });
      filterCount++;
    }

    // Usage Type (نوع الاستخدام)
    if (filters.usageType) {
      filtered = filtered.filter((p) => p.usage_type === filters.usageType);
      filterCount++;
    }

    // Furnished
    if (filters.furnished !== "" && filters.furnished !== null && filters.furnished !== undefined) {
      const isFurnished = filters.furnished === "true";
      filtered = filtered.filter((p) => p.furnished === isFurnished);
      filterCount++;
    }

    // Price Range
    if (filters.priceRange && filters.priceRange.length === 2) {
      const [min, max] = filters.priceRange;
      // نفس منطق القديم لكن نحسبه كفلتر مفعّل لو مش الديفولت لديك
      if (min > 0 || max < 20000) {
        filterCount++;
      }
      filtered = filtered.filter(
        (p) => Number(p.price) >= min && Number(p.price) <= max
      );
    }

    setActiveFilters(filterCount);
    setFilteredProperties(filtered);
    setIsFilterOpen(false);
  };

  // ----------- Handle Quick Filter (البحث السريع) -----------
  const handleQuickFilter = (usageType: string) => {
    setActiveQuickFilter(usageType);

    // إذا كانت المنطقة محددة بالفعل أو يوجد filters حالي
    if (currentFilters?.area) {
      // تطبيق الفلترة على الفلاتر الحالية
      const newFilters = {
        ...currentFilters,
        usageType: currentFilters.usageType === usageType ? "" : usageType,
      };
      handleSearch(newFilters);
    } else if (initialArea) {
      // إذا كانت هناك منطقة من URL
      const filters: Filters = {
        area: initialArea,
        rooms: "",
        usageType: usageType,
        furnished: "",
        priceRange: [0, 20000],
      };
      handleSearch(filters);
    } else {
      // إذا لم تكن هناك منطقة محددة، نطبق الفلترة على جميع البيانات
      let filtered = [...properties];
      filtered = filtered.filter((p) => p.usage_type === usageType);
      setFilteredProperties(filtered);
      setCurrentFilters({
        area: "",
        rooms: "",
        usageType: usageType,
        furnished: "",
        priceRange: [0, 20000],
      });
      setActiveFilters(1);
    }
  };

  // ----------- Empty Message -----------
  const getEmptyMessage = (): string => {
    if (!currentFilters) {
      return "لا توجد عقارات متاحة";
    }

    const reasons: string[] = [];

    if (currentFilters.usageType || currentFilters.area) {
      const parts: string[] = [];

      if (currentFilters.usageType) {
        const label =
          USAGE_TYPE_LABELS[currentFilters.usageType] ||
          currentFilters.usageType;
        parts.push(`لل${label}`);
      }

      if (currentFilters.area) {
        parts.push(`في منطقة ${currentFilters.area}`);
      }

      reasons.push(`لا توجد عقارات ${parts.join(" ")}`);
    }

    if (currentFilters.rooms) {
      reasons.push(`بعدد "${currentFilters.rooms}" غرف`);
    }

    return reasons.length
      ? reasons.join(" و ")
      : "لا توجد عقارات تطابق معايير البحث";
  };

  // ----------- Animations helpers -----------
  const stats = [
    { icon: Home, label: "عقار متاح", value: properties.length },
    { icon: MapPin, label: "منطقة", value: "15+" },
    { icon: TrendingUp, label: "صفقة هذا الشهر", value: "50+" },
    { icon: Star, label: "تقييم العملاء", value: "4.9" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Navbar />

      <main className="flex-1 mt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 py-12 sm:py-16 lg:py-20">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-secondary rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Building2 className="h-5 w-5 text-secondary" />
                <span className="text-white/90 text-sm font-medium">
                  اكتشف مكانك المناسب 
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                عقارات للإيجار في{" "}
                <span className="text-secondary">
                  {initialArea || "الإسكندرية"}
                </span>
              </h1>

              <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto mb-8">
                {initialArea
                  ? `استعرض أفضل العقارات المتاحة في ${initialArea} مع أسعار تنافسية`
                  : "نقدم لك مجموعة متنوعة من الشقق والعقارات الفاخرة بأفضل الأسعار"}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                  >
                    <stat.icon className="h-6 w-6 text-secondary mx-auto mb-2" />
                    <div className="text-2xl sm:text-3xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-white/70 text-xs sm:text-sm">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Wave Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto"
            >
              <path
                d="M0 50L48 45.7C96 41.3 192 32.7 288 35.8C384 39 480 54 576 55.2C672 56.3 768 43.7 864 39.8C960 36 1056 41 1152 48.7C1248 56.3 1344 66.7 1392 71.8L1440 77V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
                className="fill-background"
              />
            </svg>
          </div>
        </section>

        {/* Properties Section */}
        <section className="container mx-auto px-4 py-8 lg:py-12">
          {/* Header with Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-bold">
                العقارات المتاحة
              </h2>
              <Badge variant="secondary" className="text-sm">
                {loading
                  ? "جاري التحميل..."
                  : `${filteredProperties.length} عقار`}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center gap-1 bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 px-3"
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden relative">
                    <SlidersHorizontal className="h-4 w-4 ml-2" />
                    <span>الفلاتر</span>
                    {activeFilters > 0 && (
                      <span className="absolute -top-2 -left-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {activeFilters}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:max-w-md overflow-y-auto"
                >
                  <SheetHeader>
                    <SheetTitle className="text-right">
                      فلترة البحث
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <SearchFilters
                      onSearch={(filters) => handleSearch(filters as Filters)}
                      initialArea={initialArea}
                    />
                  </div>
                  {areaError && (
                    <p className="text-red-600 text-sm mt-4 text-center">
                      {areaError}
                    </p>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Area error (desktop) */}
          {areaError && (
            <div className="hidden lg:block text-center text-red-600 font-semibold mb-6">
              {areaError}
            </div>
          )}

          {/* Quick Filters (Mobile & Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <QuickFilters
              onFilterSelect={handleQuickFilter}
              activeFilter={activeQuickFilter}
            />
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden lg:block lg:w-80 flex-shrink-0"
            >
              <div className="sticky top-24">
                <SearchFilters
                  onSearch={(filters) => handleSearch(filters as Filters)}
                  initialArea={initialArea}
                />
              </div>
            </motion.aside>

            {/* Properties Grid / Content */}
            <div className="flex-1">
              {loading ? (
                <div className="text-center text-gray-500 py-20">
                  <div className="inline-flex flex-col items-center gap-3">
                    <div className="relative w-10 h-10">
                      <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
                      <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    </div>
                    <p className="text-sm">جاري تحميل العقارات...</p>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {filteredProperties.length > 0 ? (
                    <motion.div
                      key="properties"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0 }}
                      className={`grid gap-4 sm:gap-6 ${
                        viewMode === "grid"
                          ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                          : "grid-cols-1"
                      }`}
                    >
                      {filteredProperties.slice(0, displayCount).map((property) => (
                        <motion.div
                          key={property.id}
                          variants={itemVariants}
                          layout
                        >
                          <PropertyCard property={property} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <EmptyState
                      title={getEmptyMessage()}
                      message="حاول تعديل معايير البحث أو إعادة تعيين الفلاتر."
                      fullScreen={false}
                    />
                  )}
                </AnimatePresence>
              )}

              {/* Load More - Optional (نفس منطق الكود الجديد) */}
              {!loading &&
                filteredProperties.length > 0 &&
                displayCount < filteredProperties.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-10"
                  >
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="px-8"
                      onClick={() => setDisplayCount(prev => prev + 6)}
                    >
                      عرض المزيد من العقارات
                    </Button>
                  </motion.div>
                )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-muted/50 to-muted py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                لم تجد ما تبحث عنه او وهناك اى مشكلة؟
              </h2>
              <p className="text-muted-foreground mb-6">
                تواصل معنا وسنساعدك في اقرب وقت
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="px-8">
                    تواصل معنا
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Properties;
