import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyMap from "@/components/PropertyMap";
import CountdownTimer from "@/components/CountdownTimer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import VerifiedBadge from "@/components/VerifiedBadge";
import { 
  Bed, Bath, Maximize2, MapPin, Phone, 
  ChevronLeft, Home, Calendar,
  Building2, MessageCircle, CheckCircle2,
  ArrowRight, ArrowLeft, Shield, Clock, Sparkles,
  User, Eye, Ruler, Sofa, Share2, Percent, DoorOpen,
  Wind, Coffee, Wifi, Car, Droplets, Tv, ChevronDown, Check,
  Zap, Droplet, FileText, Thermometer, Flame,
  Filter, UtensilsCrossed, Waves, Dumbbell, Leaf,
  Refrigerator, Fuel, Briefcase, ExternalLink, Lock, Unlock
} from "lucide-react";
import { fetchProperty, fetchProperties, markPropertyAsBooked, markPropertyAsAvailable, type ApiProperty } from "@/api";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { usePageSeo } from "@/hooks/use-page-seo";

interface Amenity {
  id: number;
  name: string;
  icon: string;
  description?: string;
}

interface Property {
  id: string;
  name: string;
  price: number;
  daily_price?: number;
  original_price?: number;
  discount?: number;
  address: string;
  area?: string;
  rooms?: number;
  beds?: number;
  bathrooms?: number;
  size?: number;
  description?: string;
  latitude?: string | number;
  longitude?: string | number;
  usage_type?: string;
  images?: Array<{ image_url: string }>;
  videos?: Array<{ video_url: string }>;
  price_unit?: string;
  display_price?: number;
  is_daily_pricing?: boolean;
  amenities?: Amenity[];
  owner_id?: number | null;
  owner_username?: string | null;
  owner_name?: string;
  owner_type?: string;
  owner_is_verified?: boolean;
  is_booked?: boolean;
  booked_at?: string | null;
  added_at?: string;
  approved_at?: string | null;
  created_at?: string;
  [key: string]: unknown;
}

const formatDateTime = (dateValue?: unknown): string => {
  if (typeof dateValue !== "string" || !dateValue) return "غير متاح";
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return "غير متاح";
  
  const today = new Date();
  const isToday = 
    parsedDate.getDate() === today.getDate() &&
    parsedDate.getMonth() === today.getMonth() &&
    parsedDate.getFullYear() === today.getFullYear();
  
  if (isToday) {
    return "اليوم";
  }
  
  return parsedDate.toLocaleDateString('en-CA');
};

const getTimeAgo = (dateValue?: unknown): string => {
  if (typeof dateValue !== "string" || !dateValue) return "وقت غير محدد";
  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) return "وقت غير محدد";
  
  const now = new Date();
  const seconds = Math.floor((now.getTime() - parsedDate.getTime()) / 1000);
  
  if (seconds < 60) return "قبل لحظات";
  if (seconds < 3600) return `قبل ${Math.floor(seconds / 60)} دقيقة`;
  if (seconds < 86400) return `قبل ${Math.floor(seconds / 3600)} ساعة`;
  if (seconds < 604800) return `قبل ${Math.floor(seconds / 86400)} أيام`;
  if (seconds < 2592000) return `قبل ${Math.floor(seconds / 604800)} أسابيع`;
  return `قبل ${Math.floor(seconds / 2592000)} أشهر`;
};



const PropertyDetails = () => {
  const { id } = useParams();
  const { onError, onSuccess } = useErrorHandler();
  const [property, setProperty] = useState<ApiProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ username?: string; id?: number } | null>(null);
  const [relatedProperties, setRelatedProperties] = useState<ApiProperty[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);

  // جلب بيانات المستخدم الحالي
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          // محاولة جلب بيانات المستخدم من localStorage
          const userStr = localStorage.getItem("user");
          if (userStr) {
            setCurrentUser(JSON.parse(userStr));
          }
        }
      } catch (err) {
        console.error("Error getting user info:", err);
      }
    };
    getUserInfo();
  }, []);

  // خريطة الأيقونات (احترافية وحديثة)
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    wind: Wind,                    // تكييف مركزي
    coffee: UtensilsCrossed,        // مطبخ مجهز
    wifi: Wifi,                     // إنترنت فائق
    car: Car,                       // موقف سيارات
    shield: Shield,                 // أمن 24 ساعة
    dooropen: Building2,            // مصعد
    droplets: Droplets,             // غسالة ملابس
    tv: Tv,                         // تلفزيون ذكي
    sofa: Sofa,                     // أثاث
    bath: Droplet,                  // حمام نظيف
    washing: Droplets,              // آلة غسيل
    microwave: Coffee,              // ميكروويف
    fridge: Refrigerator,           // ثلاجة
    ac: Wind,                       // مكيف هواء
    heater: Flame,                  // دفاية
    balcony: Building2,             // شرفة
    garden: Leaf,                   // حديقة
    parking: Car,                   // موقف خاص
    gym: Dumbbell,                  // صالة رياضية
    pool: Waves,                    // حمام سباحة
    zap: Zap,                       // عداد كهرباء كارت
    water_card: Droplets,           // عداد مياه كارت
    droplet: Droplet,               // (backup)
    receipt: FileText,              // عداد كهرباء فاتورة
    thermometer: Thermometer,       // سخان مياه
    filter: Filter,                 // فلتر مياه
    flame: Flame,                   // غاز طبيعي
    bottle: Fuel,                   // اسطوانة غاز
  };

  const amenities = property?.amenities || [];
  const displayedAmenities = showAllAmenities
    ? amenities
    : amenities.slice(0, 6);

  const propertyName = property?.name || "تفاصيل عقار";
  const propertyArea = property?.area ? ` - ${property.area}` : "";
  const propertyAddress = property?.address || "الإسكندرية";
  const rawListingDateSource = property?.status === "approved"
    ? (property?.added_at || property?.approved_at || property?.created_at)
    : (property?.submitted_at || property?.created_at);
  const listingDateSource = typeof rawListingDateSource === "string" ? rawListingDateSource : null;

  const listingDateMessage = property?.status === "approved"
    ? `تاريخ إضافة العقار: ${formatDateTime(listingDateSource)}`
    : property?.status === "pending"
      ? `تم إضافة العقار وهو بانتظار الموافقة منذ: ${formatDateTime(listingDateSource)}`
      : property?.status === "rejected"
        ? `تم إرسال العقار للمراجعة بتاريخ: ${formatDateTime(listingDateSource)} (الحالة الحالية: مرفوض)`
        : `تاريخ الإرسال للمراجعة: ${formatDateTime(listingDateSource)}`;

  const listingDateStyle = property?.status === "approved"
    ? "bg-emerald-50 text-emerald-700"
    : property?.status === "pending"
      ? "bg-amber-50 text-amber-700"
      : property?.status === "rejected"
        ? "bg-rose-50 text-rose-700"
        : "bg-primary/5 text-primary/90";

  const approvedDate = typeof property?.approved_at === "string" ? property.approved_at : null;
  const showApprovedDate = property?.status === "approved" && !!approvedDate;
  const showListingDate = property?.status !== "approved";
  const hasDiscount = property?.discount != null && property.discount > 0;

  usePageSeo({
    title: `${propertyName}${propertyArea} | إقامتك EQAMTAK`,
    description: property
      ? `${property.name} في ${propertyAddress}. مناسب لسكن الطلاب والعائلات والمصيفين مع خيارات حجز يومي أو شهري حسب المتاح. متاح التواصل المباشر مع المالك أو الوسيط عبر إقامتك EQAMTAK.`
      : "تفاصيل عقار للإيجار في الإسكندرية مناسب للطلاب والعائلات والمصيفين مع خيارات مرنة للحجز.",
    keywords:
      "تفاصيل عقار, شقة للايجار, استديو للايجار, سكن طلاب, سكن عائلات, حجز يومي, مالك مباشر, وسيط عقاري",
    ogTitle: `${propertyName} | عقارات الإسكندرية`,
    ogDescription: property
      ? `شاهد صور ومزايا ${property.name} وتواصل مباشرة للحجز عبر إقامتك EQAMTAK.`
      : "شاهد تفاصيل العقارات المتاحة في الإسكندرية وتواصل للحجز بسهولة.",
  });

  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchProperty(id);
        setProperty(data);
        onSuccess("تم تحميل العقار بنجاح", false);
      } catch (err) {
        const appError = onError(err, "Load Property");
        setError(appError.userMessage);
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id, onError, onSuccess]);

  // جلب العقارات ذات الصلة من نفس المنطقة
  useEffect(() => {
    const loadRelatedProperties = async () => {
      if (!property || !property.area) return;
      
      setLoadingRelated(true);
      try {
        const allProperties = await fetchProperties();
        // تصفية العقارات من نفس المنطقة وإزالة العقار الحالي
        const related = allProperties.filter(
          p => p.area === property.area && p.id !== property.id && p.status === 'approved'
        ).slice(0, 3); // إظهار أول 3 عقارات فقط
        
        setRelatedProperties(related);
      } catch (err) {
        console.error("Error loading related properties:", err);
      } finally {
        setLoadingRelated(false);
      }
    };

    loadRelatedProperties();
  }, [property]);

  // التعامل مع تغيير حالة الحجز
  const handleToggleBooking = async () => {
    if (!property) return;
    if (!currentUser) {
      onError(new Error("يجب تسجيل الدخول أولاً"), "Authentication Required");
      return;
    }

    setBookingLoading(true);
    try {
      if (property.is_booked) {
        // إزالة الحجز
        const result = await markPropertyAsAvailable(property.id);
        setProperty({
          ...property,
          is_booked: false,
          booked_at: null
        });
        onSuccess("تم إزالة تعليم الحجز من العقار بنجاح", true);
      } else {
        // تعليم العقار كمحجوز
        const result = await markPropertyAsBooked(property.id);
        setProperty({
          ...property,
          is_booked: true,
          booked_at: result.data?.booked_at || new Date().toISOString()
        });
        onSuccess("تم تعليم العقار كمحجوز بنجاح ✓", true);
      }
    } catch (err) {
      onError(err, "Booking Toggle");
    } finally {
      setBookingLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <Navbar />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col bg-background" dir="rtl">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-12 pt-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Main Card */}
            <Card className="border-0 shadow-none overflow-hidden bg-transparent">
              <CardContent className="p-8 sm:p-12 text-center space-y-6">
                {/* Icon with animation */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center relative"
                >
                  <Home className="h-12 w-12 text-primary" />
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    العقار غير موجود
                  </h2>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {error ? error : "للأسف، لم نتمكن من العثور على العقار المطلوب. قد يكون تم حذفه أو قد يكون الرابط غير صحيح"}
                  </p>
                </motion.div>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="h-1 w-16 mx-auto bg-gradient-to-r from-primary/0 via-primary to-primary/0 origin-center"
                ></motion.div>

                {/* Helpful info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-muted/20 rounded-lg p-4 space-y-2"
                >
                  <p className="text-sm font-medium text-foreground">جرب أحد الخيارات التالية:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 text-right">
                    <li>✓ البحث عن عقارات أخرى</li>
                    <li>✓ العودة لقائمة جميع العقارات</li>
                    <li>✓ التواصل مع فريق الدعم</li>
                  </ul>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3 pt-2"
                >
                  {/* Primary Button */}
                  <Button asChild size="lg" className="w-full gap-2 group">
                    <Link to="/properties">
                      <span>العودة للعقارات</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    </Link>
                  </Button>

                  {/* Secondary Button */}
                  <Button asChild variant="outline" size="lg" className="w-full gap-2">
                    <Link to="/">
                      <Home className="h-4 w-4" />
                      <span>الصفحة الرئيسية</span>
                    </Link>
                  </Button>
                </motion.div>

                {/* Error Code */}
                <div className="text-xs text-muted-foreground/50 pt-2">
                  كود الخطأ: 404 | الوقت: {new Date().toLocaleTimeString('ar-EG')}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const savingsAmount = property.original_price 
    ? property.original_price - (property.display_price || property.price) 
    : 0;

  // Get area name from area_data
  const areaDisplay = property.area_data?.name ? property.area_data.name : '';

  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Navbar />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                <Home className="h-3.5 w-3.5" />
                الرئيسية
              </Link>
              <ChevronLeft className="h-4 w-4 text-muted-foreground/50" />
              <Link to="/properties" className="text-muted-foreground hover:text-primary transition-colors">
                العقارات
              </Link>
              <ChevronLeft className="h-4 w-4 text-muted-foreground/50" />
              <span className="text-foreground font-medium truncate max-w-[200px]">{property.name}</span>
            </nav>
          </div>
        </div>

        {/* Image Gallery Section */}
        <section className="container mx-auto px-4 py-6">
          <PropertyGallery 
            images={property.images} 
            videos={property.videos}
            discount={property.discount}
            featured={property.featured}
          />
        </section>

        {/* Main Content Grid */}
        <section className="container mx-auto px-4 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Property Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Property Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h1 className="text-2xl md:text-3xl font-bold leading-tight flex-1">
                        {property.name}
                      </h1>
                      {/* Share Button */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({
                                  title: property.name,
                                  text: `${property.name} - ${property.address}`,
                                  url: window.location.href,
                                }).catch(() => {});
                              } else {
                                navigator.clipboard.writeText(window.location.href);
                                alert('تم نسخ الرابط');
                              }
                            }}
                            className="flex-shrink-0 p-2.5 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 text-primary transition-all hover:scale-110 active:scale-95"
                          >
                            <Share2 className="h-5 w-5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>مشاركة</TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="flex flex-col gap-3 mb-3">
                      {/* Area & Time Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        {areaDisplay && (
                          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold shadow-sm hover:shadow-md transition-shadow">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                            <span>{areaDisplay}</span>
                          </div>
                        )}
                        {rawListingDateSource && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-sm hover:shadow-md transition-shadow cursor-help">
                                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                                <span>{getTimeAgo(rawListingDateSource)}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>{formatDateTime(rawListingDateSource)}</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      {/* Address */}
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{property.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-0 shadow-md bg-gradient-to-r from-primary/5 to-transparent hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-4 divide-x divide-x-reverse divide-primary/10">
                      <QuickStat icon={DoorOpen} value={property.rooms} label="غرف" />
                      <QuickStat icon={Bath} value={property.bathrooms} label="حمامات" />
                      <QuickStat icon={Bed} value={property.beds} label="سراير" />
                      <QuickStat icon={Building2} value={property.floor} label="الطابق" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Property Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap gap-2"
              >
                {property.featured && (
                  <Badge className="bg-amber-100 text-amber-800 border border-amber-200/60 hover:bg-amber-100 gap-1.5 py-1 px-3 text-xs font-semibold">
                    <Sparkles className="h-3.5 w-3.5" />
                    مميز
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="gap-2 py-1 px-3 text-xs font-medium text-foreground/80 border-border/70 bg-background"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${property.furnished ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                  {property.furnished ? "مفروشة بالكامل" : "غير مفروشة"}
                </Badge>
                <Badge
                  variant="outline"
                  className="gap-2 py-1 px-3 text-xs font-medium text-foreground/80 border-border/70 bg-background"
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${property.is_booked ? 'bg-red-500' : 'bg-emerald-500'}`} />
                  {property.is_booked ? "غير متاح" : "متاحة الآن"}
                </Badge>
                <Badge
                  variant="outline"
                  className="gap-2 py-1 px-3 text-xs font-medium text-foreground/80 border-border/70 bg-background"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  استجابة سريعة
                </Badge>
              </motion.div>

              <Separator />

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <div className="w-1 h-5 bg-primary rounded-full" />
                  وصف العقار
                </h2>
                <div className="space-y-2">
                  {property.description?.split('\n').map((line, index) => (
                    line.trim() && (
                      <p key={index} className="text-muted-foreground leading-relaxed">
                        {line.trim()}
                      </p>
                    )
                  ))}
                </div>
              </motion.div>

              <Separator />

              {/* Amenities Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <div className="w-1 h-5 bg-primary rounded-full" />
                  المميزات والخدمات
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <AnimatePresence>
                    {displayedAmenities.map((amenity, index) => {
                      const IconComponent = iconMap[amenity.icon.toLowerCase()] || Wind;
                      return (
                        <motion.div
                          key={amenity.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-4 w-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">
                            {amenity.name}
                          </span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {amenities.length > 6 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => setShowAllAmenities(!showAllAmenities)}
                  >
                    <span>
                      {showAllAmenities ? "عرض أقل" : `عرض الكل (${amenities.length})`}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        showAllAmenities ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                )}
              </motion.div>

              <Separator />

              {/* Location */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    الموقع
                  </h2>
                  {property.latitude && property.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all text-sm font-medium"
                    >
                      <MapPin className="h-4 w-4" />
                      فتح في خريطة جوجل
                    </a>
                  )}
                </div>
                <Card className="border-0 shadow-sm overflow-hidden">
                  <div className="p-4 bg-muted/30 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-muted-foreground truncate">{property.address}</div>
                    </div>
                  </div>
                  {property.latitude && property.longitude ? (
                    <PropertyMap 
                      latitude={property.latitude} 
                      longitude={property.longitude}
                      propertyName={property.name}
                      address={property.address}
                      height="350px"
                    />
                  ) : (
                    <div className="aspect-[16/9] bg-muted flex items-center justify-center border-t border-border">
                      <div className="text-center text-muted-foreground p-8">
                        <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">الخريطة غير متاحة حالياً</p>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Sticky Sidebar */}
            <div className="lg:block">
              <div className="sticky top-24 space-y-4">
                {/* Price Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="border-0 shadow-xl overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
                    <CardContent className="p-6 space-y-5">
                      {/* Price Display with Discount */}
                      <div className="text-center space-y-3">
                        <div className="text-sm text-muted-foreground font-medium">
                          الإيجار {property.is_daily_pricing ? 'اليومي' : 'الشهري'}
                        </div>
                        
                        {/* Current Price (Price after discount) */}
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-4xl font-bold text-primary">
                            {(property.display_price || property.price).toLocaleString()}
                          </span>
                          <span className="text-lg text-muted-foreground">
                            جنيه/{property.price_unit || (property.is_daily_pricing ? 'يوم' : 'شهر')}
                          </span>
                        </div>

                        {/* Discount Badge with Original Price */}
                        {property.original_price && property.discount != null && property.discount > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-2"
                          >
                            <Badge className="bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-md px-2.5 py-1 text-xs font-bold flex items-center gap-1">
                              <Percent className="h-3 w-3" />
                              <span>{property.discount}</span>
                            </Badge>
                            <span className="text-muted-foreground line-through text-sm">
                              {property.original_price.toLocaleString()} جنيه
                            </span>
                          </motion.div>
                        )}

                        {/* Savings Highlight */}
                        {property.original_price && property.discount != null && property.discount > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-lg p-2.5"
                          >
                            <div className="flex items-center justify-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                                وفّر {savingsAmount.toLocaleString()} جنيه
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      <Separator />

                      {/* Limited Time Offer Countdown - Show only if property is AVAILABLE */}
                      {!property.is_booked && property.booking_expires_at && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <CountdownTimer
                            expirationTime={property.booking_expires_at}
                          />
                        </motion.div>
                      )}

                      {/* Contact Buttons */}
                      <div className="space-y-3">
                        <a
                          href={`https://wa.me/${property.contact.replace(/^0/, '20')}?text=مرحباً، أريد الاستفسار عن عقار: ${property.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 px-4 rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
                        >
                          <MessageCircle className="h-5 w-5" />
                          تواصل عبر واتساب
                        </a>
                        <div className="flex gap-3">
                          <a
                            href={`tel:${property.contact}`}
                            className="flex-1 flex items-center justify-center gap-3 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground py-3.5 px-4 rounded-xl font-medium transition-all"
                          >
                            <Phone className="h-5 w-5" />
                            اتصال مباشر
                          </a>
                          <button
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({
                                  title: property.name,
                                  text: `${property.name} - ${property.address}`,
                                  url: window.location.href,
                                }).catch(() => {});
                              } else {
                                navigator.clipboard.writeText(window.location.href);
                                alert('تم نسخ الرابط');
                              }
                            }}
                            className="flex-1 flex items-center justify-center gap-3 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground py-3.5 px-4 rounded-xl font-medium transition-all"
                          >
                            <Share2 className="h-5 w-5" />
                            مشاركة
                          </button>
                        </div>
                      </div>

                      {/* Availability & Booking Status - Show when property is BOOKED */}
                      {property.is_booked && (
                        <div className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-slate-950 to-slate-800 dark:from-slate-900 dark:to-slate-950 border border-slate-700/50 dark:border-slate-600/50 rounded-xl py-3.5 px-6 shadow-lg shadow-slate-900/20 backdrop-blur-sm">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-slate-200 flex-shrink-0" strokeWidth={2.5} />
                            <span className="font-semibold text-slate-100 text-sm tracking-wide uppercase">محجوز</span>
                          </div>
                        </div>
                      )}

                      {/* Booking Action Button - Show only if user is the property owner */}
                      {currentUser && property.owner_username === currentUser.username && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Button
                            onClick={handleToggleBooking}
                            disabled={bookingLoading}
                            className={`w-full mt-3 h-11 text-sm font-semibold rounded-xl transition-all ${
                              property.is_booked
                                ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md"
                                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md"
                            }`}
                          >
                            {bookingLoading ? (
                              <span className="flex items-center justify-center gap-2">
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                جاري المعالجة...
                              </span>
                            ) : property.is_booked ? (
                              <span className="flex items-center justify-center gap-2">
                                <Unlock className="h-4 w-4" />
                                إلغاء تعليم الحجز
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-2">
                                <Lock className="h-4 w-4" />
                                تعليم العقار كمحجوز
                              </span>
                            )}
                          </Button>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Owner Profile Card */}
                {property.owner_username && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Link to={`/user/${property.owner_username}`} className="block group">
                      <Card className="border border-border/60 shadow-sm hover:shadow-md transition-all duration-300">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/70 p-[3px] flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
                                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-visible">
                                  <span className="text-xl font-bold leading-none">
                                    {(property.owner_name || "؟")[0]}
                                  </span>
                                </div>
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <User className="h-3.5 w-3.5 text-primary" />
                                  <span>صاحب العقار</span>
                                </div>
                                <div className="flex items-center gap-0.5 mt-1">
                                  {property.owner_is_verified && (
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <div className="flex items-center justify-center flex-shrink-0 order-1">
                                          <VerifiedBadge className="h-5 w-5" />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>حساب موثّق</TooltipContent>
                                    </Tooltip>
                                  )}
                                  <h4 className="font-bold text-base group-hover:text-primary transition-colors truncate order-0">
                                    {property.owner_name || "غير محدد"}
                                  </h4>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className={`text-xs mt-2 gap-1 ${
                                    property.owner_type === 'agent' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                    property.owner_type === 'office' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                  }`}
                                >
                                  {property.owner_type === 'agent' ? (
                                    <><Briefcase className="h-3 w-3" /> وسيط عقاري</>
                                  ) : property.owner_type === 'office' ? (
                                    <><Building2 className="h-3 w-3" /> مكتب عقاري</>
                                  ) : (
                                    <><Home className="h-3 w-3" /> مالك عقارات</>
                                  )}
                                </Badge>
                              </div>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm font-semibold text-primary group-hover:bg-primary/10 transition-colors">
                            <span>عرض الملف الشخصي</span>
                            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                )}

                {/* Trust Section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="border-0 shadow-lg">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Sparkles className="h-4 w-4 text-secondary" />
                        <span className="font-bold">لماذا هذا العقار؟</span>
                      </div>
                      <TrustItem 
                        icon={Shield}
                        title="عقار موثق"
                        desc="تم التحقق من جميع البيانات"
                        color="emerald"
                      />
                      <TrustItem 
                        icon={Clock}
                        title="استجابة سريعة"
                        desc="المالك يرد خلال ساعة"
                        color="blue"
                      />
                      <TrustItem 
                        icon={User}
                        title="مالك موثوق"
                        desc="تقييم 4.8 من 5"
                        color="amber"
                      />
                    </CardContent>
                  </Card>
                </motion.div>

              </div>
            </div>
          </div>
        </section>

        {/* Related Properties Section */}
        {relatedProperties.length > 0 && (
          <section className="py-16 bg-gradient-to-b from-primary/3 via-background to-background border-t border-primary/10">
            <div className="container mx-auto px-4">
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <div className="inline-block mb-4">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    <Sparkles className="h-3.5 w-3.5 ml-1.5" />
                    عقارات ذات صلة
                  </Badge>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  عقارات أخرى في {property?.area_data?.name || 'نفس المنطقة'}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  اكتشف المزيد من الخيارات المتاحة في نفس المنطقة والتي قد تناسبك
                </p>
              </motion.div>

              {/* Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {relatedProperties.map((prop, index) => (
                    <motion.div
                      key={prop.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link to={`/property/${prop.id}`} className="group h-full">
                        <Card className="border border-primary/10 overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300 h-full bg-background hover:bg-primary/3">
                          {/* Image Container */}
                          <div className="relative overflow-hidden bg-muted aspect-video group">
                            {prop.images && prop.images.length > 0 ? (
                              <img
                                src={prop.images[0].image_url}
                                alt={prop.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                <Building2 className="h-12 w-12 text-primary/30" />
                              </div>
                            )}
                            
                            {/* Badges Overlay */}
                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                              {prop.featured && (
                                <Badge className="bg-amber-500 text-white border-0 shadow-lg">
                                  <Sparkles className="h-3 w-3 ml-1" />
                                  مميز
                                </Badge>
                              )}
                              {prop.discount && prop.discount > 0 && (
                                <Badge className="bg-red-500 text-white border-0 shadow-lg">
                                  <Percent className="h-3 w-3 ml-1" />
                                  {prop.discount}%
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <CardContent className="p-4 space-y-3">
                            {/* Title */}
                            <div>
                              <h3 className="font-bold text-base line-clamp-1 group-hover:text-primary transition-colors">
                                {prop.name}
                              </h3>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {prop.address}
                              </p>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-2 text-xs">
                              {prop.rooms && (
                                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/8">
                                  <DoorOpen className="h-3 w-3 text-primary" />
                                  <span>{prop.rooms}</span>
                                </div>
                              )}
                              {prop.beds && (
                                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/8">
                                  <Bed className="h-3 w-3 text-primary" />
                                  <span>{prop.beds}</span>
                                </div>
                              )}
                              {prop.bathrooms && (
                                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/8">
                                  <Bath className="h-3 w-3 text-primary" />
                                  <span>{prop.bathrooms}</span>
                                </div>
                              )}
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline justify-between pt-2 border-t border-primary/10">
                              <div>
                                <div className="text-xs text-muted-foreground">
                                  {prop.is_daily_pricing ? 'يومي' : 'شهري'}
                                </div>
                                <div className="text-lg font-bold text-primary">
                                  {(prop.display_price || prop.price).toLocaleString()}
                                </div>
                              </div>
                              <ArrowLeft className="h-5 w-5 text-primary/60 group-hover:text-primary group-hover:-translate-x-1 transition-all" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* View All Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mt-10"
              >
                <Button asChild size="lg" className="gap-2 px-8">
                  <Link to="/properties">
                    <span>عرض جميع العقارات</span>
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </section>
        )}
      </main>

      {/* Mobile Fixed Bottom Bar */}
      <div className="lg:hidden h-24" />
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border p-4 z-50 shadow-xl"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">
              الإيجار {property.is_daily_pricing ? 'اليومي' : 'الشهري'}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {(property.display_price || property.price).toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">
                جنيه/{property.price_unit || (property.is_daily_pricing ? 'يوم' : 'شهر')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${property.contact.replace(/^0/, '20')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 h-11 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
            >
              <MessageCircle className="h-4 w-4" />
              <span>واتساب</span>
            </a>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};


// Helper Components
const QuickStat = ({ icon: Icon, value, label }: { icon: React.ComponentType<{ className?: string }>; value: string | number; label: string }) => (
  <div className="p-4 text-center">
    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="h-5 w-5 text-primary" />
    </div>
    <div className="text-lg font-bold">{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

const FeatureBox = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
  <div className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/50">
    <Icon className="h-4 w-4 text-primary flex-shrink-0" />
    <div className="min-w-0">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium truncate">{value}</div>
    </div>
  </div>
);

const TrustItem = ({ 
  icon: Icon, 
  title, 
  desc, 
  color 
}: { 
  icon: any; 
  title: string; 
  desc: string; 
  color: 'emerald' | 'blue' | 'amber' 
}) => {
  const colors = {
    emerald: 'bg-emerald-500/10 text-emerald-600',
    blue: 'bg-blue-500/10 text-blue-600',
    amber: 'bg-amber-500/10 text-amber-600',
  };

  return (
    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
      <div className={`w-9 h-9 rounded-full ${colors[color]} flex items-center justify-center flex-shrink-0`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
};

export default PropertyDetails;
