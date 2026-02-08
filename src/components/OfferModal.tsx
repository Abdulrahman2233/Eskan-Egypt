import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GraduationCap, Sparkles, Clock, BadgePercent, ArrowLeft, Gift, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface OfferData {
  id: number;
  title: string;
  description: string;
  discount_percentage: number;
  target_audience: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  icon_type: string;
}

const OfferModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [offer, setOffer] = useState<OfferData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // جلب البيانات من API
    const fetchOffer = async () => {
      try {
        // استخدام المسار الكامل للـ API
        const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
        const response = await fetch(`${apiBase}/offers/active/`);
        if (response.ok) {
          const data = await response.json();
          // أخذ أول عرض نشط
          if (data.length > 0) {
            setOffer(data[0]);
          }
        } else {
          console.error('API Error:', response.status);
        }
      } catch (error) {
        console.error('Error fetching offer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, []);

  useEffect(() => {
    if (!loading && offer) {
      // عرض المودال بعد 1.5 ثانية من دخول الصفحة الرئيسية
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [loading, offer]);

  const handleClose = () => {
    setIsOpen(false);
  };

  // إذا لم يكن هناك عرض نشط، لا تعرض المودال
  if (!offer) {
    return null;
  }

  // تحديد الأيقونة بناءً على نوع الأيقونة
  const getIcon = () => {
    switch (offer.icon_type) {
      case 'graduation':
        return <GraduationCap className="h-3.5 w-3.5 text-yellow-300" />;
      case 'gift':
        return <Gift className="h-3.5 w-3.5 text-yellow-300" />;
      case 'star':
        return <Star className="h-3.5 w-3.5 text-yellow-300" fill="currentColor" />;
      case 'sparkles':
      default:
        return <Sparkles className="h-3.5 w-3.5 text-yellow-300" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ willChange: 'transform' }}
          >
            <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/95 to-primary/85 shadow-2xl">
              {/* Transparent bottom gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-b from-transparent to-black/10 pointer-events-none z-20" />
              
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              </div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-3 left-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              >
                <X className="h-4 w-4 text-white" />
              </button>

              {/* Content */}
              <div className="relative p-5 md:p-8 text-center text-white">
                {/* Badge */}
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-yellow-400/20 border border-yellow-400/30 mb-4"
                  style={{ willChange: 'opacity, transform' }}
                >
                  {getIcon()}
                  <span className="text-xs md:text-sm font-medium text-yellow-100">{offer.target_audience === 'students' ? 'عرض حصري للطلاب' : offer.title}</span>
                </motion.div>

                {/* Discount percentage */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  className="mb-4"
                  style={{ willChange: 'transform' }}
                >
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl scale-125" />
                    <div className="relative flex items-center justify-center w-28 h-28 md:w-32 md:h-32 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg shadow-yellow-500/20">
                      <div className="text-center">
                        <div className="flex items-start justify-center">
                          <span className="text-4xl md:text-5xl font-black text-primary">{offer.discount_percentage}</span>
                          <span className="text-xl md:text-2xl font-bold text-primary mt-0.5">%</span>
                        </div>
                        <span className="text-xs md:text-sm font-semibold text-primary/80">خصم</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg md:text-2xl font-bold mb-2 flex items-center justify-center gap-2"
                >
                  {offer.title}
                  <span>🎉</span>
                </motion.h2>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                  className="h-0.5 bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent mb-3 w-2/3 mx-auto"
                  style={{ willChange: 'transform' }}
                />

                {/* Description */}
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white/80 text-sm md:text-base mb-4 leading-relaxed"
                >
                  {offer.description} ✨
                </motion.p>

                {/* Features */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="flex flex-wrap justify-center gap-2 mb-4"
                >
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-xs md:text-sm">
                    <Gift className="h-4 w-4 md:h-5 md:w-5 text-yellow-300" />
                    <span>عروض إضافية</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-xs md:text-sm">
                    <Clock className="h-4 w-4 md:h-5 md:w-5 text-yellow-300" />
                    <span>عرض محدود</span>
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col gap-3 mt-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      asChild
                      size="sm"
                      className="w-full bg-white text-primary hover:bg-white/90 font-bold shadow-lg gap-1.5 h-10 md:h-12 md:text-base transition-all"
                      onClick={handleClose}
                    >
                      <Link to="/properties?discount=true">
                        <BadgePercent className="h-4 w-4 md:h-5 md:w-5" />
                        تصفح العروض الآن
                        <ArrowLeft className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </Link>
                    </Button>
                  </motion.div>
                  
                  <motion.button
                    onClick={handleClose}
                    className="text-white/60 hover:text-white text-xs md:text-sm py-2 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    ← تصفح لاحقاً
                  </motion.button>
                </motion.div>


              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OfferModal;
