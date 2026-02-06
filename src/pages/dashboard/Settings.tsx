import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, Save, Loader2, MapPin, Calendar,
  Lock, Eye, EyeOff, Camera,
  Check, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { changePassword, updateProfile } from "@/api";

interface UserType {
  id?: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  address?: string;
  city?: string;
  country?: string;
  bio?: string;
  job_title?: string;
  company?: string;
  website?: string;
  birth_date?: string;
  account_type?: string;
}

const getStoredUser = (): UserType | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const saveUser = (user: UserType) => {
  localStorage.setItem("user", JSON.stringify(user));
};

const Settings = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    birth_date: "",
    city: "",
    country: "مصر",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        full_name: storedUser.full_name || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        birth_date: storedUser.birth_date || "",
        city: storedUser.city || "",
        country: storedUser.country || "مصر",
      });
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = {
        first_name: formData.full_name?.split(' ')[0] || "",
        last_name: formData.full_name?.split(' ').slice(1).join(' ') || "",
        email: formData.email || "",
        full_name: formData.full_name || "",
        phone_number: formData.phone || "",
        date_of_birth: formData.birth_date || "",
        city: formData.city || "",
      };

      const result = await updateProfile(updateData);

      if (user && result.user) {
        const profile = result.user?.profile || {};
        const updatedUser: UserType = {
          ...user,
          ...formData,
          email: result.user?.email || user.email,
          full_name: profile.full_name || user.full_name,
          phone: profile.phone_number || user.phone,
        };
        saveUser(updatedUser);
        setUser(updatedUser);
      }

      toast.success("تم حفظ التغييرات بنجاح");
    } catch (error: any) {
      const errorMessage = error?.error || error?.message || "حدث خطأ أثناء الحفظ";
      toast.error(errorMessage);
      console.error("Profile update error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword) {
      toast.error("يجب إدخال كلمة المرور الحالية");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("كلمة المرور الجديدة غير متطابقة");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return;
    }

    if (!/[A-Z]/.test(passwordData.newPassword)) {
      toast.error("كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل");
      return;
    }

    if (!/[a-z]/.test(passwordData.newPassword)) {
      toast.error("كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل");
      return;
    }

    if (!/[0-9]/.test(passwordData.newPassword)) {
      toast.error("كلمة المرور يجب أن تحتوي على رقم واحد على الأقل");
      return;
    }

    setSaving(true);
    try {
      await changePassword({
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        new_password_confirm: passwordData.confirmPassword,
      });
      
      toast.success("تم تغيير كلمة المرور بنجاح");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      console.error("Password change error:", error);
      
      // معالجة الأخطاء المختلفة
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.response?.data?.errors) {
        // معالجة أخطاء التحقق من الصيغة
        const errorMessages = Object.values(error.response.data.errors).flat();
        toast.error(errorMessages[0]?.toString() || "حدث خطأ أثناء تغيير كلمة المرور");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("حدث خطأ أثناء تغيير كلمة المرور");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const settingsTabs = [
    { id: "profile", label: "الملف الشخصي", icon: User },
    { id: "security", label: "الأمان", icon: Lock },
  ];

  return (
    <DashboardLayout>
      <div className="p-3 sm:p-4 lg:p-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6"
        >
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            إعدادات الحساب
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            تخصيص حسابك وإعداداتك الشخصية
          </p>
        </motion.div>

        {/* Mobile Tabs - Horizontal Scroll */}
        <div className="sm:hidden mb-4 -mx-3 px-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-card text-muted-foreground border border-border"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="hidden sm:grid w-full grid-cols-2 h-auto p-1 bg-muted/50">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 sm:space-y-6 mt-0">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-border/50">
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      ملفك الشخصي
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div>
                        <Avatar className="w-24 h-24 sm:w-32 sm:h-32 ring-4 ring-primary/10">
                          <AvatarFallback className="text-4xl sm:text-5xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                            {formData.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="space-y-3 flex-1 w-full text-center sm:text-right">
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-1">اسم المستخدم</p>
                          <p className="text-lg sm:text-xl font-bold text-foreground">
                            {user?.username || "—"}
                          </p>
                        </div>
                        {user?.account_type && (
                          <div>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-1">نوع الحساب</p>
                            <div className="flex items-center justify-center sm:justify-end gap-2">
                              <span className="text-xl">
                                {user.account_type === "owner" && "🏠"}
                                {user.account_type === "agent" && "👤"}
                                {user.account_type === "agency" && "🏢"}
                              </span>
                              <p className="text-sm sm:text-base font-semibold text-primary">
                                {user.account_type === "owner" && "مالك عقار"}
                                {user.account_type === "agent" && "وسيط"}
                                {user.account_type === "agency" && "مكتب عقارات"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Personal Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-border/50">
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <User className="h-5 w-5 text-primary" />
                      المعلومات الأساسية
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      معلوماتك الشخصية الأساسية
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-sm">الاسم الكامل</Label>
                        <Input
                          id="full_name"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          placeholder="أدخل اسمك الكامل"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4" />
                          البريد الإلكتروني
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="example@email.com"
                          dir="ltr"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4" />
                          رقم الهاتف
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="01xxxxxxxxx"
                          dir="ltr"
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birth_date" className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          تاريخ الميلاد
                        </Label>
                        <Input
                          id="birth_date"
                          name="birth_date"
                          type="date"
                          value={formData.birth_date}
                          onChange={handleInputChange}
                          dir="ltr"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Address Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-border/50">
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                      المحافظة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm">المحافظة</Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="اختر المحافظة" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="القاهرة">القاهرة</SelectItem>
                            <SelectItem value="الإسكندرية">الإسكندرية</SelectItem>
                            <SelectItem value="الجيزة">الجيزة</SelectItem>
                            <SelectItem value="الشرقية">الشرقية</SelectItem>
                            <SelectItem value="الدقهلية">الدقهلية</SelectItem>
                            <SelectItem value="الغربية">الغربية</SelectItem>
                            <SelectItem value="المنوفية">المنوفية</SelectItem>
                            <SelectItem value="الفيوم">الفيوم</SelectItem>
                            <SelectItem value="بني سويف">بني سويف</SelectItem>
                            <SelectItem value="المنيا">المنيا</SelectItem>
                            <SelectItem value="أسيوط">أسيوط</SelectItem>
                            <SelectItem value="سوهاج">سوهاج</SelectItem>
                            <SelectItem value="قنا">قنا</SelectItem>
                            <SelectItem value="أسوان">أسوان</SelectItem>
                            <SelectItem value="الأقصر">الأقصر</SelectItem>
                            <SelectItem value="البحر الأحمر">البحر الأحمر</SelectItem>
                            <SelectItem value="كفر الشيخ">كفر الشيخ</SelectItem>
                            <SelectItem value="مطروح">مطروح</SelectItem>
                            <SelectItem value="شمال سيناء">شمال سيناء</SelectItem>
                            <SelectItem value="جنوب سيناء">جنوب سيناء</SelectItem>
                            <SelectItem value="الوادي الجديد">الوادي الجديد</SelectItem>
                            <SelectItem value="بورسعيد">بورسعيد</SelectItem>
                            <SelectItem value="إسماعيلية">إسماعيلية</SelectItem>
                            <SelectItem value="السويس">السويس</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Save Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  type="submit"
                  size="lg"
                  className="w-full gap-2 shadow-lg shadow-primary/20 h-12 text-base"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      حفظ التغييرات
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4 sm:space-y-6 mt-0">
            <form onSubmit={handlePasswordSubmit} className="space-y-4 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-border/50">
                  <CardHeader className="pb-3 sm:pb-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Lock className="h-5 w-5 text-primary" />
                      تغيير كلمة المرور
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      تأكد من استخدام كلمة مرور قوية تحتوي على حروف وأرقام ورموز
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-sm">كلمة المرور الحالية</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="أدخل كلمة المرور الحالية"
                          dir="ltr"
                          className="text-sm pl-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-sm">كلمة المرور الجديدة</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="أدخل كلمة المرور الجديدة"
                          dir="ltr"
                          className="text-sm pl-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm">تأكيد كلمة المرور</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="أعد إدخال كلمة المرور الجديدة"
                        dir="ltr"
                        className="text-sm"
                      />
                    </div>
                    
                    {/* Password Requirements */}
                    <div className="bg-muted/50 rounded-lg p-3 sm:p-4 space-y-2">
                      <p className="text-xs sm:text-sm font-medium text-foreground">متطلبات كلمة المرور:</p>
                      <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                        <li className="flex items-center gap-2">
                          <Check className={`h-3 w-3 ${passwordData.newPassword.length >= 8 ? 'text-green-500' : 'text-muted-foreground'}`} />
                          8 أحرف على الأقل
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className={`h-3 w-3 ${/[A-Z]/.test(passwordData.newPassword) ? 'text-green-500' : 'text-muted-foreground'}`} />
                          حرف كبير واحد على الأقل
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className={`h-3 w-3 ${/[a-z]/.test(passwordData.newPassword) ? 'text-green-500' : 'text-muted-foreground'}`} />
                          حرف صغير واحد على الأقل
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className={`h-3 w-3 ${/[0-9]/.test(passwordData.newPassword) ? 'text-green-500' : 'text-muted-foreground'}`} />
                          رقم واحد على الأقل
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Security Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-border/50 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50">
                  <CardContent className="pt-4 sm:pt-6">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">نصائح أمنية</h4>
                        <ul className="text-xs sm:text-sm text-amber-700 dark:text-amber-300 mt-1 space-y-1">
                          <li>• لا تشارك كلمة المرور مع أي شخص</li>
                          <li>• استخدم كلمة مرور فريدة لكل حساب</li>
                          <li>• قم بتغيير كلمة المرور بشكل دوري</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 shadow-lg shadow-primary/20 h-12 text-base"
                disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري التحديث...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    تغيير كلمة المرور
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
