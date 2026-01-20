import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Upload,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Video as VideoIcon,
  ArrowLeft,
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
import { fetchAreas } from "@/api";

const EditProperty = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [areas, setAreas] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [property, setProperty] = useState<any>(null);

  const usageTypes = [
    { value: "students", label: "طلاب" },
    { value: "families", label: "عائلات" },
    { value: "studio", label: "استوديو" },
    { value: "vacation", label: "مصيفين" },
    { value: "daily", label: "حجز يومي" },
  ];

  const [formData, setFormData] = useState({
    title_ar: "",
    title_en: "",
    location: "",
    address: "",
    price: "",
    rooms: "",
    bathrooms: "",
    area: "",
    floor: "",
    furnished: false,
    usage_type: "students",
    description_ar: "",
    description_en: "",
    contact: "",
  });

  /* جلب المناطق والعقار */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const areasData = await fetchAreas();
        setAreas(areasData || []);

        // جلب بيانات العقار
        const token = localStorage.getItem("access_token");
        const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
        
        const response = await fetch(`${apiUrl}/properties/${propertyId}/`, {
          headers: { "Authorization": `Token ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setProperty(data);
          
          // ملء بيانات النموذج
          setFormData({
            title_ar: data.name || "",
            title_en: data.name_en || "",
            location: data.area?.name || "",
            address: data.address || "",
            price: data.price?.toString() || "",
            rooms: data.rooms?.toString() || "",
            bathrooms: data.bathrooms?.toString() || "",
            area: data.size?.toString() || "",
            floor: data.floor?.toString() || "",
            furnished: data.furnished || false,
            usage_type: data.usage_type || "students",
            description_ar: data.description || "",
            description_en: data.description_en || "",
            contact: data.contact || "",
          });

          // تحميل الصور الموجودة
          if (data.images && data.images.length > 0) {
            setImages(data.images.map((img: any) => img.image));
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("خطأ في تحميل بيانات العقار");
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, [propertyId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      setVideos((prev) => [...prev, file]);
    });
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title_ar || !formData.location || !formData.price) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("يجب تسجيل الدخول أولاً");
        navigate("/auth");
        return;
      }

      const selectedArea = areas.find(a => a.name === formData.location);
      
      const propertyData = {
        name: formData.title_ar,
        name_en: formData.title_en || "",
        area: selectedArea?.id || null,
        address: formData.address || "",
        price: parseFloat(formData.price),
        rooms: parseInt(formData.rooms) || 1,
        bathrooms: parseInt(formData.bathrooms) || 1,
        size: formData.area ? parseInt(formData.area) : null,
        floor: formData.floor ? parseInt(formData.floor) : null,
        furnished: formData.furnished,
        usage_type: formData.usage_type || "families",
        description: formData.description_ar || "",
        description_en: formData.description_en || "",
        contact: formData.contact || "",
      };

      const cleanData = {};
      Object.keys(propertyData).forEach(key => {
        if (propertyData[key] !== "" && propertyData[key] !== null && propertyData[key] !== undefined) {
          cleanData[key] = propertyData[key];
        }
      });

      const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
      
      const formDataMultipart = new FormData();
      
      Object.keys(cleanData).forEach(key => {
        formDataMultipart.append(key, cleanData[key]);
      });
      
      // Add new images
      images.forEach((imageBase64, index) => {
        if (imageBase64.startsWith('data:')) {
          const byteString = atob(imageBase64.split(',')[1]);
          const mimeString = imageBase64.split(',')[0].match(/:(.*?);/)[1];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });
          formDataMultipart.append(`images`, blob, `image-${index}.jpg`);
        }
      });
      
      // Add videos
      videos.forEach((videoFile: File, index: number) => {
        formDataMultipart.append(`videos`, videoFile, `video-${index}.mp4`);
      });
      
      const response = await fetch(`${apiUrl}/properties/${propertyId}/`, {
        method: "PUT",
        headers: {
          "Authorization": `Token ${token}`,
        },
        body: formDataMultipart,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "خطأ في تحديث العقار");
      }

      toast.success("تم تحديث العقار بنجاح!");
      navigate("/dashboard/my-properties");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "خطأ في تحديث العقار");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 lg:p-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <button
            onClick={() => navigate("/dashboard/my-properties")}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl lg:text-3xl font-bold">تعديل العقار</h1>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* المعلومات الأساسية */}
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الأساسية</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="title_ar" className="text-sm font-medium">
                  اسم العقار (عربي) *
                </label>
                <Input
                  id="title_ar"
                  name="title_ar"
                  placeholder="اسم العقار"
                  value={formData.title_ar}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  المنطقة *
                </label>
                <Select value={formData.location} onValueChange={(value) => handleSelectChange("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المنطقة" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area.id} value={area.name}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  السعر (جنيه) *
                </label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="السعر"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">
                  العنوان بالتفصيل
                </label>
                <Input
                  id="address"
                  name="address"
                  placeholder="العنوان"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="usage_type" className="text-sm font-medium">
                  نوع الاستخدام
                </label>
                <Select value={formData.usage_type} onValueChange={(value) => handleSelectChange("usage_type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {usageTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* التفاصيل */}
          <Card>
            <CardHeader>
              <CardTitle>التفاصيل</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label htmlFor="rooms" className="text-sm font-medium">
                  عدد الغرف
                </label>
                <Input
                  id="rooms"
                  name="rooms"
                  type="number"
                  placeholder="عدد الغرف"
                  value={formData.rooms}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="bathrooms" className="text-sm font-medium">
                  عدد الحمامات
                </label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  placeholder="عدد الحمامات"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="area" className="text-sm font-medium">
                  المساحة (م²)
                </label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  placeholder="المساحة"
                  value={formData.area}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="floor" className="text-sm font-medium">
                  الدور
                </label>
                <Input
                  id="floor"
                  name="floor"
                  type="number"
                  placeholder="الدور"
                  value={formData.floor}
                  onChange={handleInputChange}
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
                  <span className="text-sm font-medium">
                    الشقة مفروشة
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* الوصف والتواصل */}
          <Card>
            <CardHeader>
              <CardTitle>الوصف والتواصل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="description_ar" className="text-sm font-medium">
                  الوصف (عربي)
                </label>
                <Textarea
                  id="description_ar"
                  name="description_ar"
                  placeholder="وصف العقار"
                  value={formData.description_ar}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact" className="text-sm font-medium">
                  رقم التواصل
                </label>
                <Input
                  id="contact"
                  name="contact"
                  placeholder="رقم الهاتف"
                  value={formData.contact}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* الصور */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ImageIcon className="h-5 w-5 text-primary" />
                الصور
              </CardTitle>
            </CardHeader>
            <CardContent>
              <label className="flex items-center justify-center border-2 border-dashed border-border rounded-xl p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium">اضغط لاختيار الصور</p>
                  <p className="text-xs text-muted-foreground">أو اسحب الصور هنا</p>
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`صورة ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
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
                  <p className="text-sm font-medium">اضغط لاختيار الفيديوهات</p>
                  <p className="text-xs text-muted-foreground">أو اسحب الفيديوهات هنا</p>
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
                      <span className="text-sm truncate">{video.name}</span>
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

          {/* زر الحفظ */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري التحديث...
              </span>
            ) : (
              "تحديث العقار"
            )}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditProperty;
