import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Target, Users, Award, MessageSquare, PhoneIcon, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import eskanLogo from "@/assets/Eskan Egypt.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar />
      
      <main className="flex-1 mt-16">

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* About Section with Profile Logo */}
            <motion.div 
              className="text-center space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Profile Logo */}
              <div className="flex justify-center">
                <motion.div
                  className="relative w-32 h-32 md:w-40 md:h-40"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl blur-2xl"></div>
                  <img 
                    src={eskanLogo} 
                    alt="Eskan Egypt" 
                    className="relative w-full h-full object-contain rounded-3xl shadow-2xl"
                  />
                </motion.div>
              </div>

              <div className="space-y-4">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  Eskan Egypt
                </motion.h2>
                <motion.p 
                  className="text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  منصة Eskan Egypt هي الوجهة الأولى للباحثين عن شقق للإيجار في محافظة الإسكندرية.
                  نحن نوفر منصة سهلة وموثوقة تجمع بين الباحثين عن السكن وأصحاب العقارات والوسطاء العقاريين،
                  مع تقديم خدمة عملاء متميزة وتجربة استخدام سلسة.
                </motion.p>
              </div>
            </motion.div>

            {/* Values */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {[
                {
                  icon: Target,
                  title: "رؤيتنا",
                  description: "أن نكون المنصة الرائدة في مجال تأجير العقارات في مصر، ونوفر تجربة استثنائية لجميع عملائنا"
                },
                {
                  icon: Building2,
                  title: "رسالتنا",
                  description: "تسهيل عملية البحث عن السكن من خلال منصة تقنية حديثة تجمع بين الشفافية والمصداقية والسرعة"
                },
                {
                  icon: Users,
                  title: "فريقنا",
                  description: "فريق محترف من الخبراء في مجال العقارات والتكنولوجيا، نعمل على مدار الساعة لخدمتكم"
                },
                {
                  icon: Award,
                  title: "قيمنا",
                  description: "المصداقية, الشفافية، الاحترافية، والالتزام برضا العملاء هي القيم التي نؤمن بها"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300 border-primary/10">
                    <CardContent className="p-6 text-center space-y-4">
                      <motion.div 
                        className="inline-flex p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <item.icon className="h-8 w-8 text-primary" />
                      </motion.div>
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Why Choose Us */}
            <motion.div 
              className="bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 rounded-2xl p-8 md:p-12 border border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">لماذا تختار Eskan Egypt؟</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    title: "مجموعة واسعة من العقارات",
                    description: "آلاف العقارات المتنوعة في جميع مناطق الإسكندرية"
                  },
                  {
                    title: "بحث متقدم وسهل",
                    description: "أدوات بحث قوية تساعدك في العثور على شقتك المثالية بسرعة"
                  },
                  {
                    title: "عقارات موثوقة",
                    description: "جميع العقارات معتمدة ومفحوصة للتأكد من جودتها"
                  },
                  {
                    title: "دعم فني متواصل",
                    description: "فريق دعم جاهز لمساعدتك في أي وقت"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex gap-4"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      <CheckCircle className="h-6 w-6" />
                    </motion.div>
                    <div>
                      <h3 className="font-bold mb-2 text-base">{item.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* FAQ Section */}
            <div className="py-12 border-t">
              <motion.div
                className="text-center mb-10"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
              >
                <span className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-3">
                  <MessageSquare className="h-4 w-4" />
                  الأسئلة الشائعة
                </span>
                <h2 className="text-xl md:text-2xl font-bold mb-3">
                  هل لديك سؤال؟
                </h2>
                <p className="text-muted-foreground">
                  إليك إجابات لأكثر الأسئلة شيوعاً حول السكن في منصتنا
                </p>
              </motion.div>

              <motion.div
                className="max-w-3xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
                }}
              >
                <Accordion type="single" collapsible className="space-y-3">
                  {[
                    {
                      question: "هل المنصة مخصصة فقط لسكن الطلاب؟",
                      answer:
                        "لا، المنصة توفر سكن للطلاب، العائلات، والسكن اليومي أو الأسبوعي حسب احتياجك.",
                    },
                    {
                      question: "كيف يمكنني حجز سكن طلاب؟",
                      answer:
                        "تستطيع تصفح المناطق والسكن المتاح، ثم التواصل مباشرة مع المالك أو الوسيط من خلال بيانات الاتصال في صفحة العقار.",
                    },
                    {
                      question: "هل الأسعار ثابتة أم قابلة للتفاوض؟",
                      answer:
                        "الأغلب قابل للتفاوض حسب المالك أو الوسيط، يمكنك التواصل معه والاتفاق على السعر النهائي.",
                    },
                    {
                      question: "هل توجد رسوم على استخدام الموقع؟",
                      answer:
                        "البحث والتصفح مجاني بالكامل للمستخدمين، قد يتم احتساب رسوم خدمة على بعض الإعلانات المدفوعة.",
                    },
                  ].map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="bg-accent/20 rounded-xl px-6 border-0 shadow-sm"
                    >
                      <AccordionTrigger className="text-right hover:no-underline py-5">
                        <span className="font-semibold text-sm">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>

              <motion.div
                className="text-center mt-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <p className="text-muted-foreground mb-4">
                  لم تجد إجابة لسؤالك؟
                </p>
                <Button asChild variant="outline" className="gap-2">
                  <Link to="/contact">
                    <PhoneIcon className="h-4 w-4" />
                    تواصل معنا
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
