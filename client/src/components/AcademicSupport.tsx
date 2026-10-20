import React from 'react';
import { 
  FileText, 
  ScrollText, 
  Briefcase, 
  Globe, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';

interface AcademicSupportProps {
  onOpenConsultation: (serviceName?: string) => void;
}

export const AcademicSupport: React.FC<AcademicSupportProps> = ({ onOpenConsultation }) => {
  const services = [
    {
      number: '01 / DOCUMENTATION',
      title: 'Project Reports',
      description: 'Structured reports, diagrams, results and references.',
      icon: FileText,
      accentColor: 'from-purple-500 to-indigo-600',
    },
    {
      number: '02 / RESEARCH',
      title: 'IEEE Reports',
      description: 'IEEE-style formatting, citations and technical paper layout.',
      icon: ScrollText,
      accentColor: 'from-indigo-500 to-purple-600',
    },
    {
      number: '03 / CAREER',
      title: 'Resume Building',
      description: 'ATS-friendly resumes highlighting skills and projects.',
      icon: Briefcase,
      accentColor: 'from-purple-600 to-pink-600',
    },
    {
      number: '04 / DIGITAL PRESENCE',
      title: 'Portfolio Development',
      description: 'Personal websites showcasing projects, skills and achievements.',
      icon: Globe,
      accentColor: 'from-violet-500 to-purple-700',
    },
  ];

  return (
    <section id="academic-support" className="py-14 sm:py-20 bg-[#080d1a] text-slate-100 relative overflow-hidden border-t border-slate-800/80">
      {/* Soft Purple and Navy Radial Glows */}
      <div className="absolute top-0 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-600/10 blur-[100px] sm:blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-600/10 blur-[100px] sm:blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Eyebrow & Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25 text-xs font-bold tracking-widest uppercase mb-3 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>ACADEMIC SUPPORT</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Your Project. Your Story.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400">
              Professionally Presented.
            </span>
          </h2>

          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            From technical documentation to career-ready profiles, we help students present their work with clarity and confidence.
          </p>
        </div>

        {/* Responsive 2-Column Grid (Navy and Purple Theme) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {services.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                onClick={() => onOpenConsultation(item.title)}
                className="group cursor-pointer rounded-2xl bg-[#0f172a]/90 hover:bg-[#131d36] border border-purple-500/20 hover:border-purple-500/50 p-5 sm:p-7 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 relative flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Icon & Tag */}
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-110 group-hover:border-purple-400 transition-all duration-300">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    <span className="font-mono text-[10px] sm:text-xs font-bold text-purple-400 tracking-wider">
                      {item.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Action Hint */}
                <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-purple-300 group-hover:text-purple-200">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 -translate-x-1 group-hover:translate-x-0 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner Card (Matching user text) */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 p-5 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 shadow-2xl">
          <div className="space-y-1 sm:space-y-1.5 text-center md:text-left w-full">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Ready to present your work?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto md:mx-0">
              Tell us what you need. We'll help you choose the right service for your project or career.
            </p>
          </div>

          <button
            onClick={() => onOpenConsultation('Academic Support Service')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-purple-600/30 transition-all duration-200 hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center gap-2"
          >
            <span>Request a service</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
