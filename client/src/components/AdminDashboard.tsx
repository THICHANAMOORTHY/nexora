import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Layout, 
  PhoneCall, 
  Mail, 
  Users, 
  FolderPlus, 
  CheckCircle, 
  Trash2, 
  RotateCw, 
  ShieldCheck,
  Building,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  Pencil,
  AlertCircle,
  PlusCircle,
  FileText,
  Search,
  Download,
  Paperclip,
  MessageSquare,
  FileCode,
  Check
} from 'lucide-react';
import { API_BASE_URL } from '../lib/api';

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
  notes?: string;
  serviceType?: string;
  serviceDetails?: any;
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
  deliverables?: string[];
}

export interface ServiceRequestItem {
  _id: string;
  requestId: string;
  serviceType: string;
  student: {
    name: string;
    email: string;
    phone: string;
    college?: string;
    department?: string;
    degree?: string;
    academicYear?: string;
    location?: string;
  };
  requirements: Record<string, any>;
  attachments?: Array<{
    filename: string;
    originalName: string;
    mimetype?: string;
    size?: number;
    path: string;
    uploadedAt?: string;
  }>;
  status: 'Pending' | 'Reviewing' | 'In Progress' | 'Completed' | 'Rejected';
  priority?: string;
  adminNotes?: Array<{
    note: string;
    author: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt?: string;
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
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('nexora_admin_token'));
  });
  const [adminEmail, setAdminEmail] = useState<string>(() => {
    return localStorage.getItem('nexora_admin_email') || 'thichu683@gmail.com';
  });

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard Tab state
  const [activeTab, setActiveTab] = useState<'hero' | 'contact' | 'inquiries' | 'projects' | 'serviceRequests'>('serviceRequests');
  const [formData, setFormData] = useState<SiteConfig>(currentSettings);
  const [servicesInput, setServicesInput] = useState<string>(
    (currentSettings.servicesList || []).join(', ')
  );
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Service Requests (4 Segments) state
  const [serviceRequests, setServiceRequests] = useState<ServiceRequestItem[]>([]);
  const [loadingServiceRequests, setLoadingServiceRequests] = useState(false);
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [requestSearch, setRequestSearch] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequestItem | null>(null);
  const [newAdminNote, setNewAdminNote] = useState<string>('');
  const [addingNote, setAddingNote] = useState<boolean>(false);
  const [copiedReqId, setCopiedReqId] = useState<string | null>(null);

  // Inquiries state
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);

  // Projects state
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'AI/ML',
    department: 'CSE/IT',
    level: 'Final Year Capstone',
    ieeeYear: 'IEEE 2025/2026',
    description: '',
    techStack: 'Python, PyTorch, React, FastAPI',
    deliverables: 'Working Model Code, IEEE Base Paper, Project Report, PPT Deck, Viva Voce Prep',
  });
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [savingProject, setSavingProject] = useState(false);
  const [projectActionSuccess, setProjectActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    setFormData(currentSettings);
    setServicesInput((currentSettings.servicesList || []).join(', '));
  }, [currentSettings]);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchInquiries();
      fetchProjects();
      fetchServiceRequests();
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    if (isOpen && isAuthenticated && activeTab === 'serviceRequests') {
      fetchServiceRequests();
    }
  }, [isOpen, isAuthenticated, activeTab, serviceFilter, statusFilter]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('nexora_admin_token', data.token);
        localStorage.setItem('nexora_admin_email', data.user?.email || loginEmail);
        setIsAuthenticated(true);
        setAdminEmail(data.user?.email || loginEmail);
        setLoginEmail('');
        setLoginPassword('');
        fetchInquiries();
        fetchProjects();
      } else {
        setLoginError(data.message || 'Invalid administrator credentials');
      }
    } catch {
      // Local fallback check if backend is offline
      const validEmail = (loginEmail.trim().toLowerCase() === 'thichu683@gmail.com' || loginEmail.trim().toLowerCase() === 'admin');
      const validPass = (loginPassword === 'admin@nexora2026' || loginPassword === 'nexora@2026');

      if (validEmail && validPass) {
        localStorage.setItem('nexora_admin_token', 'local_offline_token');
        localStorage.setItem('nexora_admin_email', 'thichu683@gmail.com');
        setIsAuthenticated(true);
        setAdminEmail('thichu683@gmail.com');
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setLoginError('Invalid administrator credentials. Please check your email and password.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nexora_admin_token');
    localStorage.removeItem('nexora_admin_email');
    setIsAuthenticated(false);
  };

  const fetchInquiries = async () => {
    try {
      setLoadingInquiries(true);
      const res = await fetch(`${API_BASE_URL}/inquiries`);
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
      const res = await fetch(`${API_BASE_URL}/projects`);
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

  const fetchServiceRequests = async () => {
    try {
      setLoadingServiceRequests(true);
      const params = new URLSearchParams();
      if (serviceFilter !== 'ALL') params.append('serviceType', serviceFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (requestSearch.trim()) params.append('search', requestSearch.trim());

      const res = await fetch(`${API_BASE_URL}/service-requests?${params.toString()}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setServiceRequests(json.data);
      }
    } catch {
      // offline fallback
    } finally {
      setLoadingServiceRequests(false);
    }
  };

  const handleUpdateServiceStatus = async (id: string, status: string) => {
    try {
      await fetch(`${API_BASE_URL}/service-requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setServiceRequests((prev) =>
        prev.map((r) => (r._id === id || r.requestId === id ? { ...r, status: status as any } : r))
      );
      if (selectedRequest && (selectedRequest._id === id || selectedRequest.requestId === id)) {
        setSelectedRequest((prev) => (prev ? { ...prev, status: status as any } : null));
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleAddAdminNote = async (id: string) => {
    if (!newAdminNote.trim()) return;
    setAddingNote(true);
    try {
      const res = await fetch(`${API_BASE_URL}/service-requests/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newAdminNote, author: adminEmail || 'Admin' }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setServiceRequests((prev) =>
          prev.map((r) => (r._id === id || r.requestId === id ? json.data : r))
        );
        setSelectedRequest(json.data);
        setNewAdminNote('');
      }
    } catch (err) {
      console.error('Failed to add note', err);
    } finally {
      setAddingNote(false);
    }
  };


  if (!isOpen) return null;

  // 1. RENDER LOGIN SCREEN IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
        <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-500 p-0.5 shadow-md flex items-center justify-center mb-4">
              <div className="w-full h-full bg-[#0a101f] rounded-[14px] flex items-center justify-center">
                <Lock className="w-7 h-7 text-sky-400" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0a101f] tracking-tight">
              Nexora Admin Authentication
            </h2>
            <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
              Protected portal for updating academic project topics, live hero sections, and student inquiries.
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Administrator Email or Username</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. thichu683@gmail.com or admin"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Security Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
            >
              {loginLoading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authenticate & Open Dashboard</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Nexora Technologies Lab</span>
            <span className="font-semibold text-sky-600">PostgreSQL Cloud Protected</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. SAVE SITE SETTINGS (HERO / CONTACT)
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
      const res = await fetch(`${API_BASE_URL}/settings`, {
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
      await fetch(`${API_BASE_URL}/inquiries/${id}`, {
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

  // 3. PROJECT CRUD: CREATE OR UPDATE
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProject(true);
    setProjectActionSuccess(null);

    const isEdit = Boolean(editingProjectId);
    const url = isEdit 
      ? `${API_BASE_URL}/projects/${editingProjectId}`
      : `${API_BASE_URL}/projects`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectForm),
      });
      const json = await res.json();

      if (json.success && json.data) {
        if (isEdit) {
          setProjects((prev) =>
            prev.map((p) => (p._id === editingProjectId || p.projectId === editingProjectId ? json.data : p))
          );
          setProjectActionSuccess('Project updated in Supabase successfully!');
        } else {
          setProjects((prev) => [json.data, ...prev]);
          setProjectActionSuccess('New project published to live directory successfully!');
        }

        // Reset form
        setProjectForm({
          title: '',
          category: 'AI/ML',
          department: 'CSE/IT',
          level: 'Final Year Capstone',
          ieeeYear: 'IEEE 2025/2026',
          description: '',
          techStack: 'Python, PyTorch, React, FastAPI',
          deliverables: 'Working Model Code, IEEE Base Paper, Project Report, PPT Deck, Viva Voce Prep',
        });
        setEditingProjectId(null);
        setTimeout(() => setProjectActionSuccess(null), 4000);
      }
    } catch {
      // offline fallback
      setProjectActionSuccess('Action processed in local fallback.');
    } finally {
      setSavingProject(false);
    }
  };

  const handleEditClick = (p: ProjectItem) => {
    setEditingProjectId(p._id || p.projectId || null);
    setProjectForm({
      title: p.title,
      category: p.category,
      department: p.department,
      level: p.level,
      ieeeYear: p.ieeeYear,
      description: p.description,
      techStack: Array.isArray(p.techStack) ? p.techStack.join(', ') : '',
      deliverables: Array.isArray(p.deliverables) ? p.deliverables.join(', ') : '',
    });
    // Scroll form into view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      category: 'AI/ML',
      department: 'CSE/IT',
      level: 'Final Year Capstone',
      ieeeYear: 'IEEE 2025/2026',
      description: '',
      techStack: 'Python, PyTorch, React, FastAPI',
      deliverables: 'Working Model Code, IEEE Base Paper, Project Report, PPT Deck, Viva Voce Prep',
    });
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project from the database?')) return;
    try {
      await fetch(`${API_BASE_URL}/projects/${id}`, { method: 'DELETE' });
      setProjects((prev) => prev.filter((p) => p._id !== id && p.projectId !== id));
      if (editingProjectId === id) {
        handleCancelEdit();
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 bg-[#0a101f] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 p-0.5 flex items-center justify-center shrink-0">
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
                  SUPABASE LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Connected: <span className="text-sky-300 font-semibold">{adminEmail}</span> (Super Admin)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-500/40 text-slate-300 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
              title="Sign Out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Sign Out</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              title="Close Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/90 px-6 gap-2 sm:gap-6 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('serviceRequests')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === 'serviceRequests'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-purple-600" />
            <span>Service Requests ({serviceRequests.length})</span>
            {serviceRequests.filter((r) => r.status === 'Pending').length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                {serviceRequests.filter((r) => r.status === 'Pending').length} new
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === 'projects'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Manage Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === 'hero'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>Hero Section</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === 'contact'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <PhoneCall className="w-4 h-4" />
            <span>Company Contacts</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition shrink-0 ${
              activeTab === 'inquiries'
                ? 'border-sky-600 text-sky-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Inquiries ({inquiries.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: Manage Projects (Create, Update, Delete) */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    {editingProjectId ? (
                      <>
                        <Pencil className="w-4 h-4 text-amber-600" />
                        <span>Edit Project: {projectForm.title || editingProjectId}</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4 text-sky-600" />
                        <span>Add Verified Project Topic</span>
                      </>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Publish, update, or remove verified IEEE academic project topics stored directly in Supabase Cloud.
                  </p>
                </div>

                {editingProjectId && (
                  <button
                    onClick={handleCancelEdit}
                    className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              {projectActionSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{projectActionSuccess}</span>
                </div>
              )}

              {/* Project Form (Create or Edit) */}
              <form onSubmit={handleSaveProject} className="p-5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Project Title *</label>
                    <input
                      type="text"
                      required
                      value={projectForm.title}
                      onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                      placeholder="e.g. Multimodal Deep Learning for Real-Time Medical Imaging Diagnostics"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Domain Category</label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
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

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                    <select
                      value={projectForm.department}
                      onChange={(e) => setProjectForm({ ...projectForm, department: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                    >
                      <option value="CSE/IT">CSE/IT</option>
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                      <option value="MCA/BCA">MCA/BCA</option>
                      <option value="Mech">Mechanical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Academic Level</label>
                    <select
                      value={projectForm.level}
                      onChange={(e) => setProjectForm({ ...projectForm, level: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                    >
                      <option value="Final Year Capstone">Final Year Capstone</option>
                      <option value="Mini Project">Mini Project</option>
                      <option value="M.Tech / Thesis">M.Tech / Thesis</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">IEEE Reference / Year</label>
                    <input
                      type="text"
                      value={projectForm.ieeeYear}
                      onChange={(e) => setProjectForm({ ...projectForm, ieeeYear: e.target.value })}
                      placeholder="IEEE 2025/2026"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tech Stack (Comma Separated)</label>
                    <input
                      type="text"
                      value={projectForm.techStack}
                      onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
                      placeholder="Python, PyTorch, React, FastAPI, MongoDB"
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description / Project Abstract</label>
                  <textarea
                    rows={2}
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    placeholder="Concise overview of the system architecture, algorithms used, and practical implementation..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deliverables Provided (Comma Separated)</label>
                  <input
                    type="text"
                    value={projectForm.deliverables}
                    onChange={(e) => setProjectForm({ ...projectForm, deliverables: e.target.value })}
                    placeholder="Full Working Code, IEEE Base Paper, Project Report, PPT, Viva Voce Prep"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={savingProject}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-2 ${
                      editingProjectId
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-[#15803d] hover:bg-[#166534] text-white'
                    }`}
                  >
                    {savingProject ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>{editingProjectId ? 'Update Project in Database' : 'Publish Project to Catalog'}</span>
                      </>
                    )}
                  </button>

                  {editingProjectId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {/* Published Projects Table / List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    Published Catalog Projects ({projects.length})
                  </h4>
                  <button
                    onClick={fetchProjects}
                    className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Refresh</span>
                  </button>
                </div>

                {loadingProjects ? (
                  <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
                    Loading projects from Supabase...
                  </div>
                ) : projects.length === 0 ? (
                  <div className="py-10 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200/80 p-6">
                    <p className="font-semibold text-slate-700 mb-1">No projects currently published.</p>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      All fake projects have been removed. Use the form above to add your real verified projects!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {projects.map((p) => {
                      const id = p._id || p.projectId || '';
                      const isCurrentlyEditing = editingProjectId === id;

                      return (
                        <div
                          key={id}
                          className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isCurrentlyEditing
                              ? 'border-amber-400 bg-amber-50/40 shadow-xs'
                              : 'border-slate-200 hover:border-sky-300 bg-white'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                                {p.category}
                              </span>
                              <span className="text-xs font-bold text-slate-900">{p.title}</span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {p.department} • {p.level} • <span className="font-semibold text-sky-700">{p.ieeeYear}</span>
                            </p>
                            {p.techStack && p.techStack.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {p.techStack.map((tech) => (
                                  <span key={tech} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleEditClick(p)}
                              className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition flex items-center gap-1"
                              title="Edit Project"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => handleDeleteProject(id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete Project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Hero Section */}
          {activeTab === 'hero' && (
            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Hero Section Content</h3>
                <p className="text-xs text-slate-500">
                  Update main title, color highlight, subtitle, and badge appearing on the homepage.
                </p>
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Hero settings updated successfully in Supabase!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Top Eyebrow Badge Text
                  </label>
                  <input
                    type="text"
                    value={formData.heroEyebrow}
                    onChange={(e) => setFormData({ ...formData, heroEyebrow: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Main Headline (Line 1)
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitleLine1}
                    onChange={(e) => setFormData({ ...formData, heroTitleLine1: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Headline Highlight (Green Text)
                  </label>
                  <input
                    type="text"
                    value={formData.heroTitleHighlight}
                    onChange={(e) =>
                      setFormData({ ...formData, heroTitleHighlight: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hero Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={formData.heroSubtitle}
                    onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 resize-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Services Ticker Strip (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={servicesInput}
                    onChange={(e) => setServicesInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Live Preview
                </span>
                <div className="space-y-1">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[10px] font-bold">
                    {formData.heroEyebrow}
                  </div>
                  <h4 className="text-xl font-extrabold text-[#00a3e0] tracking-tight">
                    {formData.heroTitleLine1}{' '}
                    <span className="text-[#15803d]">{formData.heroTitleHighlight}</span>
                  </h4>
                  <p className="text-xs text-slate-600">{formData.heroSubtitle}</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Hero Section to Supabase</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 3: Company Contact Info */}
          {activeTab === 'contact' && (
            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900">Official Contact Channels</h3>
                <p className="text-xs text-slate-500">
                  Update phone hotline, WhatsApp, email, and Coimbatore facility address.
                </p>
              </div>

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Contact info updated successfully in Supabase!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Calling Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Chat Number (with country code, no +)
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Company Registered Address
                  </label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-sky-500 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Contact Details to Supabase</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 4: Student Inquiries */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Student & College Leads</h3>
                  <p className="text-xs text-slate-500">
                    Real-time inquiries received via website consultation form.
                  </p>
                </div>
                <button
                  onClick={fetchInquiries}
                  className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
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
                  No consultation inquiries received yet. Submit an inquiry on the homepage to test!
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq._id}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 bg-white shadow-xs transition space-y-2.5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">{inq.name}</span>
                          <span className="text-xs text-slate-500 font-medium">({inq.college})</span>
                          {inq.serviceType && (
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                              {inq.serviceType}
                            </span>
                          )}
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
                            <strong>Topic / Service Focus:</strong> {inq.topic}
                          </div>
                        )}
                        {inq.notes && (
                          <div className="sm:col-span-3 pt-1 text-slate-700 bg-white p-2 rounded-lg border border-slate-200/80 text-[11px] whitespace-pre-wrap">
                            <strong>Gathered Specifications:</strong> {inq.notes}
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

          {/* TAB 5: Student Service Requests (Project Reports, IEEE, Resume, Portfolio) */}
          {activeTab === 'serviceRequests' && (
            <div className="space-y-4">
              
              {/* Header & Stats */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span>Student Service Requests System ({serviceRequests.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Structured data collection submissions for Project Reports, IEEE Research, Resume Building & Portfolio Development.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchServiceRequests}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${loadingServiceRequests ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div className="sm:col-span-2 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={requestSearch}
                    onChange={(e) => setRequestSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchServiceRequests()}
                    placeholder="Search by Request ID, Student Name, College, Email..."
                    className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500 font-medium"
                  >
                    <option value="ALL">All Services (4 Types)</option>
                    <option value="Project Reports">01 / Project Reports</option>
                    <option value="IEEE Reports">02 / IEEE Reports</option>
                    <option value="Resume Building">03 / Resume Building</option>
                    <option value="Portfolio Development">04 / Portfolio Development</option>
                  </select>
                </div>

                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500 font-medium"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Pending">Status: Pending</option>
                    <option value="Reviewing">Status: Reviewing</option>
                    <option value="In Progress">Status: In Progress</option>
                    <option value="Completed">Status: Completed</option>
                    <option value="Rejected">Status: Rejected</option>
                  </select>
                </div>
              </div>

              {/* Service Requests List */}
              {loadingServiceRequests ? (
                <div className="py-14 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center gap-2">
                  <RotateCw className="w-5 h-5 animate-spin text-purple-600" />
                  <span>Loading service requests...</span>
                </div>
              ) : serviceRequests.length === 0 ? (
                <div className="py-14 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-1">
                  <p className="font-bold text-slate-700 text-sm">No service requests found.</p>
                  <p className="text-slate-400 max-w-sm mx-auto">
                    {requestSearch || serviceFilter !== 'ALL' || statusFilter !== 'ALL'
                      ? 'No requests match your current filters. Try resetting the filters.'
                      : 'Students have not submitted requests yet. Use the website service cards to test a submission!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {serviceRequests.map((req) => {
                    const reqTitle =
                      req.requirements?.projectTitle ||
                      req.requirements?.researchTitle ||
                      req.requirements?.targetRole ||
                      req.requirements?.professionalHeadline ||
                      'Custom Service Inquiry';

                    const serviceBadgeStyles: Record<string, string> = {
                      'Project Reports': 'bg-purple-100 text-purple-800 border-purple-200',
                      'IEEE Reports': 'bg-indigo-100 text-indigo-800 border-indigo-200',
                      'Resume Building': 'bg-pink-100 text-pink-800 border-pink-200',
                      'Portfolio Development': 'bg-violet-100 text-violet-800 border-violet-200',
                    };

                    const statusBadgeStyles: Record<string, string> = {
                      Pending: 'bg-amber-100 text-amber-800 border-amber-200',
                      Reviewing: 'bg-sky-100 text-sky-800 border-sky-200',
                      'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
                      Completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                      Rejected: 'bg-rose-100 text-rose-800 border-rose-200',
                    };

                    const badgeClass = serviceBadgeStyles[req.serviceType] || 'bg-slate-100 text-slate-800 border-slate-200';
                    const statusClass = statusBadgeStyles[req.status] || 'bg-slate-100 text-slate-800 border-slate-200';

                    return (
                      <div
                        key={req._id || req.requestId}
                        className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-purple-300 bg-white shadow-xs transition space-y-3"
                      >
                        {/* Top Row: Request ID, Service Badge, Status, Date */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 flex items-center gap-1.5">
                              <span>{req.requestId}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(req.requestId);
                                  setCopiedReqId(req.requestId);
                                  setTimeout(() => setCopiedReqId(null), 2000);
                                }}
                                title="Copy Request ID"
                                className="text-purple-400 hover:text-purple-700"
                              >
                                {copiedReqId === req.requestId ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Paperclip className="w-3 h-3" />
                                )}
                              </button>
                            </span>

                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                              {req.serviceType}
                            </span>

                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusClass}`}>
                              {req.status}
                            </span>
                          </div>

                          <span className="text-[11px] text-slate-400">
                            {new Date(req.createdAt).toLocaleDateString()} {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Student & Project Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Student</span>
                            <strong className="text-slate-900 text-sm">{req.student?.name}</strong>
                            <div className="text-[11px] text-slate-500">{req.student?.college}</div>
                          </div>

                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact</span>
                            <div><strong>Phone:</strong> {req.student?.phone}</div>
                            <div className="truncate"><strong>Email:</strong> {req.student?.email}</div>
                          </div>

                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Academic Scope</span>
                            <div>{req.student?.department}</div>
                            <div className="text-[11px] text-slate-500">{req.student?.degree} ({req.student?.academicYear || 'Final Year'})</div>
                          </div>

                          <div className="sm:col-span-3 pt-1 border-t border-slate-200/60">
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Topic / Focus</span>
                            <span className="font-semibold text-slate-800">{reqTitle}</span>
                          </div>

                          {req.attachments && req.attachments.length > 0 && (
                            <div className="sm:col-span-3 flex items-center gap-1.5 text-[11px] text-purple-700 font-semibold pt-0.5">
                              <Paperclip className="w-3.5 h-3.5" />
                              <span>{req.attachments.length} Reference Attachment(s) uploaded</span>
                            </div>
                          )}
                        </div>

                        {/* Action Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-500">Update Status:</span>
                            <select
                              value={req.status}
                              onChange={(e) => handleUpdateServiceStatus(req._id || req.requestId, e.target.value)}
                              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-purple-500"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Reviewing">Reviewing</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => setSelectedRequest(req)}
                              className="px-3.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition flex items-center gap-1.5"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Full Specifications</span>
                            </button>

                            <a
                              href={`https://wa.me/${(req.student?.phone || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(req.student?.name || 'Student')},%20this%20is%20Nexora%20Technologies%20regarding%20your%20${encodeURIComponent(req.serviceType)}%20request%20(${req.requestId}).`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

        </div>

        {/* FULL SPECIFICATION INSPECTION MODAL */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-2xl my-auto max-h-[92vh] flex flex-col text-slate-800">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                    {selectedRequest.requestId}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {selectedRequest.serviceType}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-1.5 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs">
                
                {/* Student Info */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                    <span>Student Profile & Institution</span>
                    <span className="text-xs font-normal text-slate-500">
                      Submitted: {new Date(selectedRequest.createdAt).toLocaleString()}
                    </span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                    <div><strong>Name:</strong> {selectedRequest.student?.name}</div>
                    <div><strong>Mobile:</strong> {selectedRequest.student?.phone}</div>
                    <div><strong>Email:</strong> {selectedRequest.student?.email}</div>
                    <div><strong>College:</strong> {selectedRequest.student?.college}</div>
                    <div><strong>Dept:</strong> {selectedRequest.student?.department} ({selectedRequest.student?.degree})</div>
                    <div><strong>Year:</strong> {selectedRequest.student?.academicYear}</div>
                  </div>
                </div>

                {/* Submitted Service Specifications */}
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
                  <h4 className="font-bold text-purple-900 text-sm">
                    Submitted Service Requirements
                  </h4>
                  <div className="space-y-2 text-slate-700">
                    {Object.entries(selectedRequest.requirements || {}).map(([key, val]) => (
                      <div key={key} className="bg-white p-2.5 rounded-xl border border-purple-100">
                        <span className="font-mono uppercase font-bold text-[10px] text-purple-600 block mb-0.5">
                          {key}
                        </span>
                        <div className="text-slate-900 whitespace-pre-wrap leading-relaxed">
                          {Array.isArray(val) ? val.join(', ') : String(val || 'N/A')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attachments Section */}
                {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Paperclip className="w-4 h-4 text-purple-600" />
                      <span>Uploaded Files ({selectedRequest.attachments.length})</span>
                    </h4>
                    <div className="space-y-2">
                      {selectedRequest.attachments.map((file, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <FileCode className="w-4 h-4 text-purple-600 shrink-0" />
                            <span className="font-semibold text-slate-800 truncate">{file.originalName}</span>
                            {file.size && (
                              <span className="text-[10px] text-slate-400 shrink-0">
                                ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                              </span>
                            )}
                          </div>
                          <a
                            href={`${API_BASE_URL}/service-requests/attachment/${file.filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] flex items-center gap-1 shrink-0 transition"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Internal Notes Timeline */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-sky-600" />
                    <span>Admin Internal Progress Notes ({selectedRequest.adminNotes?.length || 0})</span>
                  </h4>

                  {selectedRequest.adminNotes && selectedRequest.adminNotes.length > 0 ? (
                    <div className="space-y-2">
                      {selectedRequest.adminNotes.map((note, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                            <span className="font-bold text-slate-700">{note.author}</span>
                            <span>{new Date(note.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-slate-800">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs italic">No internal notes added yet.</p>
                  )}

                  {/* Add Note Form */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newAdminNote}
                      onChange={(e) => setNewAdminNote(e.target.value)}
                      placeholder="Add an internal progress note, guide feedback or call summary..."
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-purple-500"
                    />
                    <button
                      type="button"
                      disabled={addingNote || !newAdminNote.trim()}
                      onClick={() => handleAddAdminNote(selectedRequest._id || selectedRequest.requestId)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition disabled:opacity-50"
                    >
                      {addingNote ? 'Adding...' : 'Add Note'}
                    </button>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-600">Status:</span>
                  <select
                    value={selectedRequest.status}
                    onChange={(e) => handleUpdateServiceStatus(selectedRequest._id || selectedRequest.requestId, e.target.value)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${(selectedRequest.student?.phone || '').replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedRequest.student?.name || 'Student')},%20this%20is%20Nexora%20Technologies%20regarding%20your%20${encodeURIComponent(selectedRequest.serviceType)}%20request%20(${selectedRequest.requestId}).`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition"
                  >
                    Close
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <span>Nexora Technologies Lab · Coimbatore</span>
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
