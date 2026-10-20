-- Nexora Technologies Database Schema for Supabase PostgreSQL

-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id VARCHAR(50) UNIQUE,
  title TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  level VARCHAR(100) DEFAULT 'Final Year Capstone',
  ieee_year VARCHAR(50) DEFAULT 'IEEE 2025/2026',
  description TEXT,
  tech_stack TEXT[],
  deliverables TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Inquiries Table (Student & College Leads)
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  college VARCHAR(255) NOT NULL,
  branch VARCHAR(100) DEFAULT 'CSE/IT',
  level VARCHAR(100) DEFAULT 'Final Year Capstone',
  domain VARCHAR(100) DEFAULT 'AI/ML & Data Science',
  topic TEXT,
  deadline VARCHAR(100),
  notes TEXT,
  role VARCHAR(50) DEFAULT 'student',
  status VARCHAR(50) DEFAULT 'New',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Site Settings Table (Hero & Contact Info)
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  hero_title_line1 TEXT DEFAULT 'From Ideas to',
  hero_title_highlight TEXT DEFAULT 'Innovation.',
  hero_subtitle TEXT DEFAULT 'Empowering Students to Build, Create, and Succeed.',
  hero_eyebrow TEXT DEFAULT 'NEXORA TECHNOLOGIES',
  phone VARCHAR(50) DEFAULT '6374742431',
  email VARCHAR(255) DEFAULT 'thichu683@gmail.com',
  address TEXT DEFAULT 'NH-47, Palakkad Main Road, Navakkarai (P.O), Coimbatore – 641105, Tamil Nadu, India',
  whatsapp_number VARCHAR(50) DEFAULT '916374742431',
  services_list TEXT[] DEFAULT ARRAY['Academic Projects', 'IEEE Research', 'Project Documentation', 'Resume Building', 'Portfolio Development'],
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default row if not exists
INSERT INTO site_settings (id, hero_title_line1, hero_title_highlight, hero_subtitle, phone, email, address, whatsapp_number)
VALUES (
  1,
  'From Ideas to',
  'Innovation.',
  'Empowering Students to Build, Create, and Succeed.',
  '6374742431',
  'thichu683@gmail.com',
  'NH-47, Palakkad Main Road, Navakkarai (P.O), Coimbatore – 641105, Tamil Nadu, India',
  '916374742431'
)
ON CONFLICT (id) DO NOTHING;

-- Enable Public Read on Projects and Site Settings
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public insert on inquiries" ON inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public update on site_settings" ON site_settings FOR ALL USING (true);
CREATE POLICY "Allow admin all on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow admin all on inquiries" ON inquiries FOR ALL USING (true);
