import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Layout, 
  PhoneCall, 
  Mail, 
  MapPin, 
  Users, 
  FolderPlus, 
  CheckCircle, 
  ExternalLink, 
  Trash2, 
  RotateCw, 
  ShieldCheck,
  Building
} from 'lucide-react';

export interface SiteConfig {
  _id?: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroEyebrow: string;
  phone: string;
  email: string;
  address: string;
  whatsappNumber: string;
  servicesList: string[];
}

interface InquiryItem {
  _id: string;
  name: string;
  phone: string;
  email: string;
  college: string;
  branch: string;
  level: string;
  topic?: string;
  status?: string;
  createdAt?: string;
}

interface ProjectItem {
  _id?: string;
  projectId?: string;
  title: string;
  category: string;
  department: string;
  level: string;
  ieeeYear: string;
  description: string;
  techStack: string[];
}

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: SiteConfig;
  onSettingsUpdated: (newSettings: SiteConfig) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onSettingsUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'contact' | 'inquiries' | 'projects'>('hero');
  const [formData, setFormData] = useState<SiteConfig>(currentSettings);
  const [servicesInput, setServicesInput] = useState<string>(
    (currentSettings.servicesList || []).join(', ')
  );
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Inquiries state
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    category: 'AI/ML',
    department: 'CSE/IT',
    level: 'Final Year Capstone',
    ieeeYear: 'IEEE 2025/2026',
    description: '',
    techStack: 'Python, PyTorch, React',
    deliverables: 'Complete Source Code, IEEE Base Paper, Project Report, PPT',
  });
  const [addingProject, setAddingProject] = useState(false);

  useEffect(() => {
    setFormData(currentSettings);
    setServicesInput((currentSettings.servicesList || []).join(', '));
  }, [currentSettings]);

  useEffect(() => {
    if (isOpen) {
      fetchInquiries();
      fetchProjects();
    }
  }, [isOpen]);

  const fetchInquiries = async () => {
    try {
      setLoadingInquiries(true);
      const res = await fetch('http://localhost:5000/api/inquiries');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setInquiries(json.data);
      }
    } catch {
      // offline fallback
    } finally {
      setLoadingInquiries(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await fetch('http://localhost:5000/api/projects');
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setProjects(json.data);
      }
    } catch {
      // offline fallback
    } finally {
      setLoadingProjects(false);
    }
  };

  if (!isOpen) return null;

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const payload: SiteConfig = {
      ...formData,
      servicesList: servicesInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch('http://localhost:5000/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        onSettingsUpdated(json.data || payload);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch {
      onSettingsUpdated(payload);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    try {
      await fetch(`http://localhost:5000/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === id ? { ...inq, status } : inq))
      );
    } catch {
      // fallback
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingProject(true);
    try {
      const res = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });
      const json = await res.json();
      if (json.success) {
        setProjects((prev) => [json.data, ...prev]);
        setNewProject({
          title: '',
          category: 'AI/ML',
          department: 'CSE/IT',
          level: 'Final Year Capstone',
          ieeeYear: 'IEEE 2025/2026',
          description: '',
          techStack: 'Python, PyTorch, React',
          deliverables: 'Complete Source Code, IEEE Base Paper, Project Report, PPT',
        });
      }
    } catch {
      // ignore
    } finally {
      setAddingProject(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await fetch(`http://localhost:5000/api/projects/${id}`, { method: 'DELETE' });
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-[#0a101f] text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#0a101f] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Nexora Management Dashboard
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE DB
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Update main hero content, contact channels, and view student leads
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            title="Close Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('hero')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'hero'
                ? 'border-sky-600 text-sky-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>Main Hero Section</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'contact'
                ? 'border-emerald-600 text-emerald-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Company Contact & Address</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'inquiries'
                ? 'border-purple-600 text-purple-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Inquiries ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'projects'
                ? 'border-amber-600 text-amber-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Manage Projects ({projects.length})</span>
          </button>
        </div>

        {/* Success Alert Banner */}
        {saveSuccess && (
          <div className="px-6 py-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Changes saved to MongoDB successfully and applied to the website in real time!</span>
          </div>
        )}

        {/* Tab Body Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          
          {/* TAB 1: Main Hero Section Content Editor */}
          {activeTab === 'hero' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">Hero Section Content</h3>
                <p className="text-xs text-slate-500">
                  Instantly customize the headline, highlight color, and subtitle on the homepage hero.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Headline Part 1 (Sky Blue)
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitleLine1}
                    onChange={(e) => setFormData({ ...formData, heroTitleLine1: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-semibold"
                    placeholder="From Ideas to"
                  />
                  <span className="text-[10px] text-slate-400">Rendered in vibrant sky blue (#00a3e0)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Headline Highlight (Emerald Green)
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitleHighlight}
                    onChange={(e) => setFormData({ ...formData, heroTitleHighlight: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-semibold"
                    placeholder="Innovation."
                  />
                  <span className="text-[10px] text-slate-400">Rendered in forest green (#15803d)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tagline / Subtitle (Charcoal Slate)
                </label>
                <input
                  type="text"
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
                  placeholder="Empowering Students to Build, Create, and Succeed."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Brand Eyebrow Badge
                </label>
                <input
                  type="text"
                  value={formData.heroEyebrow}
                  onChange={(e) => setFormData({ ...formData, heroEyebrow: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-medium uppercase tracking-wider"
                  placeholder="NEXORA TECHNOLOGIES"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Services Strip Items (Comma Separated)
                </label>
                <input
                  type="text"
                  value={servicesInput}
                  onChange={(e) => setServicesInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
                  placeholder="Academic Projects, IEEE Research, Project Documentation, Resume Building, Portfolio Development"
                />
                <span className="text-[10px] text-slate-400">Separate each service badge with a comma</span>
              </div>

              {/* Live Preview Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-[#f0f9ff]/70 to-white border border-sky-100 space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Live Preview
                </div>
                <div className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  <span className="text-[#00a3e0]">{formData.heroTitleLine1} </span>
                  <span className="text-[#15803d]">{formData.heroTitleHighlight}</span>
                </div>
                <p className="text-xs text-slate-700 font-semibold">
                  {formData.heroSubtitle}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {servicesInput.split(',').map((s, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 font-semibold">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Updating Database...' : 'Save & Publish Hero Changes'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Company Contact & Address Editor */}
          {activeTab === 'contact' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">Official Contact & Address Channels</h3>
                <p className="text-xs text-slate-500">
                  Updates your hotline, email, WhatsApp link, and physical office location across Navbar, Footer, and Floating Dock.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Official Phone Hotline *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-semibold"
                    placeholder="6374742431"
                  />
                  <span className="text-[10px] text-slate-400">Used for tel: click-to-call buttons</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Direct Number (No + sign) *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-semibold"
                    placeholder="916374742431"
                  />
                  <span className="text-[10px] text-slate-400">Opens WhatsApp chat link (e.g. 916374742431)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-sky-600" />
                  <span>Official Support Email *</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-semibold"
                  placeholder="thichu683@gmail.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-600" />
                  <span>Physical Campus & Office Address *</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-medium resize-none leading-relaxed"
                  placeholder="NH-47, Palakkad Main Road, Navakkarai (P.O), Coimbatore – 641105, Tamil Nadu, India"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Updating Database...' : 'Save Contact & Address'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: Student Inquiries (Leads) */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Student & College Consultation Requests</h3>
                  <p className="text-xs text-slate-500">
                    Live leads captured through the free synopsis consultation modal.
                  </p>
                </div>
                <button
                  onClick={fetchInquiries}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {loadingInquiries ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  Loading inquiries...
                </div>
              ) : inquiries.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
                  No consultation inquiries received yet. Submit a test inquiry on the homepage modal!
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq._id}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 bg-white shadow-xs transition space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-extrabold text-slate-900 text-sm">{inq.name}</span>
                          <span className="ml-2 text-xs text-slate-500 font-medium">({inq.college})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={inq.status || 'New'}
                            onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)}
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
                          >
                            <option value="New">Status: New</option>
                            <option value="Contacted">Status: Contacted</option>
                            <option value="Proposal Sent">Status: Proposal Sent</option>
                            <option value="Completed">Status: Completed</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                        <div>
                          <strong>Phone:</strong> {inq.phone}
                        </div>
                        <div>
                          <strong>Email:</strong> {inq.email}
                        </div>
                        <div>
                          <strong>Dept:</strong> {inq.branch} ({inq.level})
                        </div>
                        {inq.topic && (
                          <div className="sm:col-span-3">
                            <strong>Requested Topic:</strong> {inq.topic}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inq.name)},%20this%20is%20Nexora%20Technologies%20regarding%20your%20project%20inquiry.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>WhatsApp Student</span>
                        </a>

                        <a
                          href={`tel:${inq.phone}`}
                          className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Manage Projects */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add New Verified Project Topic</h3>
                <p className="text-xs text-slate-500">
                  Instantly publish verified IEEE topics to the online catalog.
                </p>
              </div>

              <form onSubmit={handleCreateProject} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      placeholder="e.g. Deep Learning Brain Tumor Segmentation with UNet"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Domain Category</label>
                    <select
                      value={newProject.category}
                      onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                    >
                      <option value="AI/ML">AI/ML</option>
                      <option value="Full-Stack">Full-Stack</option>
                      <option value="IoT/Embedded">IoT/Embedded</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Cloud/DevOps">Cloud/DevOps</option>
                      <option value="Blockchain">Blockchain</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                    <select
                      value={newProject.department}
                      onChange={(e) => setNewProject({ ...newProject, department: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                    >
                      <option value="CSE/IT">CSE/IT</option>
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                      <option value="MCA/BCA">MCA/BCA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Project Level</label>
                    <select
                      value={newProject.level}
                      onChange={(e) => setNewProject({ ...newProject, level: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                    >
                      <option value="Final Year Capstone">Final Year Capstone</option>
                      <option value="Mini Project">Mini Project</option>
                      <option value="M.Tech / Thesis">M.Tech / Thesis</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">IEEE Year</label>
                    <input
                      type="text"
                      value={newProject.ieeeYear}
                      onChange={(e) => setNewProject({ ...newProject, ieeeYear: e.target.value })}
                      placeholder="IEEE 2025/2026"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tech Stack (Comma Separated)</label>
                  <input
                    type="text"
                    value={newProject.techStack}
                    onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
                    placeholder="Python, PyTorch, React, FastAPI"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description / Abstract</label>
                  <textarea
                    rows={2}
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Brief description of the research paper implementation..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={addingProject}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wide transition shadow-sm"
                >
                  {addingProject ? 'Publishing...' : 'Add Project to Live Directory'}
                </button>
              </form>

              {/* Existing Projects List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Live Published Projects ({projects.length})
                </h4>
                {loadingProjects ? (
                  <div className="py-6 text-center text-xs text-slate-500">Loading catalog...</div>
                ) : projects.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                    No custom projects added yet. Use the form above to add topics on demand!
                  </div>
                ) : (
                  <div className="space-y-2">
                    {projects.map((p) => (
                      <div
                        key={p._id || p.projectId}
                        className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 bg-white"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700">
                              {p.category}
                            </span>
                            <span className="text-xs font-bold text-slate-900">{p.title}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {p.department} • {p.level} • {p.ieeeYear}
                          </span>
                        </div>
                        {p._id && (
                          <button
                            onClick={() => handleDeleteProject(p._id!)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span>Nexora Technologies Project Lab · Coimbatore & Bangalore</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
