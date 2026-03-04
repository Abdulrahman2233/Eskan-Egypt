import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const ContactCtaSection: React.FC = () => {
  return (
    <section className="py-20 hero-gradient text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <MessageCircle className="h-4 w-4 text-secondary" />
            <span className="text-white/90 text-sm font-medium">نحن هنا لمساعدتك</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            تواصل معانا
          </h2>
          <p className="text-base md:text-lg mb-7 text-white/90">
            هل لديك أي استفسار؟ تواصل معنا وسنكون سعداء بمساعدتك
          </p>
          <Button
            asChild
            variant="secondary"
            className="gap-2 px-5 py-2.5 text-sm md:text-base"
          >
            <Link to="/contact">
              <MessageCircle className="h-4 w-4" />
              تواصل معانا الآن
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(ContactCtaSection);
