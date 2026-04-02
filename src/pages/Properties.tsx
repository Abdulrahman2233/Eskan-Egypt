import React, { useEffect, useState, Suspense, useDeferredValue } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useSearchParams } from "react-router-dom";
import { fetchProperties, fetchAreas } from "@/api";
import type { ApiArea } from "@/api";
import { usePageSeo } from "@/hooks/use-page-seo";

import HeroSection from "@/components/sections/HeroSection";
import PropertiesGrid from "@/components/sections/PropertiesGrid";

// Lazy load below-the-fold section
const ContactCtaSection = React.lazy(() => import("@/components/sections/ContactCtaSection"));

const PROPERTIES_CACHE_KEY = "properties_page_data_v1";
const PROPERTIES_CACHE_TTL_MS = 5 * 60 * 1000;

const Properties: React.FC = () => {
  usePageSeo({
    title: "عقارات الإسكندرية | سكن طلاب وعائلات واستديو وحجز يومي | إقامتك EQAMTAK",
    description:
      "تصفح أحدث عقارات الإسكندرية: سكن طلاب، سكن عائلات، مصيفين، استديوهات وشقق مفروشة بحجز يومي أو شهري. المنصة متاحة أيضا للملاك ومكاتب العقارات والوسطاء لنشر الوحدات عبر إقامتك EQAMTAK.",
    canonicalPath: "/properties",
    keywords:
      "عقارات الاسكندرية, شقق للايجار الاسكندرية, سكن طلاب الاسكندرية, سكن عائلات, استديو للايجار, حجز يومي شقق, مكاتب عقارية, وسيط عقاري",
    ogTitle: "عقارات الإسكندرية الموثوقة | إقامتك EQAMTAK",
    ogDescription:
      "ابحث وقارن بين مئات الوحدات السكنية، أو انشر عقارك بسهولة إذا كنت مالك أو مكتب أو وسيط عبر إقامتك EQAMTAK.",
  });

  const [searchParams] = useSearchParams();
  const initialArea = searchParams.get("area") || "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState<ApiArea[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const searchSuggestions = React.useMemo(() => {
    const values = new Map<string, string>();

    const addSuggestion = (rawValue: unknown) => {
      const value = typeof rawValue === "string" ? rawValue.trim() : "";
      if (!value) return;

      // Keep suggestions human-readable and avoid noisy tokens.
      if (value.length < 3 || value.length > 70) return;
      if (!/[\p{L}\p{N}]/u.test(value)) return;

      const normalizedKey = value.toLocaleLowerCase("ar-EG");
      if (!values.has(normalizedKey)) {
        values.set(normalizedKey, value);
      }
    };

    properties.forEach((property) => {
      addSuggestion(property?.name);
      addSuggestion(property?.address);

      const areaName =
        typeof property?.area_data === "object" && property.area_data?.name
          ? property.area_data.name
          : typeof property?.area === "object" && property.area?.name
          ? property.area.name
          : typeof property?.area === "string"
          ? property.area
          : "";

      addSuggestion(areaName);
    });

    return Array.from(values.values()).slice(0, 150);
  }, [properties]);

  // Fetch properties + areas in parallel
  useEffect(() => {
    let isMounted = true;

    const readCache = () => {
      try {
        const raw = sessionStorage.getItem(PROPERTIES_CACHE_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw) as {
          ts?: number;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          properties?: any[];
          areas?: ApiArea[];
        };

        if (!parsed?.ts || Date.now() - parsed.ts > PROPERTIES_CACHE_TTL_MS) {
          return null;
        }

        if (!Array.isArray(parsed.properties) || !Array.isArray(parsed.areas)) {
          return null;
        }

        return parsed;
      } catch {
        return null;
      }
    };

    const writeCache = (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      propertiesData: any[],
      areasData: ApiArea[]
    ) => {
      try {
        sessionStorage.setItem(
          PROPERTIES_CACHE_KEY,
          JSON.stringify({
            ts: Date.now(),
            properties: propertiesData,
            areas: areasData,
          })
        );
      } catch {
        // Ignore storage quota or private mode errors.
      }
    };

    const loadData = async () => {
      const cached = readCache();
      if (cached && isMounted) {
        setProperties(cached.properties || []);
        setAreas(cached.areas || []);
        setLoading(false);
      } else {
        setLoading(true);
      }

      try {
        const [propertiesData, areasData] = await Promise.all([
          fetchProperties(),
          fetchAreas(),
        ]);

        if (!isMounted) return;

        setProperties(propertiesData);
        setAreas(areasData);
        writeCache(propertiesData, areasData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Navbar />

      <main className="flex-1 mt-16">
        {/* Hero Section */}
        <HeroSection
          initialArea={initialArea}
          searchTerm={searchTerm}
          searchSuggestions={searchSuggestions}
          onSearchTermChange={setSearchTerm}
          onSearchSubmit={() => {
            const element = document.getElementById("properties-results");
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
        />

        {/* Properties Grid Section */}
        <PropertiesGrid
          properties={properties}
          initialArea={initialArea}
          loading={loading}
          areas={areas}
          searchTerm={deferredSearchTerm}
          onSearchTermChange={setSearchTerm}
        />

        {/* Contact CTA Section */}
        <Suspense fallback={null}>
          <ContactCtaSection />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default Properties;
