import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GraduationCap, Sparkles, Clock, BadgePercent, ArrowLeft, Gift, Star, Percent, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { API_BASE } from "@/config";

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
        const response = await fetch(`${API_BASE}/offers/active/`);
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
      // التحقق من localStorage - إذا كان المستخدم قد رأى العرض من قبل، لا تعرضه
      const hasSeenOffer = localStorage.getItem(`offer_seen_${offer.id}`);
      // التحقق من sessionStorage لمنع عرض المودال أكثر من مرة في نفس الجلسة
      const hasShownInSession = sessionStorage.getItem(`offer_shown_${offer.id}`);
      
      if (!hasSeenOffer && !hasShownInSession) {
        // عرض المودال بعد 1.5 ثانية من دخول الصفحة الرئيسية
        const timer = setTimeout(() => {
          setIsOpen(true);
          // حفظ في sessionStorage أن العرض تم عرضه في هذه الجلسة
          sessionStorage.setItem(`offer_shown_${offer.id}`, 'true');
        }, 1500);

        return () => clearTimeout(timer);
      }
    }
  }, [loading, offer]);

  const handleClose = () => {
    setIsOpen(false);
    // حفظ في localStorage أن المستخدم قد رأى هذا العرض
    if (offer) {
      localStorage.setItem(`offer_seen_${offer.id}`, 'true');
      sessionStorage.setItem(`offer_shown_${offer.id}`, 'true');
    }
  };

  // إذا لم يكن هناك عرض نشط، لا تعرض المودال
  if (!offer) {
    return null;
  }

  // تحديد الأيقونة بناءً على نوع الأيقونة
  const getIcon = () => {
    switch (offer.icon_type) {
      case 'graduation':
        return <GraduationCap className="h-4 w-4 text-primary" />;
      case 'gift':
        return <Gift className="h-4 w-4 text-primary" />;
      case 'star':
        return <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />;
      case 'sparkles':
      default:
        return <Percent className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/70 to-gray-900/80 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-[320px] sm:max-w-[360px] md:max-w-[380px] overflow-visible">
              {/* Floating discount badge - positioned outside card */}
              <motion.div
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 z-20"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-lg opacity-60" />
                  <div className="relative w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 p-[3px] shadow-2xl">
                    <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-500 to-orange-600">
                        {offer.discount_percentage}%
                      </span>
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">خصم</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Main Card */}
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden pt-12 sm:pt-14">
                {/* Decorative top pattern */}
                <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/5 to-transparent" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-100/50 to-transparent rounded-bl-full" />
                <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-br-full" />
                
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 left-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all z-10 group"
                >
                  <X className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </button>

                {/* Content */}
                <div className="relative px-5 sm:px-6 pb-5 sm:pb-6 pt-3 sm:pt-4">
                  {/* Offer type badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center mb-5"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-primary/10 via-blue-50 to-primary/10 border border-primary/10">
                      {getIcon()}
                      <span className="text-sm font-semibold text-primary">
                        {offer.target_audience === 'students' ? 'عرض حصري للطلاب' : 'عرض خاص'}
                      </span>
                    </div>
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-3"
                  >
                    {offer.title}
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-500 text-xs sm:text-sm text-center mb-4 sm:mb-5 leading-relaxed"
                  >
                    {offer.description}
                  </motion.p>

                  {/* Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="flex justify-center gap-2 sm:gap-3 mb-4 sm:mb-5"
                  >
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-600">
                      <Gift className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm font-medium">عروض إضافية</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-50 text-amber-600">
                      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm font-medium">لفترة محدودة</span>
                    </div>
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      asChild
                      className="w-full h-11 sm:h-12 bg-gradient-to-r from-primary via-blue-600 to-primary hover:opacity-90 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg shadow-primary/30 transition-all"
                      onClick={handleClose}
                    >
                      <Link to="/properties?discount=true" className="flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span>اكتشف العروض</span>
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    
                    <button
                      onClick={handleClose}
                      className="w-full mt-3 text-gray-400 hover:text-gray-600 text-sm py-2 transition-colors"
                    >
                      ليس الآن
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default React.memo(OfferModal);
