import React, { useState, useEffect, useMemo } from 'react';
import { 
  type Project 
} from '../data/projectsData';
import { 
  Search, 
  CheckCircle, 
  ArrowRight, 
  BookOpen, 
  Sparkles,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface ProjectCatalogProps {
  searchQuery: string;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenConsultation: (initialTopic?: string) => void;
}

export const ProjectCatalog: React.FC<ProjectCatalogProps> = ({
  searchQuery,
  selectedCategory,
  onSelectCategory,
  onOpenConsultation
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [internalSearch, setInternalSearch] = useState<string>(searchQuery);
  const [previewProject, setPreviewProject] = useState<Project | null>(null);

  useEffect(() => {
    setInternalSearch(searchQuery);
  }, [searchQuery]);

  // Fetch real projects from MongoDB backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/projects');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setProjects(json.data);
        } else {
          setProjects([]);
        }
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const categories = ['ALL', 'AI/ML', 'Full-Stack', 'IoT/Embedded', 'Cybersecurity', 'Cloud/DevOps', 'Blockchain'];
  const departments = ['ALL', 'CSE/IT', 'ECE', 'EEE', 'MCA/BCA'];
  const levels = ['ALL', 'Final Year Capstone', 'Mini Project', 'M.Tech / Thesis'];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory = selectedCategory === 'ALL' || project.category === selectedCategory;
      const matchesDept = departmentFilter === 'ALL' || project.department === departmentFilter;
      const matchesLevel = levelFilter === 'ALL' || project.level === levelFilter;
      const searchTerms = internalSearch.toLowerCase().trim();
      const matchesSearch = !searchTerms || 
        project.title.toLowerCase().includes(searchTerms) ||
        project.description.toLowerCase().includes(searchTerms) ||
        project.techStack.some((t) => t.toLowerCase().includes(searchTerms)) ||
        project.category.toLowerCase().includes(searchTerms) ||
        project.department.toLowerCase().includes(searchTerms);

      return matchesCategory && matchesDept && matchesLevel && matchesSearch;
    });
  }, [projects, selectedCategory, departmentFilter, levelFilter, internalSearch]);

  return (
    <section id="projects" className="py-12 sm:py-16 bg-white border-t border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Academic Projects Portal</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
              Projects & IEEE Base Paper Directory
            </h2>
            <p className="mt-2 text-slate-500 text-xs sm:text-sm max-w-2xl">
              Explore available topics or propose your college guide’s custom project title for verified source code, IEEE base paper matching, and viva voce preparation.
            </p>
          </div>

          <button
            onClick={() => onOpenConsultation()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-sky-50 border border-sky-200 hover:bg-sky-100 text-sky-700 font-bold text-xs transition flex items-center justify-center gap-2 shrink-0 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-sky-600" />
            <span>Have a Custom Topic From Guide?</span>
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="rounded-2xl bg-[#f8fafc] border border-slate-200/80 p-3.5 sm:p-5 mb-8 space-y-3 sm:space-y-4">
          
          {/* Top Row: Search input & Branch Filter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-7 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={internalSearch}
                onChange={(e) => setInternalSearch(e.target.value)}
                placeholder="Search project topic by keyword (e.g. PyTorch, IoT, Blockchain, React)..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition shadow-sm"
              />
              {internalSearch && (
                <button 
                  onClick={() => setInternalSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="md:col-span-5 flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 shrink-0">Branch:</span>
              <div className="flex flex-wrap gap-1.5">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setDepartmentFilter(dept)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      departmentFilter === dept
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Row: Level Filter */}
          <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-600 mr-2">Level:</span>
            {levels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  levelFilter === lvl
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Bottom Row: Category Pill Tabs */}
          <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-600 mr-2">Domain:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-[#15803d] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Dynamic Project Cards Grid or Honest Empty State */}
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            Loading verified projects...
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id || project.projectId}
                className="group rounded-2xl bg-white border border-slate-200/90 hover:border-sky-300 p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 relative"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                      {project.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {project.ieeeYear}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#111827] group-hover:text-sky-600 transition-colors line-clamp-2">
                    {project.title}
                  </h3>

                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {project.department}
                    </span>
                    <span>•</span>
                    <span>{project.level}</span>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPreviewProject(project)}
                      className="px-3 py-2 rounded-lg bg-[#e0f2fe] hover:bg-sky-200 text-[#0284c7] text-xs font-bold transition text-center"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onOpenConsultation(project.title)}
                      className="px-3 py-2 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold transition text-center flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>Get Project</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Clean & Honest State without mock data */
          <div className="text-center py-14 px-6 rounded-2xl bg-white border border-slate-200 max-w-xl mx-auto shadow-sm">
            <BookOpen className="w-12 h-12 text-sky-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">Custom Project Development on Demand</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Have an idea or a specific topic assigned by your faculty guide? We develop 100% custom academic projects with IEEE standard base papers, clean source code, and complete documentation.
            </p>
            <div className="pt-5">
              <button
                onClick={() => onOpenConsultation(internalSearch || (departmentFilter !== 'ALL' ? `${departmentFilter} Project` : ''))}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white font-bold text-xs uppercase tracking-wider transition shadow-sm inline-flex items-center justify-center gap-2"
              >
                <span>Request Custom Topic & Synopsis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Project Details Modal */}
      {previewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 p-5 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] my-auto">
            <button
              onClick={() => setPreviewProject(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                {previewProject.category}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {previewProject.level} • {previewProject.department}
              </span>
              <span className="text-xs font-bold text-sky-700 ml-auto">
                {previewProject.ieeeYear}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-[#111827] leading-snug">
              {previewProject.title}
            </h3>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Project Abstract & Architecture</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {previewProject.description}
              </p>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Technology Stack Employed</h4>
              <div className="flex flex-wrap gap-2">
                {previewProject.techStack.map((tech) => (
                  <span key={tech} className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 text-slate-800">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Complete Academic Deliverables Included</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {previewProject.deliverables.map((deliv, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium">
                    <CheckCircle className="w-4 h-4 fill-sky-500 text-white shrink-0" />
                    <span>{deliv}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setPreviewProject(null);
                  onOpenConsultation(previewProject.title);
                }}
                className="flex-1 py-3 rounded-lg bg-[#15803d] hover:bg-[#166534] text-white font-bold text-sm transition flex items-center justify-center gap-2"
              >
                <span>Order This Project & Get Synopsis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewProject(null)}
                className="py-3 px-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
