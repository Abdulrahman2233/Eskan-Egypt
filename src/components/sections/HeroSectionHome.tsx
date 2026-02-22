import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Star, ChevronDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stats } from "@/data/homeConstants";

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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const HeroSection: React.FC<{ onScrollDown?: () => void }> = ({
  onScrollDown,
}) => {
  return (
    <section className="relative pt-20 md:pt-12 pb-16 md:pb-12 overflow-hidden min-h-[95vh] md:min-h-[70vh] flex items-center mt-16 bg-white">
      {/* Simplified Background - Only 2 main shapes instead of 10+ */}
      <motion.div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 opacity-60"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      />

      <motion.div
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-tr from-cyan-100 to-blue-50 opacity-50"
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
      />

      {/* Gradient Lines - CSS only, no animations */}
      <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-l from-primary/40 to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-2/3 h-1 bg-gradient-to-r from-cyan-400/30 to-transparent opacity-40" />

      <div className="container mx-auto px-4 relative z-10 pt-20 pb-8">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.span
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-sm font-medium backdrop-blur-sm"
            animate={{
              boxShadow: [
                "0 0 0 0 rgba(var(--primary), 0)",
                "0 0 0 10px rgba(var(--primary), 0.1)",
                "0 0 0 0 rgba(var(--primary), 0)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Star className="h-4 w-4 fill-secondary text-secondary" />
            <span>المنصة الأولى للإيجار في الإسكندرية</span>
          </motion.span>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
            variants={fadeInUp}
          >
            اعثر على سكنك المثالي
            <br />
            <motion.span
              className="text-primary inline-block"
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
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8"
            variants={fadeInUp}
          >
            آلاف الشقق والعقارات المتاحة للإيجار في أفضل مناطق الإسكندرية
            <br className="hidden sm:block" />
            بأسعار مناسبة وخدمة موثوقة
          </motion.p>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="relative group"
                  variants={scaleIn}
                  whileHover={{ y: -5, scale: 1.03 }}
                >
                  <motion.div className="absolute -inset-0.5 bg-gradient-to-r from-blue-300/30 to-cyan-300/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative bg-white border border-gray-200 rounded-2xl px-4 py-2 md:px-4 md:py-3 text-center backdrop-blur-sm hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-600 mb-1">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </div>
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
