import React from "react";
import { motion } from "framer-motion";
import { Award, Building2, Home, ShieldCheck, Sparkles } from "lucide-react";
import { advantages } from "@/data/homeConstants";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const WhyChooseUsSection: React.FC = () => {
  return (
    <section className="py-14 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 xl:gap-12 items-stretch">
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
            <div className="h-full rounded-3xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 md:p-8 shadow-sm">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary text-sm font-semibold px-3 py-1.5 mb-4">
                <Award className="h-4 w-4" />
                لماذا تختار منصتنا؟
              </span>

              <h2 className="text-2xl md:text-4xl leading-tight font-bold mb-4">
                حل شامل لسكن الطلاب والعائلات
              </h2>

              <p className="text-muted-foreground md:text-lg mb-7 leading-relaxed">
                نوفر لك منصة واحدة تجمع بين سكن الطلاب، سكن العائلات، والسكن
                اليومي بتجربة استخدام واضحة وسريعة باللغة العربية.
              </p>

              {/* <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="rounded-2xl bg-muted/70 border border-border/60 p-3 text-center">
                  <div className="text-xl md:text-2xl font-bold text-primary">+500</div>
                  <div className="text-xs md:text-sm text-muted-foreground">وحدة متاحة</div>
                </div>
                <div className="rounded-2xl bg-muted/70 border border-border/60 p-3 text-center">
                  <div className="text-xl md:text-2xl font-bold text-primary">24/7</div>
                  <div className="text-xs md:text-sm text-muted-foreground">دعم ومتابعة</div>
                </div>
                <div className="rounded-2xl bg-muted/70 border border-border/60 p-3 text-center">
                  <div className="text-xl md:text-2xl font-bold text-primary">+95%</div>
                  <div className="text-xs md:text-sm text-muted-foreground">رضا العملاء</div>
                </div>
              </div>
 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {advantages.map((item, index) => (
                  <motion.div
                    key={index}
                    className="group flex items-start gap-3 p-4 bg-accent/30 border border-border/40 rounded-2xl will-change-transform"
                    whileHover={{ y: -3 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-2.5 bg-primary/10 rounded-xl flex-shrink-0 transition-colors group-hover:bg-primary/15">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm md:text-base">{item.title}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="relative will-change-transform"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
            }}
          >
            <div className="relative overflow-hidden rounded-3xl h-full min-h-[340px] md:min-h-[420px] bg-gradient-to-br from-primary/15 via-blue-50 to-cyan-100 border border-primary/15 p-6 md:p-8">
              <div className="absolute -top-12 -right-10 w-44 h-44 rounded-full bg-primary/20 blur-2xl" />
              <div className="absolute -bottom-14 -left-8 w-52 h-52 rounded-full bg-cyan-300/25 blur-2xl" />

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 text-foreground px-3 py-1.5 text-xs md:text-sm border border-white/70 shadow-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  منصة موحدة لكل أنواع السكن
                </div>

                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary to-blue-500 text-white shadow-lg">
                    <Home className="h-8 w-8 md:h-10 md:w-10" />
                  </div>

                  <div>
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                      الإسكندرية
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
                      سكن طلابي، شقق عائلية، وخيارات يومية في مناطق متعددة
                      وبأسعار تناسب احتياجك.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-xl bg-white/80 border border-white/70 px-3 py-2 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span className="text-xs font-semibold">توثيق العروض</span>
                      </div>
                      <p className="text-xs text-muted-foreground">إعلانات واضحة بمعلومات دقيقة.</p>
                    </div>
                    <div className="rounded-xl bg-white/80 border border-white/70 px-3 py-2 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span className="text-xs font-semibold">تنوع المناطق</span>
                      </div>
                      <p className="text-xs text-muted-foreground">خيارات واسعة بالقرب من الخدمات.</p>
                    </div>
                  </div>
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
