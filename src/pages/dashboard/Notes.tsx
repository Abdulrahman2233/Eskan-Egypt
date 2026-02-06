import DashboardLayout from '@/components/DashboardLayout';
import { 
  Megaphone, 
  Search, 
  MessageSquare, 
  Handshake, 
  CheckCircle2,
  Target,
  TrendingUp,
  Users,
  Globe,
  Smartphone,
  Mail,
  BarChart3,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

const processSteps = [
  {
    step: 1,
    title: 'تسويق العقار',
    description: 'نقوم بتسويق العقار عبر منصتنا ووسائل التواصل الاجتماعي للوصول لأكبر عدد من العملاء المحتملين',
    icon: Megaphone,
    color: 'from-primary to-primary/70',
  },
  {
    step: 2,
    title: 'استقبال الطلبات',
    description: 'يدخل العميل للموقع ويتصفح العقارات ويقدم طلب للعقار المناسب له',
    icon: Search,
    color: 'from-success to-success/70',
  },
  {
    step: 3,
    title: 'التواصل مع المالك',
    description: 'نتواصل مع المالك أو الوسيط أو المكتب العقاري لترتيب معاينة العقار',
    icon: MessageSquare,
    color: 'from-warning to-warning/70',
  },
  {
    step: 4,
    title: 'إتمام الصفقة',
    description: 'نساعد في إتمام عملية التأجير أو البيع بشكل سلس ومحترف',
    icon: Handshake,
    color: 'from-accent to-accent/70',
  },
  {
    step: 5,
    title: 'خدمة ما بعد البيع',
    description: 'نستمر في تقديم الدعم والمتابعة لضمان رضا جميع الأطراف',
    icon: CheckCircle2,
    color: 'from-primary to-success',
  },
];

const marketingStrategies = [
  {
    title: 'التسويق الرقمي',
    description: 'حملات إعلانية مدفوعة على Google و Facebook',
    icon: Globe,
    stats: '+500K مشاهدة شهرياً',
  },
  {
    title: 'وسائل التواصل',
    description: 'تواجد قوي على Instagram و TikTok و Twitter',
    icon: Smartphone,
    stats: '+50K متابع',
  },
  {
    title: 'التسويق بالبريد',
    description: 'نشرات دورية لقاعدة عملاء محدثة',
    icon: Mail,
    stats: '+10K مشترك',
  },
  {
    title: 'تحليل البيانات',
    description: 'تحليل سلوك العملاء لتحسين الأداء',
    icon: BarChart3,
    stats: 'تقارير أسبوعية',
  },
];

const benefits = [
  {
    title: 'وصول أوسع',
    description: 'نصل لعملاء في جميع أنحاء مصر',
    icon: Target,
  },
  {
    title: 'نتائج أسرع',
    description: 'متوسط إتمام الصفقة 7 أيام',
    icon: TrendingUp,
  },
  {
    title: 'عملاء موثوقين',
    description: 'فحص وتأهيل العملاء مسبقاً',
    icon: Users,
  },
];

export default function Notes() {
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            خطة العمل
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            كيف نوصل عقارك للعميل المناسب؟
          </h1>
          <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto">
            نتبع منهجية احترافية ومدروسة لضمان وصول عقارك لأكبر عدد من العملاء المحتملين
          </p>
        </div>

        {/* Process Steps - Mobile Timeline */}
        <div className="relative mb-16">
          {/* Desktop horizontal line */}
          <div className="absolute top-20 right-12 left-12 h-1 bg-gradient-to-r from-blue-600 via-green-500 to-orange-500 rounded-full hidden lg:block" />
          
          {/* Mobile vertical timeline */}
          <div className="absolute top-0 bottom-0 right-6 w-1 bg-gradient-to-b from-blue-600 via-green-500 to-orange-500 lg:hidden" />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {processSteps.map((step, index) => {
              const colorMap: Record<string, string> = {
                'from-primary to-primary/70': 'bg-blue-600',
                'from-success to-success/70': 'bg-green-500',
                'from-warning to-warning/70': 'bg-orange-500',
                'from-accent to-accent/70': 'bg-cyan-500',
                'from-primary to-success': 'bg-gradient-to-br from-blue-600 to-green-500',
              };
              const bgColor = colorMap[step.color] || 'bg-blue-600';
              
              return (
              <div
                key={step.step}
                className="relative pr-12 lg:pr-0"
              >
                {/* Mobile step indicator */}
                <div className={`absolute right-0 top-4 w-8 h-8 rounded-full ${bgColor} flex items-center justify-center shadow-lg lg:hidden z-10`}>
                  <span className="text-xs font-bold text-white">{step.step}</span>
                </div>
                
                <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 border border-gray-200 shadow-md hover:shadow-lg transition-all h-full group">
                  {/* Step Icon - Desktop */}
                  <div className={`hidden lg:flex w-12 h-12 rounded-lg ${bgColor} items-center justify-center mb-3 shadow-lg text-white`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  
                  {/* Mobile Header */}
                  <div className="flex items-center gap-3 lg:hidden mb-4">
                    <div className={`w-9 h-9 rounded-lg ${bgColor} flex items-center justify-center shadow-lg text-white`}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        الخطوة {step.step}
                      </span>
                      <h3 className="text-base font-bold text-gray-900 mt-1">{step.title}</h3>
                    </div>
                  </div>
                  
                  {/* Desktop Content */}
                  <div className="hidden lg:block">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2.5 py-0.5 rounded inline-block mb-2">
                      الخطوة {step.step}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                  </div>
                  
                  <p className="text-xs text-gray-600 leading-relaxed">{step.description}</p>
                  
                  {/* Arrow - Desktop only */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10">
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 shadow-md flex items-center justify-center">
                        <ArrowLeft className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Marketing Plan Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              خطة التسويق المتكاملة
            </h2>
            <p className="text-gray-600 text-base max-w-xl mx-auto">
              نستخدم أحدث استراتيجيات التسويق الرقمي لضمان أفضل النتائج
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {marketingStrategies.map((strategy) => (
              <div key={strategy.title} className="group">
                <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-5 border border-gray-200 shadow-md hover:shadow-lg transition-all h-full relative">
                  {/* Icon */}
                  <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-lg bg-blue-100 flex items-center justify-center mb-3 text-blue-600 group-hover:scale-110 transition-transform">
                    <strategy.icon className="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-sm lg:text-base font-bold text-gray-900 mb-1.5">{strategy.title}</h3>
                  <p className="text-xs text-gray-600 mb-3">{strategy.description}</p>
                  
                  {/* Stats Badge */}
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-md text-xs font-semibold border border-green-300">
                    <TrendingUp className="w-3 h-3" />
                    <span className="truncate">{strategy.stats}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl lg:rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden shadow-lg">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>
            
            <div className="relative">
              <div className="text-center mb-10">
                <h2 className="text-2xl lg:text-3xl font-bold mb-3">لماذا تختارنا؟</h2>
                <p className="text-white/80 text-base max-w-xl mx-auto">
                  نقدم لك خدمة متكاملة تضمن أفضل النتائج في أسرع وقت
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="bg-white/15 backdrop-blur-md rounded-xl lg:rounded-2xl p-4 border border-white/30 hover:bg-white/25 transition-all group flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white/25 flex items-center justify-center sm:mb-3 group-hover:scale-110 transition-transform flex-shrink-0 text-white border border-white/30">
                      <benefit.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold sm:mb-1">{benefit.title}</h3>
                      <p className="text-white/80 text-xs">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl lg:rounded-3xl p-8 lg:p-10 border border-gray-200 shadow-lg hover:shadow-xl transition-all">
            <Sparkles className="w-9 h-9 lg:w-10 lg:h-10 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">جاهز لبدء رحلتك معنا؟</h3>
            <p className="text-gray-600 text-base mb-6 max-w-lg mx-auto">أضف عقارك الآن واستفد من خدماتنا التسويقية المتكاملة</p>
            <a
              href="/dashboard/add-property"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 lg:px-10 lg:py-4 rounded-lg lg:rounded-xl text-base lg:text-lg font-bold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all hover:scale-105"
            >
              <Megaphone className="w-4 h-4 lg:w-5 lg:h-5" />
              أضف عقارك الآن
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}