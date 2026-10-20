import React from 'react';
import { 
  ArrowRight 
} from 'lucide-react';
import type { SiteConfig } from './AdminDashboard';

interface HeroProps {
  onExploreClick: () => void;
  onOpenConsultation: () => void;
  settings?: Partial<SiteConfig>;
}

export const Hero: React.FC<HeroProps> = ({ 
  onExploreClick, 
  onOpenConsultation,
  settings 
}) => {
  const titleLine1 = settings?.heroTitleLine1 || 'From Ideas to';
  const titleHighlight = settings?.heroTitleHighlight || 'Innovation.';
  const subtitle = settings?.heroSubtitle || 'Empowering Students to Build, Create, and Succeed.';
  const eyebrow = settings?.heroEyebrow || 'NEXORA TECHNOLOGIES';
  const services = settings?.servicesList && settings.servicesList.length > 0 
    ? settings.servicesList 
    : [
        'Academic Projects',
        'IEEE Research',
        'Project Documentation',
        'Resume Building',
        'Portfolio Development',
      ];
  return (
    <section className="relative w-full min-h-[auto] md:min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#f0f9ff]/60 via-[#f8fbfe] to-[#ffffff] text-slate-900 flex flex-col justify-center items-center overflow-hidden py-14 sm:py-20 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-sky-100">
      
      {/* 3D Neumorphic Background Angled Capsule Tubes (Matching Reference Image) */}
      
      {/* Left Top Tube 1 */}
      <div className="absolute -left-24 top-6 w-[420px] h-[85px] rounded-full bg-gradient-to-r from-white via-sky-50/70 to-white/40 border border-sky-100/80 shadow-[0_15px_35px_rgba(2,132,199,0.08)] rotate-[-40deg] pointer-events-none" />
      
      {/* Left Mid Tube 2 */}
      <div className="absolute -left-12 top-48 w-[320px] h-[65px] rounded-full bg-gradient-to-r from-white via-sky-50/60 to-transparent border border-sky-100/60 shadow-[0_12px_25px_rgba(2,132,199,0.06)] rotate-[-40deg] pointer-events-none" />
      
      {/* Right Top Tube */}
      <div className="absolute -right-28 top-12 w-[460px] h-[95px] rounded-full bg-gradient-to-l from-white via-sky-50/70 to-white/30 border border-sky-100/80 shadow-[0_15px_35px_rgba(2,132,199,0.08)] rotate-[40deg] pointer-events-none" />

      {/* Soft 3D Neumorphic Floating Spheres / Circular Insets */}
      <div className="absolute right-[10%] top-[8%] hidden md:block w-28 h-28 rounded-full bg-gradient-to-br from-white via-sky-50 to-sky-100/60 shadow-[inset_0_3px_8px_rgba(255,255,255,0.9),0_20px_35px_rgba(2,132,199,0.1)] border border-white/80 pointer-events-none" />
      <div className="absolute left-[6%] bottom-[12%] hidden md:block w-24 h-24 rounded-full bg-gradient-to-br from-white via-sky-50 to-sky-100/60 shadow-[inset_0_3px_8px_rgba(255,255,255,0.9),0_15px_30px_rgba(2,132,199,0.08)] border border-white/80 pointer-events-none" />

      {/* Ambient Soft Cyan Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[750px] h-[350px] sm:h-[550px] bg-sky-200/30 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Floating Tech Stack Badges (Positioned exactly as in reference image) */}
      
      {/* 1. Python Badge (Top Left) */}
      <div className="absolute left-[18%] lg:left-[22%] top-[18%] hidden md:flex items-center justify-center w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-white shadow-xl shadow-slate-200/80 border border-slate-100 animate-float-1 z-10">
        <svg className="w-6 h-6 lg:w-7 lg:h-7" viewBox="0 0 24 24" fill="none">
          <path d="M11.9 2c-3.1 0-5 1.5-5 3.3v2.2h5v.8H5.2C3.4 8.3 2 9.9 2 12.3s1.4 3.9 3.2 3.9h1.7v-2.3c0-1.8 1.6-3.4 3.5-3.4h5.2c1.4 0 2.5-1.1 2.5-2.5V5.3c0-1.8-2-3.3-6.2-3.3zm-1.8 1.8c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1-1.1-.5-1.1-1.1.5-1.1 1.1-1.1z" fill="#3776AB"/>
          <path d="M12.1 22c3.1 0 5-1.5 5-3.3v-2.2h-5v-.8h6.7c1.8 0 3.2-1.6 3.2-4s-1.4-3.9-3.2-3.9h-1.7v2.3c0 1.8-1.6 3.4-3.5 3.4H8.4c-1.4 0-2.5 1.1-2.5 2.5v3.2c0 1.8 2 3.3 6.2 3.3zm1.8-1.8c-.6 0-1.1-.5-1.1-1.1s.5-1.1 1.1-1.1 1.1.5 1.1 1.1-.5 1.1-1.1 1.1z" fill="#FFD438"/>
        </svg>
      </div>

      {/* 2. HTML5 Badge (Far Left) */}
      <div className="absolute left-[8%] lg:left-[10%] top-[16%] hidden md:flex items-center justify-center w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-white shadow-xl shadow-slate-200/80 border border-slate-100 animate-float-3 z-10">
        <span className="font-black text-xs text-orange-500 tracking-tighter">
          HTML<span className="text-orange-600 font-extrabold">5</span>
        </span>
      </div>

      {/* 3. Database / MongoDB Badge (Top Center) */}
      <div className="absolute left-[36%] lg:left-[38%] top-[10%] hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 text-white shadow-2xl shadow-slate-900/30 border-2 border-slate-700 animate-float-2 z-10">
        <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="5" rx="9" ry="3"/>
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
          <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
        </svg>
      </div>

      {/* 4. Figma Badge (Mid Left) */}
      <div className="absolute left-[15%] lg:left-[19%] top-[42%] hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-slate-900 shadow-xl shadow-slate-900/30 border border-slate-800 animate-float-4 z-10">
        <svg className="w-5 h-5" viewBox="0 0 38 57" fill="none">
          <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE"/>
          <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83"/>
          <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262"/>
          <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E"/>
          <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF"/>
        </svg>
      </div>

      {/* 5. Facebook Badge (Lower Left) */}
      <div className="absolute left-[20%] lg:left-[24%] bottom-[32%] hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-[#1877f2] text-white font-extrabold shadow-lg shadow-blue-500/20 animate-float-2 z-10">
        <span className="text-lg">f</span>
      </div>

      {/* 6. Instagram Badge (Bottom Left) */}
      <div className="absolute left-[8%] lg:left-[11%] bottom-[20%] hidden md:flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-xl shadow-pink-500/20 text-white animate-float-3 z-10">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
        </svg>
      </div>

      {/* 7. React Badge (Top Right - Matches Reference Image exactly) */}
      <div className="absolute right-[11%] lg:right-[14%] top-[12%] hidden md:flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-slate-950 shadow-2xl shadow-sky-500/20 border-2 border-sky-400/40 animate-float-1 z-10">
        <svg className="w-8 h-8 lg:w-9 lg:h-9 text-sky-400 animate-spin" style={{ animationDuration: '10s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      </div>

      {/* 8. JS Badge (Mid Right) */}
      <div className="absolute right-[22%] lg:right-[26%] top-[25%] hidden md:flex items-center justify-center w-9 h-9 rounded-lg bg-white shadow-lg border border-purple-200 text-purple-600 font-extrabold text-xs animate-float-3 z-10">
        JS
      </div>

      {/* 9. Linux Penguin Badge (Lower Right) */}
      <div className="absolute right-[18%] lg:right-[22%] bottom-[38%] hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-xl shadow-slate-200 border border-slate-100 animate-float-4 z-10">
        <span className="text-xl">🐧</span>
      </div>

      {/* 10. Code / Framework Badge (Bottom Right) */}
      <div className="absolute right-[26%] lg:right-[30%] bottom-[16%] hidden md:flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-xl shadow-slate-200 border border-rose-100 text-rose-500 font-extrabold animate-float-2 z-10">
        <span className="text-base font-black">📦</span>
      </div>

      {/* Main Hero Center Content */}
      <div className="max-w-4xl mx-auto text-center relative z-20 space-y-4 sm:space-y-6 w-full">
        
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-100/80 border border-sky-200 text-[#0284c7] text-xs font-bold tracking-widest uppercase mb-1 shadow-xs">
          <span>{eyebrow}</span>
        </div>

        {/* Big Bold Headline (Exact colors from reference image: Sky Blue + Forest Green) */}
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.15] break-words">
          <span className="text-[#00a3e0] block sm:inline">{titleLine1} </span>
          <span className="text-[#15803d]">{titleHighlight}</span>
        </h1>

        {/* Subtitle (Clean Charcoal/Slate) */}
        <p className="text-base sm:text-xl lg:text-2xl font-bold text-slate-800 max-w-2xl mx-auto leading-snug px-2">
          {subtitle}
        </p>

        {/* Services Strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs sm:text-sm font-semibold text-slate-600 max-w-3xl mx-auto px-2">
          {services.map((item, idx) => (
            <React.Fragment key={idx}>
              <span className="bg-white/80 sm:bg-transparent px-3 py-1 sm:p-0 rounded-full border border-slate-200 sm:border-0 shadow-xs sm:shadow-none">
                {item}
              </span>
              {idx < services.length - 1 && (
                <span className="text-slate-400 hidden sm:inline">•</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Action Button (Matches the Green button 'Explore Our Courses' in reference image) */}
        <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto max-w-md sm:max-w-none mx-auto">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-3.5 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-700/25 transition-all duration-200 active:scale-95"
          >
            <span>Explore Projects</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 font-bold text-sm shadow-sm transition-all duration-200 active:scale-95"
          >
            Get Consultation
          </button>
        </div>

      </div>

    </section>
  );
};

