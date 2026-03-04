import React, { useEffect, useState, Suspense } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useSearchParams } from "react-router-dom";
import { fetchProperties, fetchAreas } from "@/api";
import type { ApiArea } from "@/api";

import HeroSection from "@/components/sections/HeroSection";
import PropertiesGrid from "@/components/sections/PropertiesGrid";

// Lazy load below-the-fold section
const ContactCtaSection = React.lazy(() => import("@/components/sections/ContactCtaSection"));

const Properties: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialArea = searchParams.get("area") || "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [areas, setAreas] = useState<ApiArea[]>([]);

  // Fetch properties + areas in parallel
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [propertiesData, areasData] = await Promise.all([
          fetchProperties(),
          fetchAreas(),
        ]);
        setProperties(propertiesData);
        setAreas(areasData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Navbar />

      <main className="flex-1 mt-16">
        {/* Hero Section */}
        <HeroSection
          initialArea={initialArea}
          propertiesCount={properties.length}
          areasCount={areas.length}
        />

        {/* Properties Grid Section */}
        <PropertiesGrid
          properties={properties}
          initialArea={initialArea}
          loading={loading}
          areas={areas}
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
