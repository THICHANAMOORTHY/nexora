import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { Inquiry } from './models/Inquiry.js';
import { Project } from './models/Project.js';
import { SiteSettings } from './models/SiteSettings.js';
import { ServiceRequest } from './models/ServiceRequest.js';
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
const inMemoryServiceRequests = [];

// Secure file uploads directory
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `${uniqueSuffix}-${sanitized}`);
  },
});

// File filter: Whitelist allowed file extensions for security
const fileFilter = (req, file, cb) => {
  const allowedExts = /\.(pdf|doc|docx|png|jpg|jpeg|zip|ppt|pptx|txt)$/i;
  if (file.originalname.match(allowedExts)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PNG, JPG, ZIP, PPT, and TXT files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter,
});

// Static uploads serving
app.use('/uploads', express.static(UPLOADS_DIR));

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

// Health check (Supports Render root health probes and /api/health)
const healthHandler = (req, res) => {
  res.json({
    status: 'healthy',
    company: 'Nexora Technologies',
    supabaseStatus: supabase ? 'connected' : 'key_required',
    supabaseUrl: SUPABASE_URL,
    mongoStatus: isMongoConnected ? 'connected' : 'hybrid_in_memory',
    timestamp: new Date().toISOString(),
  });
};

app.get('/', healthHandler);
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

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
        const normalized = data.map((p) => ({
          ...p,
          _id: p.id,
          projectId: p.project_id || p.projectId || p.id,
          techStack: Array.isArray(p.tech_stack) ? p.tech_stack : (p.techStack || []),
          deliverables: Array.isArray(p.deliverables) ? p.deliverables : [],
          ieeeYear: p.ieee_year || p.ieeeYear || 'IEEE 2025/2026',
        }));
        return res.json({ success: true, count: normalized.length, data: normalized });
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
    const { name, phone, email, college, branch, level, domain, topic, deadline, notes, role, serviceType, serviceDetails } = req.body;

    if (!name || !phone || !email || !college) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, email, and college are mandatory fields.',
      });
    }

    // Format specific details if provided
    let enrichedNotes = notes || '';
    if (serviceDetails && typeof serviceDetails === 'object' && Object.keys(serviceDetails).length > 0) {
      const detailsList = Object.entries(serviceDetails)
        .filter(([_, v]) => v)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
        .join(' | ');
      if (detailsList) {
        enrichedNotes = enrichedNotes ? `${enrichedNotes}\n[Details: ${detailsList}]` : `[Details: ${detailsList}]`;
      }
    }

    const inquiryPayload = {
      role: role || 'student',
      name,
      phone,
      email,
      college,
      branch: branch || 'CSE/IT',
      level: level || 'Final Year Capstone',
      domain: domain || (serviceType ? serviceType : 'AI/ML & Data Science'),
      topic: topic || (serviceType ? `[${serviceType}] Inquiry` : ''),
      deadline: deadline || '',
      notes: enrichedNotes,
      serviceType: serviceType || 'Academic Projects',
      serviceDetails: serviceDetails || {},
      status: 'New',
    };

    let supabaseSaved = null;
    // 1. If Supabase is connected, store in Supabase
    if (supabase) {
      try {
        const sbPayload = {
          role: inquiryPayload.role,
          name: inquiryPayload.name,
          phone: inquiryPayload.phone,
          email: inquiryPayload.email,
          college: inquiryPayload.college,
          branch: inquiryPayload.branch,
          level: inquiryPayload.level,
          domain: inquiryPayload.domain,
          topic: inquiryPayload.topic,
          deadline: inquiryPayload.deadline,
          notes: inquiryPayload.notes,
          status: inquiryPayload.status,
        };
        const { data, error } = await supabase.from('inquiries').insert([sbPayload]).select();
        if (!error && data && data.length > 0) {
          supabaseSaved = data[0];
        } else if (error) {
          console.warn('Supabase inquiry insert warning:', error.message);
        }
      } catch (sbErr) {
        console.warn('Supabase insert warning:', sbErr.message);
      }
    }

    // 2. Also persist in MongoDB so both local and cloud databases stay in sync
    let mongoSaved = null;
    if (isMongoConnected) {
      try {
        mongoSaved = await Inquiry.create(inquiryPayload);
      } catch (mErr) {
        console.warn('MongoDB inquiry insert warning:', mErr.message);
      }
    }

    // 3. Fallback in-memory registration if neither DB is available
    if (!supabaseSaved && !mongoSaved) {
      inquiryPayload._id = 'temp_' + Date.now();
      inquiryPayload.createdAt = new Date().toISOString();
      inMemoryInquiries.push(inquiryPayload);
    }

    return res.status(201).json({
      success: true,
      source: supabaseSaved ? 'supabase' : (mongoSaved ? 'mongodb' : 'memory'),
      message: 'Project inquiry registered successfully! Our team will contact you within 30 minutes.',
      data: supabaseSaved || mongoSaved || inquiryPayload,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Retrieve inquiries (merges Supabase, MongoDB, and in-memory inquiries)
app.get('/api/inquiries', async (req, res) => {
  try {
    const allInquiries = [];
    const seenMap = new Map();

    // 1. Fetch from Supabase
    if (supabase) {
      try {
        const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
        if (!error && data) {
          data.forEach((item) => {
            const key = `${(item.email || '').toLowerCase().trim()}_${(item.phone || '').trim()}_${(item.topic || '').trim()}`;
            const normalized = {
              ...item,
              _id: item.id,
              createdAt: item.created_at || new Date().toISOString(),
            };
            seenMap.set(key, true);
            allInquiries.push(normalized);
          });
        }
      } catch (sbErr) {
        console.warn('Supabase fetch inquiries error:', sbErr.message);
      }
    }

    // 2. Fetch from MongoDB and include any inquiries not already added
    if (isMongoConnected) {
      try {
        const list = await Inquiry.find().sort({ createdAt: -1 });
        list.forEach((doc) => {
          const item = doc.toObject ? doc.toObject() : doc;
          const key = `${(item.email || '').toLowerCase().trim()}_${(item.phone || '').trim()}_${(item.topic || '').trim()}`;
          if (!seenMap.has(key)) {
            seenMap.set(key, true);
            allInquiries.push({
              ...item,
              _id: item._id ? item._id.toString() : item.id,
              createdAt: item.createdAt || new Date().toISOString(),
            });
          }
        });
      } catch (mErr) {
        console.warn('MongoDB fetch inquiries error:', mErr.message);
      }
    }

    // 3. Include any active in-memory inquiries
    inMemoryInquiries.forEach((item) => {
      const key = `${(item.email || '').toLowerCase().trim()}_${(item.phone || '').trim()}_${(item.topic || '').trim()}`;
      if (!seenMap.has(key)) {
        seenMap.set(key, true);
        allInquiries.push(item);
      }
    });

    // Sort newest inquiries first
    allInquiries.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return res.json({ success: true, count: allInquiries.length, data: allInquiries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Update inquiry status (e.g. New -> Contacted -> Completed)
app.patch('/api/inquiries/:id', async (req, res) => {
  try {
    const { status } = req.body;
    let updatedItem = null;

    if (supabase) {
      try {
        const { data, error } = await supabase.from('inquiries').update({ status }).eq('id', req.params.id).select();
        if (!error && data && data.length > 0) {
          updatedItem = data[0];
        }
      } catch (e) {
        console.warn('Supabase update status warning:', e.message);
      }
    }

    if (isMongoConnected) {
      try {
        const query = req.params.id.match(/^[0-9a-fA-F]{24}$/) 
          ? { _id: req.params.id } 
          : { email: req.body.email || '' };
        const updated = await Inquiry.findOneAndUpdate(query, { status }, { new: true });
        if (updated && !updatedItem) {
          updatedItem = updated;
        }
      } catch (mErr) {
        console.warn('MongoDB update status warning:', mErr.message);
      }
    }

    const item = inMemoryInquiries.find((i) => i._id === req.params.id || i.id === req.params.id);
    if (item) {
      item.status = status;
      if (!updatedItem) updatedItem = item;
    }

    return res.json({ success: true, data: updatedItem || { _id: req.params.id, status } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Delete inquiry
app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (supabase) {
      try {
        await supabase.from('inquiries').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase delete inquiry error:', e.message);
      }
    }

    if (isMongoConnected && id.match(/^[0-9a-fA-F]{24}$/)) {
      try {
        await Inquiry.findByIdAndDelete(id);
      } catch (mErr) {
        console.warn('MongoDB delete inquiry error:', mErr.message);
      }
    }

    const memIdx = inMemoryInquiries.findIndex((i) => i._id === id || i.id === id);
    if (memIdx !== -1) {
      inMemoryInquiries.splice(memIdx, 1);
    }

    return res.json({ success: true, message: 'Inquiry deleted successfully' });
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
    const idParam = req.params.id;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idParam);

    if (supabase) {
      try {
        let delQuery = supabase.from('projects').delete();
        if (isUUID) {
          delQuery = delQuery.eq('id', idParam);
        } else {
          delQuery = delQuery.eq('project_id', idParam);
        }
        await delQuery;
      } catch (e) {
        console.warn('Supabase delete error:', e.message);
      }
    }

    if (isMongoConnected) {
      if (mongoose.isValidObjectId(idParam)) {
        await Project.findByIdAndDelete(idParam);
      } else {
        await Project.findOneAndDelete({ projectId: idParam });
      }
      return res.json({ success: true, message: 'Project removed successfully.' });
    }
    return res.json({ success: true, message: 'Project removed (fallback).' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Update an existing project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const idParam = req.params.id;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idParam);

    const { title, category, department, level, ieeeYear, description, techStack, deliverables } = req.body;
    const techStackArr = Array.isArray(techStack) ? techStack : (techStack || '').split(',').map((t) => t.trim());
    const deliverablesArr = Array.isArray(deliverables) ? deliverables : (deliverables || '').split(',').map((d) => d.trim());

    if (supabase) {
      try {
        const updatePayload = {
          title,
          category,
          department,
          level: level || 'Final Year Capstone',
          ieee_year: ieeeYear || 'IEEE 2025/2026',
          description: description || '',
          tech_stack: techStackArr,
          deliverables: deliverablesArr,
        };

        let updateQuery = supabase.from('projects').update(updatePayload);
        if (isUUID) {
          updateQuery = updateQuery.eq('id', idParam);
        } else {
          updateQuery = updateQuery.eq('project_id', idParam);
        }

        const { data, error } = await updateQuery.select();

        if (!error && data && data.length > 0) {
          const p = data[0];
          return res.json({
            success: true,
            message: 'Project updated in Supabase successfully',
            data: {
              ...p,
              _id: p.id,
              projectId: p.project_id || p.id,
              techStack: p.tech_stack || [],
              deliverables: p.deliverables || [],
              ieeeYear: p.ieee_year || 'IEEE 2025/2026',
            },
          });
        }
      } catch (e) {
        console.warn('Supabase update project error:', e.message);
      }
    }

    if (isMongoConnected) {
      const updateData = {
        title,
        category,
        department,
        level,
        ieeeYear,
        description,
        techStack: techStackArr,
        deliverables: deliverablesArr,
      };

      let updated;
      if (mongoose.isValidObjectId(idParam)) {
        updated = await Project.findByIdAndUpdate(idParam, updateData, { new: true });
      } else {
        updated = await Project.findOneAndUpdate({ projectId: idParam }, updateData, { new: true });
      }
      return res.json({ success: true, message: 'Project updated successfully', data: updated });
    }

    return res.json({ success: true, message: 'Project updated (fallback)' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Authentication: Login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const adminEmail = (process.env.ADMIN_EMAIL || 'thichu683@gmail.com').toLowerCase();
    const fallbackEmail = 'admin@nexoratech.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin@nexora2026';

    // 1. Check with Supabase Auth if credentials match a registered Supabase user
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });
        if (!error && data && data.user) {
          return res.json({
            success: true,
            message: 'Authenticated via Supabase Auth',
            token: data.session?.access_token || 'sb_auth_token_' + Date.now(),
            user: {
              email: data.user.email,
              name: data.user.user_metadata?.name || 'Administrator',
              role: 'Super Admin',
            },
          });
        }
      } catch (sbAuthErr) {
        // Fall back to built-in admin check
      }
    }

    // 2. Validate against primary Admin credentials (thichu683@gmail.com / admin@nexoratech.com / admin)
    const isValidUser = (
      trimmedEmail === adminEmail || 
      trimmedEmail === fallbackEmail || 
      trimmedEmail === 'admin'
    );
    const isValidPass = (password === adminPassword || password === 'nexora@2026');

    if (isValidUser && isValidPass) {
      const token = 'nexora_jwt_adm_' + Buffer.from(`${trimmedEmail}:${Date.now()}`).toString('base64');
      return res.json({
        success: true,
        message: 'Admin authentication successful',
        token,
        user: {
          email: trimmedEmail === 'admin' ? adminEmail : trimmedEmail,
          name: 'Nexora Director',
          role: 'Administrator',
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid administrator credentials. Please check your email and password.',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin Authentication: Verify session
app.get('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer nexora_jwt_adm_')) {
    return res.json({ success: true, valid: true });
  }
  return res.status(401).json({ success: false, valid: false });
});

// ==========================================
// STUDENT SERVICE REQUESTS SYSTEM (4 Segments)
// 1. Project Reports
// 2. IEEE Reports
// 3. Resume Building
// 4. Portfolio Development
// ==========================================

const generateRequestId = (serviceType) => {
  const prefixMap = {
    'Project Reports': 'NXR-PR',
    'IEEE Reports': 'NXR-IEEE',
    'Resume Building': 'NXR-RES',
    'Portfolio Development': 'NXR-PORT',
  };
  const prefix = prefixMap[serviceType] || 'NXR-SR';
  const year = new Date().getFullYear();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${year}-${randomSuffix}`;
};

// 1. Submit Service Request (Supports multi-part attachments)
app.post('/api/service-requests', upload.array('attachments', 6), async (req, res) => {
  try {
    let { serviceType, student, requirements, consentGiven } = req.body;

    // Parse JSON if sent as stringified multipart form-data
    if (typeof student === 'string') {
      try { student = JSON.parse(student); } catch { student = {}; }
    }
    if (typeof requirements === 'string') {
      try { requirements = JSON.parse(requirements); } catch { requirements = {}; }
    }

    // Fallback if student fields were sent as top-level fields
    if (!student || !student.name) {
      student = {
        name: req.body.name || student?.name || '',
        email: req.body.email || student?.email || '',
        phone: req.body.phone || student?.phone || '',
        college: req.body.college || student?.college || '',
        department: req.body.department || student?.department || '',
        degree: req.body.degree || student?.degree || '',
        academicYear: req.body.academicYear || student?.academicYear || '',
        location: req.body.location || student?.location || '',
      };
    }

    if (!student.name || !student.email || !student.phone) {
      return res.status(400).json({
        success: false,
        message: 'Student name, email address, and phone number are required.',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(student.email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const validServices = ['Project Reports', 'IEEE Reports', 'Resume Building', 'Portfolio Development'];
    if (!serviceType || !validServices.includes(serviceType)) {
      serviceType = 'Project Reports';
    }

    // Process uploaded file attachments
    const attachments = (req.files || []).map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: `/uploads/${file.filename}`,
      uploadedAt: new Date(),
    }));

    const requestId = generateRequestId(serviceType);

    const serviceRequestPayload = {
      requestId,
      serviceType,
      student,
      requirements: requirements || {},
      attachments,
      status: 'Pending',
      priority: 'Normal',
      adminNotes: [],
      consentGiven: consentGiven !== undefined ? Boolean(consentGiven) : true,
      ipAddress: req.ip || req.headers['x-forwarded-for'] || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Also mirror as an inquiry in Supabase so it is backed up in the cloud and visible in Inquiries dashboard
    if (supabase) {
      try {
        const topicSummary = (requirements && typeof requirements === 'object')
          ? (requirements.projectTitle || requirements.researchTitle || requirements.targetRole || requirements.portfolioPersona || `[${serviceType}] Request`)
          : `[${serviceType}] Request`;
        const notesSummary = (requirements && typeof requirements === 'object')
          ? Object.entries(requirements).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ')
          : '';

        const sbPayload = {
          role: 'student',
          name: student.name,
          phone: student.phone,
          email: student.email,
          college: student.college || 'Engineering College',
          branch: student.department || 'CSE/IT',
          level: student.academicYear || student.degree || 'Final Year Capstone',
          domain: serviceType,
          topic: `[${serviceType}] ${topicSummary} (Req ID: ${requestId})`,
          deadline: 'Standard',
          notes: notesSummary ? `[Request ID: ${requestId}]\n${notesSummary}` : `[Request ID: ${requestId}]`,
          status: 'New',
        };
        await supabase.from('inquiries').insert([sbPayload]);
      } catch (sbLeadErr) {
        console.warn('Supabase service request lead sync warning:', sbLeadErr.message);
      }
    }

    // Store in MongoDB if connected
    if (isMongoConnected) {
      try {
        const saved = await ServiceRequest.create(serviceRequestPayload);
        return res.status(201).json({
          success: true,
          message: 'Service request submitted successfully to database.',
          requestId,
          data: saved,
        });
      } catch (dbErr) {
        console.warn('MongoDB save warning:', dbErr.message);
      }
    }

    // Fallback: Store in memory
    serviceRequestPayload._id = 'sr_' + Date.now();
    inMemoryServiceRequests.unshift(serviceRequestPayload);

    return res.status(201).json({
      success: true,
      message: 'Service request registered successfully (Active session).',
      requestId,
      data: serviceRequestPayload,
    });
  } catch (error) {
    console.error('Service request error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Admin: Get all service requests with filtering and search
app.get('/api/service-requests', async (req, res) => {
  try {
    const { serviceType, status, search } = req.query;

    if (isMongoConnected) {
      const query = {};
      if (serviceType && serviceType !== 'ALL') {
        query.serviceType = serviceType;
      }
      if (status && status !== 'ALL') {
        query.status = status;
      }
      if (search) {
        query.$or = [
          { requestId: { $regex: search, $options: 'i' } },
          { 'student.name': { $regex: search, $options: 'i' } },
          { 'student.email': { $regex: search, $options: 'i' } },
          { 'student.phone': { $regex: search, $options: 'i' } },
          { 'student.college': { $regex: search, $options: 'i' } },
        ];
      }

      const list = await ServiceRequest.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: list.length, data: list });
    }

    // Memory fallback
    let results = [...inMemoryServiceRequests];
    if (serviceType && serviceType !== 'ALL') {
      results = results.filter((r) => r.serviceType === serviceType);
    }
    if (status && status !== 'ALL') {
      results = results.filter((r) => r.status === status);
    }
    if (search) {
      const s = search.toLowerCase();
      results = results.filter(
        (r) =>
          r.requestId?.toLowerCase().includes(s) ||
          r.student?.name?.toLowerCase().includes(s) ||
          r.student?.email?.toLowerCase().includes(s) ||
          r.student?.phone?.includes(s) ||
          r.student?.college?.toLowerCase().includes(s)
      );
    }

    return res.json({ success: true, count: results.length, data: results });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Admin: Get single service request details
app.get('/api/service-requests/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      const item = await ServiceRequest.findOne({
        $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { requestId: id }],
      });
      if (item) return res.json({ success: true, data: item });
    }

    const memoryItem = inMemoryServiceRequests.find(
      (r) => r._id === id || r.requestId === id
    );
    if (memoryItem) return res.json({ success: true, data: memoryItem });

    return res.status(404).json({ success: false, message: 'Service request not found.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Admin: Update request status
app.patch('/api/service-requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['Pending', 'Reviewing', 'In Progress', 'Completed', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided.' });
    }

    if (isMongoConnected) {
      const updated = await ServiceRequest.findOneAndUpdate(
        { $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { requestId: id }] },
        { status, updatedAt: new Date() },
        { new: true }
      );
      if (updated) return res.json({ success: true, data: updated });
    }

    const item = inMemoryServiceRequests.find((r) => r._id === id || r.requestId === id);
    if (item) {
      item.status = status;
      item.updatedAt = new Date().toISOString();
      return res.json({ success: true, data: item });
    }

    return res.status(404).json({ success: false, message: 'Request not found.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Admin: Add internal note
app.post('/api/service-requests/:id/notes', async (req, res) => {
  try {
    const { id } = req.params;
    const { note, author } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({ success: false, message: 'Note text cannot be empty.' });
    }

    const newNote = {
      note: note.trim(),
      author: author || 'Admin',
      createdAt: new Date(),
    };

    if (isMongoConnected) {
      const updated = await ServiceRequest.findOneAndUpdate(
        { $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { requestId: id }] },
        { $push: { adminNotes: newNote }, updatedAt: new Date() },
        { new: true }
      );
      if (updated) return res.json({ success: true, data: updated });
    }

    const item = inMemoryServiceRequests.find((r) => r._id === id || r.requestId === id);
    if (item) {
      item.adminNotes = item.adminNotes || [];
      item.adminNotes.push(newNote);
      return res.json({ success: true, data: item });
    }

    return res.status(404).json({ success: false, message: 'Request not found.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Admin: Securely download attachment
app.get('/api/service-requests/attachment/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const safeFilename = path.basename(filename);
    const filePath = path.join(UPLOADS_DIR, safeFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found or expired.' });
    }

    res.download(filePath, safeFilename);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Nexora Technologies API Server listening on port ${PORT}`);
});
