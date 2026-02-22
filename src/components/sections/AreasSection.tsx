import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AreaCard } from "@/components/AreaCard";

interface Area {
  id: number | string;
  name: string;
  property_count?: number;
  [key: string]: any;
}

interface AreasSectionProps {
  areas: Area[];
  loading: boolean;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const AreasSection: React.FC<AreasSectionProps> = ({ areas, loading }) => {
  return (
    <section className="py-16 bg-accent/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">
            استكشف مناطق الإسكندرية
          </h2>
          <p className="text-muted-foreground">
            اختر المنطقة المفضلة لديك
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex flex-col items-center gap-2">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </div>
              <p className="text-sm text-slate-500">جاري تحميل المناطق...</p>
            </div>
          </div>
        ) : areas.length > 0 ? (
          <>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {areas.map((area) => (
                <motion.div key={area.id} variants={fadeInUp}>
                  <AreaCard
                    area={{
                      id: area.id as number,
                      name: (area.name || area.title || "") as string,
                      property_count: (area.property_count || 0) as number,
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg">
                <Link to="/properties">عرض جميع المناطق</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">لم تتمكن من تحميل المناطق</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(AreasSection);
