import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, ChevronDown, ArrowLeft, Shield, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

import HeroChartBackground from "./HeroChartBackground";

// Quick features for hero section
const heroFeatures = [
  { icon: Shield, label: "عقارات موثوقة" },
  { icon: MapPin, label: "أفضل المناطق" },
  { icon: Clock, label: "حجز سريع" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const HeroSection: React.FC<{ onScrollDown?: () => void }> = ({
  onScrollDown,
}) => {
  return (
    <section className="relative pt-20 md:pt-12 pb-16 md:pb-12 overflow-hidden min-h-[95vh] md:min-h-[70vh] flex items-center mt-16 bg-white">
      {/* Professional Chart Background */}
      <HeroChartBackground />

      {/* Gradient Lines */}
      <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-l from-primary/40 to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-2/3 h-1 bg-gradient-to-r from-cyan-400/30 to-transparent opacity-40" />

      <div className="container mx-auto px-4 relative z-10 pt-20 pb-8">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div
            className="inline-flex items-center gap-2 relative overflow-hidden bg-gradient-to-l from-primary/[0.08] via-secondary/[0.06] to-primary/[0.08] border border-primary/15 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-[0_2px_12px_-2px_rgba(var(--primary),0.15)]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.03, boxShadow: "0 4px 20px -4px rgba(var(--primary),0.25)" }}
          >
            {/* Shine sweep effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-white/40 to-transparent -skew-x-12"
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
              style={{ width: "50%" }}
            />
            <div className="relative w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_1px_rgba(52,211,153,0.5)]">
              <motion.div
                className="absolute inset-0 rounded-full bg-emerald-400"
                animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="relative text-xs font-semibold bg-gradient-to-l from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent tracking-wide">
              المنصة الأولى للإيجار في الإسكندرية
            </span>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            variants={fadeInUp}
          >
             نقدم لك تجربة سكن متكاملة 
            <br />
            <motion.span
              className="text-primary inline-block relative"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{
                background:
                  "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--primary)))",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              في الإسكندرية
              {/* Curved underline SVG */}
              <motion.svg
                className="absolute -bottom-2 md:-bottom-3 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              >
                <motion.path
                  d="M2 8 C50 2, 100 2, 150 6 C200 10, 250 4, 298 6"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.6, ease: "easeInOut" }}
                />
                <motion.path
                  d="M2 8 C50 2, 100 2, 150 6 C200 10, 250 4, 298 6"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.3"
                  style={{ filter: "blur(3px)" }}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.6, ease: "easeInOut" }}
                />
              </motion.svg>
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-6"
            variants={fadeInUp}
          >
            آلاف الشقق والعقارات المتاحة للإيجار في أفضل مناطق الإسكندرية
            <br className="hidden sm:block" />
            بأسعار مناسبة وخدمة موثوقة
          </motion.p>

          {/* Quick Features */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-8"
            variants={fadeInUp}
          >
            {heroFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/60 shadow-sm"
                  whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{feature.label}</span>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className="flex justify-center mb-12"
            variants={fadeInUp}
          >
            <Button
              asChild
              size="md"
              className="relative h-11 md:h-12 px-6 md:px-8 text-sm md:text-base rounded-xl bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:shadow-lg shadow-md transition-all duration-200 gap-2 font-semibold"
            >
              <Link to="/properties" className="flex items-center gap-2">
                <Search className="h-4 w-4 md:h-5 md:w-5" />
                <span>تصفح العقارات</span>
                <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Down Button */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        onClick={onScrollDown}
      >
        <ChevronDown className="h-8 w-8 text-blue-600/70 hover:text-blue-600 transition-colors" />
      </motion.div>
    </section>
  );
};

export default React.memo(HeroSection);
