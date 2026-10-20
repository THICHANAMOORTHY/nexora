import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Inquiry } from './models/Inquiry.js';
import { Project } from './models/Project.js';
import { SiteSettings } from './models/SiteSettings.js';
import { supabase, SUPABASE_URL } from './supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexora_tech';

// Middleware
app.use(cors());
app.use(express.json());

if (supabase) {
  console.log(`⚡ Supabase client connected to ${SUPABASE_URL}`);
} else {
  console.log(`ℹ️ Supabase key not set yet. Running with MongoDB / memory fallback.`);
}

// In-memory fallback if MongoDB instance isn't active locally yet
let isMongoConnected = false;
const inMemoryInquiries = [];
let inMemorySettings = {
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

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB successfully.');
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB connection warning (Operating in fallback hybrid mode):', err.message);
  });

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    company: 'Nexora Technologies',
    supabaseStatus: supabase ? 'connected' : 'key_required',
    supabaseUrl: SUPABASE_URL,
    mongoStatus: isMongoConnected ? 'connected' : 'hybrid_in_memory',
    timestamp: new Date().toISOString(),
  });
});

// Projects API
app.get('/api/projects', async (req, res) => {
  const { category, department, level, search } = req.query;

  try {
    if (supabase) {
      let sbQuery = supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (category && category !== 'ALL') sbQuery = sbQuery.eq('category', category);
      if (department && department !== 'ALL') sbQuery = sbQuery.eq('department', department);
      if (level && level !== 'ALL') sbQuery = sbQuery.eq('level', level);
      if (search) sbQuery = sbQuery.ilike('title', `%${search}%`);

      const { data, error } = await sbQuery;
      if (!error && data && data.length > 0) {
        return res.json({ success: true, count: data.length, data });
      }
    }

    if (isMongoConnected) {
      const query = {};
      if (category && category !== 'ALL') query.category = category;
      if (department && department !== 'ALL') query.department = department;
      if (level && level !== 'ALL') query.level = level;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      const projects = await Project.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: projects.length, data: projects });
    }

    // Default static projects list if database is offline
    return res.json({
      success: true,
      message: 'Serving catalog from baseline',
      count: 0,
      data: [],
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Submit Lead Inquiry (Student or College)
app.post('/api/inquiries', async (req, res) => {
  try {
    const { name, phone, email, college, branch, level, domain, topic, deadline, notes, role } = req.body;

    if (!name || !phone || !email || !college) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, email, and college are mandatory fields.',
      });
    }

    const inquiryPayload = {
      role: role || 'student',
      name,
      phone,
      email,
      college,
      branch: branch || 'CSE/IT',
      level: level || 'Final Year Capstone',
      domain: domain || 'AI/ML & Data Science',
      topic: topic || '',
      deadline: deadline || '',
      notes: notes || '',
      status: 'New',
    };

    // 1. If Supabase is connected, store in Supabase
    if (supabase) {
      try {
        const { data, error } = await supabase.from('inquiries').insert([inquiryPayload]).select();
        if (!error && data && data.length > 0) {
          return res.status(201).json({
            success: true,
            source: 'supabase',
            message: 'Project inquiry registered successfully in Supabase! Our team will contact you within 30 minutes.',
            data: data[0],
          });
        }
      } catch (sbErr) {
        console.warn('Supabase insert warning:', sbErr.message);
      }
    }

    // 2. If Mongo connected
    if (isMongoConnected) {
      const savedInquiry = await Inquiry.create(inquiryPayload);
      return res.status(201).json({
        success: true,
        source: 'mongodb',
        message: 'Project inquiry registered successfully. Our team will contact you within 30 minutes.',
        data: savedInquiry,
      });
    }

    // 3. Fallback in-memory registration
    inquiryPayload._id = 'temp_' + Date.now();
    inquiryPayload.createdAt = new Date().toISOString();
    inMemoryInquiries.push(inquiryPayload);

    return res.status(201).json({
      success: true,
      source: 'memory',
      message: 'Project inquiry registered successfully (Active in-memory). Our team will contact you within 30 minutes.',
      data: inquiryPayload,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Retrieve inquiries
app.get('/api/inquiries', async (req, res) => {
  try {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          return res.json({ success: true, source: 'supabase', count: data.length, data });
        }
      } catch (sbErr) {
        console.warn('Supabase fetch inquiries error:', sbErr.message);
      }
    }

    if (isMongoConnected) {
      const list = await Inquiry.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: list.length, data: list });
    }
    return res.json({ success: true, count: inMemoryInquiries.length, data: inMemoryInquiries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Update inquiry status (e.g. New -> Contacted -> Completed)
app.patch('/api/inquiries/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (supabase) {
      try {
        const { data, error } = await supabase.from('inquiries').update({ status }).eq('id', req.params.id).select();
        if (!error && data && data.length > 0) {
          return res.json({ success: true, source: 'supabase', data: data[0] });
        }
      } catch (e) {
        console.warn('Supabase update status warning:', e.message);
      }
    }

    if (isMongoConnected) {
      const updated = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
      return res.json({ success: true, data: updated });
    }
    const item = inMemoryInquiries.find((i) => i._id === req.params.id || i.id === req.params.id);
    if (item) item.status = status;
    return res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Settings API: Retrieve site configuration
app.get('/api/settings', async (req, res) => {
  try {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
        if (!error && data) {
          return res.json({
            success: true,
            source: 'supabase',
            data: {
              heroTitleLine1: data.hero_title_line1,
              heroTitleHighlight: data.hero_title_highlight,
              heroSubtitle: data.hero_subtitle,
              heroEyebrow: data.hero_eyebrow,
              phone: data.phone,
              email: data.email,
              address: data.address,
              whatsappNumber: data.whatsapp_number,
              servicesList: data.services_list,
            },
          });
        }
      } catch (e) {
        console.warn('Supabase get settings warning:', e.message);
      }
    }

    if (isMongoConnected) {
      let settings = await SiteSettings.findOne();
      if (!settings) {
        settings = await SiteSettings.create(inMemorySettings);
      }
      return res.json({ success: true, data: settings });
    }
    return res.json({ success: true, data: inMemorySettings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Settings API: Update site configuration (Hero section, contact, phone, email, address)
app.put('/api/settings', async (req, res) => {
  try {
    const updateData = req.body;

    if (supabase) {
      try {
        const supabaseRow = {
          id: 1,
          hero_title_line1: updateData.heroTitleLine1,
          hero_title_highlight: updateData.heroTitleHighlight,
          hero_subtitle: updateData.heroSubtitle,
          hero_eyebrow: updateData.heroEyebrow,
          phone: updateData.phone,
          email: updateData.email,
          address: updateData.address,
          whatsapp_number: updateData.whatsappNumber,
          services_list: updateData.servicesList,
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase.from('site_settings').upsert(supabaseRow).select();
        if (!error && data) {
          console.log('✅ Settings synced to Supabase site_settings table.');
        }
      } catch (e) {
        console.warn('Supabase settings upsert error:', e.message);
      }
    }

    if (isMongoConnected) {
      let settings = await SiteSettings.findOne();
      if (!settings) {
        settings = await SiteSettings.create(updateData);
      } else {
        Object.assign(settings, updateData);
        await settings.save();
      }
      return res.json({
        success: true,
        message: 'Settings updated successfully in database.',
        data: settings,
      });
    }

    inMemorySettings = { ...inMemorySettings, ...updateData };
    return res.json({
      success: true,
      message: 'Settings updated successfully (In-memory fallback).',
      data: inMemorySettings,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Add a new verified Project
app.post('/api/projects', async (req, res) => {
  try {
    const { title, category, department, level, ieeeYear, description, techStack, deliverables } = req.body;
    if (!title || !category || !department) {
      return res.status(400).json({ success: false, message: 'Title, category, and department are required.' });
    }

    const techStackArr = Array.isArray(techStack) ? techStack : (techStack || '').split(',').map((t) => t.trim());
    const deliverablesArr = Array.isArray(deliverables) ? deliverables : (deliverables || '').split(',').map((d) => d.trim());

    if (supabase) {
      try {
        const { data, error } = await supabase.from('projects').insert([{
          project_id: 'PRJ-' + Math.floor(1000 + Math.random() * 9000),
          title,
          category,
          department,
          level: level || 'Final Year Capstone',
          ieee_year: ieeeYear || 'IEEE 2025/2026',
          description: description || 'Verified IEEE academic research implementation.',
          tech_stack: techStackArr,
          deliverables: deliverablesArr,
        }]).select();

        if (!error && data && data.length > 0) {
          return res.status(201).json({ success: true, message: 'Project added to Supabase!', data: data[0] });
        }
      } catch (e) {
        console.warn('Supabase add project error:', e.message);
      }
    }

    const newProjectData = {
      projectId: 'PRJ-' + Math.floor(1000 + Math.random() * 9000),
      title,
      category,
      department,
      level: level || 'Final Year Capstone',
      ieeeYear: ieeeYear || 'IEEE 2025/2026',
      description: description || 'Verified IEEE academic research implementation.',
      techStack: techStackArr,
      deliverables: deliverablesArr,
    };

    if (isMongoConnected) {
      const created = await Project.create(newProjectData);
      return res.status(201).json({ success: true, message: 'Project added successfully', data: created });
    }

    return res.status(201).json({ success: true, message: 'Project created (local)', data: newProjectData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Delete a project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    if (supabase) {
      try {
        await supabase.from('projects').delete().or(`id.eq.${req.params.id},project_id.eq.${req.params.id}`);
      } catch (e) {
        console.warn('Supabase delete error:', e.message);
      }
    }

    if (isMongoConnected) {
      await Project.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Project removed successfully.' });
    }
    return res.json({ success: true, message: 'Project removed (fallback).' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Nexora Technologies API Server listening on port ${PORT}`);
});
