import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Step = "email" | "token" | "newPassword" | "success";

const ForgotPasswordModal = ({ isOpen, onClose, onSuccess }: ForgotPasswordModalProps) => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/auth/request-password-reset/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("تم إرسال رمز إعادة التعيين إلى بريدك الإلكتروني");
        setStep("token");
      } else {
        toast.error(data.error || "حدث خطأ ما");
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/auth/reset-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          token,
          new_password: newPassword,
          new_password_confirm: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("تم تغيير كلمة المرور بنجاح");
        setStep("success");
      } else {
        toast.error(data.error || "حدث خطأ ما");
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("email");
    setEmail("");
    setToken("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  const handleSuccess = () => {
    handleClose();
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleBack = () => {
    if (step === "token") {
      setStep("email");
      setToken("");
    } else if (step === "newPassword") {
      setStep("token");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6"
          >
            <div className="w-full max-w-md md:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-2">
                  {step !== "email" && (
                    <button
                      onClick={handleBack}
                      className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  )}
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    {step === "email" && "استعادة كلمة المرور"}
                    {step === "token" && "أدخل الرمز"}
                    {step === "newPassword" && "كلمة مرور جديدة"}
                    {step === "success" && "تم بنجاح"}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {/* Email Step */}
                  {step === "email" && (
                    <motion.form
                      key="email"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleRequestReset}
                      className="space-y-4 sm:space-y-5"
                    >
                      <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                        أدخل عنوان بريدك الإلكتروني وسنرسل لك رمز إعادة التعيين
                      </p>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          البريد الإلكتروني
                        </label>
                        <div className="relative">
                          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pr-10 pl-4 py-3 sm:py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="example@gmail.com"
                            dir="rtl"
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-base sm:text-lg"
                      >
                        {loading ? "جاري الإرسال..." : "إرسال الرمز"}
                      </Button>
                    </motion.form>
                  )}

                  {/* Token Step */}
                  {step === "token" && (
                    <motion.form
                      key="token"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={(e) => {
                        e.preventDefault();
                        setStep("newPassword");
                      }}
                      className="space-y-4 sm:space-y-5"
                    >
                      <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                        أدخل الرمز الذي تلقيته في بريدك الإلكتروني
                      </p>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          الرمز (6 أرقام)
                        </label>
                        <input
                          type="text"
                          value={token}
                          onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          required
                          maxLength={6}
                          className="w-full px-4 py-4 sm:py-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-center text-3xl sm:text-4xl tracking-[0.5em] font-bold text-gray-900 placeholder-gray-300"
                          placeholder="000000"
                          inputMode="numeric"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={token.length !== 6}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition text-base sm:text-lg"
                      >
                        التالي
                      </Button>
                    </motion.form>
                  )}

                  {/* New Password Step */}
                  {step === "newPassword" && (
                    <motion.form
                      key="newPassword"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleResetPassword}
                      className="space-y-4 sm:space-y-5"
                    >
                      <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                        أدخل كلمة مرور جديدة قوية
                      </p>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          كلمة المرور الجديدة
                        </label>
                        <div className="relative">
                          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={8}
                            className="w-full pr-10 pl-4 py-3 sm:py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="أدخل كلمة مرور قوية"
                          />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                          على الأقل 8 أحرف تشمل أحرف كبيرة وصغيرة وأرقام وعلامات خاصة
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          تأكيد كلمة المرور
                        </label>
                        <div className="relative">
                          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                            className="w-full pr-10 pl-4 py-3 sm:py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="أعد إدخال كلمة المرور"
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={loading || !newPassword || newPassword !== confirmPassword}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition text-base sm:text-lg"
                      >
                        {loading ? "جاري التحديث..." : "تغيير كلمة المرور"}
                      </Button>
                    </motion.form>
                  )}

                  {/* Success Step */}
                  {step === "success" && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-8 sm:py-10"
                    >
                      <div className="flex justify-center mb-4 sm:mb-6">
                        <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-500" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        تم تغيير كلمة المرور بنجاح
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed px-2">
                        يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة
                      </p>
                      <Button
                        onClick={handleSuccess}
                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition text-base sm:text-lg"
                      >
                        عودة إلى تسجيل الدخول
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;
