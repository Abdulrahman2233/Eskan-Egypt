import React, { useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Grid3X3,
  LayoutList,
  SlidersHorizontal,
  Building2,
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
import { PropertyCard } from "@/components/PropertyCard";
import { SearchFilters } from "@/components/SearchFilters";
import { QuickFilters } from "@/components/QuickFilters";

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

interface PropertiesGridProps {
  properties: Property[];
  initialArea: string;
  onFiltersChange?: (count: number) => void;
  loading?: boolean;
}

const USAGE_TYPE_LABELS: { [key: string]: string } = {
  students: "طلاب",
  families: "عائلات",
  studio: "استوديو",
  vacation: "مصيفين",
  daily: "حجز يومي",
};

const EmptyState = ({ title, message }: { title: string; message: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    className="py-16 sm:py-24 text-center"
  >
    <div className="bg-muted/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
      <Building2 className="h-10 w-10 text-muted-foreground" />
    </div>
    <h3 className="text-xl sm:text-2xl font-bold mb-3">{title}</h3>
    <p className="text-muted-foreground max-w-md mx-auto">{message}</p>
  </motion.div>
);

const PropertiesGrid: React.FC<PropertiesGridProps> = ({
  properties,
  initialArea,
  onFiltersChange,
  loading = false,
}) => {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState(0);
  const [displayCount, setDisplayCount] = React.useState(6);
  const [activeQuickFilter, setActiveQuickFilter] = React.useState<
    string | null
  >(null);
  const [currentFilters, setCurrentFilters] = React.useState<Filters | null>(
    null
  );
  const [areaError, setAreaError] = React.useState<string | null>(null);

  // Optimized filtering logic
  const { filteredProperties, filterCount } = useMemo(() => {
    if (!currentFilters) {
      return {
        filteredProperties: initialArea
          ? properties.filter((p) => {
              const pArea =
                typeof p.area_data === "object" && p.area_data?.name
                  ? p.area_data.name
                  : typeof p.area === "object" && p.area?.name
                  ? p.area.name
                  : p.area;
              return pArea === initialArea;
            })
          : properties,
        filterCount: 0,
      };
    }

    let filtered = [...properties];
    let count = 0;

    // Single pass filtering
    filtered = filtered.filter((p) => {
      let matches = true;

      // Area filter
      if (currentFilters.area) {
        const pArea =
          typeof p.area_data === "object" && p.area_data?.name
            ? p.area_data.name
            : typeof p.area === "object" && p.area?.name
            ? p.area.name
            : p.area;
        matches = matches && pArea === currentFilters.area;
      }

      // Rooms filter
      if (matches && currentFilters.rooms) {
        const roomCount =
          currentFilters.rooms === "5+" ? 5 : Number(currentFilters.rooms);
        const propertyRooms = Number(p.rooms ?? 0);
        matches =
          matches &&
          (currentFilters.rooms === "5+"
            ? propertyRooms >= roomCount
            : propertyRooms === roomCount);
      }

      // Usage Type filter
      if (matches && currentFilters.usageType) {
        matches = matches && p.usage_type === currentFilters.usageType;
      }

      // Furnished filter
      if (
        matches &&
        currentFilters.furnished !== "" &&
        currentFilters.furnished !== null &&
        currentFilters.furnished !== undefined
      ) {
        const isFurnished = currentFilters.furnished === "true";
        matches = matches && p.furnished === isFurnished;
      }

      // Price Range filter
      if (matches && currentFilters.priceRange?.length === 2) {
        const [min, max] = currentFilters.priceRange;
        matches =
          matches &&
          Number(p.price) >= min &&
          Number(p.price) <= max;
      }

      return matches;
    });

    // Count active filters
    if (currentFilters.area) count++;
    if (currentFilters.rooms) count++;
    if (currentFilters.usageType) count++;
    if (currentFilters.furnished !== "" && currentFilters.furnished !== null)
      count++;
    if (
      currentFilters.priceRange &&
      (currentFilters.priceRange[0] > 0 || currentFilters.priceRange[1] < 20000)
    )
      count++;

    return { filteredProperties: filtered, filterCount: count };
  }, [currentFilters, properties, initialArea]);

  // Update active filters when they change
  React.useEffect(() => {
    setActiveFilters(filterCount);
    onFiltersChange?.(filterCount);
  }, [filterCount, onFiltersChange]);

  const handleSearch = useCallback((filters: Filters) => {
    if (!filters.area) {
      setAreaError("من فضلك اختر المنطقة أولاً");
      setCurrentFilters(null);
      return;
    }

    setAreaError(null);
    setCurrentFilters(filters);
    setIsFilterOpen(false);
    setDisplayCount(6); // Reset pagination
  }, []);

  const handleQuickFilter = useCallback(
    (usageType: string) => {
      setActiveQuickFilter(
        activeQuickFilter === usageType ? null : usageType
      );

      if (currentFilters?.area) {
        const newFilters = {
          ...currentFilters,
          usageType:
            currentFilters.usageType === usageType ? "" : usageType,
        };
        handleSearch(newFilters);
      } else if (initialArea) {
        const filters: Filters = {
          area: initialArea,
          rooms: "",
          usageType: usageType,
          furnished: "",
          priceRange: [0, 20000],
        };
        handleSearch(filters);
      } else {
        // Only update filters, no need to manually set properties
        setCurrentFilters({
          area: "",
          rooms: "",
          usageType: usageType,
          furnished: "",
          priceRange: [0, 20000],
        });
      }
    },
    [currentFilters, initialArea, handleSearch, activeQuickFilter]
  );

  const displayedProperties = filteredProperties.slice(0, displayCount);

  return (
    <section className="container mx-auto px-1 py-8 lg:py-12">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold">
            العقارات المتاحة
          </h2>
          <Badge variant="secondary" className="text-sm">
            {loading ? "جاري التحميل..." : `${filteredProperties.length} عقار`}
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
                <SheetTitle className="text-right">فلترة البحث</SheetTitle>
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

      {/* Quick Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
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
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="hidden lg:block lg:w-80 flex-shrink-0"
        >
          <div className="sticky top-24">
            <SearchFilters
              onSearch={(filters) => handleSearch(filters as Filters)}
              initialArea={initialArea}
            />
          </div>
        </motion.aside>

        {/* Properties Grid */}
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
            <div>
              {displayedProperties.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={JSON.stringify(currentFilters)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`grid gap-4 sm:gap-6 ${
                      viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    }`}
                  >
                    {displayedProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <EmptyState
                  title="لا توجد عقارات تطابق معايير البحث"
                  message="حاول تعديل معايير البحث أو إعادة تعيين الفلاتر."
                />
              )}
            </div>
          )}

          {/* Load More Button */}
          {!loading &&
            displayedProperties.length > 0 &&
            displayCount < filteredProperties.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-center mt-10"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 hover:scale-105 transition-transform"
                  onClick={() => setDisplayCount((prev) => prev + 6)}
                >
                  عرض المزيد من العقارات
                </Button>
              </motion.div>
            )}
        </div>
      </div>
    </section>
  );
};

export default React.memo(PropertiesGrid);
