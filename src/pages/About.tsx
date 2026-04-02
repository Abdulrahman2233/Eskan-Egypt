import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  BarChart3,
  Building2,
  CheckCircle,
  HeartHandshake,
  MessageSquare,
  PhoneIcon,
  Search,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import eskanLogo from "@/assets/logo1.webp";
import { usePageSeo } from "@/hooks/use-page-seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const stats = [
  { value: "24/7", label: "دعم ومتابعة مستمرة" },
  { value: "98%", label: "رضا المستخدمين" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "ثقة وشفافية",
    description: "نوفر بيانات واضحة وتفاصيل دقيقة لكل عقار قبل أي خطوة تواصل.",
  },
  {
    icon: Search,
    title: "بحث ذكي وسريع",
    description: "فلترة دقيقة حسب المنطقة والسعر والمستوى لتصل لخيارات حقيقية بسرعة.",
  },
  {
    icon: HeartHandshake,
    title: "دعم إنساني محترف",
    description: "فريقنا يرافقك من أول استفسار حتى إتمام الاتفاق بثقة وهدوء.",
  },
  {
    icon: BarChart3,
    title: "تحسين مستمر",
    description: "نطور المنصة باستمرار اعتمادا على سلوك المستخدمين واحتياجات السوق.",
  },
];

const workflow = [
  {
    icon: Search,
    title: "استكشف الخيارات",
    description: "حدد ميزانيتك، المنطقة، ونوع السكن ثم ابدأ التصفح الذكي.",
  },
  {
    icon: BadgeCheck,
    title: "تأكد من التفاصيل",
    description: "راجع الصور والمزايا وشروط الإيجار كاملة قبل التواصل.",
  },
  {
    icon: PhoneIcon,
    title: "تواصل واتفق",
    description: "تواصل مباشرة مع المالك أو الوسيط وحدد الزيارة أو التعاقد.",
  },
];

const faqs = [
  {
    question: "هل المنصة مخصصة فقط لسكن الطلاب؟",
    answer:
      "لا، المنصة توفر سكن للطلاب والعائلات، بالإضافة إلى خيارات يومية وأسبوعية حسب احتياجك.",
  },
  {
    question: "كيف يمكنني حجز سكن؟",
    answer:
      "تصفح العقارات المناسبة، ثم تواصل مباشرة مع المالك أو الوسيط من خلال بيانات الاتصال داخل صفحة العقار.",
  },
  {
    question: "هل الأسعار ثابتة أم قابلة للتفاوض؟",
    answer:
      "في أغلب الحالات الأسعار قابلة للتفاوض، ويعتمد القرار النهائي على المالك أو الوسيط.",
  },
  {
    question: "هل يوجد أي رسوم على استخدام الموقع؟",
    answer:
      "البحث والتصفح مجاني للمستخدمين، وقد تظهر رسوم خاصة على بعض الخدمات أو الإعلانات المدفوعة.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const About = () => {
  usePageSeo({
    title: "عن إقامتك EQAMTAK | منصة سكن للطلاب والعائلات ومصيفين + حلول للملاك والمكاتب",
    description:
      "تعرف على إقامتك EQAMTAK: منصة عقارية بالإسكندرية للباحثين عن سكن طلاب، عائلات، ومصيفين، ومخصصة أيضا للملاك ومكاتب العقارات والوسطاء لعرض العقارات وإدارة الطلبات.",
    keywords:
      "عن اسكان ايجيبت, منصة عقارية الاسكندرية, سكن طلاب, سكن عائلات, مكاتب عقارات, وسيط عقاري, اعلان عقار",
    ogTitle: "عن إقامتك EQAMTAK | الثقة والشفافية في العقارات",
    ogDescription:
      "منصة تجمع المستأجرين مع الملاك والمكاتب والوسطاء في تجربة احترافية واضحة.",
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50" dir="rtl">
      <Navbar />
      <main className="flex-1 mt-16">
        <section className="relative overflow-hidden bg-slate-100/70">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(30,64,175,0.12),transparent_40%),radial-gradient(circle_at_85%_100%,rgba(14,165,233,0.14),transparent_45%)]" />
          <div className="container relative mx-auto px-4 py-12 md:py-20">
            <motion.div
              className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_25px_60px_-30px_rgba(15,23,42,0.35)] md:p-10"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
                <motion.div variants={fadeUp} className="space-y-6">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary md:text-sm">
                    <BadgeCheck className="h-4 w-4" />
                    خبرة محلية وتقنية دقيقة
                  </span>

                  <h1 className="text-3xl font-black leading-tight text-slate-900 md:text-5xl">
                    خبرة عقارية رقمية
                    <br />
                    بمعيار احترافي حقيقي
                  </h1>

                  <p className="max-w-2xl text-sm leading-8 text-slate-600 md:text-base">
                    في إقامتك EQAMTAK نختصر رحلة البحث عن السكن إلى تجربة واضحة وسريعة.
                    نعرض بيانات دقيقة، خيارات موثوقة، وتواصل مباشر مع المالك أو الوسيط
                    حتى تصل إلى قرار سكني أفضل بثقة كاملة.
                  </p>

                  <div className="grid gap-2 text-xs text-slate-700 sm:grid-cols-2 md:text-sm">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                      فلترة متقدمة حسب المنطقة والميزانية
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                      إعلانات موثوقة مع تفاصيل واضحة
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Button asChild size="lg" className="h-11 gap-2 rounded-xl">
                      <Link to="/properties">
                        ابدأ تصفح العقارات
                        <ArrowLeft className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="h-11 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100">
                      <Link to="/contact">تحدث مع فريقنا</Link>
                    </Button>
                  </div>
                </motion.div>

                <motion.div variants={fadeUp} className="mx-auto w-full max-w-md">
                  <div className="rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white shadow-xl">
                    <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 p-3">
                      <div>
                        <p className="text-[11px] text-slate-300">منصة متخصصة في الإسكندرية</p>
                        <h2 className="text-base font-bold">إقامتك EQAMTAK</h2>
                      </div>
                      <img
                        src={eskanLogo}
                        alt="إقامتك EQAMTAK"
                        className="h-12 w-12 rounded-xl bg-white p-1 object-contain"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {stats.slice(0, 4).map((item) => (
                        <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                          <p className="text-lg font-extrabold">{item.value}</p>
                          <p className="text-[11px] leading-5 text-slate-300">{item.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-14">
          <div className="mx-auto max-w-6xl space-y-14">
            <motion.div
              className="mt-7 grid gap-6 lg:grid-cols-3"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: Target,
                  title: "رؤيتنا",
                  description:
                    "أن نكون المنصة العقارية الأكثر ثقة وسرعة في مصر، مع تجربة رقمية متفوقة للمستأجرين والمعلنين.",
                },
                {
                  icon: Building2,
                  title: "رسالتنا",
                  description:
                    "تبسيط رحلة البحث عن السكن عبر أدوات ذكية، وبيانات واضحة، وتواصل مباشر وفعّال.",
                },
                {
                  icon: Users,
                  title: "من نخدم",
                  description:
                    "الطلاب والعائلات والمغتربين وكل من يبحث عن سكن موثوق يناسب احتياجه وميزانيته.",
                },
              ].map((item) => (
                <motion.div key={item.title} variants={fadeUp}>
                  <Card className="h-full rounded-2xl border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <CardContent className="space-y-4 p-6">
                      <div className="inline-flex rounded-2xl bg-slate-900 p-3 text-white">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                      <p className="text-sm leading-7 text-slate-600">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeUp} className="mb-8 text-center md:text-right">
                <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  <Award className="h-4 w-4" />
                  كيف نعمل؟
                </p>
                <h2 className="text-2xl font-extrabold text-slate-900 md:text-3xl">رحلة واضحة من البحث إلى السكن</h2>
              </motion.div>

              <div className="grid gap-4 md:grid-cols-3">
                {workflow.map((item, index) => (
                  <motion.div
                    key={item.title}
                    variants={fadeUp}
                    className="relative rounded-2xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <div className="mb-3 flex items-center gap-2">
                      <item.icon className="h-5 w-5 text-primary" />
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                    </div>
                    <p className="text-sm leading-7 text-slate-600">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="grid gap-6 md:grid-cols-2"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {values.map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card className="h-full rounded-2xl border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-6">
                      <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-primary to-cyan-500 p-3 text-white shadow-md">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-slate-900">{item.title}</h3>
                      <p className="text-sm leading-7 text-slate-600">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 p-8 text-white md:p-12"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <motion.h2 variants={fadeUp} className="mb-8 text-center text-2xl font-extrabold md:text-3xl">
                لماذا يختارنا العملاء؟
              </motion.h2>
              <div className="grid gap-5 md:grid-cols-2">
                {[
                  "تغطية واسعة لأحياء الإسكندرية وخيارات متعددة في كل نطاق سعري",
                  "جودة عرض عالية للصور والبيانات مع معلومات واضحة قابلة للمقارنة",
                  "تواصل مباشر وسريع مع المالك أو الوسيط بدون خطوات مرهقة",
                  "نظام دعم فعّال لحل المشكلات ومتابعة الاستفسارات في أسرع وقت",
                ].map((item) => (
                  <motion.div key={item} variants={fadeUp} className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-300" />
                    <p className="text-sm leading-7 text-slate-100">{item}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="border-t border-slate-200 pt-12">
              <motion.div
                className="mb-10 text-center"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary md:text-sm">
                  <MessageSquare className="h-4 w-4" />
                  الأسئلة الشائعة
                </span>
                <h2 className="mb-3 text-2xl font-extrabold text-slate-900 md:text-3xl">كل ما تحتاج معرفته قبل اتخاذ القرار</h2>
                <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                  جمعنا أكثر الأسئلة تكرارا لتساعدك على التحرك بسرعة وثقة أثناء البحث عن السكن.
                </p>
              </motion.div>

              <motion.div
                className="mx-auto max-w-4xl"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <Accordion type="single" collapsible className="space-y-3">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={faq.question}
                      value={`item-${index}`}
                      className="rounded-2xl border border-slate-200 bg-white px-5 shadow-sm"
                    >
                      <AccordionTrigger className="py-5 text-right text-sm font-semibold text-slate-900 hover:no-underline md:text-base">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 text-sm leading-7 text-slate-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>

              <motion.div
                className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm md:p-8"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                <h3 className="mb-3 text-xl font-extrabold text-slate-900 md:text-2xl">جاهز تبدأ رحلة السكن بثقة؟</h3>
                <p className="mx-auto mb-6 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                  فريق إقامتك EQAMTAK جاهز يساعدك تختار العقار المناسب لك بسرعة وبأعلى مستوى احترافية.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button asChild variant="secondary" className="h-11 gap-2 rounded-xl">
                    <Link to="/for-owners">
                      انشر عقارك كمُالك أو مكتب أو وسيط
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild className="h-11 gap-2 rounded-xl">
                    <Link to="/properties">
                      تصفح العقارات الآن
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-11 gap-2 rounded-xl">
                    <Link to="/contact">
                      <PhoneIcon className="h-4 w-4" />
                      تواصل مع الدعم
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
