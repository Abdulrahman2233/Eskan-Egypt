import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/PropertyCard";

interface Property {
  id: string;
  [key: string]: any;
}

interface FeaturedPropertiesSectionProps {
  properties: Property[];
  loading?: boolean;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const FeaturedPropertiesSection: React.FC<FeaturedPropertiesSectionProps> = ({
  properties,
  loading = false,
}) => {
  if (loading || properties.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-accent/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header with View All Button */}
        <motion.div
          className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-6 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
          }}
        >
          <div className="text-center md:text-right flex-1">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-3">
              <Sparkles className="h-4 w-4 fill-current" />
              <span>عروض حصرية مميزة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              أفضل العقارات بأسعار <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                مميزة
              </span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto md:mx-0">
              اكتشف العقارات المميزة الخاصة بنا مع خصومات رائعة محدودة الوقت
            </p>
          </div>

          <motion.div
            className="w-full md:w-auto flex justify-center md:justify-end"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Button
              asChild
              className="w-full md:w-auto bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-lg transition-all px-5 md:px-7 h-10 text-sm md:text-xs font-semibold"
            >
              <Link
                to="/properties"
                className="flex items-center justify-center md:justify-start gap-2"
              >
                <span>عرض جميع العقارات</span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Mobile: Horizontal Scroll, Desktop: Grid */}
        <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          <motion.div
            className="flex gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08, delayChildren: 0.1 },
              },
            }}
          >
            {properties.map((property) => (
              <motion.div
                key={property.id}
                className="flex-shrink-0 w-[85vw] max-w-[320px] will-change-transform"
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
                }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Desktop Grid */}
        <motion.div
          className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          variants={staggerContainer}
        >
          {properties.map((property) => (
            <motion.div
              key={property.id}
              className="will-change-transform"
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
              }}
            >
              <PropertyCard property={property} variant="grid" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(FeaturedPropertiesSection);
