import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  isLoggedIn: boolean;
}

const CtaSection: React.FC<CTASectionProps> = ({ isLoggedIn }) => {
  if (isLoggedIn) return null;

  return (
    <section className="py-12 md:py-20 hero-gradient text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 leading-tight">
            هل أنت وسيط عقاري؟
          </h2>
          <p className="text-base sm:text-lg mb-6 md:mb-8 text-white/90">
            انضم إلى منصتنا وابدأ في عرض عقاراتك لآلاف المستخدمين
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-3 justify-center items-center w-full">
            <Button asChild size="lg" className="gap-2 bg-white text-blue-700 hover:bg-gray-100 font-semibold transition-all w-full sm:w-auto">
              <Link to="/auth">سجل كوسيط عقاري</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="gap-2 text-white border border-white/40 hover:bg-white/15 hover:border-white/60 font-semibold transition-all w-full sm:w-auto">
              <Link to="/for-owners">معرفة المزيد</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(CtaSection);
