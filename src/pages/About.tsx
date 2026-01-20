import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Target, Users, Award } from "lucide-react";

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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
