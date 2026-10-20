export interface Project {
  id: string;
  projectId?: string;
  title: string;
  category: 'AI/ML' | 'Full-Stack' | 'IoT/Embedded' | 'Cybersecurity' | 'Cloud/DevOps' | 'Blockchain';
  department: 'CSE/IT' | 'ECE' | 'EEE' | 'MCA/BCA' | 'Mech';
  level: 'Final Year Capstone' | 'Mini Project' | 'M.Tech / Thesis';
  ieeeYear: string;
  techStack: string[];
  description: string;
  deliverables: string[];
  trending?: boolean;
  featured?: boolean;
}

// Clean projects catalog - populated dynamically from database
export const sampleProjects: Project[] = [];
