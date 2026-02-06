import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AreaCard } from "@/components/AreaCard";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OfferModal from "@/components/OfferModal";

import {
  Search,
  Award,
  ChevronDown,
  MapPin,
  GraduationCap,
  Users,
  Sun,
  MessageSquare,
  Phone as PhoneIcon,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  BadgeCheck,
  Home,
  Star,
  Megaphone,
  Handshake,
  CheckCircle2,
  ArrowLeft,
  Target,
  Globe,
  Smartphone,
  Mail,
  BarChart3,
  Calendar,
  Building2,
  Shield,
  Clock,
  Eye,
  HeartHandshake,
} from "lucide-react";
import { fetchAreas, fetchProperties } from "@/api";
import { Link } from "react-router-dom";
import heroHome from "@/assets/Alex-home2.jpg";
import alexHome from "@/assets/Alex-home.jpg";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type AreaType = {
  id: number | string;
  name?: string;
  [key: string]: any;
};

// 👇 تعريف خطوات "كيف يعمل الموقع"
const howItWorks = [
  {
    step: "1",
    icon: Search,
    title: "ابحث عن منطقتك",
    desc: "اختر المنطقة المناسبة لك من بين أفضل مناطق الإسكندرية.",
  },
  {
    step: "2",
    icon: MapPin,
    title: "تصفح العقارات",
    desc: "شاهد تفاصيل العقار، الصور، السعر، ونوع السكن المتوفر.",
  },
  {
    step: "3",
    icon: MessageSquare,
    title: "تواصل مع المالك",
    desc: "تواصل مباشرة مع المالك أو الوسيط عبر بيانات الاتصال المتاحة.",
  },
  {
    step: "4",
    icon: Home,
    title: "احجز سكنك",
    desc: "اتفق على الشروط واستلم سكنك بكل سهولة وأمان.",
  },
];

// 👇 تعريف خطوات "كيف نوصل عقارك للعميل المناسب"
const propertyMarketingSteps = [
  {
    step: 1,
    title: 'سكن للطلاب',
    description: 'توفير سكن آمن وموثوق قريب من الجامعات بأسعار مناسبة للطلاب وخدمات متكاملة',
    icon: GraduationCap,
    color: 'from-primary to-primary/70',
  },
  {
    step: 2,
    title: 'سكن للعائلات',
    description: 'شقق عائلية بمساحات متنوعة وتجهيزات حديثة في مناطق هادئة وآمنة',
    icon: Users,
    color: 'from-success to-success/70',
  },
  {
    step: 3,
    title: 'سكن للمصيفين',
    description: 'عروض موسمية خاصة للسياح والمصيفين برفاهية عالية وإطلالات رائعة',
    icon: Sun,
    color: 'from-warning to-warning/70',
  },
  {
    step: 4,
    title: 'استديو للايجار',
    description: 'استديوهات مفروشة بالكامل وجاهزة للسكن الفوري بأفضل الأسعار',
    icon: Home,
    color: 'from-accent to-accent/70',
  },
  {
    step: 5,
    title: 'حجز يومي',
    description: 'عروض يومية وأسبوعية مرنة بأسعار مناسبة وخدمات متميزة لكل احتياجاتك',
    icon: Calendar,
    color: 'from-purple-500 to-purple-400',
  },
];

// Animated Building Component
const AnimatedBuilding = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay, ease: "easeOut" }}
  >
    <svg viewBox="0 0 100 140" className="w-full h-full" fill="currentColor">
      {/* Main building body */}
      <rect x="10" y="40" width="80" height="100" rx="2" className="fill-current opacity-20" />
      {/* Windows - animated */}
      <motion.rect
        x="20" y="50" width="12" height="12" rx="1"
        className="fill-current opacity-40"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: delay + 0.2 }}
      />
      <motion.rect
        x="44" y="50" width="12" height="12" rx="1"
        className="fill-current opacity-40"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: delay + 0.5 }}
      />
      <motion.rect
        x="68" y="50" width="12" height="12" rx="1"
        className="fill-current opacity-40"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 1.8, repeat: Infinity, delay: delay + 0.3 }}
      />
      <motion.rect
        x="20" y="70" width="12" height="12" rx="1"
        className="fill-current opacity-40"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2.2, repeat: Infinity, delay: delay + 0.7 }}
      />
      <motion.rect
        x="44" y="70" width="12" height="12" rx="1"
        className="fill-current opacity-40"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, delay: delay + 0.1 }}
      />
      <motion.rect
        x="68" y="70" width="12" height="12" rx="1"
        className="fill-current opacity-40"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2.3, repeat: Infinity, delay: delay + 0.4 }}
      />
      <motion.rect
        x="20" y="90" width="12" height="12" rx="1"
        className="fill-current opacity-40"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 1.9, repeat: Infinity, delay: delay + 0.6 }}
      />
      <motion.rect
        x="44" y="90" width="12" height="12" rx="1"
        className="fill-current opacity-40"
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2.1, repeat: Infinity, delay: delay + 0.8 }}
      />
      <motion.rect
        x="68" y="90" width="12" height="12" rx="1"
        className="fill-current opacity-40"
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, delay: delay + 0.2 }}
      />
      {/* Door */}
      <rect x="40" y="115" width="20" height="25" rx="2" className="fill-current opacity-50" />
      {/* Roof detail */}
      <rect x="5" y="35" width="90" height="8" rx="1" className="fill-current opacity-30" />
    </svg>
  </motion.div>
);

// Floating Geometric Shapes
const FloatingShape = ({ 
  className, 
  size, 
  delay = 0,
  duration = 6 
}: { 
  className?: string; 
  size: number; 
  delay?: number;
  duration?: number;
}) => (
  <motion.div
    className={`absolute ${className}`}
    style={{ width: size, height: size }}
    animate={{
      y: [-20, 20, -20],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
  >
    <div className="w-full h-full rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/20" />
  </motion.div>
);

// Feature Card Component
const FeatureCard = ({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) => (
  <div className="text-center space-y-3 bg-background rounded-2xl p-6 shadow-sm">
    <div className="inline-flex p-4 bg-primary/10 rounded-full">{icon}</div>
    <h3 className="font-bold text-lg">{title}</h3>
    <p className="text-sm text-muted-foreground">{text}</p>
  </div>
);

const Index = () => {
  const [displayAreas, setDisplayAreas] = useState<AreaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Animation variants
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

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);

    const loadAreas = async () => {
      try {
        const data = await fetchAreas();
        setDisplayAreas(data.slice(0, 8));
      } catch (error) {
        console.error("Failed to load areas:", error);
        setDisplayAreas([]);
      } finally {
        setLoading(false);
      }
    };
    loadAreas();

    // تحميل العقارات المميزة والخصومات
    const loadFeaturedProperties = async () => {
      try {
        const data = await fetchProperties();
        console.log("Properties loaded:", data.length);
        // فلتر: احصل على أي عقارات مميزة أو لها خصومات
        const featured = data.filter(
          (p: any) => 
            (p.is_featured || p.featured) || 
            (p.discount && p.discount > 0)
        );
        console.log("Featured properties filtered:", featured.length);
        setFeaturedProperties(featured.slice(0, 12));
      } catch (error) {
        console.error("Failed to load featured properties:", error);
        setFeaturedProperties([]);
      } finally {
        setPropertiesLoading(false);
      }
    };
    loadFeaturedProperties();
  }, []);

  // بطاقتين فقط
  const stats = [
    { value: "1000+", label: "عميل سعيد", icon: Users },
    { value: "200+", label: "وسيط معتمد", icon: BadgeCheck },
  ];

  const advantages = [
    {
      icon: BadgeCheck,
      title: "موثوقية عالية",
      desc: "تحقق دوري من الإعلانات ومراجعة مستمرة للمحتوى.",
    },
    {
      icon: TrendingUp,
      title: "تحديث مستمر",
      desc: "إضافة عروض جديدة بشكل مستمر في مختلف المناطق.",
    },
    {
      icon: ThumbsUp,
      title: "سهولة الاستخدام",
      desc: "واجهة عربية بسيطة ومريحة للطلاب والعائلات.",
    },
    {
      icon: Users,
      title: "تنوع في السكن",
      desc: "خيارات متاحة للطلاب، العائلات، والسكن القصير المدى.",
    },
  ];

  const testimonials = [
    {
      name: "أحمد محمود",
      role: "طالب جامعي",
      content:
        "لقيت سكن قريب من جامعة الإسكندرية بسهولة، والتواصل مع المالك كان سريع وواضح.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "سارة أحمد",
      role: "طالبة",
      content:
        "المنصة ساعدتني أختار بين أكتر من شقة للطالبات بأسعار مناسبة وأماكن آمنة.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "محمد علي",
      role: "رب أسرة",
      content:
        "كمستأجر لعائلتي، قدرت ألاقي شقة مناسبة في منطقة هادية وبسعر كويس في وقت قصير.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/67.jpg",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <OfferModal />
      <Navbar />

      {/* Hero Section - Animated Professional Design */}
      <section className="relative pt-20 md:pt-12 pb-16 md:pb-12 overflow-hidden min-h-[95vh] md:min-h-[60vh] flex items-center mt-16">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <motion.path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-primary/10"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Animated Circles */}
        <motion.div
          className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-[5%] w-80 h-80 rounded-full bg-gradient-to-tr from-secondary/20 to-transparent blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-b from-primary/10 to-secondary/10 blur-3xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />

        {/* Animated Lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
              style={{
                top: `${20 + i * 15}%`,
                width: "100%",
              }}
              animate={{
                x: ["-100%", "100%"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Floating Geometric Shapes - Now visible on mobile too */}
        <FloatingShape className="top-[10%] right-[3%]" size={40} delay={0} />
        <FloatingShape className="top-[20%] left-[5%]" size={30} delay={0.5} duration={8} />
        <FloatingShape className="bottom-[25%] right-[8%]" size={35} delay={1} duration={7} />
        <FloatingShape className="bottom-[35%] left-[8%]" size={25} delay={1.5} />
        <FloatingShape className="top-[50%] right-[20%] hidden sm:block" size={45} delay={2} duration={9} />
        <FloatingShape className="top-[40%] left-[15%] hidden sm:block" size={38} delay={0.8} duration={6} />

        {/* Mobile-specific floating elements */}
        <motion.div
          className="absolute top-[30%] right-[50%] w-3 h-3 rounded-full bg-primary/30 sm:hidden"
          animate={{
            y: [-10, 10, -10],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-[45%] left-[20%] w-2 h-2 rounded-full bg-secondary/40 sm:hidden"
          animate={{
            y: [10, -10, 10],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        />
        <motion.div
          className="absolute bottom-[40%] right-[15%] w-4 h-4 rounded-full bg-primary/20 sm:hidden"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />

        {/* Animated Buildings Skyline */}
        <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-48 md:h-64 flex items-end justify-center gap-1 sm:gap-2 md:gap-4 opacity-[0.08] overflow-hidden">
          <AnimatedBuilding className="w-10 sm:w-16 md:w-24 h-20 sm:h-32 md:h-48 text-primary" delay={0} />
          <AnimatedBuilding className="w-8 sm:w-12 md:w-20 h-16 sm:h-24 md:h-36 text-primary" delay={0.2} />
          <AnimatedBuilding className="w-12 sm:w-20 md:w-28 h-24 sm:h-40 md:h-56 text-primary" delay={0.4} />
          <AnimatedBuilding className="w-9 sm:w-14 md:w-22 h-18 sm:h-28 md:h-44 text-primary" delay={0.1} />
          <AnimatedBuilding className="w-11 sm:w-18 md:w-26 h-22 sm:h-36 md:h-52 text-primary" delay={0.3} />
          <AnimatedBuilding className="w-8 sm:w-12 md:w-18 h-14 sm:h-20 md:h-32 text-primary" delay={0.5} />
          <AnimatedBuilding className="w-10 sm:w-16 md:w-24 h-20 sm:h-32 md:h-48 text-primary hidden xs:block" delay={0.6} />
          <AnimatedBuilding className="w-12 sm:w-20 md:w-28 h-24 sm:h-40 md:h-56 text-primary hidden sm:block" delay={0.7} />
        </div>

        {/* Animated Dots Pattern - More dots on mobile */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-primary/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-20 pb-8">
          <motion.div
            className="max-w-4xl mx-auto text-center text-white space-y-6 md:space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-sm font-medium backdrop-blur-sm">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span>المنصة الأولى للإيجار في الإسكندرية</span>
              </span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
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
                  background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--primary)))",
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
              className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
              variants={fadeInUp}
            >
              آلاف الشقق والعقارات المتاحة للإيجار في أفضل مناطق الإسكندرية
              <br className="hidden sm:block" />
              بأسعار مناسبة وخدمة موثوقة
            </motion.p>

            {/* Enhanced Stats Grid */}
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
                    {/* Card glow on hover */}
                    <motion.div
                      className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="relative bg-background/80 border border-primary/20 rounded-2xl px-4 py-2 md:px-4 md:py-3 text-center backdrop-blur-sm hover:border-primary/40 transition-colors">
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary mb-1">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="text-base sm:text-lg md:text-xl font-bold text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground">
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
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  {/* Animated glow effect */}
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ backgroundSize: "200% auto" }}
                  />
                  {/* Pulsing ring */}
                  <motion.div
                    className="absolute -inset-2 rounded-2xl border-2 border-primary/30"
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <Button
                    asChild
                    size="lg"
                    className="relative h-14 md:h-16 px-8 md:px-12 text-base md:text-lg rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:from-primary/90 hover:to-primary shadow-2xl shadow-primary/40 gap-3 border border-primary-foreground/10"
                  >
                    <Link to="/properties" className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Search className="h-5 w-5 md:h-6 md:w-6" />
                      </motion.div>
                      <span className="font-bold">تصفح العقارات</span>
                      <motion.div
                        animate={{ x: [0, -5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
                      </motion.div>
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          onClick={() => {
            const element = document.querySelector('#how-it-works');
            element?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <ChevronDown className="h-8 w-8 text-primary/60 hover:text-primary transition-colors" />
        </motion.div>
      </section>


      {/* How We Connect Properties to Clients - Same Design as Notes */}
      <section id="how-it-works" className="py-12 md:py-16 bg-accent/50">
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

          {/* Process Steps - Mobile Timeline */}
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
            
            <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              {propertyMarketingSteps.map((step, index) => {
                const colorMap: Record<string, string> = {
                  'from-primary to-primary/70': 'bg-blue-600',
                  'from-success to-success/70': 'bg-green-500',
                  'from-warning to-warning/70': 'bg-orange-500',
                  'from-accent to-accent/70': 'bg-cyan-500',
                  'from-primary to-success': 'bg-gradient-to-br from-blue-600 to-green-500',
                  'from-purple-500 to-purple-400': 'bg-purple-500',
                };
                const bgColor = colorMap[step.color] || 'bg-blue-600';
                
                return (
                <motion.div
                  key={step.step}
                  className="relative pr-4 md:pr-0"
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  variants={fadeInUp}
                >
                  <div className={`bg-gradient-to-br from-white to-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-5 border border-gray-200 shadow-md hover:shadow-xl transition-all h-full group overflow-hidden relative flex items-start gap-3`}>
                    {/* Background gradient accent */}
                    <div className={`absolute top-0 right-0 w-20 h-20 ${bgColor} opacity-10 rounded-full -mr-10 -mt-10 transition-all duration-300 group-hover:scale-150`} />
                    
                    {/* Step Icon */}
                    <div className={`flex w-12 h-12 rounded-lg ${bgColor} items-center justify-center shadow-lg text-white relative z-10 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 px-2 py-0.5 rounded-full shadow-sm">
                          النوع {step.step}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">{step.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                    
                    {/* Hover CTA */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:to-blue-600/10 transition-all duration-300 rounded-xl" />
                  </div>
                </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section - الجديد */}
      {!propertiesLoading && featuredProperties.length > 0 && (
        <section className="py-12 md:py-20 bg-gradient-to-b from-accent/30 to-background">
          <div className="container mx-auto px-4">
            {/* Header with View All Button */}
            <motion.div
              className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-6 mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
            >
              <div className="text-center md:text-right flex-1">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-3">
                  <Sparkles className="h-4 w-4 fill-current" />
                  <span>عروض حصرية مميزة</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  أفضل العقارات بأسعار <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    مميزة
                  </span>
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto md:mx-0">
                  اكتشف العقارات المميزة الخاصة بنا مع خصومات رائعة محدودة الوقت
                </p>
              </div>
              
              <motion.div
                className="w-full md:w-auto flex justify-center md:justify-end"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <Button
                  asChild
                  className="w-full md:w-auto bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-lg transition-all px-5 md:px-7 h-10 text-sm md:text-xs font-semibold"
                >
                  <Link to="/properties" className="flex items-center justify-center md:justify-start gap-2">
                    <span>عرض جميع العقارات</span>
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Mobile: Horizontal Scroll, Desktop: Grid */}
            <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              <motion.div
                className="flex gap-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
                  },
                }}
              >
                {featuredProperties.slice(0, 4).map((property) => (
                  <motion.div
                    key={property.id}
                    className="flex-shrink-0 w-[85vw] max-w-[320px] will-change-transform"
                    variants={{
                      hidden: { opacity: 0, scale: 0.9 },
                      visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
                    }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Desktop Grid */}
            <motion.div
              className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08, delayChildren: 0.1 },
                },
              }}
            >
              {featuredProperties.slice(0, 4).map((property) => (
                <motion.div
                  key={property.id}
                  className="will-change-transform"
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
                  }}
                >
                  <PropertyCard property={property} variant="grid" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
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
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

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
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={alexHome}
                  alt="Alexandria housing"
                  className="w-full h-[300px] md:h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                <div className="absolute bottom-6 right-6 left-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <Home className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">الإسكندرية</div>
                      <div className="text-white/80 text-sm">
                        خيارات سكن متنوعة لكل الاحتياجات
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* Areas Section */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">
              استكشف مناطق الإسكندرية
            </h2>
            <p className="text-muted-foreground">اختر المنطقة المفضلة لديك</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex flex-col items-center gap-2">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
                <p className="text-sm text-slate-500">جاري تحميل المناطق...</p>
              </div>
            </div>
          ) : displayAreas.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {displayAreas.map((area) => (
                <motion.div key={area.id} variants={fadeInUp}>
                  <AreaCard area={{
                    id: area.id as number,
                    name: (area.name || area.title || "") as string,
                    property_count: (area.property_count || 0) as number,
                  }} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">لم تتمكن من تحميل المناطق</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link to="/properties">عرض جميع المناطق</Link>
            </Button>
          </div>
        </div>
      </section>

            {/* CTA Section - Show only for non-logged-in users */}
      {!isLoggedIn && (
      <section className="py-20 hero-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            هل أنت وسيط عقاري؟
          </h2>
          <p className="text-lg mb-8 text-white/90">
            انضم إلى منصتنا وابدأ في عرض عقاراتك لآلاف المستخدمين
          </p>
          <Button asChild size="lg" variant="secondary" className="gap-2">
            <Link to="/auth">
              سجل كوسيط عقاري
            </Link>
          </Button>
        </div>
      </section>
      )}

      <Footer />
    </div>
  );
};

export default Index;
