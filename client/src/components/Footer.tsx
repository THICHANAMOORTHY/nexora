import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';

interface FooterProps {
  onOpenConsultation: () => void;
  onOpenAdmin?: () => void;
  phone?: string;
  email?: string;
  address?: string;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenConsultation,
  onOpenAdmin,
  phone = '6374742431',
  email = 'thichu683@gmail.com',
  address = 'NH-47, Palakkad Main Road, Navakkarai (P.O), Coimbatore – 641105, Tamil Nadu, India'
}) => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs">
      {/* Top CTA Banner */}
      <div className="border-b border-slate-100 py-8 sm:py-12 bg-sky-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 text-center md:text-left">
          <div>
            <h3 className="text-lg sm:text-2xl font-extrabold text-[#111827]">
              Ready to Ace Your College Final Year Project Reviews & Viva?
            </h3>
            <p className="mt-1 text-slate-500 text-xs sm:text-sm">
              Get your verified IEEE synopsis, clean source code, and comprehensive project report today.
            </p>
          </div>
          <button
            onClick={onOpenConsultation}
            className="w-full md:w-auto px-7 py-3.5 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-700/20 transition shrink-0 flex items-center justify-center gap-2"
          >
            <span>Book Your Project Topic</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center p-0.5 shadow-sm">
                <div className="w-full h-full bg-white rounded-[6px] flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-sky-600" />
                </div>
              </div>
              <span className="font-extrabold text-lg text-[#172554] tracking-tight">
                NEXORA TECHNOLOGIES
              </span>
            </div>

            <p className="text-slate-500 leading-relaxed text-xs max-w-sm">
              Premier academic research lab and final year engineering project consultancy in Coimbatore & Bangalore. Empowering B.E, B.Tech, M.Tech, and MCA students with publishable research, working code, and viva excellence.
            </p>

            <div className="space-y-2.5 text-slate-700 pt-2 font-medium">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <a href={`tel:+91${cleanPhone}`} className="hover:text-emerald-700 transition">
                  Helpline: +91 {cleanPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-600 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-sky-700 transition">
                  {email}
                </a>
              </div>
            </div>
          </div>

          {/* Department Quicklinks */}
          <div className="space-y-3">
            <div className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Departments
            </div>
            <ul className="space-y-2 text-slate-500">
              <li><a href="#departments" className="hover:text-sky-600 transition">B.E Computer Science (CSE)</a></li>
              <li><a href="#departments" className="hover:text-sky-600 transition">B.E Electronics (ECE)</a></li>
              <li><a href="#departments" className="hover:text-sky-600 transition">B.E Information Tech (IT)</a></li>
              <li><a href="#departments" className="hover:text-sky-600 transition">B.E EEE Power & Automation</a></li>
              <li><a href="#departments" className="hover:text-sky-600 transition">B.Sc Computer Science</a></li>
              <li><a href="#departments" className="hover:text-sky-600 transition">M.Sc CS & MCA Postgrads</a></li>
            </ul>
          </div>

          {/* Technologies */}
          <div className="space-y-3">
            <div className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Trending Tech
            </div>
            <ul className="space-y-2 text-slate-500">
              <li><a href="#projects" className="hover:text-sky-600 transition">Artificial Intelligence & LLMs</a></li>
              <li><a href="#projects" className="hover:text-sky-600 transition">Python & Deep Learning</a></li>
              <li><a href="#projects" className="hover:text-sky-600 transition">IoT ESP32 & Embedded Edge</a></li>
              <li><a href="#projects" className="hover:text-sky-600 transition">MERN Full Stack & Next.js</a></li>
              <li><a href="#projects" className="hover:text-sky-600 transition">Cybersecurity & Ransomware</a></li>
              <li><a href="#projects" className="hover:text-sky-600 transition">Blockchain Smart Contracts</a></li>
            </ul>
          </div>

          {/* Deliverables */}
          <div className="space-y-3">
            <div className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Student Guarantees
            </div>
            <ul className="space-y-2 text-slate-500">
              <li><a href="#projects" className="hover:text-sky-600 transition">100% Working Source Code</a></li>
              <li><a href="#projects" className="hover:text-sky-600 transition">Turnitin Plagiarism &lt; 10%</a></li>
              <li><a href="#projects" className="hover:text-sky-600 transition">Review 1, 2, 3 PPT Decks</a></li>
              <li><a href="#projects" className="hover:text-sky-600 transition">1-on-1 Viva Voce Coaching</a></li>
              <li><a href="#projects" className="hover:text-sky-600 transition">AnyDesk Remote Setup</a></li>
              <li><a href="#projects" className="hover:text-sky-600 transition">College Guide Modifications</a></li>
            </ul>
          </div>

        </div>

        {/* Ethical Academic Notice & Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-[11px] text-slate-400 space-y-2">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <p>
              <strong>Academic Integrity Notice:</strong> All source code, research prototypes, architecture designs, and documentation provided by Nexora Technologies are intended for educational guidance, research prototyping, and viva voce preparation in accordance with university guidelines.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div>
              &copy; {new Date().getFullYear()} Nexora Technologies Pvt. Ltd. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-slate-600">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600">Terms of Service</a>
              <a href="#" className="hover:text-slate-600">IEEE Compliance</a>
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="font-bold text-sky-600 hover:text-sky-800 transition underline underline-offset-2"
                >
                  Admin Portal
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
