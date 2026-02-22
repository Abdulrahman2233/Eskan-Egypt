// Last Updated: February 22, 2026 - Major Refactoring for Performance
import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import OfferModal from "@/components/OfferModal";

// Import Sections
import HeroSectionHome from "@/components/sections/HeroSectionHome";
import PropertyMarketingSection from "@/components/sections/PropertyMarketingSection";
import FeaturedPropertiesSection from "@/components/sections/FeaturedPropertiesSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import AreasSection from "@/components/sections/AreasSection";
import CtaSection from "@/components/sections/CtaSection";

import { fetchAreas, fetchProperties } from "@/api";

type AreaType = {
  id: number | string;
  name?: string;
  [key: string]: any;
};

const Index = () => {
  const [displayAreas, setDisplayAreas] = useState<AreaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
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
        const data = await fetchProperties();
        const featured = data.filter(
          (p: any) => (p.is_featured || p.featured) || (p.discount && p.discount > 0)
        );
        setFeaturedProperties(featured.slice(0, 4));
      } catch (error) {
        console.error("Failed to load featured properties:", error);
        setFeaturedProperties([]);
      } finally {
        setPropertiesLoading(false);
      }
    };
    loadFeaturedProperties();
  }, []);

  const handleScrollDown = () => {
    const element = document.querySelector("#how-it-works");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <OfferModal />
      <Navbar />

      {/* Hero Section */}
      <HeroSectionHome onScrollDown={handleScrollDown} />

      {/* Property Marketing Steps */}
      <PropertyMarketingSection />

      {/* Featured Properties */}
      <FeaturedPropertiesSection
        properties={featuredProperties}
        loading={propertiesLoading}
      />

      {/* Why Choose Us */}
      <WhyChooseUsSection />

      {/* Areas Section */}
      <AreasSection areas={displayAreas} loading={loading} />

      {/* CTA Section */}
      <CtaSection isLoggedIn={isLoggedIn} />

      <Footer />
    </div>
  );
};

export default Index;
