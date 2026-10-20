import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DepartmentCards } from './components/DepartmentCards';
import { AcademicSupport } from './components/AcademicSupport';
import { ProjectCatalog } from './components/ProjectCatalog';
import { Footer } from './components/Footer';
import { ConsultationModal } from './components/ConsultationModal';
import { FloatingContactDock } from './components/FloatingContactDock';
import { AdminDashboard, type SiteConfig } from './components/AdminDashboard';

const defaultSettings: SiteConfig = {
  heroTitleLine1: 'From Ideas to',
  heroTitleHighlight: 'Innovation.',
  heroSubtitle: 'Empowering Students to Build, Create, and Succeed.',
  heroEyebrow: 'NEXORA TECHNOLOGIES',
  phone: '6374742431',
  email: 'thichu683@gmail.com',
  address: 'NH-47, Palakkad Main Road, Navakkarai (P.O), Coimbatore – 641105, Tamil Nadu, India',
  whatsappNumber: '916374742431',
  servicesList: [
    'Academic Projects',
    'IEEE Research',
    'Project Documentation',
    'Resume Building',
    'Portfolio Development',
  ],
};

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationTopic, setConsultationTopic] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [settings, setSettings] = useState<SiteConfig>(defaultSettings);

  // Fetch site configuration from MongoDB backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/settings');
        const json = await res.json();
        if (json.success && json.data) {
          setSettings((prev) => ({ ...prev, ...json.data }));
        }
      } catch {
        // Fallback to local default settings
      }
    };

    fetchSettings();
  }, []);

  const handleOpenConsultation = (topic?: string) => {
    setConsultationTopic(topic || '');
    setIsConsultationOpen(true);
  };

  const handleSelectDepartment = (deptKey: string) => {
    setSearchQuery(deptKey);
    const catalog = document.getElementById('projects');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreClick = () => {
    const deptSection = document.getElementById('departments');
    if (deptSection) {
      deptSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-sky-500 selection:text-white relative">
      {/* Navbar with Brand, Links, Hotline, and Admin button */}
      <Navbar 
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        phone={settings.phone}
      />

      {/* Main Page Layout */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* Hero Section (Controlled via Admin Dashboard) */}
        <Hero 
          onExploreClick={handleExploreClick}
          onOpenConsultation={() => handleOpenConsultation()}
          settings={settings}
        />

        {/* Department Cards Grid */}
        <DepartmentCards 
          onSelectDepartment={handleSelectDepartment}
          onOpenConsultation={(dept) => handleOpenConsultation(`Project in ${dept}`)}
        />

        {/* Academic Support Section (Responsive 2-Column Navy & Purple Theme) */}
        <AcademicSupport 
          onOpenConsultation={(service) => handleOpenConsultation(service || 'Academic Support Service')}
        />

        {/* Projects Catalog */}
        <ProjectCatalog
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onOpenConsultation={handleOpenConsultation}
        />
      </main>

      {/* Footer with updated address, phone, and Admin Portal link */}
      <Footer 
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenAdmin={() => setIsAdminOpen(true)}
        phone={settings.phone}
        email={settings.email}
        address={settings.address}
      />

      {/* Floating Action Dock on Right Edge (Calendar, Phone, WhatsApp) */}
      <FloatingContactDock 
        onOpenConsultation={() => handleOpenConsultation()}
        phone={settings.phone}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* Free Project Consultation & Booking Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        initialTopic={consultationTopic}
        whatsappNumber={settings.whatsappNumber}
      />

      {/* Live Admin Dashboard (Hero Editor, Contact/Address Editor, Inquiries, Projects) */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentSettings={settings}
        onSettingsUpdated={(newSettings) => setSettings(newSettings)}
      />
    </div>
  );
}

export default App;

