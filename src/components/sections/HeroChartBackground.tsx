import React from "react";

/* ──────────────────────────────────────────────
   Professional Real Estate Background
   Modern city skyline with architectural elements
   Fully responsive for mobile and desktop
   GPU-accelerated CSS animations
   ────────────────────────────────────────────── */

const HeroChartBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* CSS animations */}
      <style>{`
        @keyframes hero-fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes hero-slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes hero-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes hero-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }
        @keyframes hero-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .hero-fade { animation: hero-fadeIn 0.8s ease-out forwards; opacity: 0; }
        .hero-slide { animation: hero-slideUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
        .hero-float { animation: hero-float 4s ease-in-out infinite; }
        .hero-pulse { animation: hero-pulse 3s ease-in-out infinite; }
        .hero-shimmer { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); background-size: 200% 100%; animation: hero-shimmer 3s infinite; }
      `}</style>

      {/* Gradient Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-white" />
      <div className="absolute -top-40 right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-radial from-blue-100/40 to-transparent blur-3xl" />
      <div className="absolute -top-20 left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-radial from-cyan-100/30 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-[20%] w-[800px] h-[400px] rounded-full bg-gradient-radial from-indigo-100/20 to-transparent blur-3xl" />

      {/* Floating Property Cards - Desktop Only */}
      <div className="hidden lg:block absolute top-[15%] right-[8%] hero-fade hero-float" style={{ animationDelay: '0.5s' }}>
        <div className="w-20 h-24 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg shadow-blue-200/30 border border-blue-100/50 p-2 transform rotate-6">
          <div className="w-full h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 mb-2" />
          <div className="w-3/4 h-1.5 rounded bg-gray-200" />
          <div className="w-1/2 h-1.5 rounded bg-gray-100 mt-1" />
        </div>
      </div>

      <div className="hidden lg:block absolute top-[22%] left-[10%] hero-fade hero-float" style={{ animationDelay: '0.8s', animationDuration: '5s' }}>
        <div className="w-16 h-20 rounded-xl bg-white/70 backdrop-blur-sm shadow-lg shadow-indigo-200/30 border border-indigo-100/50 p-2 transform -rotate-6">
          <div className="w-full h-10 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-50 mb-1.5" />
          <div className="w-2/3 h-1 rounded bg-gray-200" />
          <div className="w-1/2 h-1 rounded bg-gray-100 mt-1" />
        </div>
      </div>

      {/* Floating Icons - Responsive */}
      <div className="absolute top-[12%] sm:top-[18%] right-[15%] sm:right-[25%] hero-fade" style={{ animationDelay: '0.3s' }}>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-400/30 flex items-center justify-center hero-float">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
      </div>

      <div className="absolute top-[8%] sm:top-[12%] left-[10%] sm:left-[18%] hero-fade" style={{ animationDelay: '0.6s' }}>
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-500 shadow-lg shadow-cyan-400/30 flex items-center justify-center hero-float" style={{ animationDuration: '4.5s' }}>
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
      </div>

      <div className="hidden sm:block absolute top-[25%] left-[35%] hero-fade" style={{ animationDelay: '0.9s' }}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-500 shadow-lg shadow-indigo-400/30 flex items-center justify-center hero-float" style={{ animationDuration: '5.5s' }}>
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      {/* Decorative Dots Pattern */}
      <div className="absolute top-[30%] right-[5%] sm:right-[12%] grid grid-cols-4 gap-2 opacity-20 hero-fade" style={{ animationDelay: '1s' }}>
        {[...Array(16)].map((_, i) => (
          <div key={i} className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-400" />
        ))}
      </div>

      <div className="hidden md:grid absolute top-[20%] left-[5%] grid-cols-3 gap-2 opacity-15 hero-fade" style={{ animationDelay: '1.2s' }}>
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
        ))}
      </div>

      {/* Modern City Skyline - Full Width */}
      <svg
        viewBox="0 0 1400 400"
        preserveAspectRatio="xMidYMax slice"
        className="absolute bottom-0 inset-x-0 w-full h-[45%] sm:h-[50%] md:h-[55%] lg:h-[60%] hero-slide"
        style={{ animationDelay: '0.2s' }}
      >
        <defs>
          {/* Building Gradients */}
          <linearGradient id="building1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="building2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="building3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="building4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          {/* Window Pattern */}
          <pattern id="windows" patternUnits="userSpaceOnUse" width="20" height="25">
            <rect x="3" y="3" width="6" height="8" rx="1" fill="#fff" opacity="0.4" />
            <rect x="11" y="3" width="6" height="8" rx="1" fill="#fff" opacity="0.3" />
            <rect x="3" y="14" width="6" height="8" rx="1" fill="#fff" opacity="0.35" />
            <rect x="11" y="14" width="6" height="8" rx="1" fill="#fff" opacity="0.25" />
          </pattern>
        </defs>

        {/* Background Buildings Layer - Farthest */}
        <g className="hero-pulse">
          <rect x="50" y="200" width="80" height="200" rx="4" fill="url(#building4)" />
          <rect x="160" y="180" width="60" height="220" rx="4" fill="url(#building4)" />
          <rect x="1180" y="190" width="70" height="210" rx="4" fill="url(#building4)" />
          <rect x="1280" y="220" width="60" height="180" rx="4" fill="url(#building4)" />
        </g>

        {/* Mid Buildings Layer */}
        <g>
          {/* Left Side Buildings */}
          <rect x="0" y="250" width="100" height="150" rx="4" fill="url(#building3)" />
          <rect x="0" y="250" width="100" height="150" rx="4" fill="url(#windows)" opacity="0.3" />
          
          <rect x="110" y="180" width="90" height="220" rx="4" fill="url(#building2)" />
          <rect x="110" y="180" width="90" height="220" rx="4" fill="url(#windows)" opacity="0.4" />
          
          <rect x="210" y="230" width="70" height="170" rx="4" fill="url(#building3)" />
          <rect x="210" y="230" width="70" height="170" rx="4" fill="url(#windows)" opacity="0.35" />

          {/* Center-Left Buildings */}
          <rect x="300" y="160" width="85" height="240" rx="4" fill="url(#building1)" />
          <rect x="300" y="160" width="85" height="240" rx="4" fill="url(#windows)" opacity="0.5" />
          <rect x="305" y="160" width="15" height="240" fill="url(#glass)" />
          
          <rect x="400" y="200" width="75" height="200" rx="4" fill="url(#building2)" />
          <rect x="400" y="200" width="75" height="200" rx="4" fill="url(#windows)" opacity="0.4" />

          {/* Center Buildings - Tallest */}
          <rect x="500" y="100" width="100" height="300" rx="6" fill="url(#building1)" />
          <rect x="500" y="100" width="100" height="300" rx="6" fill="url(#windows)" opacity="0.5" />
          <rect x="510" y="100" width="20" height="300" fill="url(#glass)" />
          {/* Building Top Detail */}
          <rect x="530" y="85" width="40" height="15" rx="2" fill="url(#building1)" />
          <circle cx="550" cy="75" r="8" fill="url(#building1)" />
          
          <rect x="620" y="140" width="90" height="260" rx="6" fill="url(#building2)" />
          <rect x="620" y="140" width="90" height="260" rx="6" fill="url(#windows)" opacity="0.45" />
          
          <rect x="730" y="120" width="80" height="280" rx="6" fill="url(#building1)" />
          <rect x="730" y="120" width="80" height="280" rx="6" fill="url(#windows)" opacity="0.5" />
          {/* Antenna */}
          <line x1="770" y1="120" x2="770" y2="90" stroke="#3b82f6" strokeWidth="2" opacity="0.3" />
          <circle cx="770" cy="85" r="4" fill="#3b82f6" opacity="0.4" />

          {/* Center-Right Buildings */}
          <rect x="830" y="180" width="85" height="220" rx="4" fill="url(#building3)" />
          <rect x="830" y="180" width="85" height="220" rx="4" fill="url(#windows)" opacity="0.4" />
          
          <rect x="935" y="210" width="70" height="190" rx="4" fill="url(#building2)" />
          <rect x="935" y="210" width="70" height="190" rx="4" fill="url(#windows)" opacity="0.35" />

          {/* Right Side Buildings */}
          <rect x="1025" y="170" width="90" height="230" rx="4" fill="url(#building1)" />
          <rect x="1025" y="170" width="90" height="230" rx="4" fill="url(#windows)" opacity="0.45" />
          <rect x="1030" y="170" width="18" height="230" fill="url(#glass)" />
          
          <rect x="1130" y="220" width="80" height="180" rx="4" fill="url(#building3)" />
          <rect x="1130" y="220" width="80" height="180" rx="4" fill="url(#windows)" opacity="0.4" />
          
          <rect x="1230" y="250" width="100" height="150" rx="4" fill="url(#building2)" />
          <rect x="1230" y="250" width="100" height="150" rx="4" fill="url(#windows)" opacity="0.35" />
          
          <rect x="1340" y="200" width="70" height="200" rx="4" fill="url(#building1)" />
          <rect x="1340" y="200" width="70" height="200" rx="4" fill="url(#windows)" opacity="0.4" />
        </g>

        {/* Ground/Street Level */}
        <rect x="0" y="395" width="1400" height="10" fill="url(#building1)" opacity="0.5" />

        {/* Decorative Elements */}
        {/* Street Trees */}
        <g opacity="0.3">
          <circle cx="250" cy="380" r="15" fill="#10b981" />
          <circle cx="480" cy="385" r="12" fill="#10b981" />
          <circle cx="850" cy="380" r="14" fill="#10b981" />
          <circle cx="1100" cy="385" r="13" fill="#10b981" />
        </g>
      </svg>

      {/* Foreground Accent Buildings - Mobile Optimized */}
      <div className="absolute bottom-0 left-[5%] w-16 sm:w-24 md:w-32 h-[25%] sm:h-[30%] bg-gradient-to-t from-blue-200/30 to-blue-100/10 rounded-t-lg hero-slide" style={{ animationDelay: '0.4s' }}>
        <div className="absolute inset-x-2 top-4 grid grid-cols-2 gap-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-2 sm:h-3 rounded-sm bg-white/40" />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 right-[8%] w-14 sm:w-20 md:w-28 h-[20%] sm:h-[25%] bg-gradient-to-t from-indigo-200/25 to-indigo-100/10 rounded-t-lg hero-slide" style={{ animationDelay: '0.5s' }}>
        <div className="absolute inset-x-1.5 top-3 grid grid-cols-2 gap-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-2 sm:h-2.5 rounded-sm bg-white/35" />
          ))}
        </div>
      </div>

      {/* Subtle Grid Lines */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ 
        backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      {/* Corner Decorations */}
      <div className="absolute bottom-[20%] right-[2%] sm:right-[5%] w-20 sm:w-32 h-px bg-gradient-to-l from-blue-300/30 to-transparent hero-fade" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-[25%] right-[2%] sm:right-[5%] w-px h-16 sm:h-24 bg-gradient-to-t from-blue-300/30 to-transparent hero-fade" style={{ animationDelay: '1.5s' }} />

      <div className="absolute bottom-[20%] left-[2%] sm:left-[5%] w-20 sm:w-32 h-px bg-gradient-to-r from-indigo-300/30 to-transparent hero-fade" style={{ animationDelay: '1.7s' }} />
      <div className="absolute bottom-[25%] left-[2%] sm:left-[5%] w-px h-16 sm:h-24 bg-gradient-to-t from-indigo-300/30 to-transparent hero-fade" style={{ animationDelay: '1.7s' }} />
    </div>
  );
};

export default React.memo(HeroChartBackground);
