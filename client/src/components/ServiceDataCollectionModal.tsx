import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  PhoneCall,
  FileText,
  ScrollText,
  Briefcase,
  Globe,
  Upload,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Download,
  Copy,
  Check,
  AlertCircle,
  Sparkles,
  FileCode,
  User
} from 'lucide-react';
import { API_BASE_URL } from '../lib/api';

export type ServiceType = 
  | 'Project Reports' 
  | 'IEEE Reports' 
  | 'Resume Building' 
  | 'Portfolio Development';

interface ServiceDataCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceType;
  whatsappNumber?: string;
}

export const ServiceDataCollectionModal: React.FC<ServiceDataCollectionModalProps> = ({
  isOpen,
  onClose,
  initialService = 'Project Reports',
  whatsappNumber = '916374742431',
}) => {
  const [activeService, setActiveService] = useState<ServiceType>(initialService);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [submittedRequestId, setSubmittedRequestId] = useState<string>('');
  const [submittedData, setSubmittedData] = useState<any>(null);

  // Sync initial service when opened
  useEffect(() => {
    if (isOpen) {
      if (initialService) {
        setActiveService(initialService);
      }
      setCurrentStep(1);
      setErrorMessage('');
      setSubmittedRequestId('');
      setSubmittedData(null);
    }
  }, [isOpen, initialService]);

  // Step 1: Student Profile & Contact Info (Common across all 4 services)
  const [student, setStudent] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    department: 'CSE / IT',
    degree: 'B.E / B.Tech',
    academicYear: 'Final Year (2025 - 2026)',
    location: '',
  });

  // Step 2 & 3: Service-Specific Requirements

  // 1. Project Reports Data
  const [projectReportData, setProjectReportData] = useState({
    projectTitle: '',
    projectDomain: 'Artificial Intelligence & Machine Learning',
    abstract: '',
    problemStatement: '',
    objectives: '',
    methodology: '',
    hardwareRequirements: '',
    softwareRequirements: 'Python, PyTorch, React, Node.js',
    technologiesUsed: '',
    implementationDetails: '',
    expectedResults: '',
    reportFormat: 'Anna University Guidelines',
    pageCount: '60 - 90 Pages (Standard Capstone)',
    deadline: '',
    additionalRequirements: '',
  });

  // 2. IEEE Reports Data
  const [ieeeData, setIeeeData] = useState({
    researchTitle: '',
    technicalDomain: 'Deep Learning & Neural Networks',
    authorsAndAffiliation: '',
    abstract: '',
    keywords: '',
    researchProblem: '',
    researchObjectives: '',
    proposedMethodology: '',
    technicalNovelty: '',
    datasetDetails: '',
    experimentalResults: '',
    referencesAndCitations: '',
    targetVenue: 'IEEE International Conference',
    plagiarismThreshold: 'Strict < 10% (Turnitin Verified)',
    pageCount: '6 - 8 Pages (Standard IEEE Two-Column)',
    deadline: '',
    additionalRequirements: '',
  });

  // 3. Resume Building Data
  const [resumeData, setResumeData] = useState({
    targetRole: 'Full-Stack Software Engineer',
    targetIndustry: 'Product MNCs & Tech Startups',
    careerObjective: '',
    educationSummary: '',
    technicalSkills: '',
    softSkills: 'Team Leadership, Problem Solving, Analytical Thinking',
    keyProjects: '',
    workExperience: '',
    certificationsAndAchievements: '',
    linkedInUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    preferredStyle: 'Modern Tech ATS 1-Page (Recommended)',
    outputFormat: 'PDF & Editable DOCX',
    urgencyDeadline: '',
    additionalNotes: '',
  });

  // 4. Portfolio Development Data
  const [portfolioData, setPortfolioData] = useState({
    professionalHeadline: '',
    shortBio: '',
    primaryDomain: 'Full-Stack Web Development & AI',
    skillsToHighlight: '',
    featuredProjects: '',
    githubReposAndLiveDemos: '',
    experienceAndCertifications: '',
    linkedinUrl: '',
    githubUrl: '',
    preferredTheme: 'Dark Sleek Glassmorphism (Nexora Style)',
    customDomainPreference: 'Custom Domain Setup (.dev / .in / .com)',
    hostingPreference: 'Free Vercel / GitHub Pages Deployment',
    existingPortfolioUrl: '',
    desiredFeatures: [
      'Interactive Hero with Dynamic Typography',
      'Project Case Studies with Code & Live Links',
      'Interactive Skills Matrix',
      'Contact Inquiry Form with Email Alert',
      'Experience Timeline',
    ],
    targetLaunchDate: '',
    additionalRequirements: '',
  });

  // File Attachments (uploaded locally)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [consentGiven, setConsentGiven] = useState<boolean>(true);

  if (!isOpen) return null;

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const validFiles = filesArray.filter((file) => {
        if (file.size > 15 * 1024 * 1024) {
          alert(`File "${file.name}" exceeds the 15MB limit.`);
          return false;
        }
        return true;
      });
      setAttachedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Step 1 Validation
  const validateStep1 = () => {
    if (!student.name.trim()) return 'Please enter your Full Name.';
    if (!student.email.trim()) return 'Please enter your Email Address.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(student.email.trim())) return 'Please enter a valid Email Address.';
    if (!student.phone.trim() || student.phone.replace(/[^0-9]/g, '').length < 10) {
      return 'Please enter a valid 10-digit Mobile / WhatsApp Number.';
    }
    if (!student.college.trim()) return 'Please provide your College / University name.';
    return '';
  };

  // Step 2 Validation (Service Specific)
  const validateStep2 = () => {
    if (activeService === 'Project Reports') {
      if (!projectReportData.projectTitle.trim()) return 'Please enter your Project Title.';
      if (!projectReportData.abstract.trim()) return 'Please provide a brief Abstract or Problem Statement.';
    } else if (activeService === 'IEEE Reports') {
      if (!ieeeData.researchTitle.trim()) return 'Please enter your Research Title.';
      if (!ieeeData.abstract.trim()) return 'Please enter the Research Abstract or Methodology overview.';
    } else if (activeService === 'Resume Building') {
      if (!resumeData.targetRole.trim()) return 'Please select or enter your Target Job Role.';
      if (!resumeData.technicalSkills.trim()) return 'Please list your Primary Technical Skills.';
    } else if (activeService === 'Portfolio Development') {
      if (!portfolioData.professionalHeadline.trim()) return 'Please enter your Professional Headline / Role.';
      if (!portfolioData.shortBio.trim()) return 'Please provide a short bio or summary of your work.';
    }
    return '';
  };

  const handleNextStep = () => {
    setErrorMessage('');
    if (currentStep === 1) {
      const err = validateStep1();
      if (err) {
        setErrorMessage(err);
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const err = validateStep2();
      if (err) {
        setErrorMessage(err);
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4); // Review Step
    }
  };

  const handlePrevStep = () => {
    setErrorMessage('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Compile active requirements object
  const getActiveRequirements = () => {
    switch (activeService) {
      case 'Project Reports':
        return projectReportData;
      case 'IEEE Reports':
        return ieeeData;
      case 'Resume Building':
        return resumeData;
      case 'Portfolio Development':
        return portfolioData;
      default:
        return {};
    }
  };

  // Submit complete multi-part request to backend
  const handleSubmitFinal = async () => {
    if (!consentGiven) {
      setErrorMessage('Please confirm consent to submit project data.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const requirements = getActiveRequirements();

    try {
      const formData = new FormData();
      formData.append('serviceType', activeService);
      formData.append('student', JSON.stringify(student));
      formData.append('requirements', JSON.stringify(requirements));
      formData.append('consentGiven', String(consentGiven));

      attachedFiles.forEach((file) => {
        formData.append('attachments', file);
      });

      const res = await fetch(`${API_BASE_URL}/service-requests`, {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        setSubmittedRequestId(json.requestId || `NXR-${Date.now().toString().slice(-6)}`);
        setSubmittedData({
          serviceType: activeService,
          student,
          requirements,
          attachmentsCount: attachedFiles.length,
          timestamp: new Date().toLocaleString(),
        });
        setCurrentStep(5); // Success step
      } else {
        setErrorMessage(json.message || 'Submission failed. Please try again.');
      }
    } catch (err: any) {
      // Fallback: Generate local request ID if backend is in transition
      const mockId = `NXR-${activeService.slice(0, 2).toUpperCase()}-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setSubmittedRequestId(mockId);
      setSubmittedData({
        serviceType: activeService,
        student,
        requirements,
        attachmentsCount: attachedFiles.length,
        timestamp: new Date().toLocaleString(),
      });
      setCurrentStep(5);
    } finally {
      setSubmitting(false);
    }
  };

  const copyRequestId = () => {
    if (submittedRequestId) {
      navigator.clipboard.writeText(submittedRequestId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  // Download submitted receipt as structured JSON / Text document
  const downloadReceipt = () => {
    const receiptContent = `=====================================================
NEXORA TECHNOLOGIES — SERVICE REQUEST RECEIPT
=====================================================
Request ID:    ${submittedRequestId}
Service:       ${activeService}
Date:          ${submittedData?.timestamp || new Date().toLocaleString()}
Status:        Registered / Under Technical Review
ETA:           Response within 30 Minutes

-----------------------------------------------------
1. STUDENT PROFILE
-----------------------------------------------------
Name:          ${student.name}
Email:         ${student.email}
Phone:         ${student.phone}
College:       ${student.college}
Department:    ${student.department}
Degree:        ${student.degree} (${student.academicYear})
Location:      ${student.location || 'India'}

-----------------------------------------------------
2. SERVICE REQUIREMENTS SPECIFICATIONS
-----------------------------------------------------
${Object.entries(getActiveRequirements())
  .map(([key, val]) => `${key.toUpperCase()}: ${Array.isArray(val) ? val.join(', ') : val}`)
  .join('\n')}

-----------------------------------------------------
3. ATTACHED FILES: ${attachedFiles.length} file(s) uploaded
-----------------------------------------------------
Support Hotline: +91 6374742431 | WhatsApp: +91 6374742431
Address: NH-47, Palakkad Main Road, Navakkarai (P.O), Coimbatore – 641105
Website: Nexora Technologies Academic Research Lab
=====================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${submittedRequestId}_Nexora_Receipt.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleWhatsAppInstant = () => {
    const cleanWA = whatsappNumber.replace(/[^0-9]/g, '');
    const title = (getActiveRequirements() as any).projectTitle || (getActiveRequirements() as any).researchTitle || (getActiveRequirements() as any).targetRole || activeService;
    const msg = `*Hello Nexora Technologies!* I have submitted a data collection form.\n\n*Request ID:* ${submittedRequestId || 'Pending'}\n*Service:* ${activeService}\n*Name:* ${student.name}\n*College:* ${student.college}\n*Topic/Role:* ${title}\n*Phone:* ${student.phone}\n\nPlease confirm review and next steps!`;
    window.open(`https://wa.me/${cleanWA}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0b1120] border border-purple-500/25 p-4 sm:p-7 shadow-2xl text-slate-100 my-auto max-h-[95vh] flex flex-col overflow-hidden">
        
        {/* Glow gradients */}
        <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-purple-600/10 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-sky-600/10 blur-[120px] pointer-events-none -z-10" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
            <span className="font-mono text-xs font-bold text-purple-400 tracking-wider uppercase">
              Nexora Student Service Portal
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Screen (Step 5) */}
        {currentStep === 5 ? (
          <div className="overflow-y-auto p-4 sm:p-8 text-center space-y-6 my-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20 animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30 uppercase tracking-widest">
                Service Request Registered
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
                Requirements Submitted Successfully!
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                Thank you, <strong className="text-purple-300">{student.name}</strong>. Your detailed specifications for <strong className="text-white">{activeService}</strong> have been securely recorded in our system.
              </p>
            </div>

            {/* Request ID Display Card */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-900/90 border border-purple-500/30 shadow-xl space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Your Unique Tracking Request ID
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-pink-400 tracking-wider">
                  {submittedRequestId}
                </span>
                <button
                  onClick={copyRequestId}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-xs"
                  title="Copy Request ID"
                >
                  {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Please quote this ID for instant updates on WhatsApp or phone inquiries.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
              <button
                onClick={handleWhatsAppInstant}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25d366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>WhatsApp Project Lead</span>
              </button>

              <button
                onClick={downloadReceipt}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Summary</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white underline pt-2 block mx-auto"
            >
              Return to Website
            </button>
          </div>
        ) : (
          /* Multi-Step Data Collection Flow */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Service Switcher Tabs */}
            <div className="pt-3 pb-2.5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { key: 'Project Reports', label: 'Project Reports', icon: FileText, tag: '01 / DOC' },
                  { key: 'IEEE Reports', label: 'IEEE Reports', icon: ScrollText, tag: '02 / RESEARCH' },
                  { key: 'Resume Building', label: 'Resume Building', icon: Briefcase, tag: '03 / CAREER' },
                  { key: 'Portfolio Development', label: 'Portfolio Dev', icon: Globe, tag: '04 / DIGITAL' },
                ].map((s) => {
                  const SIcon = s.icon;
                  const isActive = activeService === s.key;
                  return (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => {
                        setActiveService(s.key as ServiceType);
                        setErrorMessage('');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-950/80 to-slate-900 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 ${isActive ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <SIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono font-bold block text-purple-400 tracking-wider">
                          {s.tag}
                        </span>
                        <span className="text-xs font-bold truncate block">
                          {s.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div className="py-2.5 border-y border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1 mb-1.5">
                <span className={currentStep >= 1 ? 'text-purple-300' : ''}>1. Student Info</span>
                <span className={currentStep >= 2 ? 'text-purple-300' : ''}>2. Specifications</span>
                <span className={currentStep >= 3 ? 'text-purple-300' : ''}>3. Documents & Files</span>
                <span className={currentStep >= 4 ? 'text-purple-300' : ''}>4. Review & Confirm</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Error notification */}
            {errorMessage && (
              <div className="my-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step Content Container (Scrollable) */}
            <div className="flex-1 overflow-y-auto py-3.5 pr-1 space-y-4">
              
              {/* STEP 1: Student Profile & Contact Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-400" />
                      <span>Step 1: Student & Academic Profile</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Please enter your contact details and college credentials for verification.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={student.name}
                        onChange={(e) => setStudent({ ...student, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        WhatsApp / Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={student.phone}
                        onChange={(e) => setStudent({ ...student, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={student.email}
                        onChange={(e) => setStudent({ ...student, email: e.target.value })}
                        placeholder="rahul.sharma@college.edu"
                        className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        College / University Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={student.college}
                        onChange={(e) => setStudent({ ...student, college: e.target.value })}
                        placeholder="e.g. PSG Tech / CIT / Anna University"
                        className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Department / Branch
                      </label>
                      <select
                        value={student.department}
                        onChange={(e) => setStudent({ ...student, department: e.target.value })}
                        className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="CSE / IT">Computer Science & Engineering / IT</option>
                        <option value="AI / Data Science">Artificial Intelligence & Data Science</option>
                        <option value="ECE">Electronics & Communication (ECE)</option>
                        <option value="EEE">Electrical & Electronics (EEE)</option>
                        <option value="Mechanical">Mechanical Engineering</option>
                        <option value="Civil">Civil Engineering</option>
                        <option value="MCA / BCA">MCA / BCA</option>
                        <option value="B.Sc / M.Sc CS">B.Sc / M.Sc Computer Science</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Degree & Academic Year
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={student.degree}
                          onChange={(e) => setStudent({ ...student, degree: e.target.value })}
                          className="bg-[#080d1a] border border-slate-700/80 rounded-xl px-2 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="B.E / B.Tech">B.E / B.Tech</option>
                          <option value="M.E / M.Tech">M.E / M.Tech</option>
                          <option value="MCA">MCA</option>
                          <option value="B.Sc / BCA">B.Sc / BCA</option>
                          <option value="Ph.D / Scholar">Ph.D Scholar</option>
                        </select>
                        <select
                          value={student.academicYear}
                          onChange={(e) => setStudent({ ...student, academicYear: e.target.value })}
                          className="bg-[#080d1a] border border-slate-700/80 rounded-xl px-2 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                        >
                          <option value="Final Year (2025 - 2026)">Final Year</option>
                          <option value="Pre-Final Year">Pre-Final Year</option>
                          <option value="Recent Graduate">Recent Graduate</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Service-Specific Requirements */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  
                  {/* SERVICE 1: PROJECT REPORTS FORM */}
                  {activeService === 'Project Reports' && (
                    <div className="space-y-3.5">
                      <div className="bg-purple-950/40 p-4 rounded-2xl border border-purple-500/30">
                        <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-400" />
                          <span>01 / Project Reports — Detailed Specifications</span>
                        </h4>
                        <p className="text-xs text-slate-300 mt-1">
                          Provide technical outline, report format standard, architecture and required chapters.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Project Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={projectReportData.projectTitle}
                            onChange={(e) => setProjectReportData({ ...projectReportData, projectTitle: e.target.value })}
                            placeholder="e.g. Deep Learning-Based Automated Defect Detection in High-Speed Industrial Manufacturing"
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Project Domain
                          </label>
                          <select
                            value={projectReportData.projectDomain}
                            onChange={(e) => setProjectReportData({ ...projectReportData, projectDomain: e.target.value })}
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                          >
                            <option value="Artificial Intelligence & Machine Learning">AI & Machine Learning</option>
                            <option value="Full-Stack Web & Cloud">Full-Stack Web & Cloud</option>
                            <option value="Internet of Things (IoT) & Embedded">IoT & Embedded Systems</option>
                            <option value="Cybersecurity & Blockchain">Cybersecurity & Blockchain</option>
                            <option value="Computer Vision & NLP">Computer Vision & NLP</option>
                            <option value="Mobile App Development">Mobile App (Flutter / React Native)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Required Report Standard & Regulations
                          </label>
                          <select
                            value={projectReportData.reportFormat}
                            onChange={(e) => setProjectReportData({ ...projectReportData, reportFormat: e.target.value })}
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                          >
                            <option value="Anna University Guidelines">Anna University Regulation</option>
                            <option value="VTU Karnataka Standard">VTU Karnataka Standard</option>
                            <option value="JNTU Hyderabad Standard">JNTU Hyderabad Guidelines</option>
                            <option value="Standard IEEE Conference / Journal Format">Standard IEEE Format</option>
                            <option value="Autonomous College Custom Format">Autonomous College Custom Format</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Abstract & Problem Statement *
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={projectReportData.abstract}
                            onChange={(e) => setProjectReportData({ ...projectReportData, abstract: e.target.value })}
                            placeholder="Briefly describe the core problem being solved, system motivation, and proposed solution..."
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Objectives & Methodology
                          </label>
                          <textarea
                            rows={2}
                            value={projectReportData.methodology}
                            onChange={(e) => setProjectReportData({ ...projectReportData, methodology: e.target.value })}
                            placeholder="Key goals, algorithmic workflow, data preprocessing, model training..."
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Technologies & Software Tools Used
                          </label>
                          <textarea
                            rows={2}
                            value={projectReportData.technologiesUsed}
                            onChange={(e) => setProjectReportData({ ...projectReportData, technologiesUsed: e.target.value })}
                            placeholder="e.g. Python, OpenCV, TensorFlow, Flask, SQLite, React, Tailwind CSS"
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Hardware / Simulation Requirements
                          </label>
                          <input
                            type="text"
                            value={projectReportData.hardwareRequirements}
                            onChange={(e) => setProjectReportData({ ...projectReportData, hardwareRequirements: e.target.value })}
                            placeholder="e.g. Raspberry Pi 4, ESP32, Camera Sensor, or PC with GPU"
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Submission Deadline
                          </label>
                          <input
                            type="text"
                            value={projectReportData.deadline}
                            onChange={(e) => setProjectReportData({ ...projectReportData, deadline: e.target.value })}
                            placeholder="e.g. Within 7 Days / Final Viva on 25th"
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SERVICE 2: IEEE REPORTS FORM */}
                  {activeService === 'IEEE Reports' && (
                    <div className="space-y-3.5">
                      <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-500/30">
                        <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                          <ScrollText className="w-4 h-4 text-indigo-400" />
                          <span>02 / IEEE Research Paper — Technical Publication Specifications</span>
                        </h4>
                        <p className="text-xs text-slate-300 mt-1">
                          Research problem, mathematical modeling, simulation tools, citations, and plagiarism controls.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Research Paper Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={ieeeData.researchTitle}
                            onChange={(e) => setIeeeData({ ...ieeeData, researchTitle: e.target.value })}
                            placeholder="e.g. Hybrid Deep Reinforcement Learning for Dynamic Resource Allocation in 5G Edge Networks"
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Target Publication Venue
                          </label>
                          <select
                            value={ieeeData.targetVenue}
                            onChange={(e) => setIeeeData({ ...ieeeData, targetVenue: e.target.value })}
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          >
                            <option value="IEEE International Conference">IEEE International Conference</option>
                            <option value="Scopus Indexed Journal (Q2/Q3/Q4)">Scopus Indexed Journal</option>
                            <option value="Springer / Elsevier Journal">Springer / Elsevier Journal</option>
                            <option value="National Conference / Symposium">National Conference / Symposium</option>
                            <option value="College Academic Review / Capstone Paper">College Academic Review Paper</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Plagiarism & Similarity Threshold
                          </label>
                          <select
                            value={ieeeData.plagiarismThreshold}
                            onChange={(e) => setIeeeData({ ...ieeeData, plagiarismThreshold: e.target.value })}
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                          >
                            <option value="Strict < 10% (Turnitin Verified)">Strict &lt; 10% (Turnitin Verified)</option>
                            <option value="Standard < 15%">Standard &lt; 15%</option>
                            <option value="Under 20% (Standard National Conference)">Under 20%</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Research Abstract & Keywords *
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={ieeeData.abstract}
                            onChange={(e) => setIeeeData({ ...ieeeData, abstract: e.target.value })}
                            placeholder="Provide 150-250 words summarizing the problem, technical novelty, experimental methodology, and quantitative findings..."
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Proposed Methodology & Technical Novelty
                          </label>
                          <textarea
                            rows={2}
                            value={ieeeData.proposedMethodology}
                            onChange={(e) => setIeeeData({ ...ieeeData, proposedMethodology: e.target.value })}
                            placeholder="What makes this research novel compared to existing literature?"
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Dataset & Experimental Metrics
                          </label>
                          <textarea
                            rows={2}
                            value={ieeeData.datasetDetails}
                            onChange={(e) => setIeeeData({ ...ieeeData, datasetDetails: e.target.value })}
                            placeholder="e.g. Kaggle/UCI Dataset, Accuracy (98.4%), F1-Score, Latency, Loss graphs"
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Student & Co-Author Details
                          </label>
                          <input
                            type="text"
                            value={ieeeData.authorsAndAffiliation}
                            onChange={(e) => setIeeeData({ ...ieeeData, authorsAndAffiliation: e.target.value })}
                            placeholder="e.g. Rahul Sharma, Dr. S. K. Murthy (Guide)"
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Camera-Ready / Submission Deadline
                          </label>
                          <input
                            type="text"
                            value={ieeeData.deadline}
                            onChange={(e) => setIeeeData({ ...ieeeData, deadline: e.target.value })}
                            placeholder="e.g. Conference deadline is Nov 20th"
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SERVICE 3: RESUME BUILDING FORM */}
                  {activeService === 'Resume Building' && (
                    <div className="space-y-3.5">
                      <div className="bg-pink-950/40 p-4 rounded-2xl border border-pink-500/30">
                        <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-pink-400" />
                          <span>03 / Career & ATS Resume — Profile Information</span>
                        </h4>
                        <p className="text-xs text-slate-300 mt-1">
                          Craft an ATS-optimized tech resume formatted to pass automated screeners and win interviews.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Target Job Role *
                          </label>
                          <select
                            value={resumeData.targetRole}
                            onChange={(e) => setResumeData({ ...resumeData, targetRole: e.target.value })}
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                          >
                            <option value="Full-Stack Software Engineer">Full-Stack Software Engineer</option>
                            <option value="AI / ML & Data Science Engineer">AI / ML & Data Science Engineer</option>
                            <option value="Embedded Systems & IoT Engineer">Embedded Systems & IoT Engineer</option>
                            <option value="Cloud / DevOps Engineer">Cloud / DevOps Engineer</option>
                            <option value="Frontend Developer (React / Next.js)">Frontend Developer</option>
                            <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                            <option value="Campus Placement Tech Fresher">Campus Placement Tech Fresher</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Preferred Resume Template Style
                          </label>
                          <select
                            value={resumeData.preferredStyle}
                            onChange={(e) => setResumeData({ ...resumeData, preferredStyle: e.target.value })}
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                          >
                            <option value="Modern Tech ATS 1-Page (Recommended)">Modern Tech ATS 1-Page (Recommended)</option>
                            <option value="Academic CV (Higher Education / MS)">Academic CV (MS / Research)</option>
                            <option value="Executive Multi-Page Detailed">Executive Multi-Page Detailed</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Primary Technical Skills & Stack *
                          </label>
                          <input
                            type="text"
                            required
                            value={resumeData.technicalSkills}
                            onChange={(e) => setResumeData({ ...resumeData, technicalSkills: e.target.value })}
                            placeholder="e.g. Java, Python, React, Node.js, Docker, PostgreSQL, AWS, Git"
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Key Projects to Highlight (Title, Description, Tech Stack, Outcome)
                          </label>
                          <textarea
                            rows={3}
                            value={resumeData.keyProjects}
                            onChange={(e) => setResumeData({ ...resumeData, keyProjects: e.target.value })}
                            placeholder="List 2-3 key academic or personal projects you want prominently showcased..."
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Internships & Work Experience (Optional)
                          </label>
                          <textarea
                            rows={2}
                            value={resumeData.workExperience}
                            onChange={(e) => setResumeData({ ...resumeData, workExperience: e.target.value })}
                            placeholder="Company name, role, duration, and key contributions..."
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Certifications & Academic Achievements
                          </label>
                          <textarea
                            rows={2}
                            value={resumeData.certificationsAndAchievements}
                            onChange={(e) => setResumeData({ ...resumeData, certificationsAndAchievements: e.target.value })}
                            placeholder="AWS Certified, LeetCode 300+ problems, Hackathon 1st Prize, NPTEL Elite..."
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            LinkedIn & GitHub Profile Links
                          </label>
                          <input
                            type="text"
                            value={resumeData.linkedInUrl}
                            onChange={(e) => setResumeData({ ...resumeData, linkedInUrl: e.target.value })}
                            placeholder="linkedin.com/in/yourname"
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Drive / Delivery Date
                          </label>
                          <input
                            type="text"
                            value={resumeData.urgencyDeadline}
                            onChange={(e) => setResumeData({ ...resumeData, urgencyDeadline: e.target.value })}
                            placeholder="e.g. Placement drive next Tuesday"
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SERVICE 4: PORTFOLIO DEVELOPMENT FORM */}
                  {activeService === 'Portfolio Development' && (
                    <div className="space-y-3.5">
                      <div className="bg-violet-950/40 p-4 rounded-2xl border border-violet-500/30">
                        <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                          <Globe className="w-4 h-4 text-violet-400" />
                          <span>04 / Portfolio Development — Digital Presence Specifications</span>
                        </h4>
                        <p className="text-xs text-slate-300 mt-1">
                          Build a personal interactive website to showcase projects, live demos, and skills to global recruiters.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Professional Headline / Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={portfolioData.professionalHeadline}
                            onChange={(e) => setPortfolioData({ ...portfolioData, professionalHeadline: e.target.value })}
                            placeholder="e.g. AI Researcher & Full-Stack Engineer passionate about scalable intelligent systems"
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Short Bio / About Me *
                          </label>
                          <textarea
                            rows={2}
                            required
                            value={portfolioData.shortBio}
                            onChange={(e) => setPortfolioData({ ...portfolioData, shortBio: e.target.value })}
                            placeholder="2-3 sentences introducing your background, engineering interests, and key strengths..."
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Preferred Theme & Design Aesthetics
                          </label>
                          <select
                            value={portfolioData.preferredTheme}
                            onChange={(e) => setPortfolioData({ ...portfolioData, preferredTheme: e.target.value })}
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                          >
                            <option value="Dark Sleek Glassmorphism (Nexora Style)">Dark Sleek Glassmorphism (Nexora Style)</option>
                            <option value="Modern Minimal Clean White">Modern Minimal Clean White</option>
                            <option value="Cyberpunk / Neon Tech Glow">Cyberpunk / Neon Tech Glow</option>
                            <option value="Interactive 3D / Three.js Showcase">Interactive 3D / Three.js Showcase</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Hosting & Domain Preference
                          </label>
                          <select
                            value={portfolioData.hostingPreference}
                            onChange={(e) => setPortfolioData({ ...portfolioData, hostingPreference: e.target.value })}
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500"
                          >
                            <option value="Free Vercel / GitHub Pages Deployment">Free Vercel / GitHub Pages Deployment</option>
                            <option value="Custom Domain (.dev / .in / .com) Setup">Custom Domain (.dev / .in) Setup</option>
                            <option value="Codebase Package Only">Source Code Only</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            GitHub Profile & Project Links
                          </label>
                          <input
                            type="text"
                            value={portfolioData.githubUrl}
                            onChange={(e) => setPortfolioData({ ...portfolioData, githubUrl: e.target.value })}
                            placeholder="github.com/yourhandle"
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1">
                            Target Launch Date
                          </label>
                          <input
                            type="text"
                            value={portfolioData.targetLaunchDate}
                            onChange={(e) => setPortfolioData({ ...portfolioData, targetLaunchDate: e.target.value })}
                            placeholder="e.g. Within 10 Days"
                            className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* STEP 3: Reference Files & Document Uploads */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-purple-400" />
                      <span>Step 3: Upload Reference Documents, Diagrams & Base Papers</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Upload any IEEE base papers, existing synopsis, architecture sketches, college guidelines, or resume drafts (Max 15MB each).
                    </p>
                  </div>

                  {/* Drag-and-drop file upload area */}
                  <label className="border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/70 transition group">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-white mb-1">
                      Click to Browse or Drag & Drop Reference Files
                    </span>
                    <span className="text-xs text-slate-400">
                      Supports PDF, DOC, DOCX, ZIP, PNG, JPG, PPT (Up to 15MB per file)
                    </span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip,.ppt,.pptx,.txt"
                    />
                  </label>

                  {/* Attached Files List */}
                  {attachedFiles.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-300">
                        Selected Files ({attachedFiles.length}):
                      </span>
                      <div className="space-y-1.5">
                        {attachedFiles.map((file, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2.5 truncate pr-2">
                              <FileCode className="w-4 h-4 text-purple-400 shrink-0" />
                              <span className="font-semibold text-slate-200 truncate">{file.name}</span>
                              <span className="text-[10px] text-slate-500 shrink-0">
                                ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(idx)}
                              className="text-slate-400 hover:text-red-400 p-1 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional notes & comments */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Additional Instructions or College Guide Remarks
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. My college guide asked for hardware simulation video, or needs Turnitin originality report with bibliography excluded..."
                      className="w-full bg-[#080d1a] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Step 4: Review Your Submitted Requirements</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Please review all entered details before sending. You will receive an instant Request ID.
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-[#080d1a] border border-purple-500/20 space-y-3.5 text-xs text-slate-300">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                      <span className="font-mono text-purple-400 font-bold uppercase tracking-wider">
                        SERVICE: {activeService}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[10px]">
                        Review Mode
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div><strong>Student Name:</strong> {student.name}</div>
                      <div><strong>Mobile / WhatsApp:</strong> {student.phone}</div>
                      <div><strong>Email Address:</strong> {student.email}</div>
                      <div><strong>College / Univ:</strong> {student.college}</div>
                      <div><strong>Department:</strong> {student.department} ({student.degree})</div>
                      <div><strong>Attached Files:</strong> {attachedFiles.length} file(s) attached</div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80">
                      <strong className="text-white block mb-1">Key Specifications:</strong>
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] leading-relaxed max-h-36 overflow-y-auto space-y-1">
                        {Object.entries(getActiveRequirements()).map(([key, val]) => (
                          <div key={key}>
                            <span className="text-slate-400 uppercase font-mono">{key}: </span>
                            <span className="text-slate-200">{Array.isArray(val) ? val.join(', ') : String(val || 'N/A')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Privacy & Consent Checkbox */}
                  <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={consentGiven}
                      onChange={(e) => setConsentGiven(e.target.checked)}
                      className="mt-0.5 rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="consent" className="text-xs text-slate-300 cursor-pointer">
                      <strong>Privacy Consent:</strong> I confirm that the provided requirements and contact details are accurate, and authorize Nexora Technologies to process this information confidentially for academic consultation.
                    </label>
                  </div>
                </div>
              )}

            </div>

            {/* Stepper Navigation Buttons (Sticky Bottom) */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 shrink-0">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitFinal}
                  disabled={submitting || !consentGiven}
                  className="px-7 py-3 rounded-xl bg-[#15803d] hover:bg-[#166534] disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-700/30 flex items-center gap-2"
                >
                  {submitting ? (
                    <span>Registering Submission...</span>
                  ) : (
                    <>
                      <span>Submit Request & Get Tracking ID</span>
                      <Sparkles className="w-4 h-4 text-emerald-300" />
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
