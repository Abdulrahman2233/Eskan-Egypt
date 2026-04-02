import React from "react";
import { motion } from "framer-motion";
import { Building2, CircleCheck, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchAutocompleteInput from "@/components/SearchAutocompleteInput";

interface HeroSectionProps {
  initialArea: string;
  searchTerm: string;
  searchSuggestions: string[];
  onSearchTermChange: (value: string) => void;
  onSearchSubmit: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  initialArea,
  searchTerm,
  searchSuggestions,
  onSearchTermChange,
  onSearchSubmit,
}) => {
  const highlights = React.useMemo(
    () => [
      "عروض مختارة بعناية",
      "خبارات سلسة وسريعة",
    ],
    []
  );

  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(127deg,hsl(221_67%_13%)_0%,hsl(216_62%_22%)_46%,hsl(207_70%_34%)_100%)] pb-24 pt-12 sm:pb-28 sm:pt-16 lg:pb-32 lg:pt-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08),transparent_42%)]" />

        <div className="absolute -left-24 bottom-4 hidden h-72 w-72 rounded-full border border-white/10 lg:block" />
        <div className="absolute -right-20 top-12 hidden h-56 w-56 rounded-full border border-white/15 lg:block" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="text-center lg:text-right"
          >
            <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-4 py-1.5">
              <Building2 className="h-3.5 w-3.5 text-amber-300" />
              <span className="text-xs font-semibold text-white/95">مكانك المناسب</span>
            </div>

            <h1 className="text-4xl font-black leading-[1.15] text-white sm:text-5xl lg:text-6xl">
              خليك أذكى في اختيار
              <span className="block text-amber-300">مكان اقامتك</span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base text-white/85 sm:text-lg lg:mx-0">
              {initialArea
                ? `اكتشف عروضًا مختارة في ${initialArea} مع تفاصيل واضحة، صور دقيقة، وخيارات تناسب ميزانيتك.`
                : "ابحث عن شقة للطلاب و للعائلات و للحجز اليومى او الاسبوعي من خلال واجهة ذكية تعطيك نتائج سريعة وواضحة من أول مرة."}
            </p>

            <div className="mx-auto mt-7 hidden w-full max-w-xl grid-cols-2 gap-3 lg:mx-0 lg:grid">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="inline-flex h-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-center text-sm text-white/90"
                >
                  <CircleCheck className="h-4 w-4 text-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
            className="relative mx-auto w-full max-w-md lg:max-w-[430px]"
          >
            <div className="rounded-3xl border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.06)_100%)] p-3.5 shadow-[0_14px_40px_-18px_rgba(2,6,23,0.75)] sm:p-4">
              <div className="mb-2.5 flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm font-semibold text-white/80">ابحث الآن</p>
                  <p className="text-xs text-white/60">نتائج فورية محدثة باستمرار</p>
                </div>
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-300/20 text-amber-200">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
              </div>

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  onSearchSubmit();
                }}
                className="relative z-40 space-y-3"
              >
                <SearchAutocompleteInput
                  className="w-full"
                  theme="dark"
                  dropdownTheme="light"
                  submitOnSelect
                  minQueryLength={1}
                  suggestions={searchSuggestions}
                  value={searchTerm}
                  onChange={onSearchTermChange}
                  onSubmit={onSearchSubmit}
                  placeholder="ابحث باسم العقار أو المنطقة أو العنوان"
                  inputClassName="h-11 rounded-xl border-white/20 bg-white/15 text-white placeholder:text-slate-200 focus-visible:ring-2 focus-visible:ring-amber-300"
                  dropdownClassName="max-h-72"
                />
                <Button
                  type="submit"
                  className="h-11 w-full rounded-xl bg-amber-400 text-sm font-extrabold text-slate-900 transition-colors hover:bg-amber-300"
                >
                  <Search className="ml-2 h-5 w-5" />
                  ابحث الآن
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full">
          <path
            d="M0 70L90 64C180 58 360 46 540 50C720 54 900 74 1080 76C1260 78 1350 62 1440 44V120H0V70Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default React.memo(HeroSection);
