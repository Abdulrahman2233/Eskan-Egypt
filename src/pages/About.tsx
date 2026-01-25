import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Target, Users, Award, MessageSquare, PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
        <div className="bg-primary/5 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-2">من نحن</h1>
            <p className="text-muted-foreground">تعرف على Eskan Egypt</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* About Section */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">Eskan Egypt</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                منصة Eskan Egypt هي الوجهة الأولى للباحثين عن شقق للإيجار في محافظة الإسكندرية.
                نحن نوفر منصة سهلة وموثوقة تجمع بين الباحثين عن السكن وأصحاب العقارات والوسطاء العقاريين،
                مع تقديم خدمة عملاء متميزة وتجربة استخدام سلسة.
              </p>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="inline-flex p-4 bg-primary/10 rounded-full">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">رؤيتنا</h3>
                  <p className="text-muted-foreground">
                    أن نكون المنصة الرائدة في مجال تأجير العقارات في مصر،
                    ونوفر تجربة استثنائية لجميع عملائنا
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="inline-flex p-4 bg-primary/10 rounded-full">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">رسالتنا</h3>
                  <p className="text-muted-foreground">
                    تسهيل عملية البحث عن السكن من خلال منصة تقنية حديثة
                    تجمع بين الشفافية والمصداقية والسرعة
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="inline-flex p-4 bg-primary/10 rounded-full">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">فريقنا</h3>
                  <p className="text-muted-foreground">
                    فريق محترف من الخبراء في مجال العقارات والتكنولوجيا،
                    نعمل على مدار الساعة لخدمتكم
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="inline-flex p-4 bg-primary/10 rounded-full">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">قيمنا</h3>
                  <p className="text-muted-foreground">
                    المصداقية، الشفافية، الاحترافية، والالتزام برضا العملاء
                    هي القيم التي نؤمن بها
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Why Choose Us */}
            <div className="bg-accent/30 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">لماذا تختار Eskan Egypt؟</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">مجموعة واسعة من العقارات</h3>
                    <p className="text-sm text-muted-foreground">
                      آلاف العقارات المتنوعة في جميع مناطق الإسكندرية
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">بحث متقدم وسهل</h3>
                    <p className="text-sm text-muted-foreground">
                      أدوات بحث قوية تساعدك في العثور على شقتك المثالية بسرعة
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">عقارات موثوقة</h3>
                    <p className="text-sm text-muted-foreground">
                      جميع العقارات معتمدة ومفحوصة للتأكد من جودتها
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">دعم فني متواصل</h3>
                    <p className="text-sm text-muted-foreground">
                      فريق دعم جاهز لمساعدتك في أي وقت
                    </p>
                  </div>
                </div>
              </div>
            </div>

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
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
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
                        <span className="font-semibold text-base">
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
