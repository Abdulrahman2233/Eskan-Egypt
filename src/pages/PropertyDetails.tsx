
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Phone,
  Share2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Clock,
  Star,
  BedSingle,
} from "lucide-react";
import { fetchProperty } from "@/api";
import { Property as PropertyType } from "@/data/properties";
import { motion, AnimatePresence } from "framer-motion";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
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
      <div className="min-h-screen flex items-center justify-center">
        يرجى الانتظار...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        خطأ: {error}
      </div>
    );

  if (!property)
    return (
      <div className="min-h-screen flex items-center justify-center">
        العقار غير موجود
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

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar />

      <main className="flex-1 mt-16">
        {/* Breadcrumb */}
        <div className="bg-accent/30 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm">
              <Link
                to="/"
                className="text-muted-foreground hover:text-primary"
              >
                الرئيسية
              </Link>
              <ChevronLeft className="h-4 w-4" />
              <Link
                to="/properties"
                className="text-muted-foreground hover:text-primary"
              >
                العقارات
              </Link>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-foreground font-medium">
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
                <div className="relative h-[500px] rounded-lg overflow-hidden bg-black">
                  <AnimatePresence>
                    {mediaItems.map((media, index) =>
                      index === currentIndex ? (
                        <motion.div
                          key={`${media.image_url || media.video_url}-${index}`}
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          {media.image_url ? (
                            <img
                              src={media.image_url}
                              alt={`${property.name} - صورة ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : media.video_url ? (
                            <video
                              src={media.video_url}
                              controls
                              className="w-full h-full object-contain bg-black"
                            />
                          ) : null}
                        </motion.div>
                      ) : null
                    )}
                  </AnimatePresence>

                  {/* السابق */}
                  <button
                    onClick={prevSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white"
                    title="السابق"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* التالي */}
                  <button
                    onClick={nextSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white"
                    title="التالي"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {/* النقاط */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {mediaItems.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-3 h-3 rounded-full ${
                          i === currentIndex
                            ? "bg-primary"
                            : "bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-[500px] bg-muted rounded-lg flex items-center justify-center">
                  لا توجد صور أو فيديوهات
                </div>
              )}

              {/* تفاصيل العقار */}
              <Card>
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">
                        {property.name}
                      </h1>
                      <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <MapPin className="h-5 w-5" />
                        <span>
                          {property.area_data?.name ? `${property.area_data.name} - ` : property.area?.name ? `${property.area.name} - ` : ''}
                          {property.address}
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline">{property.type}</Badge>
                        <Badge variant="outline">
                          {property.furnished ? "مفروشة" : "غير مفروشة"}
                        </Badge>
                        {property.floor && (
                          <Badge variant="outline">
                            الطابق {property.floor}
                          </Badge>
                        )}
                        {property.featured && (
                            <Badge className="bg-[#ffb914] text-black hover:bg-[#e6a813] transition-colors">
                              مميز
                            </Badge>
                          )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
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
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* تفاصيل سريعة */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border">
                    <div className="text-center">
                      <Bed className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="font-bold">{property.rooms}</div>
                      <div className="text-sm text-muted-foreground">غرف</div>
                    </div>

                    <div className="text-center">
                      <Bath className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="font-bold">{property.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">
                        حمامات
                      </div>
                    </div>

                    <div className="text-center">
                      <BedSingle className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="font-bold">{property.beds}</div>
                      <div className="text-sm text-muted-foreground">سراير</div>
                    </div>

                    {property.floor && (
                      <div className="text-center">
                        <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                        <div className="font-bold">{property.floor}</div>
                        <div className="text-sm text-muted-foreground">
                          الطابق
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold mb-3">الوصف</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* الشريط الجانبي */}
            <div className="space-y-6">
              {/* بطاقة السعر والتواصل */}
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center pb-4 border-b border-border">
                    <div className="text-sm text-muted-foreground mb-1">
                      السعر الشهري
                    </div>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold text-primary">
                        {property.price?.toLocaleString()}
                      </span>
                      <span className="text-lg text-muted-foreground">
                        جنيه
                      </span>
                    </div>
                  </div>

                  {/* رقم الهاتف + واتساب */}
                  <div className="pt-4 border-t border-border space-y-4">
                    <div className="text-center">
                      <div className="text-xs text-muted-foreground mb-1">
                        تواصل معنا
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {/* زر واتساب */}
                      <a
                        href={`https://wa.me/${property.contact}?text=مرحبًا، أريد الاستفسار عن عقار: ${property.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white py-2 text-sm font-medium transition-colors"
                        dir="ltr"
                      >
                        <Phone className="h-4 w-4" />
                        تواصل عبر واتساب
                      </a>

                      {/* زر اتصال مباشر */}
                      <a
                        href={`tel:${property.contact}`}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-primary text-primary hover:bg-primary/5 py-2 text-sm font-medium transition-colors"
                        dir="ltr"
                      >
                        <Phone className="h-4 w-4" />
                        اتصال مباشر
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* بطاقة موثوقية العقار */}
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">عقار موثق</div>
                      <div className="text-xs text-muted-foreground">
                        تم التحقق من البيانات
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">
                        استجابة سريعة
                      </div>
                      <div className="text-xs text-muted-foreground">
                        يرد خلال ساعة
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Star className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">تقييم ممتاز</div>
                      <div className="text-xs text-muted-foreground">
                        4.8 من 5 نجوم
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
