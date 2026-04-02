// Last Updated: February 25, 2026 - Performance Optimization (lazy loading, memoization, reduced animations)
import React, { useEffect, useState, useCallback, Suspense } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Eagerly load above-the-fold section
import HeroSectionHome from "@/components/sections/HeroSectionHome";

// Lazy load below-the-fold sections
const PropertyMarketingSection = React.lazy(() => import("@/components/sections/PropertyMarketingSection"));
const FeaturedPropertiesSection = React.lazy(() => import("@/components/sections/FeaturedPropertiesSection"));
const WhyChooseUsSection = React.lazy(() => import("@/components/sections/WhyChooseUsSection"));
const AreasSection = React.lazy(() => import("@/components/sections/AreasSection"));
const CtaSection = React.lazy(() => import("@/components/sections/CtaSection"));
const OfferModal = React.lazy(() => import("@/components/OfferModal"));

import { fetchAreas, fetchFeaturedProperties, fetchProperties } from "@/api";
import type { ApiProperty, ApiArea } from "@/api";
import { usePageSeo } from "@/hooks/use-page-seo";

// Lightweight fallback for lazy sections
const SectionFallback = () => (
  <div className="py-12 flex justify-center">
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

const Index = () => {
  usePageSeo({
    title: "إقامتك EQAMTAK | سكن طلاب وعائلات ومصيفين واستديو وحجز يومي في الإسكندرية",
    description:
      "منصة إقامتك EQAMTAK تجمع الباحثين عن سكن طلاب، سكن عائلات، سكن مصيفين، واستديوهات بحجز يومي أو شهري في الإسكندرية، ومتاحة أيضا للملاك ومكاتب العقارات والوسطاء لنشر العقارات بسهولة.",
    keywords:
      "سكن طلاب, سكن طالبات, سكن عائلات, سكن مصيفين, استديو للايجار, استوديو للايجار, حجز يومي, شقق مفروشة الاسكندرية, مكاتب عقارات الاسكندرية, وسيط عقاري, نشر عقار",
    ogTitle: "إقامتك EQAMTAK | منصة سكن وبيع وإيجار في الإسكندرية",
    ogDescription:
      "ابحث عن سكن مناسب بسرعة، أو انشر عقارك كمالك أو مكتب عقاري أو وسيط على إقامتك EQAMTAK.",
    twitterTitle: "إقامتك EQAMTAK | سكن طلاب وعائلات + منصة للملاك والوسطاء",
    twitterDescription:
      "عقارات واستديوهات بحجز يومي أو شهري في الإسكندرية مع إمكانية النشر للملاك والمكاتب والوسطاء.",
  });

  const [displayAreas, setDisplayAreas] = useState<ApiArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredProperties, setFeaturedProperties] = useState<ApiProperty[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);

    // Load areas
    const loadAreas = async () => {
      try {
        const data = await fetchAreas();
        setDisplayAreas(data.slice(0, 8));
      } catch (error) {
        console.error("Failed to load areas:", error);
        setDisplayAreas([]);
      } finally {
        setLoading(false);
      }
    };
    loadAreas();

    // Load featured properties
    const loadFeaturedProperties = async () => {
      try {
        setPropertiesLoading(true);

        try {
          const allProperties = await fetchProperties();
          if (allProperties && allProperties.length > 0) {
            // Filter for featured OR discounted items only
            const filteredProperties = allProperties.filter(
              (p: any) => (p.featured === true || (p.discount && Number(p.discount) > 0))
            );
            setFeaturedProperties(filteredProperties.slice(0, 4));
          } else {
            setFeaturedProperties([]);
          }
        } catch (err) {
          console.log("Error fetching properties:", err);
          setFeaturedProperties([]);
        }
      } catch (error) {
        console.error("Failed to load featured properties:", error);
        setFeaturedProperties([]);
      } finally {
        setPropertiesLoading(false);
      }
    };
    loadFeaturedProperties();
  }, []);

  const handleScrollDown = useCallback(() => {
    const element = document.querySelector("#how-it-works");
    element?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Suspense fallback={null}>
        <OfferModal />
      </Suspense>
      <Navbar />

      {/* Hero Section - eagerly loaded (above the fold) */}
      <HeroSectionHome onScrollDown={handleScrollDown} />

      {/* Below-the-fold sections - lazy loaded */}
      <Suspense fallback={<SectionFallback />}>
        <PropertyMarketingSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <FeaturedPropertiesSection
          properties={featuredProperties}
          loading={propertiesLoading}
        />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <WhyChooseUsSection />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <AreasSection areas={displayAreas} loading={loading} />
      </Suspense>

      <Suspense fallback={<SectionFallback />}>
        <CtaSection isLoggedIn={isLoggedIn} />
      </Suspense>

      <Footer />
    </div>
  );
};

export default Index;
