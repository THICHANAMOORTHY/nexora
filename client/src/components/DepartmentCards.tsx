import React from 'react';
import { 
  Laptop, 
  Cpu, 
  CheckCircle, 
  ArrowRight
} from 'lucide-react';

interface DepartmentCardsProps {
  onSelectDepartment: (dept: string) => void;
  onOpenConsultation: (deptName: string) => void;
}

export const DepartmentCards: React.FC<DepartmentCardsProps> = ({ 
  onSelectDepartment, 
  onOpenConsultation 
}) => {
  const departments = [
    {
      id: 'cse-it',
      filterKey: 'CSE/IT',
      title: 'B.E / B.Tech CSE & IT Projects',
      icon: Laptop,
      tags: ['AI & Deep Learning', 'Full Stack MERN', 'Cloud & DevOps', 'Cybersecurity'],
      description: 'Nexora Technologies delivers industry-grade IEEE projects for Computer Science and Information Technology final-year students, featuring clean source code, mathematical models, and Turnitin-verified documentation.',
      features: [
        'Trending AI & Full-Stack Technologies',
        'Industry Expert 1-on-1 Mentorship',
        'Complete Source Code & PPT Decks'
      ],
      borderColor: 'border-sky-200 shadow-md',
    },
    {
      id: 'ece',
      filterKey: 'ECE',
      title: 'B.E ECE (IoT & Embedded Projects)',
      icon: Cpu,
      tags: ['IoT & Smart Sensors', 'Embedded Systems', 'Edge AI', 'LoRaWAN & Robotics'],
      description: 'Industry-driven IEEE based projects for B.E ECE final year students, equipped with Proteus circuit schematics, hardware firmware, and live AnyDesk execution support.',
      features: [
        'Hardware Firmware & Circuit Simulations',
        'Modern Embedded Resources',
        'Comprehensive External Viva Preparation'
      ],
      borderColor: 'border-slate-200/90 hover:border-sky-300 shadow-sm',
    },
  ];

  return (
    <section id="departments" className="py-14 sm:py-20 bg-[#f8fafc] text-slate-800 relative border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold uppercase tracking-wider mb-3">
            Core Project Specializations
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] tracking-tight leading-tight">
            Select Your Department & Explore Projects
          </h2>
          <p className="mt-2 text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto font-normal">
            Curated IEEE 2025/2026 project domains with base papers, tested source code, and university viva coaching.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <div
                key={dept.id}
                className="rounded-2xl bg-white border border-slate-200/90 hover:border-sky-400 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Icon & Title */}
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-[#111827] group-hover:text-sky-600 transition-colors">
                        {dept.title}
                      </h3>
                      <span className="text-xs font-semibold text-sky-600">
                        IEEE 2025/2026 Aligned
                      </span>
                    </div>
                  </div>

                  {/* Sub-Pills */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5">
                    {dept.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                    {dept.description}
                  </p>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 mb-6">
                    {dept.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                        <CheckCircle className="w-4 h-4 fill-sky-500 text-white shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      onSelectDepartment(dept.filterKey);
                      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#e0f2fe] hover:bg-sky-200 text-[#0284c7] font-bold text-xs tracking-wide transition shadow-xs active:scale-95"
                  >
                    <span>Explore Topics</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenConsultation(dept.title)}
                    className="text-center sm:text-right text-xs font-semibold text-slate-500 hover:text-sky-600 transition py-1"
                  >
                    Custom Topic Support
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
