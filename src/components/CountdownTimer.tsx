import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  expirationTime?: string | null;
  onExpired?: () => void;
}

const toTwoDigits = (value: number): string =>
  String(Math.max(0, value)).padStart(2, "0");

const getTimeLeft = (targetTimeMs: number) => {
  const remaining = Math.max(0, targetTimeMs - Date.now());

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

  return {
    remaining,
    days,
    hours,
    minutes,
    seconds,
    isExpired: remaining <= 0,
  };
};

export default function CountdownTimer({
  expirationTime,
  onExpired,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!expirationTime) return;

    const targetTimeMs = new Date(expirationTime).getTime();

    const initial = getTimeLeft(targetTimeMs);
    setTimeLeft(initial);

    if (initial.isExpired) {
      setIsVisible(false);
      onExpired?.();
      return;
    }

    const timer = setInterval(() => {
      const updated = getTimeLeft(targetTimeMs);
      setTimeLeft(updated);

      if (updated.isExpired) {
        setIsVisible(false);
        onExpired?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expirationTime, onExpired]);

  if (!expirationTime || !timeLeft || !isVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-primary text-sm font-semibold">
          <Clock className="h-4 w-4" />
          عرض محدود
        </div>
        <span className="text-xs text-muted-foreground">
          ينتهي خلال  
        </span>
      </div>

      {/* Content */}
      <div className="grid grid-cols-4 gap-2">
        <TimeUnit value={timeLeft.days} label="يوم" />
        <TimeUnit value={timeLeft.hours} label="ساعة" />
        <TimeUnit value={timeLeft.minutes} label="دقيقة" />
        <TimeUnit value={timeLeft.seconds} label="ثانية" />
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 mt-3 bg-primary/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          animate={{
            width: `${(timeLeft.remaining / (2 * 24 * 60 * 60 * 1000)) * 100}%`,
          }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center bg-white/80 dark:bg-slate-800/60 rounded-lg p-2 border border-primary/20"
    >
      <div className="text-lg font-bold text-slate-900 dark:text-white">
        {toTwoDigits(value)}
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400">{label}</div>
    </motion.div>
  );
}

