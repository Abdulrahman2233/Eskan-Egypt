import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Upload,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Video as VideoIcon,
  MapPin,
  DollarSign,
  FileText,
  MessageSquare,
  Phone,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import LocationPicker from "@/components/LocationPicker";
import { fetchAreas, createProperty } from "@/api";

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [areas, setAreas] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  /* نوع الاستخدام من البيانات المتوقعة */
  const usageTypes = [
    { value: "students", label: "طلاب" },
    { value: "families", label: "عائلات" },
    { value: "studio", label: "استوديو" },
    { value: "vacation", label: "مصيفين" },
    { value: "daily", label: "حجز يومي" },
  ];

  const [formData, setFormData] = useState({
    title_ar: "",
    location: "",
    address: "",
    price: "",
    bedrooms: "",
    beds: "",
    bathrooms: "",
    area: "",
    floor: "",
    furnished: false,
    usage_type: "students",
    description_ar: "",
    contact: "",
    latitude: "",
    longitude: "",
  });

  /* جلب المناطق من الـ API */
  useEffect(() => {
    const loadAreas = async () => {
      try {
        setLoadingData(true);
        const data = await fetchAreas();
        setAreas(data || []);
      } catch (error) {
        console.error("Error loading areas:", error);
        toast.error("خطأ في تحميل المناطق");
      } finally {
        setLoadingData(false);
      }
    };
    loadAreas();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (latitude: number, longitude: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    }));
  };

  /* التحقق من أبعاد الصورة */
  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          resolve({ width: img.width, height: img.height });
        };
        img.onerror = () => {
          reject(new Error("فشل في قراءة الصورة"));
        };
        img.src = e.target?.result as string;
      };
      reader.onerror = () => {
        reject(new Error("خطأ في قراءة الملف"));
      };
      reader.readAsDataURL(file);
    });
  };

  /* الصور */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Check image dimensions (max 20 megapixels)
      const reader = new FileReader();
      reader.onload = async (event) => {
        const img = new Image();
        img.onload = () => {
          const megapixels = (img.width * img.height) / 1000000;
          
          if (megapixels > 20) {
            toast.error(`الصورة ${file.name} تتجاوز 20 ميجا بكسل (${megapixels.toFixed(2)} ميجا بكسل)`);
            return;
          }
          
          setImages((prev) => [...prev, event.target?.result as string]);
          toast.success(`تم تحميل الصورة بنجاح (${megapixels.toFixed(2)} ميجا بكسل)`);
        };
        img.onerror = () => {
          toast.error(`فشل في قراءة الصورة: ${file.name}`);
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = () => {
        toast.error(`خطأ في قراءة الملف: ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* الفيديو */
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // Check video file size - get video dimensions through metadata
      const video = document.createElement('video');
      const fileUrl = URL.createObjectURL(file);
      
      video.onloadedmetadata = () => {
        const megapixels = (video.videoWidth * video.videoHeight) / 1000000;
        
        if (megapixels > 50) {
          toast.error(`الفيديو ${file.name} يتجاوز 50 ميجا بكسل (${megapixels.toFixed(2)} ميجا بكسل)`);
          URL.revokeObjectURL(fileUrl);
          return;
        }
        
        setVideos((prev) => [...prev, file]);
        toast.success(`تم تحميل الفيديو بنجاح (${megapixels.toFixed(2)} ميجا بكسل)`);
        URL.revokeObjectURL(fileUrl);
      };
      
      video.onerror = () => {
        toast.error(`فشل في قراءة الفيديو: ${file.name}`);
        URL.revokeObjectURL(fileUrl);
      };
      
      video.src = fileUrl;
    });
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title_ar || !formData.location || !formData.price || !formData.bedrooms || !formData.beds || !formData.bathrooms || !formData.address || !formData.description_ar || !formData.area || !formData.floor || !formData.contact) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      setLoading(false);
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      toast.error("يرجى اختيار الموقع على الخريطة");
      setLoading(false);
      return;
    }

    if (images.length === 0) {
      toast.error("يرجى إضافة صور للعقار");
      setLoading(false);
      return;
    }

    if (formData.contact.length < 11 || formData.contact.length > 15) {
      toast.error("رقم التواصل يجب أن يكون بين 11 و 15 حرف");
      setLoading(false);
      return;
    }

    // التحقق من أن جميع الصور والفيديوهات تحقق المتطلبات
    let hasInvalidFiles = false;
    
    // Verify images by reloading them to check megapixels
    for (let i = 0; i < images.length; i++) {
      const imageBase64 = images[i];
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const megapixels = (img.width * img.height) / 1000000;
          if (megapixels > 20) {
            toast.error(`الصورة رقم ${i + 1} تتجاوز 20 ميجا بكسل`);
            hasInvalidFiles = true;
          }
          resolve();
        };
        img.onerror = () => {
          resolve();
        };
        img.src = imageBase64;
      });
    }

    if (hasInvalidFiles) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("access_token") || localStorage.getItem("auth_token");
      if (!token) {
        toast.error("يجب تسجيل الدخول أولاً");
        navigate("/auth");
        return;
      }

      // البيانات المطلوب إرسالها
      // العثور على Area ID من الاسم
      const selectedArea = areas.find(a => a.name === formData.location);
      
      // دالة متقدمة لتنسيق الإحداثيات - تتعامل مع أي حالة
      const formatCoordinate = (value: any): string | null => {
        try {
          // معالجة القيم الفارغة والـ null
          if (value === null || value === undefined || value === '' || value === 'null' || value === 'undefined') {
            return null;
          }

          // تحويل إلى string وتنظيفه
          let strValue = String(value).trim();
          
          // تجاهل القيم الفارغة بعد التنظيف
          if (!strValue || ['none', 'null', 'undefined', 'nan'].includes(strValue.toLowerCase())) {
            return null;
          }

          // تحويل آمن إلى رقم
          const num = parseFloat(strValue);
          
          // التحقق من صحة الرقم
          if (isNaN(num) || !isFinite(num)) {
            console.warn(`تحذير: قيمة غير صحيحة: ${value}`);
            return null;
          }

          // تقريب إلى 8 أرقام عشرية كحد أقصى
          const rounded = parseFloat(num.toFixed(8));
          
          // إعادة التحويل إلى string بدون أصفار غير ضرورية
          return rounded.toString();
        } catch (error) {
          console.error(`خطأ في تحويل الإحداثيات: ${value}`, error);
          return null;
        }
      };
      
      const propertyData = {
        name: formData.title_ar,
        area: selectedArea?.id || null,
        address: formData.address || "",
        price: parseFloat(formData.price),
        rooms: parseInt(formData.bedrooms) || 1,
        beds: parseInt(formData.beds) || 1,
        bathrooms: parseInt(formData.bathrooms) || 1,
        size: formData.area ? parseInt(formData.area) : 0,
        floor: formData.floor ? parseInt(formData.floor) : 0,
        furnished: formData.furnished === true,
        usage_type: formData.usage_type || "families",
        description: formData.description_ar || "",
        contact: formData.contact || "",
        latitude: formatCoordinate(formData.latitude),
        longitude: formatCoordinate(formData.longitude),
      };

      // حذف القيم الفارغة والـ null والـ undefined فقط (ليس 0)
      const cleanData = {};
      Object.keys(propertyData).forEach(key => {
        const value = propertyData[key];
        // عدم إرسال null أو undefined أو strings فارغة (لكن 0 مقبول)
        if (value !== "" && value !== null && value !== undefined) {
          cleanData[key] = value;
        }
      });

      // استخدام API محلي عند التطوير
      const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
      
      // Create FormData to send images and videos along with property data
      const formDataMultipart = new FormData();
      
      // Add property fields - تحويل جميع القيم إلى strings
      Object.keys(cleanData).forEach(key => {
        const value = cleanData[key];
        // تحويل الأرقام والقيم الأخرى إلى strings
        if (value !== null && value !== undefined) {
          formDataMultipart.append(key, String(value));
        }
      });
      
      // Add images
      images.forEach((imageBase64, index) => {
        // Convert base64 to blob
        const byteString = atob(imageBase64.split(',')[1]);
        const mimeString = imageBase64.split(',')[0].match(/:(.*?);/)[1];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        formDataMultipart.append(`images`, blob, `image-${index}.jpg`);
      });
      
      // Add videos
      videos.forEach((videoFile: File, index: number) => {
        formDataMultipart.append(`videos`, videoFile, `video-${index}.mp4`);
      });
      
      console.log("=== DEBUG INFO ===");
      console.log("Sending to:", `${apiUrl}/properties/`);
      console.log("With images:", images.length);
      console.log("With videos:", videos.length);
      console.log("Latitude:", formData.latitude);
      console.log("Longitude:", formData.longitude);
      console.log("Token:", token);
      console.log("FormData entries:");
      for (const [key, value] of formDataMultipart.entries()) {
        if (typeof value === 'string') {
          console.log(`  ${key}: ${value}`);
        } else {
          console.log(`  ${key}: [File]`);
        }
      }
      console.log("=== END DEBUG ===");
      
      const response = await fetch(`${apiUrl}/properties/`, {
        method: "POST",
        headers: {
          "Authorization": `Token ${token}`,
        },
        body: formDataMultipart,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend Error Response:", errorData);
        
        // معالجة الأخطاء المفصلة
        if (errorData.errors) {
          const errorMessages = Object.entries(errorData.errors)
            .map(([key, value]: any) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(errorData.detail || "خطأ في إضافة العقار");
      }

      const data = await response.json();
      toast.success("تم إضافة العقار بنجاح! سيتم مراجعته من قبل الفريق.");
      navigate("/dashboard/my-properties");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "خطأ في إضافة العقار");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl lg:text-3xl font-bold mb-6"
        >
          إضافة عقار جديد
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* معلومات أساسية */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                معلومات أساسية
              </CardTitle>
              <CardDescription>بيانات العقار الرئيسية</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="title_ar"
                  className="text-sm font-medium text-foreground"
                >
                 اسم العقار <span className="text-red-500">*</span>
                </label>
                <Input
                  id="title_ar"
                  name="title_ar"
                  placeholder="شقة ميامي "
                  value={formData.title_ar}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="usage_type"
                  className="text-sm font-medium text-foreground"
                >
                  المستأجر <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.usage_type}
                  onValueChange={(v) => handleSelectChange("usage_type", v)}
                >
                  <SelectTrigger id="usage_type">
                    <SelectValue placeholder="اختر نوع الاستخدام" />
                  </SelectTrigger>
                  <SelectContent>
                    {usageTypes.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* الموقع والموقع الجغرافي (مدمجة) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                الموقع والإحداثيات الجغرافية
              </CardTitle>
              <CardDescription>حدد المنطقة والعنوان والموقع على الخريطة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* المنطقة والعنوان */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="location"
                    className="text-sm font-medium text-foreground"
                  >
                    المنطقة <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.location}
                    onValueChange={(v) => handleSelectChange("location", v)}
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder="اختر المنطقة" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingData ? (
                        <div className="p-2 text-center text-sm text-gray-500">
                          جاري التحميل...
                        </div>
                      ) : areas.length > 0 ? (
                        areas.map((area) => (
                          <SelectItem key={area.id} value={area.name}>
                            {area.name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-center text-sm text-gray-500">
                          لا توجد مناطق
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="address"
                    className="text-sm font-medium text-foreground"
                  >
                    العنوان التفصيلي <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="العنوان التفصيلي"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* الفاصل */}
              <div className="border-t border-border/30"></div>

              {/* الخريطة الجغرافية */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">
                    اختر الموقع على الخريطة <span className="text-red-500">*</span>
                  </label>
                  {formData.latitude && formData.longitude && (
                    <span className="text-xs text-green-600 bg-green-50 dark:bg-green-950 px-2 py-1 rounded border border-green-200 dark:border-green-800">
                      ✓ تم تحديد الموقع
                    </span>
                  )}
                  {(!formData.latitude || !formData.longitude) && (
                    <span className="text-xs text-red-600 bg-red-50 dark:bg-red-950 px-2 py-1 rounded border border-red-200 dark:border-red-800">
                      ⚠ مطلوب
                    </span>
                  )}
                </div>
                <LocationPicker 
                  onLocationSelect={handleLocationSelect}
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  height="450px"
                />
                {!formData.latitude || !formData.longitude ? (
                  <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                    <span>⚠</span> يرجى اختيار موقع على الخريطة
                  </p>
                ) : (
                  <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                    <span>✓</span> تم اختيار الموقع بنجاح
                  </p>
                )}
              </div>

              {/* الإحداثيات المعروضة */}
              {(formData.latitude || formData.longitude) && (
                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 space-y-2 border border-green-200 dark:border-green-800">
                  <p className="text-xs font-medium text-foreground">الإحداثيات المحددة:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">الخط الاستوائي:</span> {formData.latitude || '-'}
                    </div>
                    <div>
                      <span className="font-medium">خط الطول:</span> {formData.longitude || '-'}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* السعر */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                السعر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="text-sm font-medium text-foreground"
                >
                  السعر (للايجارالشهرى) <span className="text-red-500">*</span>
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="السعر بالجنيه"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* التفاصيل */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                التفاصيل
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label
                  htmlFor="bedrooms"
                  className="text-sm font-medium text-foreground"
                >
                  عدد الغرف <span className="text-red-500">*</span>
                </label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  placeholder="عدد الغرف"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="beds"
                  className="text-sm font-medium text-foreground"
                >
                  عدد السراير <span className="text-red-500">*</span>
                </label>
                <Input
                  id="beds"
                  name="beds"
                  type="number"
                  placeholder="عدد السراير"
                  value={formData.beds}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="bathrooms"
                  className="text-sm font-medium text-foreground"
                >
                  عدد الحمامات <span className="text-red-500">*</span>
                </label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  placeholder="عدد الحمامات"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="area"
                  className="text-sm font-medium text-foreground"
                >
                  المساحة (م²) <span className="text-red-500">*</span>
                </label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  placeholder="المساحة"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="floor"
                  className="text-sm font-medium text-foreground"
                >
                  الدور <span className="text-red-500">*</span>
                </label>
                <Input
                  id="floor"
                  name="floor"
                  type="number"
                  placeholder="الدور"
                  value={formData.floor}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2 flex items-center gap-4 pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="furnished"
                    checked={formData.furnished}
                    onChange={(e) =>
                      setFormData({ ...formData, furnished: e.target.checked })
                    }
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm font-medium text-foreground">
                    الشقة مفروشة
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* الوصف والتواصل */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                الوصف والتواصل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="description_ar"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <FileText className="h-4 w-4 text-primary" />
                  الوصف <span className="text-red-500">*</span>
                </label>
                <Textarea
                  id="description_ar"
                  name="description_ar"
                  placeholder="اكتب وصف العقار"
                  value={formData.description_ar}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="contact"
                  className="text-sm font-medium text-foreground flex items-center gap-2"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  رقم التواصل <span className="text-red-500">*</span>
                  <span className="text-xs text-muted-foreground">(11-15 رقم)</span>
                </label>
                <Input
                  id="contact"
                  name="contact"
                  type="tel"
                  placeholder="رقم التواصل (11-15 رقم)"
                  value={formData.contact}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value.length <= 15) {
                      setFormData({ ...formData, contact: value });
                    }
                  }}
                  minLength={11}
                  maxLength={15}
                  required
                />
                {formData.contact && (formData.contact.length < 11 || formData.contact.length > 15) && (
                  <p className="text-xs text-red-500">يجب أن يكون رقم التواصل بين 11 و 15 رقم</p>
                )}
              </div>
            </CardContent>
          </Card>



          {/* الصور */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                الصور <span className="text-red-500">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <label className="flex items-center justify-center border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">اضغط لاختيار الصور</p>
                  <p className="text-xs text-muted-foreground">
                    أو اسحب الصور هنا
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* الفيديوهات */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <VideoIcon className="h-5 w-5 text-primary" />
                الفيديوهات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <label className="flex items-center justify-center border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">
                    اضغط لاختيار الفيديوهات
                  </p>
                  <p className="text-xs text-muted-foreground">
                    أو اسحب الفيديوهات هنا
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>

              {videos.length > 0 && (
                <div className="space-y-2 mt-4">
                  {videos.map((video, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-muted p-3 rounded-lg"
                    >
                      <span className="text-sm truncate">
                        {video.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* حفظ */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الحفظ...
              </span>
            ) : (
              "حفظ العقار"
            )}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AddProperty;
