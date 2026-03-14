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

// Lightweight fallback for lazy sections
const SectionFallback = () => (
  <div className="py-12 flex justify-center">
    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

const Index = () => {
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
        
        let allFeaturedAndDiscounted: any[] = [];
        
        // Try to fetch featured first
        try {
          const featured = await fetchFeaturedProperties();
          if (featured && featured.length > 0) {
            allFeaturedAndDiscounted = [...featured];
          }
        } catch (err) {
          console.log("Featured endpoint not available, using fallback");
        }
        
        // Get all properties and filter for featured + discounted
        try {
          const allProperties = await fetchProperties();
          if (allProperties && allProperties.length > 0) {
            // Filter for featured OR discounted items
            const discountedProperties = allProperties.filter(
              (p: any) => (p.featured === true || (p.discount && Number(p.discount) > 0))
            );
            
            // Combine featured from API with filtered properties, removing duplicates
            for (const prop of discountedProperties) {
              if (!allFeaturedAndDiscounted.some((p) => p.id === prop.id)) {
                allFeaturedAndDiscounted.push(prop);
              }
            }
            
            // If still no results, use all properties
            if (allFeaturedAndDiscounted.length === 0) {
              allFeaturedAndDiscounted = allProperties.slice(0, 4);
            }
          }
        } catch (err) {
          console.log("Error fetching all properties:", err);
        }
        
        setFeaturedProperties(allFeaturedAndDiscounted.slice(0, 4));
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
