import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AreaCard } from "@/components/AreaCard";
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
  CalendarClock,
  MessageSquare,
  Phone as PhoneIcon,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  BadgeCheck,
  Home,
  Star,
} from "lucide-react";
import { fetchAreas } from "@/api";
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

const Index = () => {
  const [displayAreas, setDisplayAreas] = useState<AreaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
  }, []);

  // بطاقتين فقط
  const stats = [
    { value: "1000+", label: "عميل سعيد" },
    { value: "200+", label: "وسيط معتمد" },
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

      {/* Hero Section - Animated */}
      <section className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden mt-16">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroHome})`, filter: "blur(3px) brightness(0.75)", margin: "-10px" }}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 1.5 }}
        />
        <div className="absolute inset-0 hero-gradient1" />
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-20 pb-8">
          <motion.div
            className="max-w-4xl mx-auto text-center text-white space-y-6 md:space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm md:text-base">
                <GraduationCap className="h-4 w-4 text-secondary" />
                <span>سكن طلاب وعائلات في الإسكندرية</span>
              </span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              variants={fadeInUp}
            >
              اعثر على سكنك المثالي
              <br />
              <span className="text-secondary">في الإسكندرية</span>
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto px-4"
              variants={fadeInUp}
            >
              سكن طلاب، سكن عائلات، وسكن يومي أو أسبوعي في أفضل مناطق
              الإسكندرية.
            </motion.p>

            {/* Stats (عميل سعيد + وسيط معتمد) */}
            <motion.div
              className="grid grid-cols-2 gap-4 sm:gap-6 pt-4 md:pt-6 px-2"
              variants={staggerContainer}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-xl"
                  variants={scaleIn}
                >
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

              <div className="text-center mt-6">
                <Button asChild variant="outline" size="lg">
                  <Link to="/properties" className="text-black">
                    عرض جميع المناطق
                  </Link>
                </Button>
              </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="h-8 w-8 text-white/60" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-16 bg-accent/50">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              {
                icon: <GraduationCap className="h-8 w-8 text-primary" />,
                title: "سكن طلاب",
                text: "مجموعة واسعة من العقارات لطلاب جامعة الإسكندرية.",
              },
              {
                icon: <Users className="h-8 w-8 text-primary" />,
                title: "سكن عائلات",
                text: "شقق مناسبة للعائلات بمستويات مختلفة من الأسعار.",
              },
              {
                icon: <CalendarClock className="h-8 w-8 text-primary" />,
                title: "سكن يومي",
                text: "خيار الحجز اليومي أو الأسبوعي لإقامات قصيرة.",
              },
              {
                icon: <Award className="h-8 w-8 text-primary" />,
                title: "أفضل الأسعار",
                text: "عروض حصرية وأسعار تنافسية في السوق.",
              },
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  text={feature.text}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-10 md:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-3">
              <Sparkles className="h-4 w-4" />
              كيف يعمل الموقع
            </span>
            <h2 className="text-2xl md:text-4xl font-bold mb-3">
              أربع خطوات بسيطة
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              ابحث عن سكنك المثالي بكل سهولة من خلال خطوات بسيطة
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {howItWorks.map((item, index) => (
              <motion.div key={index} className="relative" variants={fadeInUp}>
                {/* Connector Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-border -translate-x-1/2" />
                )}

                <div className="relative bg-accent/30 rounded-2xl p-6 text-center hover:bg-accent/50 transition-colors">
                  <div className="absolute -top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    {item.step}
                  </div>
                  <motion.div
                    className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4 mt-2"
                    whileHover={{ scale: 1.1 }}
                  >
                    <item.icon className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
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
                    className="flex items-start gap-3 p-4 bg-accent/30 rounded-xl"
                    whileHover={{ scale: 1.02 }}
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
              className="relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
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
                  <AreaCard area={area} />
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





      <Footer />
    </div>
  );
};

export default Index;

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
