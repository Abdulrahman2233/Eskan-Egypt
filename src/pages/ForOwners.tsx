import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Briefcase,
  Home,
  ArrowLeft,
  BadgeCheck,
  BarChart3,
  Clock3,
  Megaphone,
  ShieldCheck,
  Users,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePageSeo } from "@/hooks/use-page-seo";

const audienceCards = [
  {
    icon: Home,
    title: "للمالك",
    description: "اعرض وحداتك بسهولة ووصل مباشرة للمستأجر المناسب بدون تعقيد.",
  },
  {
    icon: Building2,
    title: "لمكاتب العقارات",
    description: "إدارة احترافية لعروض المكتب وزيادة ظهور العقارات أمام عملاء جادين.",
  },
  {
    icon: Briefcase,
    title: "للوسيط العقاري",
    description: "ابن وجودك الرقمي وقدم عقاراتك بصورة موثوقة وسريعة الوصول.",
  },
];

const benefits = [
  {
    icon: Megaphone,
    title: "وصول أقوى",
    description: "ظهور أعلى لعقاراتك أمام الباحثين عن سكن في الإسكندرية.",
  },
  {
    icon: Clock3,
    title: "نشر أسرع",
    description: "إضافة العقار وتحديث البيانات في دقائق من لوحة تحكم واحدة.",
  },
  {
    icon: ShieldCheck,
    title: "ثقة أكبر",
    description: "عرض منظم للصور والتفاصيل يعزز المصداقية ويرفع جودة الاستفسارات.",
  },
  {
    icon: BarChart3,
    title: "متابعة الأداء",
    description: "تعرف على تفاعل العملاء مع عقاراتك وطور أسلوب العرض باستمرار.",
  },
];

const publishSteps = [
  "أنشئ حسابك كمُعلن (مالك / مكتب / وسيط)",
  "أضف بيانات العقار والصور بشكل احترافي",
  "انشر الإعلان واستقبل طلبات التواصل مباشرة",
];

const ForOwners = () => {
  usePageSeo({
    title: "انشر عقارك على إقامتك EQAMTAK | للملاك ومكاتب العقارات والوسطاء",
    description:
      "صفحة مخصصة للملاك ومكاتب العقارات والوسطاء لنشر العقارات على إقامتك EQAMTAK: وصول أكبر، عرض احترافي، وإدارة أسهل للإعلانات في الإسكندرية.",
    canonicalPath: "/for-owners",
    keywords:
      "نشر عقار, اعلان عقاري, للملاك, مكاتب عقارات, وسيط عقاري, تسويق عقاري الاسكندرية, عرض شقة للايجار",
    ogTitle: "انشر عقارك الآن | إقامتك EQAMTAK",
    ogDescription:
      "انضم كمالك أو مكتب عقاري أو وسيط وابدأ نشر عقاراتك باحترافية على إقامتك EQAMTAK.",
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50" dir="rtl">
      <Navbar />

      <main className="flex-1 mt-16">
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_5%,rgba(14,116,144,0.12),transparent_38%),radial-gradient(circle_at_85%_90%,rgba(30,64,175,0.12),transparent_42%)]" />
          <div className="container relative mx-auto px-4 py-14 md:py-20">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="mx-auto max-w-4xl text-center"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary md:text-sm">
                <BadgeCheck className="h-4 w-4" />
                بوابة نشر احترافية للمعلنين العقاريين
              </span>

              <h1 className="mt-5 text-3xl font-black leading-tight text-slate-900 md:text-5xl">
                منصة قوية للملاك
                <br />
                ومكاتب العقارات والوسطاء
              </h1>

              <p className="mx-auto mt-5 max-w-3xl text-sm leading-8 text-slate-600 md:text-base">
                إذا كنت مالك عقار، أو تدير مكتب عقارات، أو تعمل كوسيط عقاري,
                إقامتك EQAMTAK تمنحك قناة واضحة للوصول إلى مستأجرين جادين، مع عرض
                احترافي لعقاراتك وخطوات نشر سهلة وسريعة.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" className="h-11 gap-2 rounded-xl">
                  <Link to="/auth">
                    ابدأ نشر عقارك الآن
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-11 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100">
                  <Link to="/properties">تصفح العقارات المعروضة</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid gap-4 md:grid-cols-3">
            {audienceCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                >
                  <Card className="h-full border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="text-lg font-bold text-slate-900">{card.title}</h2>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{card.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="bg-white border-y border-slate-200">
          <div className="container mx-auto px-4 py-10 md:py-14">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-2xl font-black text-slate-900 md:text-3xl">لماذا تنشر عقاراتك معنا؟</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {benefits.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.45, delay: index * 0.08 }}
                    >
                      <Card className="h-full border-slate-200 bg-slate-50/70">
                        <CardContent className="p-5">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                              <p className="mt-1.5 text-sm leading-7 text-slate-600">{item.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 md:py-14">
          <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-slate-900 px-6 py-8 text-white md:px-10 md:py-10">
            <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <h2 className="text-2xl font-black md:text-3xl">3 خطوات وتبدأ النشر</h2>
                <div className="mt-5 space-y-3">
                  {publishSteps.map((step) => (
                    <div key={step} className="flex items-start gap-2.5 text-sm leading-7 text-slate-200">
                      <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-400" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/5 p-5">
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <Users className="h-4 w-4 text-cyan-300" />
                  انضم لآلاف الباحثين عن سكن
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  ابدأ اليوم في بناء حضور رقمي أقوى لعقاراتك، وقدم عروضك بشكل يليق
                  بخبرتك في السوق.
                </p>
                <Button asChild size="lg" className="mt-5 h-11 w-full bg-white text-slate-900 hover:bg-slate-100">
                  <Link to="/auth">إنشاء حساب مُعلن</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ForOwners;
