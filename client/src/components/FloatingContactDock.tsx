import React from 'react';
import { Calendar, Phone, MessageCircle } from 'lucide-react';

interface FloatingContactDockProps {
  onOpenConsultation: () => void;
  phone?: string;
  whatsappNumber?: string;
}

export const FloatingContactDock: React.FC<FloatingContactDockProps> = ({ 
  onOpenConsultation,
  phone = '6374742431',
  whatsappNumber = '916374742431'
}) => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <aside aria-label="Quick contact actions" className="fixed right-2.5 bottom-3 sm:right-4 sm:bottom-8 z-40 flex flex-col gap-2 sm:gap-3">
      {/* 1. Cyan Calendar Button */}
      <button
        onClick={onOpenConsultation}
        className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#00a3e0] hover:bg-[#0284c7] text-white flex items-center justify-center shadow-md sm:shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 border border-white/50"
        title="Book Appointment / Free Consultation"
        aria-label="Book Project Consultation"
      >
        <Calendar className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
      </button>

      {/* 2. Cyan Phone Button */}
      <a
        href={`tel:+91${cleanPhone}`}
        className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#00a3e0] hover:bg-[#0284c7] text-white flex items-center justify-center shadow-md sm:shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 border border-white/50"
        title={`Call Helpline: +91 ${cleanPhone}`}
        aria-label="Call Helpline"
      >
        <Phone className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-white" />
      </a>

      {/* 3. Green WhatsApp Button */}
      <a
        href={`https://wa.me/${cleanWhatsApp}?text=Hello%20Nexora%20Technologies,%20I%20need%20details%20for%20my%20final%20year%20project`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[#25d366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-md sm:shadow-lg hover:scale-110 active:scale-95 transition-all duration-200 border border-white/50"
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6 fill-white" />
      </a>
    </aside>
  );
};
