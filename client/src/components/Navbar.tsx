import React, { useState } from 'react';
import { 
  Phone, 
  ChevronDown, 
  Menu, 
  X, 
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  onOpenConsultation: () => void;
  onOpenAdmin?: () => void;
  phone?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenConsultation,
  onOpenAdmin,
  phone = '6374742431'
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [domainsDropdown, setDomainsDropdown] = useState(false);
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-2">
          
          {/* Logo with Leaf & Graduation Tech Branding */}
          <a href="#" className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-sky-500 via-teal-500 to-emerald-500 p-0.5 shadow-md shrink-0">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6 text-sky-600" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-[#172554]">
                  NEXORA
                </span>
                <span className="font-bold text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 border border-sky-200 shrink-0">
                  PROJECT LAB
                </span>
              </div>
              <p className="text-[8px] sm:text-[10px] text-slate-500 font-semibold tracking-wider uppercase truncate">
                Final Year Academic Project Center
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <a href="#" className="text-sky-600 hover:text-sky-700 transition">
              Home
            </a>
            <a href="#departments" className="hover:text-sky-600 transition">
              About Us
            </a>

            {/* Project Domains Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setDomainsDropdown(true)}
              onMouseLeave={() => setDomainsDropdown(false)}
            >
              <button 
                type="button"
                className="flex items-center gap-1 hover:text-sky-600 transition"
              >
                <span>Project Domains</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {domainsDropdown && (
                <div className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-white border border-slate-100 shadow-xl py-2 z-50">
                  <a href="#departments" className="block px-4 py-2.5 text-xs hover:bg-sky-50 hover:text-sky-600 text-slate-700 font-semibold transition">
                    B.E / B.Tech CSE & IT Projects
                  </a>
                  <a href="#departments" className="block px-4 py-2.5 text-xs hover:bg-sky-50 hover:text-sky-600 text-slate-700 font-semibold transition">
                    B.E ECE (IoT & Embedded Projects)
                  </a>
                </div>
              )}
            </div>

            <a href="#academic-support" className="hover:text-sky-600 transition">
              Academic Support
            </a>
            <a href="#projects" className="hover:text-sky-600 transition">
              Explore Projects
            </a>
            <a href="#contact" onClick={onOpenConsultation} className="hover:text-sky-600 transition">
              Contact
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5 shrink-0">
            {/* Phone Button */}
            <a
              href={`tel:+91${cleanPhone}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-emerald-700/20 transition-all duration-200"
            >
              <Phone className="w-4 h-4 fill-white text-white" />
              <span>+91 {cleanPhone}</span>
            </a>

            {/* Admin Dashboard Button */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                title="Open Admin Management Dashboard"
              >
                <span>Admin</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-5 py-5 space-y-3 shadow-lg">
          <a 
            href="#" 
            onClick={() => setMobileMenuOpen(false)} 
            className="block py-2 text-sm font-semibold text-sky-600 border-b border-slate-50"
          >
            Home
          </a>
          <a 
            href="#departments" 
            onClick={() => setMobileMenuOpen(false)} 
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-sky-600 border-b border-slate-50"
          >
            B.E / B.Tech CSE & IT Projects
          </a>
          <a 
            href="#departments" 
            onClick={() => setMobileMenuOpen(false)} 
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-sky-600 border-b border-slate-50"
          >
            B.E ECE (IoT & Embedded Projects)
          </a>
          <a 
            href="#academic-support" 
            onClick={() => setMobileMenuOpen(false)} 
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-sky-600 border-b border-slate-50"
          >
            Academic Support (Reports, IEEE, Resumes)
          </a>
          <a 
            href="#projects" 
            onClick={() => setMobileMenuOpen(false)} 
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-sky-600 border-b border-slate-50"
          >
            Explore Projects Directory
          </a>
          <a 
            href="#contact" 
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenConsultation();
            }} 
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-sky-600"
          >
            Contact & Consultation
          </a>
          
          <div className="pt-2 space-y-2">
            <a
              href={`tel:+91${cleanPhone}`}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#15803d] text-white font-bold text-sm shadow-md"
            >
              <Phone className="w-4 h-4 fill-white" />
              <span>Call Helpline: +91 {cleanPhone}</span>
            </a>

            {onOpenAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <span>Open Admin Management Portal</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
