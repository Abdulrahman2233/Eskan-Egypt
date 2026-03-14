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
    <section className="relative isolate overflow-hidden bg-[linear-gradient(125deg,hsl(223_74%_23%)_0%,hsl(220_76%_31%)_48%,hsl(213_69%_40%)_100%)] pb-24 pt-12 sm:pb-28 sm:pt-16 lg:pb-32 lg:pt-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_22%,rgba(250,204,21,0.22),transparent_34%),radial-gradient(circle_at_82%_80%,rgba(148,163,184,0.2),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.09),transparent_52%)]" />

        <motion.div
          className="absolute -left-24 bottom-6 hidden h-72 w-72 rounded-full border border-white/10 lg:block"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <motion.div
          className="absolute -right-16 top-6 hidden h-56 w-56 rounded-full border border-white/15 lg:block"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-sm">
            <Building2 className="h-4 w-4 text-secondary" />
            <span className="text-sm font-semibold text-white/95">اكتشف مكانك المناسب</span>
          </div>

          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            عقارات متاحة للإيجار في
            <span className="text-secondary"> {initialArea || "الإسكندرية"}</span>
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base text-white/80 sm:text-lg">
            {initialArea
              ? `استعرض أفضل العقارات المتاحة في ${initialArea} مع أسعار تنافسية`
              : "نقدم لك مجموعة متنوعة من الشقق والعقارات الفاخرة بأفضل الأسعار"}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.08, duration: 0.3 }}
                className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm transition-colors hover:bg-white/15"
              >
                <stat.icon className="mx-auto mb-2 h-6 w-6 text-secondary" />
                <div className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</div>
                <div className="text-xs text-white/70 sm:text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full">
          <path
            d="M0 74L90 67C180 60 360 46 540 49C720 52 900 72 1080 74C1260 76 1350 60 1440 44V120H0V74Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default React.memo(HeroSection);
