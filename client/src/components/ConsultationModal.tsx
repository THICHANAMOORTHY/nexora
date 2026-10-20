import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  PhoneCall, 
  GraduationCap, 
  Building2, 
  Sparkles,
  ShieldCheck,
  FileText,
  ScrollText,
  Briefcase,
  Globe,
  Layers,
  Check
} from 'lucide-react';
import { API_BASE_URL } from '../lib/api';
import { supabase } from '../lib/supabaseClient';

export type ServiceType = 
  | 'Academic Projects' 
  | 'Project Reports' 
  | 'IEEE Reports' 
  | 'Resume Building' 
  | 'Portfolio Development';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  initialService?: string;
  whatsappNumber?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  initialTopic = '',
  initialService = 'Academic Projects',
  whatsappNumber = '916374742431',
}) => {
  const [role, setRole] = useState<'student' | 'college'>('student');
  const [serviceType, setServiceType] = useState<ServiceType>('Academic Projects');

  // Core contact info
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    college: '',
    deadline: '',
    notes: '',
  });

  // 1. Academic Projects Specific Details
  const [projectDetails, setProjectDetails] = useState({
    branch: 'CSE/IT',
    level: 'Final Year Capstone',
    domain: 'AI/ML & Data Science',
    topic: '',
  });

  // 2. Project Reports (Documentation) Specific Details
  const [reportDetails, setReportDetails] = useState({
    branch: 'CSE/IT',
    reportType: 'Final Year Capstone Report',
    formatStandard: 'Anna University Guidelines',
    pageCount: '60 - 90 Pages',
    projectTitle: '',
    inclusions: ['System Architecture Diagram', 'Results & Graphs', 'Plagiarism Check'],
  });

  // 3. IEEE Reports Specific Details
  const [ieeeDetails, setIeeeDetails] = useState({
    branch: 'CSE/IT',
    researchLevel: 'Final Year B.Tech / B.E',
    targetPublication: 'IEEE International Conference',
    paperTitle: '',
    basePaper: '',
    simulationTool: 'Python / PyTorch',
    plagiarismTolerance: 'Strict < 10% (Turnitin)',
  });

  // 4. Resume Building Specific Details
  const [resumeDetails, setResumeDetails] = useState({
    targetRole: 'Full-Stack Web Developer',
    degreeAndBatch: '',
    coreSkills: '',
    resumeFormat: '1-Page Modern Tech ATS (Recommended)',
    targetCompanies: 'Product-Based MNCs & Startups',
    profileLink: '',
  });

  // 5. Portfolio Development Specific Details
  const [portfolioDetails, setPortfolioDetails] = useState({
    portfolioPersona: 'Software Engineer / Full-Stack Developer',
    preferredStack: 'Next.js / React + Tailwind CSS',
    deployment: 'Free Vercel / GitHub Pages Deployment',
    githubLink: '',
    desiredSections: ['Interactive Hero', 'Project Case Studies', 'Skills Matrix', 'Contact Form'],
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync initial props on open
  useEffect(() => {
    if (isOpen) {
      if (initialService) {
        const normalized = initialService.toLowerCase();
        if (normalized.includes('report') && !normalized.includes('ieee')) {
          setServiceType('Project Reports');
        } else if (normalized.includes('ieee')) {
          setServiceType('IEEE Reports');
        } else if (normalized.includes('resume')) {
          setServiceType('Resume Building');
        } else if (normalized.includes('portfolio')) {
          setServiceType('Portfolio Development');
        } else {
          setServiceType('Academic Projects');
        }
      }

      if (initialTopic) {
        setProjectDetails((prev) => ({ ...prev, topic: initialTopic }));
        setReportDetails((prev) => ({ ...prev, projectTitle: initialTopic }));
        setIeeeDetails((prev) => ({ ...prev, paperTitle: initialTopic }));
      }
    }
  }, [isOpen, initialService, initialTopic]);

  if (!isOpen) return null;

  // Toggle multi-select inclusion tags
  const toggleReportInclusion = (item: string) => {
    setReportDetails((prev) => {
      const exists = prev.inclusions.includes(item);
      return {
        ...prev,
        inclusions: exists 
          ? prev.inclusions.filter((i) => i !== item)
          : [...prev.inclusions, item],
      };
    });
  };

  const togglePortfolioSection = (item: string) => {
    setPortfolioDetails((prev) => {
      const exists = prev.desiredSections.includes(item);
      return {
        ...prev,
        desiredSections: exists
          ? prev.desiredSections.filter((i) => i !== item)
          : [...prev.desiredSections, item],
      };
    });
  };

  // Compile detailed information bundle based on active service
  const getServiceDetailsBundle = () => {
    switch (serviceType) {
      case 'Project Reports':
        return {
          serviceCategory: '01 / DOCUMENTATION',
          branch: reportDetails.branch,
          reportType: reportDetails.reportType,
          formatStandard: reportDetails.formatStandard,
          pageCount: reportDetails.pageCount,
          projectTitle: reportDetails.projectTitle,
          inclusions: reportDetails.inclusions,
        };
      case 'IEEE Reports':
        return {
          serviceCategory: '02 / RESEARCH & PUBLICATION',
          branch: ieeeDetails.branch,
          researchLevel: ieeeDetails.researchLevel,
          targetPublication: ieeeDetails.targetPublication,
          paperTitle: ieeeDetails.paperTitle,
          basePaper: ieeeDetails.basePaper,
          simulationTool: ieeeDetails.simulationTool,
          plagiarismTolerance: ieeeDetails.plagiarismTolerance,
        };
      case 'Resume Building':
        return {
          serviceCategory: '03 / CAREER & ATS',
          targetRole: resumeDetails.targetRole,
          degreeAndBatch: resumeDetails.degreeAndBatch,
          coreSkills: resumeDetails.coreSkills,
          resumeFormat: resumeDetails.resumeFormat,
          targetCompanies: resumeDetails.targetCompanies,
          profileLink: resumeDetails.profileLink,
        };
      case 'Portfolio Development':
        return {
          serviceCategory: '04 / DIGITAL PRESENCE',
          portfolioPersona: portfolioDetails.portfolioPersona,
          preferredStack: portfolioDetails.preferredStack,
          deployment: portfolioDetails.deployment,
          githubLink: portfolioDetails.githubLink,
          desiredSections: portfolioDetails.desiredSections,
        };
      case 'Academic Projects':
      default:
        return {
          serviceCategory: 'ACADEMIC CAPSTONE',
          branch: projectDetails.branch,
          level: projectDetails.level,
          domain: projectDetails.domain,
          topic: projectDetails.topic,
        };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const specificDetails = getServiceDetailsBundle();

    const payload = {
      role,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      college: formData.college,
      deadline: formData.deadline,
      notes: formData.notes,
      serviceType,
      serviceDetails: specificDetails,
      branch: (specificDetails as any).branch || projectDetails.branch || 'CSE/IT',
      level: (specificDetails as any).level || (specificDetails as any).researchLevel || projectDetails.level,
      domain: (specificDetails as any).domain || serviceType,
      topic: (specificDetails as any).topic || (specificDetails as any).projectTitle || (specificDetails as any).paperTitle || (specificDetails as any).targetRole || serviceType,
    };

    // 1. Direct Supabase cloud insertion ensures lead is immediately saved and never lost
    if (supabase) {
      try {
        const sbPayload = {
          role: payload.role || 'student',
          name: payload.name,
          phone: payload.phone,
          email: payload.email,
          college: payload.college,
          branch: payload.branch,
          level: payload.level,
          domain: payload.domain,
          topic: payload.topic,
          deadline: payload.deadline || '',
          notes: payload.notes || (payload.serviceType ? `[${payload.serviceType}] Inquiry` : ''),
          status: 'New',
        };
        const { error: sbErr } = await supabase.from('inquiries').insert([sbPayload]);
        if (!sbErr) {
          window.dispatchEvent(new CustomEvent('nexora_inquiries_updated'));
        } else {
          console.warn('Supabase inquiry insert error:', sbErr);
        }
      } catch (sbErr) {
        console.warn('Supabase insert exception:', sbErr);
      }
    }

    // 2. Also forward to Express backend API if active
    try {
      await fetch(`${API_BASE_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // Backend server may be sleeping or offline
    }

    setLoading(false);
    setSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const cleanWA = whatsappNumber.replace(/[^0-9]/g, '');

    let detailsSummary = '';
    if (serviceType === 'Project Reports') {
      detailsSummary = `Report: ${reportDetails.reportType}\nFormat: ${reportDetails.formatStandard}\nTitle: ${reportDetails.projectTitle || 'To Be Decided'}\nPages: ${reportDetails.pageCount}\nInclusions: ${reportDetails.inclusions.join(', ')}`;
    } else if (serviceType === 'IEEE Reports') {
      detailsSummary = `Target: ${ieeeDetails.targetPublication}\nPaper Title: ${ieeeDetails.paperTitle || 'To Be Decided'}\nBase Paper: ${ieeeDetails.basePaper || 'Needed'}\nSimulation Tool: ${ieeeDetails.simulationTool}\nPlagiarism: ${ieeeDetails.plagiarismTolerance}`;
    } else if (serviceType === 'Resume Building') {
      detailsSummary = `Target Role: ${resumeDetails.targetRole}\nDegree/Batch: ${resumeDetails.degreeAndBatch || 'Fresher'}\nCore Skills: ${resumeDetails.coreSkills || 'Full Stack'}\nStyle: ${resumeDetails.resumeFormat}`;
    } else if (serviceType === 'Portfolio Development') {
      detailsSummary = `Focus: ${portfolioDetails.portfolioPersona}\nStack: ${portfolioDetails.preferredStack}\nHosting: ${portfolioDetails.deployment}\nSections: ${portfolioDetails.desiredSections.join(', ')}`;
    } else {
      detailsSummary = `Dept: ${projectDetails.branch} (${projectDetails.level})\nDomain: ${projectDetails.domain}\nTopic: ${projectDetails.topic || 'Need Topic Recommendations'}`;
    }

    const message = `*Hello Nexora Technologies!* I would like to request assistance.\n\n*Service:* ${serviceType}\n*Name:* ${formData.name || 'Student'}\n*College:* ${formData.college || 'Engineering College'}\n*Phone:* ${formData.phone || 'Direct WhatsApp'}\n*Deadline:* ${formData.deadline || 'Standard'}\n\n*Details:*\n${detailsSummary}\n\n*Requirements / Notes:* ${formData.notes || 'Looking for fast confirmation'}`;

    window.open(`https://wa.me/${cleanWA}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Service headers and badges
  const serviceMeta = {
    'Academic Projects': {
      badge: 'FAST-TRACK ACADEMIC CONSULTATION',
      title: 'Request Free Topic Synopsis & Project Quote',
      subtitle: 'Receive IEEE base papers, technical feasibility confirmation, and an instant quotation within 30 minutes.',
      btnText: 'SUBMIT FOR FREE SYNOPSIS & QUOTE',
    },
    'Project Reports': {
      badge: '01 / DOCUMENTATION & THESIS',
      title: 'Request Project Documentation & Report Quote',
      subtitle: 'Structured reports, architecture diagrams, flowcharts, results analysis, and university-compliant formatting.',
      btnText: 'SUBMIT FOR DOCUMENTATION QUOTE',
    },
    'IEEE Reports': {
      badge: '02 / RESEARCH & PUBLICATION',
      title: 'Request IEEE Research Paper & Technical Layout',
      subtitle: 'IEEE two-column formatting, literature review, simulation results validation, and Turnitin plagiarism check.',
      btnText: 'SUBMIT FOR IEEE PAPER QUOTE',
    },
    'Resume Building': {
      badge: '03 / CAREER & ATS OPTIMIZATION',
      title: 'Request ATS-Optimized Professional Resume',
      subtitle: 'ATS-tailored tech resumes designed to pass automated recruiters and land product MNC interviews.',
      btnText: 'SUBMIT FOR RESUME CONSULTATION',
    },
    'Portfolio Development': {
      badge: '04 / DIGITAL PRESENCE & SHOWCASE',
      title: 'Request Custom Developer / Scholar Portfolio',
      subtitle: 'Personal interactive website showcasing projects, live GitHub demos, skills, and personal branding.',
      btnText: 'SUBMIT FOR PORTFOLIO QUOTE',
    },
  };

  const activeMeta = serviceMeta[serviceType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/65 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 p-4 sm:p-6 shadow-2xl my-auto max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 sm:top-3.5 right-3 sm:right-3.5 p-1.5 sm:p-2 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition z-20"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div className="overflow-y-auto pr-1">
            {/* Header */}
            <div className="mb-4 pr-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-[11px] font-bold uppercase tracking-wide mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>{activeMeta.badge}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight leading-snug">
                {activeMeta.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                {activeMeta.subtitle}
              </p>
            </div>

            {/* Service Selector Tabs */}
            <div className="mb-4">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Select Service Category:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 rounded-xl bg-slate-100/90 border border-slate-200">
                {[
                  { key: 'Academic Projects', label: 'Projects', icon: Layers },
                  { key: 'Project Reports', label: 'Reports', icon: FileText },
                  { key: 'IEEE Reports', label: 'IEEE Paper', icon: ScrollText },
                  { key: 'Resume Building', label: 'Resume', icon: Briefcase },
                  { key: 'Portfolio Development', label: 'Portfolio', icon: Globe },
                ].map((s) => {
                  const SIcon = s.icon;
                  const isActive = serviceType === s.key;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setServiceType(s.key as ServiceType)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 font-extrabold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <SIcon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                      <span className="truncate">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role Switcher (Student / Scholar vs College / HOD) */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200 mb-4">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                  role === 'student'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student / Scholar</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('college')}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition ${
                  role === 'college'
                    ? 'bg-[#15803d] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>College / HOD / Faculty</span>
              </button>
            </div>

            {/* Gathering Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Row 1: Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Row 2: Email & College */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@university.edu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    College / University Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="e.g. PSG Tech / CIT / Anna Univ"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* DYNAMIC SERVICE-SPECIFIC GATHER INFORMATION SECTION */}
              
              {/* SERVICE 1: ACADEMIC PROJECTS */}
              {serviceType === 'Academic Projects' && (
                <div className="space-y-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Branch / Dept
                      </label>
                      <select
                        value={projectDetails.branch}
                        onChange={(e) => setProjectDetails({ ...projectDetails, branch: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                      >
                        <option value="CSE/IT">CSE / IT</option>
                        <option value="ECE">ECE</option>
                        <option value="EEE">EEE</option>
                        <option value="AI / DS">AI & Data Science</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Civil">Civil</option>
                        <option value="MCA/BCA">MCA / BCA</option>
                        <option value="B.Sc/M.Sc">B.Sc / M.Sc CS</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Project Level
                      </label>
                      <select
                        value={projectDetails.level}
                        onChange={(e) => setProjectDetails({ ...projectDetails, level: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                      >
                        <option value="Final Year Capstone">Final Year Capstone</option>
                        <option value="Mini Project">Mini Project</option>
                        <option value="M.Tech Thesis">M.Tech Thesis</option>
                        <option value="Ph.D Implementation">Ph.D Implementation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Submission Deadline
                      </label>
                      <input
                        type="text"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        placeholder="e.g. In 2 Weeks"
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Project Title or Topic Idea
                    </label>
                    <input
                      type="text"
                      value={projectDetails.topic}
                      onChange={(e) => setProjectDetails({ ...projectDetails, topic: e.target.value })}
                      placeholder="Enter specific topic title or leave blank for customized recommendations"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              )}

              {/* SERVICE 2: PROJECT REPORTS (01 / DOCUMENTATION) */}
              {serviceType === 'Project Reports' && (
                <div className="space-y-3 p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>Documentation & Report Specifications</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Report Type
                      </label>
                      <select
                        value={reportDetails.reportType}
                        onChange={(e) => setReportDetails({ ...reportDetails, reportType: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                      >
                        <option value="Final Year Capstone Report">Final Year Capstone Report</option>
                        <option value="Mini Project Report">Mini Project Report</option>
                        <option value="Internship / Industrial Training Report">Internship / Industrial Report</option>
                        <option value="M.Tech Thesis Book">M.Tech Thesis Book</option>
                        <option value="Lab Record & Viva Doc">Lab Record & Viva Doc</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Formatting Standard
                      </label>
                      <select
                        value={reportDetails.formatStandard}
                        onChange={(e) => setReportDetails({ ...reportDetails, formatStandard: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                      >
                        <option value="Anna University Guidelines">Anna University Regulation</option>
                        <option value="VTU / JNTU Standard">VTU / JNTU Guidelines</option>
                        <option value="IEEE Standard Format">Standard IEEE Format</option>
                        <option value="Autonomous College Guideline">Autonomous College Guideline</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Expected Page Count
                      </label>
                      <select
                        value={reportDetails.pageCount}
                        onChange={(e) => setReportDetails({ ...reportDetails, pageCount: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                      >
                        <option value="35 - 50 Pages (Compact)">35 - 50 Pages (Compact)</option>
                        <option value="60 - 90 Pages (Standard)">60 - 90 Pages (Standard)</option>
                        <option value="100+ Pages (Comprehensive / Thesis)">100+ Pages (Thesis)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Project / Thesis Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={reportDetails.projectTitle}
                        onChange={(e) => setReportDetails({ ...reportDetails, projectTitle: e.target.value })}
                        placeholder="e.g. AI-Based Real Time Defect Detection System"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Submission Deadline
                      </label>
                      <input
                        type="text"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        placeholder="e.g. Within 5 Days"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Required Diagrams & Deliverables:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'System Architecture Diagram',
                        'Data Flow / ER Diagram',
                        'Flowchart & Algorithms',
                        'Results & Graphs',
                        'Source Code Appendix',
                        'Plagiarism Check (Turnitin)',
                      ].map((item) => {
                        const checked = reportDetails.inclusions.includes(item);
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => toggleReportInclusion(item)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1 transition ${
                              checked
                                ? 'bg-purple-600 text-white border-purple-600 font-semibold'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                            }`}
                          >
                            {checked && <Check className="w-3 h-3" />}
                            <span>{item}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* SERVICE 3: IEEE REPORTS (02 / RESEARCH) */}
              {serviceType === 'IEEE Reports' && (
                <div className="space-y-3 p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                    <ScrollText className="w-4 h-4 text-indigo-600" />
                    <span>IEEE Research Paper & Publication Parameters</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Target Publication
                      </label>
                      <select
                        value={ieeeDetails.targetPublication}
                        onChange={(e) => setIeeeDetails({ ...ieeeDetails, targetPublication: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="IEEE International Conference">IEEE International Conference</option>
                        <option value="Scopus Indexed Journal">Scopus Indexed Journal</option>
                        <option value="Springer / Elsevier Journal">Springer / Elsevier</option>
                        <option value="National Conference / Symposium">National Conference / Symposium</option>
                        <option value="College Internal Review">College Internal Review</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Simulation Tool
                      </label>
                      <select
                        value={ieeeDetails.simulationTool}
                        onChange={(e) => setIeeeDetails({ ...ieeeDetails, simulationTool: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Python / PyTorch / TensorFlow">Python / PyTorch / TensorFlow</option>
                        <option value="MATLAB / Simulink">MATLAB / Simulink</option>
                        <option value="NS2 / NS3 / OMNeT++">NS2 / NS3 / OMNeT++</option>
                        <option value="Ansys / HFSS / Cadence">Ansys / HFSS / Cadence</option>
                        <option value="CloudSim / Wireshark">CloudSim / Wireshark</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Plagiarism Threshold
                      </label>
                      <select
                        value={ieeeDetails.plagiarismTolerance}
                        onChange={(e) => setIeeeDetails({ ...ieeeDetails, plagiarismTolerance: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Strict < 10% (Turnitin)">Strict &lt; 10% (Turnitin)</option>
                        <option value="Standard < 15%">Standard &lt; 15%</option>
                        <option value="Under 20% (Standard Conference)">Under 20% (Conference)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Research Paper Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={ieeeDetails.paperTitle}
                        onChange={(e) => setIeeeDetails({ ...ieeeDetails, paperTitle: e.target.value })}
                        placeholder="e.g. Deep Reinforcement Learning for Smart Grid Optimization"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Base Paper Reference (Title / DOI)
                      </label>
                      <input
                        type="text"
                        value={ieeeDetails.basePaper}
                        onChange={(e) => setIeeeDetails({ ...ieeeDetails, basePaper: e.target.value })}
                        placeholder="e.g. IEEE Transactions 2024 or Leave blank"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Paper Camera-Ready / Review Deadline
                    </label>
                    <input
                      type="text"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      placeholder="e.g. Conference deadline is Nov 15th"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* SERVICE 4: RESUME BUILDING (03 / CAREER) */}
              {serviceType === 'Resume Building' && (
                <div className="space-y-3 p-3.5 rounded-xl bg-pink-50/60 border border-pink-200/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-pink-900">
                    <Briefcase className="w-4 h-4 text-pink-600" />
                    <span>Career & ATS Resume Parameters</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Target Job Role *
                      </label>
                      <select
                        value={resumeDetails.targetRole}
                        onChange={(e) => setResumeDetails({ ...resumeDetails, targetRole: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-pink-500"
                      >
                        <option value="Full-Stack Web Developer">Full-Stack Web Developer</option>
                        <option value="AI / ML & Data Science Engineer">AI / ML Engineer</option>
                        <option value="Embedded Systems / IoT Engineer">Embedded / IoT Engineer</option>
                        <option value="Cloud / DevOps Engineer">Cloud / DevOps Engineer</option>
                        <option value="Software Engineer Fresher (General)">Software Engineer (Fresher)</option>
                        <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Degree & Batch Year
                      </label>
                      <input
                        type="text"
                        value={resumeDetails.degreeAndBatch}
                        onChange={(e) => setResumeDetails({ ...resumeDetails, degreeAndBatch: e.target.value })}
                        placeholder="e.g. B.E CSE (2026 Batch)"
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Resume Format Style
                      </label>
                      <select
                        value={resumeDetails.resumeFormat}
                        onChange={(e) => setResumeDetails({ ...resumeDetails, resumeFormat: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-pink-500"
                      >
                        <option value="1-Page Modern Tech ATS (Recommended)">1-Page Tech ATS (Recommended)</option>
                        <option value="Academic CV / Higher Education">Academic CV (Higher Studies)</option>
                        <option value="Executive 2-Page Detailed">Executive 2-Page Detailed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Core Tech Stack / Skills to Highlight *
                      </label>
                      <input
                        type="text"
                        required
                        value={resumeDetails.coreSkills}
                        onChange={(e) => setResumeDetails({ ...resumeDetails, coreSkills: e.target.value })}
                        placeholder="e.g. React, Node.js, Python, PostgreSQL, AWS"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-pink-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        LinkedIn / Existing Resume Link (Optional)
                      </label>
                      <input
                        type="text"
                        value={resumeDetails.profileLink}
                        onChange={(e) => setResumeDetails({ ...resumeDetails, profileLink: e.target.value })}
                        placeholder="e.g. linkedin.com/in/yourname"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SERVICE 5: PORTFOLIO DEVELOPMENT (04 / DIGITAL PRESENCE) */}
              {serviceType === 'Portfolio Development' && (
                <div className="space-y-3 p-3.5 rounded-xl bg-violet-50/60 border border-violet-200/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-violet-900">
                    <Globe className="w-4 h-4 text-violet-600" />
                    <span>Portfolio Website Features & Design Scope</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Portfolio Focus Persona
                      </label>
                      <select
                        value={portfolioDetails.portfolioPersona}
                        onChange={(e) => setPortfolioDetails({ ...portfolioDetails, portfolioPersona: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                      >
                        <option value="Software Engineer / Full-Stack Developer">Full-Stack Software Engineer</option>
                        <option value="AI / ML Researcher & Data Scientist">AI / ML Researcher</option>
                        <option value="UI/UX Designer & Frontend Dev">UI / UX Designer</option>
                        <option value="Hardware / Embedded Systems Specialist">Hardware / Embedded Specialist</option>
                        <option value="Academic Scholar & Educator">Academic Scholar</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Preferred Tech Stack
                      </label>
                      <select
                        value={portfolioDetails.preferredStack}
                        onChange={(e) => setPortfolioDetails({ ...portfolioDetails, preferredStack: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                      >
                        <option value="Next.js / React + Tailwind CSS">Next.js / React + Tailwind (Fast)</option>
                        <option value="Clean Modern HTML5 / CSS3 / JS">Modern HTML5 / CSS3</option>
                        <option value="Interactive 3D / Three.js / Spline">Interactive 3D / Three.js</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Hosting & Deployment
                      </label>
                      <select
                        value={portfolioDetails.deployment}
                        onChange={(e) => setPortfolioDetails({ ...portfolioDetails, deployment: e.target.value })}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                      >
                        <option value="Free Vercel / GitHub Pages Deployment">Free Vercel / GitHub Deployment</option>
                        <option value="Custom Domain (.dev / .in / .com) Setup">Custom Domain (.dev / .in) Setup</option>
                        <option value="Source Code Package Only">Source Code Only</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        GitHub Profile / Projects Link
                      </label>
                      <input
                        type="text"
                        value={portfolioDetails.githubLink}
                        onChange={(e) => setPortfolioDetails({ ...portfolioDetails, githubLink: e.target.value })}
                        placeholder="e.g. github.com/yourhandle"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Target Launch Date
                      </label>
                      <input
                        type="text"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        placeholder="e.g. Within 1 Week"
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      Desired Portfolio Sections:
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Interactive Hero',
                        'Project Case Studies',
                        'Skills Matrix',
                        'Live Demos & GitHub Links',
                        'Experience Timeline',
                        'Contact Form',
                        'Dark / Light Mode Toggle',
                      ].map((item) => {
                        const checked = portfolioDetails.desiredSections.includes(item);
                        return (
                          <button
                            type="button"
                            key={item}
                            onClick={() => togglePortfolioSection(item)}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1 transition ${
                              checked
                                ? 'bg-violet-600 text-white border-violet-600 font-semibold'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-violet-300'
                            }`}
                          >
                            {checked && <Check className="w-3 h-3" />}
                            <span>{item}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Specific Guide Requirements or Notes (Present across all forms) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Specific Guide Requirements / Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="E.g. Guide asked for PyTorch, or need hardware circuit simulation video, or specific college guidelines..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition resize-none"
                />
              </div>

              {/* Sticky Action Buttons Footer */}
              <div className="sticky -bottom-1 bg-white/95 backdrop-blur-md pt-2.5 pb-1 border-t border-slate-100 flex flex-col gap-2 z-10 -mx-1 px-1">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 sm:py-3 px-5 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs tracking-wide uppercase transition shadow-md flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>Submitting Request...</span>
                    ) : (
                      <>
                        <span>{activeMeta.btnText}</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppDirect}
                    className="py-2.5 sm:py-3 px-5 rounded-xl bg-[#25d366] hover:bg-[#20ba59] text-white font-bold text-xs transition flex items-center justify-center gap-2 shrink-0 shadow-md"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>WhatsApp Instantly</span>
                  </button>
                </div>

                {/* Trust & Privacy Notice */}
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 pb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>Your contact details and project ideas remain 100% confidential.</span>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Submission Receipt / Confirmation View */
          <div className="text-center py-6 sm:py-8 space-y-4 overflow-y-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                INQUIRY REGISTERED SUCCESSFULLY
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#111827] mt-2">
                Consultation Request Received!
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-slate-900">{formData.name}</strong>. Our technical team has received your information for <strong className="text-slate-900">{formData.college}</strong>.
              </p>
            </div>

            {/* Collected Information Summary Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2 text-slate-700 shadow-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 font-bold text-slate-900">
                <span>Service Requested:</span>
                <span className="text-sky-700">{serviceType}</span>
              </div>
              <div><strong>Name:</strong> {formData.name} ({formData.phone})</div>
              <div><strong>College:</strong> {formData.college}</div>
              {formData.deadline && <div><strong>Target Deadline:</strong> {formData.deadline}</div>}
              <div><strong>Response ETA:</strong> Within 15 - 30 Minutes</div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
              <button
                onClick={handleWhatsAppDirect}
                className="flex-1 py-3 px-5 rounded-xl bg-[#25d366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Connect via WhatsApp Now</span>
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="py-3 px-5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
              >
                Back to Website
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

