import React from "react";

/* ──────────────────────────────────────────────
   Auth Page Hero Background
   Animated city skyline for the authentication page
   Based on HeroChartBackground with dark theme colors
   ────────────────────────────────────────────── */

const AuthHeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* CSS animations */}
      <style>{`
        @keyframes auth-fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes auth-slideUp { from { opacity: 0; transform: translateY(100%); } to { opacity: 1; transform: translateY(0); } }
        @keyframes auth-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes auth-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.7; } }
        @keyframes auth-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .auth-fade { animation: auth-fadeIn 0.8s ease-out forwards; opacity: 0; }
        .auth-slide { animation: auth-slideUp 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
        .auth-float { animation: auth-float 4s ease-in-out infinite; }
        .auth-pulse { animation: auth-pulse 3s ease-in-out infinite; }
        .auth-shimmer { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); background-size: 200% 100%; animation: auth-shimmer 3s infinite; }
      `}</style>

      {/* Gradient Overlays */}
      <div className="absolute -top-40 right-[-10%] w-[400px] h-[400px] rounded-full bg-gradient-radial from-white/10 to-transparent blur-3xl" />
      <div className="absolute -top-20 left-[-5%] w-[300px] h-[300px] rounded-full bg-gradient-radial from-cyan-400/10 to-transparent blur-3xl" />
      <div className="absolute bottom-0 left-[20%] w-[500px] h-[300px] rounded-full bg-gradient-radial from-indigo-400/10 to-transparent blur-3xl" />

      {/* Floating Property Cards */}
      <div className="absolute top-[10%] right-[8%] auth-fade auth-float" style={{ animationDelay: '0.5s' }}>
        <div className="w-16 h-20 rounded-xl bg-white/10 backdrop-blur-sm shadow-lg border border-white/20 p-2 transform rotate-6">
          <div className="w-full h-10 rounded-lg bg-white/15 mb-2" />
          <div className="w-3/4 h-1.5 rounded bg-white/30" />
          <div className="w-1/2 h-1.5 rounded bg-white/20 mt-1" />
        </div>
      </div>

      <div className="absolute top-[15%] left-[10%] auth-fade auth-float" style={{ animationDelay: '0.8s', animationDuration: '5s' }}>
        <div className="w-14 h-16 rounded-xl bg-white/8 backdrop-blur-sm shadow-lg border border-white/15 p-2 transform -rotate-6">
          <div className="w-full h-8 rounded-lg bg-white/10 mb-1.5" />
          <div className="w-2/3 h-1 rounded bg-white/25" />
          <div className="w-1/2 h-1 rounded bg-white/15 mt-1" />
        </div>
      </div>

      {/* Floating Icons */}
      <div className="absolute top-[8%] right-[30%] auth-fade" style={{ animationDelay: '0.3s' }}>
        <div className="w-10 h-10 rounded-2xl bg-white/15 shadow-lg flex items-center justify-center auth-float">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
      </div>

      <div className="absolute top-[5%] left-[25%] auth-fade" style={{ animationDelay: '0.6s' }}>
        <div className="w-8 h-8 rounded-xl bg-cyan-400/20 shadow-lg flex items-center justify-center auth-float" style={{ animationDuration: '4.5s' }}>
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
      </div>

      <div className="absolute top-[20%] left-[40%] auth-fade" style={{ animationDelay: '0.9s' }}>
        <div className="w-9 h-9 rounded-xl bg-indigo-400/20 shadow-lg flex items-center justify-center auth-float" style={{ animationDuration: '5.5s' }}>
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>

      {/* Decorative Dots Pattern */}
      <div className="absolute top-[25%] right-[5%] grid grid-cols-4 gap-2 opacity-30 auth-fade" style={{ animationDelay: '1s' }}>
        {[...Array(16)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
        ))}
      </div>

      <div className="absolute top-[30%] left-[5%] grid grid-cols-3 gap-2 opacity-20 auth-fade" style={{ animationDelay: '1.2s' }}>
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />
        ))}
      </div>

      {/* Modern City Skyline - Full Width */}
      <svg
        viewBox="0 0 800 350"
        preserveAspectRatio="xMidYMax slice"
        className="absolute bottom-0 inset-x-0 w-full h-[55%] auth-slide"
        style={{ animationDelay: '0.2s' }}
      >
        <defs>
          {/* Building Gradients - White/Light for dark background */}
          <linearGradient id="authBuilding1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="authBuilding2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="authBuilding3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="authBuilding4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="authGlass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#fff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          {/* Window Pattern */}
          <pattern id="authWindows" patternUnits="userSpaceOnUse" width="18" height="22">
            <rect x="2" y="2" width="5" height="7" rx="1" fill="#fff" opacity="0.4" />
            <rect x="9" y="2" width="5" height="7" rx="1" fill="#fff" opacity="0.3" />
            <rect x="2" y="12" width="5" height="7" rx="1" fill="#fff" opacity="0.35" />
            <rect x="9" y="12" width="5" height="7" rx="1" fill="#fff" opacity="0.25" />
          </pattern>
        </defs>

        {/* Background Buildings Layer - Farthest */}
        <g className="auth-pulse">
          <rect x="20" y="180" width="50" height="170" rx="3" fill="url(#authBuilding4)" />
          <rect x="90" y="160" width="40" height="190" rx="3" fill="url(#authBuilding4)" />
          <rect x="680" y="170" width="45" height="180" rx="3" fill="url(#authBuilding4)" />
          <rect x="740" y="190" width="40" height="160" rx="3" fill="url(#authBuilding4)" />
        </g>

        {/* Mid Buildings Layer */}
        <g>
          {/* Left Side Buildings */}
          <rect x="0" y="220" width="70" height="130" rx="3" fill="url(#authBuilding3)" />
          <rect x="0" y="220" width="70" height="130" rx="3" fill="url(#authWindows)" opacity="0.3" />
          
          <rect x="80" y="160" width="60" height="190" rx="3" fill="url(#authBuilding2)" />
          <rect x="80" y="160" width="60" height="190" rx="3" fill="url(#authWindows)" opacity="0.4" />
          
          <rect x="150" y="200" width="50" height="150" rx="3" fill="url(#authBuilding3)" />
          <rect x="150" y="200" width="50" height="150" rx="3" fill="url(#authWindows)" opacity="0.35" />

          {/* Center-Left Buildings */}
          <rect x="210" y="140" width="65" height="210" rx="3" fill="url(#authBuilding1)" />
          <rect x="210" y="140" width="65" height="210" rx="3" fill="url(#authWindows)" opacity="0.5" />
          <rect x="215" y="140" width="12" height="210" fill="url(#authGlass)" />
          
          <rect x="285" y="170" width="55" height="180" rx="3" fill="url(#authBuilding2)" />
          <rect x="285" y="170" width="55" height="180" rx="3" fill="url(#authWindows)" opacity="0.4" />

          {/* Center Buildings - Tallest */}
          <rect x="355" y="80" width="75" height="270" rx="4" fill="url(#authBuilding1)" />
          <rect x="355" y="80" width="75" height="270" rx="4" fill="url(#authWindows)" opacity="0.5" />
          <rect x="363" y="80" width="15" height="270" fill="url(#authGlass)" />
          {/* Building Top Detail */}
          <rect x="378" y="68" width="30" height="12" rx="2" fill="url(#authBuilding1)" />
          <circle cx="393" cy="60" r="6" fill="url(#authBuilding1)" />
          
          <rect x="445" y="110" width="65" height="240" rx="4" fill="url(#authBuilding2)" />
          <rect x="445" y="110" width="65" height="240" rx="4" fill="url(#authWindows)" opacity="0.45" />
          
          <rect x="525" y="95" width="60" height="255" rx="4" fill="url(#authBuilding1)" />
          <rect x="525" y="95" width="60" height="255" rx="4" fill="url(#authWindows)" opacity="0.5" />
          {/* Antenna */}
          <line x1="555" y1="95" x2="555" y2="70" stroke="#fff" strokeWidth="2" opacity="0.3" />
          <circle cx="555" cy="65" r="3" fill="#fff" opacity="0.4" />

          {/* Center-Right Buildings */}
          <rect x="600" y="150" width="65" height="200" rx="3" fill="url(#authBuilding3)" />
          <rect x="600" y="150" width="65" height="200" rx="3" fill="url(#authWindows)" opacity="0.4" />
          
          <rect x="675" y="180" width="50" height="170" rx="3" fill="url(#authBuilding2)" />
          <rect x="675" y="180" width="50" height="170" rx="3" fill="url(#authWindows)" opacity="0.35" />

          {/* Right Side Buildings */}
          <rect x="735" y="145" width="65" height="205" rx="3" fill="url(#authBuilding1)" />
          <rect x="735" y="145" width="65" height="205" rx="3" fill="url(#authWindows)" opacity="0.45" />
          <rect x="740" y="145" width="14" height="205" fill="url(#authGlass)" />
        </g>

        {/* Ground/Street Level */}
        <rect x="0" y="345" width="800" height="10" fill="url(#authBuilding1)" opacity="0.5" />

        {/* Decorative Elements - Street Trees */}
        <g opacity="0.25">
          <circle cx="175" cy="335" r="12" fill="#4ade80" />
          <circle cx="340" cy="340" r="10" fill="#4ade80" />
          <circle cx="610" cy="335" r="11" fill="#4ade80" />
        </g>
      </svg>

      {/* Foreground Accent Buildings */}
      <div className="absolute bottom-0 left-[5%] w-20 h-[25%] bg-gradient-to-t from-white/15 to-white/5 rounded-t-lg auth-slide" style={{ animationDelay: '0.4s' }}>
        <div className="absolute inset-x-2 top-4 grid grid-cols-2 gap-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-2.5 rounded-sm bg-white/30" />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 right-[8%] w-16 h-[20%] bg-gradient-to-t from-white/12 to-white/4 rounded-t-lg auth-slide" style={{ animationDelay: '0.5s' }}>
        <div className="absolute inset-x-1.5 top-3 grid grid-cols-2 gap-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-2 rounded-sm bg-white/25" />
          ))}
        </div>
      </div>

      {/* Subtle Grid Lines */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ 
        backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Corner Decorations */}
      <div className="absolute bottom-[25%] right-[3%] w-24 h-px bg-gradient-to-l from-white/30 to-transparent auth-fade" style={{ animationDelay: '1.5s' }} />
      <div className="absolute bottom-[30%] right-[3%] w-px h-20 bg-gradient-to-t from-white/30 to-transparent auth-fade" style={{ animationDelay: '1.5s' }} />

      <div className="absolute bottom-[25%] left-[3%] w-24 h-px bg-gradient-to-r from-white/30 to-transparent auth-fade" style={{ animationDelay: '1.7s' }} />
      <div className="absolute bottom-[30%] left-[3%] w-px h-20 bg-gradient-to-t from-white/30 to-transparent auth-fade" style={{ animationDelay: '1.7s' }} />
    </div>
  );
};

export default React.memo(AuthHeroBackground);
