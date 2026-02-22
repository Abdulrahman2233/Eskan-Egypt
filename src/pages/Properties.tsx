import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "@/config";
import { fetchProperties } from "@/api";

import HeroSection from "@/components/sections/HeroSection";
import PropertiesGrid from "@/components/sections/PropertiesGrid";
import CtaSection from "@/components/sections/CtaSection";

// ----------- Simple Interfaces -----------
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

const Properties: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialArea = searchParams.get("area") || "";

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [areasCount, setAreasCount] = useState(0);

  // Fetch properties
  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      try {
        const data = await fetchProperties();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  // Fetch areas count  
  useEffect(() => {
    const fetchAreasCount = async () => {
      try {
        const response = await axios.get(`${API_URL}/areas/`);
        const areas = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        setAreasCount(areas.length);
      } catch (error) {
        console.error("Error fetching areas count:", error);
      }
    };

    fetchAreasCount();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Navbar />

      <main className="flex-1 mt-16">
        {/* Hero Section */}
        <HeroSection
          initialArea={initialArea}
          propertiesCount={properties.length}
          areasCount={areasCount}
        />

        {/* Properties Grid Section */}
        <PropertiesGrid
          properties={properties}
          initialArea={initialArea}
          loading={loading}
        />

        {/* CTA Section */}
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
};

export default Properties;
