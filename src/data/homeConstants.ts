import {
  Search,
  MapPin,
  MessageSquare,
  Home,
  GraduationCap,
  Users,
  Sun,
  Calendar,
  BadgeCheck,
  TrendingUp,
  ThumbsUp,
  Award,
} from "lucide-react";

// How It Works Steps
export const howItWorks = [
  {
    step: "1",
    icon: Search,
    title: "ابحث عن منطقتك",
    desc: "اختر المنطقة المناسبة لك من بين أفضل مناطق الإسكندرية.",
  },
  {
    step: "2",
    icon: MapPin,
    title: "تصفح العقارات",
    desc: "شاهد تفاصيل العقار، الصور، السعر، ونوع السكن المتوفر.",
  },
  {
    step: "3",
    icon: MessageSquare,
    title: "تواصل مع المالك",
    desc: "تواصل مباشرة مع المالك أو الوسيط عبر بيانات الاتصال المتاحة.",
  },
  {
    step: "4",
    icon: Home,
    title: "احجز سكنك",
    desc: "اتفق على الشروط واستلم سكنك بكل سهولة وأمان.",
  },
];

// Property Marketing Steps
export const propertyMarketingSteps = [
  {
    step: 1,
    title: "سكن للطلاب",
    description:
      "توفير سكن آمن وموثوق قريب من الجامعات بأسعار مناسبة للطلاب وخدمات متكاملة",
    icon: GraduationCap,
    color: "from-primary to-primary/70",
  },
  {
    step: 2,
    title: "سكن للعائلات",
    description:
      "شقق عائلية بمساحات متنوعة وتجهيزات حديثة في مناطق هادئة وآمنة",
    icon: Users,
    color: "from-success to-success/70",
  },
  {
    step: 3,
    title: "سكن للمصيفين",
    description:
      "عروض موسمية خاصة للسياح والمصيفين برفاهية عالية وإطلالات رائعة",
    icon: Sun,
    color: "from-warning to-warning/70",
  },
  {
    step: 4,
    title: "استديو للايجار",
    description:
      "استديوهات مفروشة بالكامل وجاهزة للسكن الفوري بأفضل الأسعار",
    icon: Home,
    color: "from-accent to-accent/70",
  },
  {
    step: 5,
    title: "حجز يومي",
    description:
      "عروض يومية وأسبوعية مرنة بأسعار مناسبة وخدمات متميزة لكل احتياجاتك",
    icon: Calendar,
    color: "from-purple-500 to-purple-400",
  },
];

// Stats
export const stats = [
  { value: "1000+", label: "عميل سعيد", icon: Users },
  { value: "200+", label: "وسيط معتمد", icon: BadgeCheck },
];

// Advantages
export const advantages = [
  {
    icon: BadgeCheck,
    title: "موثوقية عالية",
    desc: "تحقق دوري من الإعلانات ومراجعة مستمرة للمحتوى.",
  },
  {
    icon: TrendingUp,
    title: "تحديث مستمر",
    desc: "إضافة عروض جديدة بشكل مستمر في مختلف المناطق.",
  },
  {
    icon: ThumbsUp,
    title: "سهولة الاستخدام",
    desc: "واجهة عربية بسيطة ومريحة للطلاب والعائلات.",
  },
  {
    icon: Users,
    title: "تنوع في السكن",
    desc: "خيارات متاحة للطلاب، العائلات، والسكن القصير المدى.",
  },
];

// Testimonials
export const testimonials = [
  {
    name: "أحمد محمود",
    role: "طالب جامعي",
    content:
      "لقيت سكن قريب من جامعة الإسكندرية بسهولة، والتواصل مع المالك كان سريع وواضح.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "سارة أحمد",
    role: "طالبة",
    content:
      "المنصة ساعدتني أختار بين أكتر من شقة للطالبات بأسعار مناسبة وأماكن آمنة.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "محمد علي",
    role: "رب أسرة",
    content:
      "كمستأجر لعائلتي، قدرت ألاقي شقة مناسبة في منطقة هادية وبسعر كويس في وقت قصير.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/67.jpg",
  },
];
