import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyMap from "@/components/PropertyMap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Bed, Bath, Maximize2, MapPin, Phone, 
  ChevronLeft, Home, Calendar,
  Building2, MessageCircle, CheckCircle2,
  ArrowRight, Shield, Clock, Sparkles,
  User, Eye, Ruler, Sofa, Share2, Percent, DoorOpen,
  Wind, Coffee, Wifi, Car, Droplets, Tv, ChevronDown,
  Zap, Droplet, FileText, Thermometer, Flame,
  Filter, UtensilsCrossed, Waves, Dumbbell, Leaf,
  Refrigerator, Fuel
} from "lucide-react";
import { fetchProperty } from "@/api";
import { useErrorHandler } from "@/hooks/use-error-handler";

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
  [key: string]: unknown;
}

const PropertyDetails = () => {
  const { id } = useParams();
  const { onError, onSuccess } = useErrorHandler();
  const [_isFavorite, _setIsFavorite] = useState(false);
  const [_isContactOpen, _setIsContactOpen] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

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
                    <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                      {property.name}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{property.address}</span>
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
                <Card className="border-0 shadow-sm bg-muted/30">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-4 divide-x divide-x-reverse divide-border">
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
                {/* شارة مميز */}
                {property.featured && (
                  <Badge className="bg-[#ffb914] text-black hover:bg-[#e6a813] transition-colors gap-1.5 py-1.5 px-3 font-bold">
                    <Sparkles className="h-3.5 w-3.5" />
                    مميز
                  </Badge>
                )}
                <Badge 
                  variant="secondary" 
                  className={`gap-1.5 py-1.5 px-3 ${property.furnished ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}`}
                >
                  <Sofa className="h-3.5 w-3.5" />
                  {property.furnished ? "مفروشة بالكامل" : "غير مفروشة"}
                </Badge>
                <Badge variant="secondary" className="gap-1.5 py-1.5 px-3 bg-emerald-600 text-white dark:bg-emerald-600 dark:text-white">
                  <Calendar className="h-3.5 w-3.5" />
                  متاحة الآن
                </Badge>
                <Badge variant="secondary" className="gap-1.5 py-1.5 px-3 bg-emerald-600 text-white dark:bg-emerald-600 dark:text-white">
                  <Clock className="h-3.5 w-3.5" />
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
                  <div className="p-4 bg-muted/30 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{property.area}</div>
                      <div className="text-sm text-muted-foreground">{property.address}</div>
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
                        {property.original_price && property.discount && property.discount > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-2"
                          >
                            <Badge className="bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-md px-2.5 py-1 text-xs font-bold flex items-center gap-1">
                              <Percent className="h-3 w-3" />
                              <span>{property.discount}%</span>
                            </Badge>
                            <span className="text-muted-foreground line-through text-sm">
                              {property.original_price.toLocaleString()} جنيه
                            </span>
                          </motion.div>
                        )}

                        {/* Savings Highlight */}
                        {property.original_price && property.discount && property.discount > 0 && (
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

                      {/* Quick Features */}
                      <div className="grid grid-cols-2 gap-3">
                        <FeatureBox icon={DoorOpen} label="غرف" value={property.rooms} />
                        <FeatureBox icon={Bath} label="حمامات" value={property.bathrooms} />
                        <FeatureBox icon={Bed} label="سراير" value={property.beds} />
                        <FeatureBox icon={Ruler} label="المساحة" value={`${property.size} م²`} />
                      </div>

                      <Separator />

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

                      {/* Availability */}
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span>متاح للحجز الآن</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

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
      </main>

      {/* Mobile Fixed Bottom Bar */}
      <div className="lg:hidden h-24" />
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border p-4 z-50 shadow-2xl"
      >
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">الإيجار {property.is_daily_pricing ? 'اليومي' : 'الشهري'}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-primary">
                {(property.display_price || property.price).toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">جنيه/{property.price_unit || (property.is_daily_pricing ? 'يوم' : 'شهر')}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href={`https://wa.me/${property.contact.replace(/^0/, '20')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500 text-white shadow-lg"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <a
              href={`tel:${property.contact}`}
              className="flex items-center justify-center gap-2 px-6 h-12 rounded-xl bg-primary text-primary-foreground shadow-lg font-medium"
            >
              <Phone className="h-4 w-4" />
              <span>اتصل</span>
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
