import React from "react";
import { motion } from "framer-motion";
import { Award, Home } from "lucide-react";
import { advantages } from "@/data/homeConstants";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const WhyChooseUsSection: React.FC = () => {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
            className="will-change-transform"
          >
            <span className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-3">
              <Award className="h-4 w-4" />
              لماذا تختار منصتنا؟
            </span>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              حل شامل لسكن الطلاب والعائلات
            </h2>
            <p className="text-muted-foreground mb-6">
              نوفر لك منصة واحدة تجمع بين سكن الطلاب، سكن العائلات، والسكن
              اليومي، مع تجربة استخدام سهلة ومريحة باللغة العربية.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {advantages.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl will-change-transform"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Visual */}
          <motion.div
            className="relative will-change-transform"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
            }}
          >
            {/* Geometric Shapes Background */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 p-8 h-[300px] md:h-[400px] flex items-center justify-center">
              <motion.div
                className="absolute top-0 right-0 w-48 h-48 rounded-full bg-gradient-to-br from-blue-200 to-blue-100 opacity-40"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
              />

              <motion.div
                className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-gradient-to-tr from-cyan-200 to-cyan-100 opacity-30"
                animate={{ scale: [1, 0.9, 1] }}
                transition={{ duration: 10, repeat: Infinity, delay: 1 }}
              />

              {/* Center Content */}
              <div className="relative z-10 text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="mb-4"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                    <Home className="h-8 w-8" />
                  </div>
                </motion.div>
                <div className="text-center max-w-xs">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    الإسكندرية
                  </h3>
                  <p className="text-gray-600">
                    خيارات سكن متنوعة لكل الاحتياجات والميزانيات
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(WhyChooseUsSection);
