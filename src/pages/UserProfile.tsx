import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import VerifiedBadge from "@/components/VerifiedBadge";
import {
  User, MapPin, Calendar, Building2, Home,
  ArrowRight, Shield, Clock, Briefcase,
  Star, Sparkles, Eye, Layers,
  Crown, Zap, Heart, CheckCircle,
  Share2,
  Grid3X3, LayoutList, TrendingUp,
} from "lucide-react";
import { fetchPublicProfile, PublicUserProfile, ApiProperty } from "@/api";

/* ===== User Type Configuration ===== */
const USER_TYPES: Record<string, {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  ring: string;
  gradient: string;
}> = {
  landlord: {
    label: "مالك عقارات",
    icon: Home,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    ring: "ring-amber-500/30",
    gradient: "from-amber-500 to-orange-600",
  },
  agent: {
    label: "وسيط عقاري",
    icon: Briefcase,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/40",
    ring: "ring-violet-500/30",
    gradient: "from-violet-500 to-purple-600",
  },
  office: {
    label: "مكتب عقاري",
    icon: Building2,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-50 dark:bg-sky-950/40",
    ring: "ring-sky-500/30",
    gradient: "from-sky-500 to-blue-600",
  },
  tenant: {
    label: "مستأجر",
    icon: User,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    ring: "ring-emerald-500/30",
    gradient: "from-emerald-500 to-teal-600",
  },
  admin: {
    label: "مدير",
    icon: Shield,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    ring: "ring-rose-500/30",
    gradient: "from-rose-500 to-red-600",
  },
};

/* ===== Main Component ===== */
const UserProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [properties, setProperties] = useState<ApiProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const loadProfile = async () => {
      if (!username) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPublicProfile(username);
        setProfile(data.profile);
        setProperties(data.properties);
      } catch {
        setError("لم نتمكن من العثور على هذا المستخدم");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
    window.scrollTo(0, 0);
  }, [username]);

  const featuredProps = useMemo(() => properties.filter(p => p.featured), [properties]);
  const discountedProps = useMemo(() => properties.filter(p => p.discount !== null && p.discount > 0), [properties]);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <div className="container mx-auto px-4 pt-8">
          {/* Skeleton Hero */}
          <div className="animate-pulse space-y-6">
            <div className="h-48 sm:h-56 rounded-3xl bg-muted" />
            <div className="flex flex-col sm:flex-row gap-6 -mt-20 sm:-mt-16 px-6">
              <div className="w-28 h-28 rounded-2xl bg-muted border-4 border-background" />
              <div className="flex-1 space-y-3 pt-2">
                <div className="h-7 w-48 bg-muted rounded-lg" />
                <div className="h-4 w-32 bg-muted rounded-lg" />
                <div className="flex gap-2">
                  <div className="h-8 w-24 bg-muted rounded-full" />
                  <div className="h-8 w-24 bg-muted rounded-full" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 rounded-2xl bg-muted" />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-80 rounded-2xl bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col bg-background" dir="rtl">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm text-center space-y-5"
          >
            <div className="w-20 h-20 mx-auto rounded-2xl bg-muted flex items-center justify-center">
              <User className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold">المستخدم غير موجود</h2>
            <p className="text-muted-foreground text-sm">{error}</p>
            <Button asChild className="w-full rounded-xl h-11 gap-2 group">
              <Link to="/properties">
                تصفح العقارات
                <ArrowRight className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ---------- Profile Data ---------- */
  const typeConf = USER_TYPES[profile.user_type] || USER_TYPES.landlord;
  const TypeIcon = typeConf.icon;
  const memberDate = new Date(profile.member_since);
  const memberFormatted = memberDate.toLocaleDateString("ar-EG", { year: "numeric", month: "long" });
  const diffM = (new Date().getFullYear() - memberDate.getFullYear()) * 12 + (new Date().getMonth() - memberDate.getMonth());
  const memberDuration = diffM < 1 ? "عضو جديد" : diffM < 12 ? `${diffM} شهر` : `${Math.floor(diffM / 12)} سنة`;
  const initials = (profile.full_name || profile.username || "?").trim()[0]?.toUpperCase() || "?";
  
  // Check if name is in English
  const isEnglishName = /^[a-zA-Z\s]+$/.test(profile.full_name || "");

  /* ---------- Render ---------- */
  return (
    <div className="min-h-screen flex flex-col bg-background" dir="rtl">
      <Navbar />

      <main className="flex-1">
        {/* ══════════ HERO SECTION ══════════ */}
        <section className="relative overflow-hidden">
          {/* Background - Abstract Gradient */}
          <div className="absolute inset-0 h-[320px] sm:h-[360px]">
            <div className={`absolute inset-0 bg-gradient-to-br ${typeConf.gradient} opacity-[0.08] dark:opacity-[0.15]`} />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(var(--primary-rgb,59,130,246),0.12)_0%,transparent_60%)]" />
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent" />
            {/* Subtle geometric pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="container mx-auto px-4 relative z-10 pt-16 sm:pt-20 pb-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-background/80 backdrop-blur-xl sm:rounded-3xl p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Avatar Column */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 180 }}
                  className="flex flex-col items-center gap-3"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className={`w-[104px] h-[104px] sm:w-[120px] sm:h-[120px] rounded-full bg-gradient-to-br ${typeConf.gradient} p-[3px] shadow-lg`}>
                      <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-visible">
                        <span className={`text-3xl sm:text-4xl font-bold leading-none bg-gradient-to-br ${typeConf.gradient} bg-clip-text text-transparent`}>
                          {initials}
                        </span>
                      </div>
                    </div>
                    {/* Share icon */}
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({ title: profile.full_name, url: window.location.href }).catch(() => {});
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                        }
                      }}
                      className="absolute -bottom-1.5 -left-1.5 w-7 h-7 rounded-full bg-background flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110 transition-all cursor-pointer"
                    >
                      <Share2 className="h-4 w-4 text-primary" />
                    </button>
                  </div>
                  {/* Member since (mobile hidden) */}
                  <span className="hidden sm:block text-[11px] text-muted-foreground/70 font-medium">
                    عضو منذ {memberFormatted}
                  </span>
                </motion.div>

                {/* Info Column */}
                <div className="flex-1 min-w-0 text-center sm:text-right">
                  {/* Name & Type */}
                  <motion.div
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <div
                      dir={isEnglishName ? "ltr" : "rtl"}
                      className="flex flex-wrap items-center gap-1 justify-center sm:justify-start mb-1"
                    >
                      <h1 className={`order-1 text-2xl sm:text-2xl ${isEnglishName ? 'font-bold' : 'font-extrabold'} tracking-tight leading-tight`}>
                        {profile.full_name}
                      </h1>
                      {profile.is_verified && (
                        <span className={isEnglishName ? "order-2" : "order-0"}>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center justify-center">
                                <VerifiedBadge className="h-5 w-5 sm:h-5 sm:w-5" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>حساب موثّق</TooltipContent>
                          </Tooltip>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">@{profile.username}</p>
                  </motion.div>

                  {/* Tags Row */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="flex flex-wrap items-center gap-2 justify-center sm:justify-start mb-5"
                  >
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${typeConf.bg} ${typeConf.color} ring-1 ${typeConf.ring}`}>
                      <TypeIcon className="h-3.5 w-3.5" />
                      {typeConf.label}
                    </span>
                    {profile.city && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground ring-1 ring-border/50">
                        <MapPin className="h-3 w-3" />
                        {profile.city}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-500/20">
                      <Zap className="h-3 w-3" />
                      استجابة سريعة
                    </span>
                  </motion.div>

                  {/* Reputation Badges */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap items-center gap-2 justify-center sm:justify-start"
                  >
                    {profile.is_verified && (
                      <ReputationBadge icon={TrendingUp} text="موثوق التعامل" />
                    )}
                    {profile.properties_count >= 5 && (
                      <ReputationBadge icon={Star} text="معلن نشط" />
                    )}
                    {featuredProps.length >= 2 && (
                      <ReputationBadge icon={Heart} text="عقارات مميزة" />
                    )}
                  </motion.div>
                </div>

                {/* Action Buttons (Desktop) */}
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="hidden sm:flex flex-col gap-2 items-end shrink-0 pt-1"
                >
                  <Button size="sm" variant="outline" className="rounded-xl gap-2 h-9 px-4" onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: profile.full_name, url: window.location.href }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}>
                    <Share2 className="h-3.5 w-3.5" />
                    مشاركة
                  </Button>
                </motion.div>
              </div>

              {/* ── Metrics Strip ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7 pt-7 border-t border-border/50"
              >
                <MetricCard icon={Building2} value={profile.properties_count} label="عقار معروض" accent="blue" />
                <MetricCard icon={Sparkles} value={discountedProps.length} label="عقارات بخصومات" accent="violet" />
                <MetricCard icon={Heart} value={featuredProps.length} label="عقار مميز" accent="amber" />
                <MetricCard icon={Calendar} value={memberDuration} label="مدة العضوية" accent="emerald" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════ PROPERTIES SECTION ══════════ */}
        <section className="container mx-auto px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <Tabs defaultValue="all" className="w-full">
              {/* Header */}
              <div className="flex flex-row-reverse items-start sm:items-center justify-between gap-4 mb-6 flex-wrap">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    العقارات المعروضة
                  </h2>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Tabs */}
                  <TabsList className="hidden sm:flex bg-muted/50 rounded-xl h-9 p-1">
                    <TabsTrigger value="all" className="rounded-lg text-xs px-3 data-[state=active]:shadow-sm">
                      الكل ({properties.length})
                    </TabsTrigger>
                    {featuredProps.length > 0 && (
                      <TabsTrigger value="featured" className="rounded-lg text-xs px-3 data-[state=active]:shadow-sm gap-1">
                        <Sparkles className="h-3 w-3" />
                        مميز ({featuredProps.length})
                      </TabsTrigger>
                    )}
                  </TabsList>

                  {/* View Toggle */}
                  <div className="hidden sm:flex items-center rounded-xl bg-muted/50 p-1 gap-0.5">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    >
                      <LayoutList className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* All Tab */}
              <TabsContent value="all">
                <PropertiesGrid properties={properties} viewMode={viewMode} />
              </TabsContent>

              {/* Featured Tab */}
              <TabsContent value="featured">
                <PropertiesGrid properties={featuredProps} viewMode={viewMode} />
              </TabsContent>
            </Tabs>
          </motion.div>
        </section>
      </main>

      {/* Mobile Bottom Action Bar */}
      <div className="sm:hidden sticky bottom-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border/50 p-3 flex gap-2">
      </div>

      <Footer />
    </div>
  );
};

/* ═══════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════ */

/** Metric Card in the profile header */
const MetricCard = ({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
  accent: "blue" | "violet" | "amber" | "emerald";
}) => {
  const map = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  };
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className={`w-10 h-10 rounded-xl ${map[accent]} flex items-center justify-center shrink-0`}>
        <Icon className="h-[18px] w-[18px]" />
      </div>
      <div className="min-w-0">
        <div className="text-base sm:text-lg font-bold leading-tight truncate">{value}</div>
        <div className="text-[11px] text-muted-foreground leading-tight">{label}</div>
      </div>
    </div>
  );
};

/** Small reputation indicator pill */
const ReputationBadge = ({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-medium ring-1 ring-emerald-500/20">
    <Icon className="h-3 w-3" />
    {text}
  </span>
);

/** Properties grid with empty state */
const PropertiesGrid = ({
  properties,
  viewMode,
}: {
  properties: ApiProperty[];
  viewMode: "grid" | "list";
}) => {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Building2 className="h-8 w-8 text-muted-foreground/40" />
        </div>
        <h3 className="font-semibold mb-1">لا توجد عقارات</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          لم يقم هذا المستخدم بإضافة أي عقارات بعد
        </p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      dir="rtl"
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          : "flex flex-col gap-4"
      }
    >
      <AnimatePresence mode="popLayout">
        {properties.map((property, i) => (
          <motion.div
            key={property.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: Math.min(i * 0.06, 0.3) }}
          >
            <PropertyCard property={property} variant={viewMode === "list" ? "list" : "grid"} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserProfilePage;
