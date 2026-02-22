import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { propertyMarketingSteps } from "@/data/homeConstants";

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

const PropertyMarketingSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-accent/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            أنواع السكن
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            ما هي أنواع السكن المتاحة؟
          </h2>
          <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto">
            نوفر لك خيارات سكن متنوعة تناسب جميع الاحتياجات والميزانيات
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative mb-12">
          {/* Desktop horizontal line */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="absolute top-20 right-12 left-12 h-1 bg-gradient-to-r from-blue-600 via-green-500 to-orange-500 rounded-full hidden lg:block" />
          </motion.div>

          {/* Mobile vertical timeline */}
          <div className="absolute top-0 bottom-0 right-6 w-1 bg-gradient-to-b from-blue-600 via-green-500 to-orange-500 md:hidden" />

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {propertyMarketingSteps.map((step) => {
              const Icon = step.icon;
              const colorMap: Record<string, string> = {
                "from-primary to-primary/70": "bg-blue-600",
                "from-success to-success/70": "bg-green-500",
                "from-warning to-warning/70": "bg-orange-500",
                "from-accent to-accent/70": "bg-cyan-500",
                "from-purple-500 to-purple-400": "bg-purple-500",
              };
              const bgColor = colorMap[step.color] || "bg-blue-600";

              return (
                <motion.div
                  key={step.step}
                  className="relative pr-4 md:pr-0"
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  variants={fadeInUp}
                >
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-gray-200 shadow-md hover:shadow-xl transition-all h-full group overflow-hidden relative flex flex-col">
                    {/* Background gradient accent */}
                    <div
                      className={`absolute top-0 right-0 w-20 h-20 ${bgColor} opacity-10 rounded-full -mr-10 -mt-10 transition-all duration-300 group-hover:scale-150`}
                    />

                    {/* Step Icon with Badge */}
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className={`flex w-10 h-10 rounded-lg ${bgColor} items-center justify-center shadow-lg text-white relative z-10 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                        النوع {step.step}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex-1">
                      <h3 className="text-sm font-bold text-gray-900 mb-2 leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:to-blue-600/10 transition-all duration-300 rounded-xl" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(PropertyMarketingSection);
