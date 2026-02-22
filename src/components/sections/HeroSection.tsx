import React from "react";
import { motion } from "framer-motion";
import { Building2, Home, MapPin, TrendingUp, Star } from "lucide-react";

interface HeroSectionProps {
  initialArea: string;
  propertiesCount: number;
  areasCount: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  initialArea,
  propertiesCount,
  areasCount,
}) => {
  // Memoize stats array
  const stats = React.useMemo(
    () => [
      { icon: Home, label: "عقار متاح", value: propertiesCount },
      { icon: MapPin, label: "منطقة", value: areasCount },
      { icon: TrendingUp, label: "صفقة هذا الشهر", value: "50+" },
      { icon: Star, label: "تقييم العملاء", value: "4.9" },
    ],
    [propertiesCount, areasCount]
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 py-12 sm:py-16 lg:py-20">
      {/* Background Pattern - مبسط */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-secondary rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Building2 className="h-5 w-5 text-secondary" />
            <span className="text-white/90 text-sm font-medium">
              اكتشف مكانك المناسب
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            عقارات للإيجار في{" "}
            <span className="text-secondary">
              {initialArea || "الإسكندرية"}
            </span>
          </h1>

          <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            {initialArea
              ? `استعرض أفضل العقارات المتاحة في ${initialArea} مع أسعار تنافسية`
              : "نقدم لك مجموعة متنوعة من الشقق والعقارات الفاخرة بأفضل الأسعار"}
          </p>

          {/* Stats - بدون animations ثقيلة */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.08, duration: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-colors"
              >
                <stat.icon className="h-6 w-6 text-secondary mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-white/70 text-xs sm:text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 50L48 45.7C96 41.3 192 32.7 288 35.8C384 39 480 54 576 55.2C672 56.3 768 43.7 864 39.8C960 36 1056 41 1152 48.7C1248 56.3 1344 66.7 1392 71.8L1440 77V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default React.memo(HeroSection);
