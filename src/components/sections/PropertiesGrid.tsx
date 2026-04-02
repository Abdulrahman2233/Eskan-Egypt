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
  SheetDescription,
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
  areas?: { id: number; name: string }[];
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
}

const PropertyCardSkeleton = ({ list = false }: { list?: boolean }) => {
  if (list) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
        <div className="flex flex-col-reverse sm:flex-row-reverse">
          <div className="flex-1 p-4 sm:p-5 animate-pulse">
            <div className="mb-3 h-7 w-36 rounded-md bg-muted" />
            <div className="mb-2 h-4 w-28 rounded-md bg-muted/80" />
            <div className="mb-4 h-4 w-56 rounded-md bg-muted/70" />

            <div className="mb-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="h-10 rounded-xl bg-muted/80" />
              <div className="h-10 rounded-xl bg-muted/80" />
              <div className="h-10 rounded-xl bg-muted/80" />
              <div className="h-10 rounded-xl bg-muted/80" />
            </div>

            <div className="mb-4 flex gap-2">
              <div className="h-6 w-16 rounded-full bg-muted" />
              <div className="h-6 w-20 rounded-full bg-muted" />
            </div>

            <div className="h-11 w-full rounded-xl bg-muted" />
          </div>

          <div className="h-48 sm:h-auto sm:w-72 lg:w-80 bg-muted/80 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
      <div className="h-52 sm:h-56 bg-muted/80 animate-pulse" />
      <div className="p-4 animate-pulse">
        <div className="mb-3 h-7 w-36 rounded-md bg-muted" />
        <div className="mb-4 h-4 w-32 rounded-md bg-muted/80" />

        <div className="mb-4 grid grid-cols-3 gap-2">
          <div className="h-10 rounded-xl bg-muted/80" />
          <div className="h-10 rounded-xl bg-muted/80" />
          <div className="h-10 rounded-xl bg-muted/80" />
        </div>

        <div className="mb-4 flex gap-2">
          <div className="h-6 w-16 rounded-full bg-muted" />
          <div className="h-6 w-20 rounded-full bg-muted" />
        </div>

        <div className="h-11 w-full rounded-xl bg-muted" />
      </div>
    </div>
  );
};

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
  areas = [],
  searchTerm,
  onSearchTermChange,
}) => {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState(0);
  const [displayCount, setDisplayCount] = React.useState(6);
  const [filterVersion, setFilterVersion] = React.useState(0);
  const [activeQuickFilter, setActiveQuickFilter] = React.useState<
    string | null
  >(null);
  const [currentFilters, setCurrentFilters] = React.useState<Filters | null>(
    null
  );

  const getAreaName = useCallback((p: Property): string => {
    if (typeof p.area_data === "object" && p.area_data?.name) {
      return p.area_data.name;
    }
    if (typeof p.area === "object" && p.area?.name) {
      return p.area.name;
    }
    return typeof p.area === "string" ? p.area : "";
  }, []);

  const normalizedSearchTerm = useMemo(
    () => searchTerm.trim().toLowerCase(),
    [searchTerm]
  );

  const propertySearchIndex = useMemo(() => {
    const index = new Map<string, string>();

    properties.forEach((p) => {
      const areaName = getAreaName(p);
      const usageTypeLabel = p.usage_type
        ? USAGE_TYPE_LABELS[p.usage_type] || p.usage_type
        : "";

      const searchableText = [
        p.name,
        p.address,
        areaName,
        p.type,
        p.usage_type,
        p.usage_type_ar,
        usageTypeLabel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      index.set(p.id, searchableText);
    });

    return index;
  }, [properties, getAreaName]);

  // Optimized filtering logic
  const { filteredProperties, filterCount } = useMemo(() => {
    let filtered = properties;
    let count = 0;

    // Keep initial area route filter when no explicit area selected in sidebar
    if (!currentFilters && initialArea) {
      filtered = filtered.filter((p) => getAreaName(p) === initialArea);
    }

    if (currentFilters) {
      // Single pass filtering
      filtered = filtered.filter((p) => {
        let matches = true;

        // Area filter
        if (currentFilters.area) {
          matches = matches && getAreaName(p) === currentFilters.area;
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
      ) {
        count++;
      }
    }

    if (normalizedSearchTerm) {
      filtered = filtered.filter((p) => {
        const searchableText = propertySearchIndex.get(p.id) || "";
        return searchableText.includes(normalizedSearchTerm);
      });
      count++;
    }

    return { filteredProperties: filtered, filterCount: count };
  }, [currentFilters, properties, initialArea, normalizedSearchTerm, getAreaName, propertySearchIndex]);

  // Update active filters when they change
  React.useEffect(() => {
    setActiveFilters(filterCount);
    onFiltersChange?.(filterCount);
  }, [filterCount, onFiltersChange]);

  const handleSearch = useCallback((filters: Record<string, unknown> | Filters) => {
    const f = filters as Filters;

    const normalizedFilters: Filters = {
      area: typeof f?.area === "string" ? f.area : "",
      rooms: typeof f?.rooms === "string" ? f.rooms : "",
      usageType: typeof f?.usageType === "string" ? f.usageType : "",
      furnished: typeof f?.furnished === "string" ? f.furnished : "",
      priceRange:
        Array.isArray(f?.priceRange) && f.priceRange.length === 2
          ? f.priceRange
          : [0, 20000],
    };

    const hasActiveFilter =
      normalizedFilters.area ||
      normalizedFilters.rooms ||
      normalizedFilters.usageType ||
      normalizedFilters.furnished ||
      normalizedFilters.priceRange[0] > 0 ||
      normalizedFilters.priceRange[1] < 20000;

    setCurrentFilters(hasActiveFilter ? normalizedFilters : null);
    setFilterVersion(v => v + 1);
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
  const skeletonCount = viewMode === "list" ? 4 : 6;

  return (
    <section id="properties-results" className="container mx-auto px-1 py-8 lg:py-12">
      {/* Header (mobile) */}
      <div className="flex items-center justify-between gap-3 mb-4 pr-[2px] lg:hidden">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">العقارات المتاحة</h2>
          <Badge variant="secondary" className="text-sm">
            {loading ? "جاري التحميل..." : `${filteredProperties.length} عقار`}
          </Badge>
        </div>

        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
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
              <SheetDescription className="text-right">
                استخدم الفلاتر لتضييق النتائج حسب المنطقة والسعر ونوع العقار.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <SearchFilters
                onSearch={handleSearch}
                initialArea={initialArea}
                areas={areas}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Header (desktop) */}
      <div className="hidden lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold">
            العقارات المتاحة
          </h2>
          <Badge variant="secondary" className="text-sm">
            {loading ? "جاري التحميل..." : `${filteredProperties.length} عقار`}
          </Badge>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="hidden lg:block"
        >
          <QuickFilters
            onFilterSelect={handleQuickFilter}
            activeFilter={activeQuickFilter}
            align="center"
          />
        </motion.div>

        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* Quick Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 lg:hidden"
      >
        <QuickFilters
          onFilterSelect={handleQuickFilter}
          activeFilter={activeQuickFilter}
          align="center"
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
              onSearch={handleSearch}
              initialArea={initialArea}
              areas={areas}
            />
          </div>
        </motion.aside>

        {/* Properties Grid */}
        <div className="flex-1">
          {loading ? (
            <div>
              <div className="mb-4 h-4 w-48 rounded-md bg-muted/80 animate-pulse" />
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "flex flex-col gap-4"
                }
              >
                {Array.from({ length: skeletonCount }).map((_, index) => (
                  <PropertyCardSkeleton
                    key={index}
                    list={viewMode === "list"}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div>
              {displayedProperties.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={filterVersion}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={
                      viewMode === "grid"
                        ? "grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                        : "flex flex-col gap-4"
                    }
                  >
                    {displayedProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        variant={viewMode === "list" ? "list" : "grid"}
                        listImagePosition={viewMode === "list" ? "start" : undefined}
                      />
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
