import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface MediaItem {
  url: string;
  type: "image" | "video";
}

interface PropertyGalleryProps {
  images?: Array<{ image_url: string }>;
  videos?: Array<{ video_url: string }>;
}

const PropertyGallery = ({ images = [], videos = [] }: PropertyGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);

  // Combine images and videos into a single array
  const mediaItems: MediaItem[] = [
    ...images.map(img => ({ url: img.image_url, type: "image" as const })),
    ...videos.map(vid => ({ url: vid.video_url, type: "video" as const })),
  ];

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedMediaIndex === null) return;

      if (e.key === "Escape") {
        setSelectedMediaIndex(null);
      } else if (e.key === "ArrowLeft") {
        setSelectedMediaIndex((prev) => (prev + 1) % mediaItems.length);
      } else if (e.key === "ArrowRight") {
        setSelectedMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMediaIndex, mediaItems.length]);

  if (!mediaItems.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg overflow-hidden shadow-lg bg-muted/30"
      >
        <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg
                className="w-10 h-10 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground">لا توجد صور أو فيديوهات</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Desktop Mosaic Grid View
  if (!isMobile) {
    const firstImage = mediaItems[0];
    const secondImage = mediaItems[1];
    const thirdImage = mediaItems[2];
    const hasMoreImages = mediaItems.length > 3;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg overflow-hidden shadow-lg"
      >
        <div className="hidden md:grid gap-2 h-[500px]" style={{ gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr' }}>
          {/* First Image - Left */}
          {firstImage && (
            <motion.button
              className="relative cursor-pointer overflow-hidden group"
              onClick={() => setSelectedMediaIndex(0)}
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={firstImage.url}
                alt="صورة أولى"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Zoom Icon on Hover */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl">
                  <ZoomIn className="h-8 w-8 text-foreground" />
                </div>
              </motion.div>

              {/* Badge with count */}
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-black/60 text-white shadow-lg gap-1 px-3 py-1.5">
                  <span>1/{mediaItems.length}</span>
                </Badge>
              </div>

              {firstImage.type === "video" && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                </div>
              )}
            </motion.button>
          )}

          {/* Second Image - Middle */}
          {secondImage && (
            <motion.button
              className="relative cursor-pointer overflow-hidden group"
              onClick={() => setSelectedMediaIndex(1)}
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={secondImage.url}
                alt="صورة ثانية"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Zoom Icon on Hover */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl">
                  <ZoomIn className="h-8 w-8 text-foreground" />
                </div>
              </motion.div>

              {/* Badge with count */}
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-black/60 text-white shadow-lg gap-1 px-3 py-1.5">
                  <span>2/{mediaItems.length}</span>
                </Badge>
              </div>

              {secondImage.type === "video" && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                </div>
              )}
            </motion.button>
          )}

          {/* Third Image - Right */}
          {thirdImage && (
            <motion.button
              className="relative cursor-pointer overflow-hidden group"
              onClick={() => setSelectedMediaIndex(2)}
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={thirdImage.url}
                alt="صورة ثالثة"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Zoom Icon on Hover */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl">
                  <ZoomIn className="h-8 w-8 text-foreground" />
                </div>
              </motion.div>

              {/* Badge with count */}
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-black/60 text-white shadow-lg gap-1 px-3 py-1.5">
                  <span>3/{mediaItems.length}</span>
                </Badge>
              </div>

              {/* Show More Overlay if more images exist */}
              {hasMoreImages && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-3xl font-bold mb-1">+{mediaItems.length - 3}</div>
                    <div className="text-sm opacity-80">صورة</div>
                  </div>
                </div>
              )}

              {thirdImage.type === "video" && !hasMoreImages && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                </div>
              )}
            </motion.button>
          )}
        </div>

        {/* Fullscreen Modal */}
        <AnimatePresence>
          {selectedMediaIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center"
              onClick={() => setSelectedMediaIndex(null)}
            >
              <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button
                  onClick={() => setSelectedMediaIndex(null)}
                  className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all flex items-center justify-center z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Counter */}
                <div className="absolute top-6 left-6 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm z-10">
                  {selectedMediaIndex + 1} / {mediaItems.length}
                </div>

                {/* Media Display */}
                <motion.div
                  key={selectedMediaIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  {mediaItems[selectedMediaIndex]?.type === "image" ? (
                    <img
                      src={mediaItems[selectedMediaIndex]?.url}
                      alt="عرض ملء الشاشة"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <>
                      <video
                        ref={fullscreenVideoRef}
                        src={mediaItems[selectedMediaIndex]?.url}
                        controls
                        autoPlay
                        className="max-w-full max-h-full object-contain"
                      />
                    </>
                  )}
                </motion.div>

                {/* Navigation Buttons */}
                {mediaItems.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length)}
                      className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all z-10 flex items-center justify-center"
                      aria-label="الصورة السابقة"
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                      onClick={() => setSelectedMediaIndex((prev) => (prev + 1) % mediaItems.length)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all z-10 flex items-center justify-center"
                      aria-label="الصورة التالية"
                    >
                      <ChevronRight className="w-8 h-8" />
                    </button>
                  </>
                )}

                {/* Keyboard Navigation Info */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                  استخدم الأسهم للتنقل أو اضغط Esc للإغلاق
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Mobile Carousel View
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg overflow-hidden shadow-lg"
    >
      <div className="relative bg-muted h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {mediaItems[currentIndex]?.type === "image" ? (
              <img
                src={mediaItems[currentIndex]?.url}
                alt={`صورة ${currentIndex + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={mobileVideoRef}
                src={mediaItems[currentIndex]?.url}
                controls
                autoPlay
                className="w-full h-full object-cover"
                style={{ pointerEvents: 'auto' }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        {mediaItems.length > 1 && (
          <>
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-foreground shadow-lg transition-all z-10 flex items-center justify-center"
              aria-label="الصورة السابقة"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % mediaItems.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-foreground shadow-lg transition-all z-10 flex items-center justify-center"
              aria-label="الصورة التالية"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter and Fullscreen */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
            {currentIndex + 1} / {mediaItems.length}
          </div>
          <button
            onClick={() => setSelectedMediaIndex(currentIndex)}
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-foreground shadow-lg transition-all flex items-center justify-center"
            aria-label="عرض ملء الشاشة"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Thumbnail Dots */}
      {mediaItems.length > 1 && (
        <div className="flex items-center justify-center gap-2 p-4 bg-background">
          {mediaItems.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-primary w-8"
                  : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50"
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedMediaIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setSelectedMediaIndex(null)}
          >
            <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={mediaItems[selectedMediaIndex]?.url}
                alt="عرض ملء الشاشة"
                className="max-w-full max-h-full object-contain"
              />
              {mediaItems[selectedMediaIndex]?.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-10 h-10 text-white fill-white" />
                  </div>
                </div>
              )}
              <button
                onClick={() => setSelectedMediaIndex(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PropertyGallery;
