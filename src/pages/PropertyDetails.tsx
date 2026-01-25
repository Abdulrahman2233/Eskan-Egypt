
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import PropertyMap from "@/components/PropertyMap";
import {
  Bed,
  Bath,
  DoorOpen,
  Rows3,
  MapPin,
  Phone,
  Share2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  Star,
  BedSingle,
  Heart,
  MessageCircle,
  Eye,
  AlertTriangle,
  Home,
  Loader2,
  Sofa,
  Building2,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { fetchProperty } from "@/api";
import { Property as PropertyType } from "@/data/properties";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // جلب بيانات العقار
  useEffect(() => {
    if (!id) {
      setError("معرّف العقار مفقود");
      setLoading(false);
      return;
    }

    fetchProperty(id)
      .then((data) => {
        setProperty(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-sm text-slate-500">جاري التحميل...</p>
        </motion.div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-6"
          >
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">حدث خطأ</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-lg border-2 border-primary text-primary hover:bg-primary/5 font-semibold transition-all duration-300"
            >
              حاول مجددًا
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white font-semibold hover:shadow-lg transition-all duration-300"
            >
              <Home className="h-5 w-5" />
              الرئيسية
            </motion.button>
          </div>
        </motion.div>
      </div>
    );

  if (!property)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-6"
          >
            <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">العقار غير موجود</h2>
          <p className="text-slate-600 mb-6">عذراً، لم نتمكن من العثور على العقار الذي تبحث عنه.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/properties")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white font-semibold hover:shadow-lg transition-all duration-300"
          >
            <Home className="h-5 w-5" />
            عرض جميع العقارات
          </motion.button>
        </motion.div>
      </div>
    );

  const mediaItems = [
    ...(property.images || []),
    ...(property.videos || []),
  ];

  const nextSlide = () => {
    if (mediaItems.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevSlide = () => {
    if (mediaItems.length === 0) return;
    setCurrentIndex(
      (prev) => (prev - 1 + mediaItems.length) % mediaItems.length
    );
  };

  // قائمة المميزات والخدمات
  const amenities = [
    "مصعد",
    "مكيف هواء",
    "مطبخ مجهز",
    "إنترنت سريع",
    "حديقة خاصة",
    "مواقف سيارات",
    "أمن وحراسة",
    "نظام تهوية حديث",
  ];

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar />

      <main className="flex-1 mt-16 bg-gradient-to-b from-slate-50 via-white to-slate-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-slate-200/50 sticky top-16 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Link
                to="/"
                className="text-slate-600 hover:text-primary transition-colors font-medium"
              >
                الرئيسية
              </Link>
              <ChevronLeft className="h-4 w-4 text-slate-400" />
              <Link
                to="/properties"
                className="text-slate-600 hover:text-primary transition-colors font-medium"
              >
                العقارات
              </Link>
              <ChevronLeft className="h-4 w-4 text-slate-400" />
              <span className="text-foreground font-semibold">
                {property.name}
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* المحتوى الأساسي */}
            <div className="lg:col-span-2 space-y-6">
              {/* Carousel */}
              {mediaItems.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Carousel */}
                  <div className="relative h-[550px] rounded-lg overflow-hidden bg-black group">
                    {/* Media Counter - Top Left */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg"
                    >
                      <span className="text-white text-sm font-semibold">
                        {currentIndex + 1}/{mediaItems.length}
                      </span>
                    </motion.div>

                    {/* Main Media Display with Fade Transition */}
                    <AnimatePresence mode="wait">
                      {mediaItems.map((media, index) => {
                        const isImage = 'image_url' in media;
                        const isVideo = 'video_url' in media;
                        const key = isImage ? media.image_url : media.video_url;
                        
                        return index === currentIndex ? (
                          <motion.div
                            key={`${key}-${index}`}
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                          >
                            {isImage ? (
                              <img
                                src={media.image_url}
                                alt={`${property.name} - صورة ${index + 1}`}
                                className="w-full h-full object-cover"
                                role="img"
                                aria-label={`صورة ${index + 1} من ${mediaItems.length}`}
                              />
                            ) : isVideo ? (
                              <video
                                src={media.video_url}
                                controls
                                autoPlay
                                className="w-full h-full object-contain bg-black"
                                aria-label={`فيديو ${index + 1} من ${mediaItems.length}`}
                              />
                            ) : null}
                          </motion.div>
                        ) : null;
                      })}
                    </AnimatePresence>

                    {/* Previous Button with Backdrop Blur */}
                    <button
                      onClick={prevSlide}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full text-white transition-all duration-200 cursor-grab active:cursor-grabbing"
                      title="الصورة السابقة"
                      aria-label="عرض الصورة السابقة"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Next Button with Backdrop Blur */}
                    <button
                      onClick={nextSlide}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-3 rounded-full text-white transition-all duration-200 cursor-grab active:cursor-grabbing"
                      title="الصورة التالية"
                      aria-label="عرض الصورة التالية"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Thumbnails - Interactive Below Carousel */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
                  >
                    {mediaItems.map((media, i) => {
                      const isImage = 'image_url' in media;
                      const isVideo = 'video_url' in media;
                      
                      return (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentIndex(i)}
                          className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                            i === currentIndex
                              ? "border-primary ring-2 ring-primary ring-offset-2"
                              : "border-slate-300 hover:border-primary/50"
                          }`}
                          aria-label={`انتقل إلى ${i === 0 ? 'الوسيط الأول' : `الوسيط ${i + 1}`}`}
                          aria-current={i === currentIndex ? "true" : "false"}
                        >
                          {isImage ? (
                            <img
                              src={media.image_url}
                              alt={`صورة مصغرة ${i + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : isVideo ? (
                            <div className="w-full h-full bg-black flex items-center justify-center relative">
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                              <div className="relative flex items-center justify-center">
                                <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                                  <div className="w-0 h-0 border-l-4 border-l-black border-t-[3px] border-t-transparent border-b-[3px] border-b-transparent" />
                                </div>
                              </div>
                              <span className="absolute bottom-1 right-1 text-white text-xs bg-black/60 px-1 rounded">
                                فيديو
                              </span>
                            </div>
                          ) : null}

                          {/* Hover Overlay */}
                          {i !== currentIndex && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
                            >
                              <span className="text-white text-xs font-semibold">{i + 1}</span>
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-[500px] bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300"
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold text-slate-600 mb-2">
                      لا توجد صور أو فيديوهات
                    </div>
                    <p className="text-slate-500 text-sm">
                      سيتم إضافة الصور قريباً
                    </p>
                  </div>
                </motion.div>
              )}

              {/* تفاصيل العقار */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-start justify-between gap-6">
                      
                      <div className="flex-1 space-y-4">
                        
                        <motion.h1
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-2xl font-bold text-slate-800"
                        >
                          {property.name}
                        </motion.h1>
                         <div className="flex items-center gap-2 text-slate-500 text-la">
                          <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
                          <span>
                            {typeof property.area === "string" 
                              ? `${property.area.replace(/^\d+\s*/, '')} - ` 
                              : ''}
                            {property.address}
                          </span>
                        </div>


                        {/* Tags with Icons - Under Name */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                          className="flex flex-wrap gap-2"
                        >
                          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 text-xs sm:text-sm">
                            <Sofa className="h-3.5 w-3.5" />
                            {property.furnished ? "مفروشة" : "غير مفروشة"}
                          </Badge>
                          <Badge variant="outline" className="gap-1.5 py-1.5 px-3 text-xs sm:text-sm">
                            <Building2 className="h-3.5 w-3.5" />
                            الطابق {property.floor}
                          </Badge>
                          <Badge className="gap-1.5 py-1.5 px-3 text-xs sm:text-sm bg-gradient-to-r from-green-50 to-emerald-50 text-green-900 hover:from-green-100 hover:to-emerald-100 border border-green-300 shadow-sm">
                            <Calendar className="h-3.5 w-3.5" />
                            متاح الآن
                          </Badge>
                          {property.featured && (
                            <Badge className="gap-1.5 py-1.5 px-3 text-xs sm:text-sm bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-900 hover:from-amber-100 hover:to-yellow-100 border border-amber-200 shadow-sm">
                              <Star className="h-3.5 w-3.5 fill-current text-amber-600" />
                              مميز
                            </Badge>
                          )}
                        </motion.div>

                      </div>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: property.name,
                              text: property.description,
                              url: window.location.href,
                            });
                          } else {
                            navigator.clipboard.writeText(
                              window.location.href
                            );
                            alert("تم نسخ الرابط");
                          }
                        }}
                        className="p-2 rounded-full bg-slate-100 hover:bg-primary/10 text-slate-600 hover:text-primary transition-all"
                      >
                        <Share2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                          {/* تفاصيل سريعة */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-slate-200 bg-gradient-to-b from-slate-50 to-white rounded-lg p-6 -m-2 mb-6">
                          <motion.div
                            whileHover={{ y: -5 }}
                            className="text-center"
                          >
                            <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 mb-3">
                              <DoorOpen className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="font-bold text-base text-slate-800">{property.rooms}</div>
                            <div className="text-xs text-slate-600">غرف</div>
                          </motion.div>

                          <motion.div
                            whileHover={{ y: -5 }}
                            className="text-center"
                          >
                            <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 mb-3">
                              <Bath className="h-5 w-5 text-cyan-600" />
                            </div>
                            <div className="font-bold text-base text-slate-800">{property.bathrooms}</div>
                            <div className="text-xs text-slate-600">
                              حمامات
                            </div>
                          </motion.div>

                          <motion.div
                            whileHover={{ y: -5 }}
                            className="text-center"
                          >
                            <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-500/10 mb-3">
                              <Bed className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="font-bold text-base text-slate-800">{property.beds}</div>
                            <div className="text-xs text-slate-600">سرير</div>
                          </motion.div>

                          {property.floor && (
                            <motion.div
                              whileHover={{ y: -5 }}
                              className="text-center"
                            >
                              <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/10 mb-3">
                                <Rows3 color="#9d09ec" strokeWidth={1.25} className="h-5 w-5" />
                              </div>
                              <div className="font-bold text-base text-slate-800">{property.floor}</div>
                              <div className="text-xs text-slate-600">
                                الطابق
                              </div>
                            </motion.div>
                          )}
                        </div>

                    {/* Tabs Content */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Card className="border-0 shadow-lg overflow-hidden">
                        <Tabs defaultValue="description" className="w-full">
                          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
                            <TabsTrigger
                              value="description"
                              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 sm:px-6 py-3 text-sm"
                            >
                              الوصف
                            </TabsTrigger>
                            <TabsTrigger
                              value="location"
                              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 sm:px-6 py-3 text-sm"
                            >
                              الموقع
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="description" className="p-4 sm:p-5 m-0">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-1 h-5 bg-primary rounded-full" />
                              <h3 className="font-bold">وصف العقار</h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                              {property.description}
                            </p>
                          </TabsContent>

                          <TabsContent value="location" className="p-4 sm:p-5 m-0">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="w-1 h-5 bg-primary rounded-full" />
                              <h3 className="font-bold">الموقع</h3>
                            </div>
                            <div className="flex items-start gap-3 mb-4 p-3 rounded-xl bg-muted/50">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <MapPin className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-semibold text-sm">{typeof property.area === 'string' ? property.area.replace(/^\d+\s*/, '') : property.area}</div>
                                <div className="text-xs text-muted-foreground">{property.address}</div>
                              </div>
                            </div>
                            {((property as any).latitude && (property as any).longitude) ? (
                              <PropertyMap 
                                latitude={(property as any).latitude} 
                                longitude={(property as any).longitude}
                                propertyName={property.name}
                                address={property.address}
                                height="350px"
                              />
                            ) : (
                              <div className="aspect-video rounded-xl bg-muted flex items-center justify-center border-2 border-dashed border-border">
                                <div className="text-center text-muted-foreground">
                                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                  <span className="text-sm">خريطة الموقع قريباً</span>
                                </div>
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      </Card>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* الشريط الجانبي */}
            <div className="space-y-6">
              {/* بطاقة السعر والتواصل */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="sticky top-24 shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/0 pointer-events-none" />
                  <CardContent className="p-6 space-y-5 relative">
                    <div className="text-center pb-5 border-b-2 border-slate-200">
                      <div className="text-xs uppercase tracking-wide text-slate-500 mb-2 font-semibold">
                        السعر الشهري
                      </div>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                          {property.price?.toLocaleString()}
                        </span>
                        <span className="text-base text-slate-600 font-semibold">
                          جنيه
                        </span>
                      </div>
                    </div>

                    {/* رقم الهاتف + واتساب */}
                    <div className="pt-3 space-y-3">
                      <div className="text-center mb-4">
                        <div className="inline-block bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-1 rounded-full">
                          <span className="text-xs uppercase tracking-wide text-primary font-bold">
                            تواصل معنا الآن
                          </span>
                        </div>
                      </div>

                      <motion.a
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        href={`https://wa.me/${property.contact}?text=مرحبًا، أريد الاستفسار عن عقار: ${property.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/30"
                        dir="ltr"
                      >
                        <Phone className="h-5 w-5" />
                        واتساب
                      </motion.a>

                      <motion.a
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        href={`tel:${property.contact}`}
                        className="flex items-center justify-center gap-2 rounded-lg border-2 border-primary text-primary hover:bg-primary/5 hover:border-primary/80 py-3 text-sm font-semibold transition-all duration-300"
                        dir="ltr"
                      >
                        <Phone className="h-5 w-5" />
                        اتصال مباشر
                      </motion.a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* بطاقة موثوقية العقار */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6 space-y-5">
                    <h3 className="font-bold text-slate-800 text-base">لماذا نثق فيهم؟</h3>

                    <motion.div
                      whileHover={{ x: -5 }}
                      className="flex items-start gap-4 pb-4 border-b border-slate-200 last:border-b-0 last:pb-0"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Shield className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800 text-sm mb-0.5">عقار موثق</div>
                        <div className="text-xs text-slate-600">
                          تم التحقق من البيانات والملكية
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: -5 }}
                      className="flex items-start gap-4 pb-4 border-b border-slate-200 last:border-b-0 last:pb-0"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800 text-sm mb-0.5">
                          استجابة سريعة
                        </div>
                        <div className="text-xs text-slate-600">
                          يرد خلال ساعة واحدة
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ x: -5 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Star className="h-6 w-6 text-amber-600 fill-current" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800 text-sm mb-0.5">تقييم ممتاز</div>
                        <div className="text-xs text-slate-600">
                          4.8 من 5 نجوم من المستخدمين
                        </div>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
