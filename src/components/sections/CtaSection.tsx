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
    <section className="py-20 hero-gradient text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            هل أنت وسيط عقاري؟
          </h2>
          <p className="text-lg mb-8 text-white/90">
            انضم إلى منصتنا وابدأ في عرض عقاراتك لآلاف المستخدمين
          </p>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link to="/auth">سجل كوسيط عقاري</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(CtaSection);
