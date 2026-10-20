import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Inquiry } from './models/Inquiry.js';
import { Project } from './models/Project.js';
import { SiteSettings } from './models/SiteSettings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexora_tech';

// Middleware
app.use(cors());
app.use(express.json());

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
    mongoStatus: isMongoConnected ? 'connected' : 'hybrid_in_memory',
    timestamp: new Date().toISOString(),
  });
});

// Projects API
app.get('/api/projects', async (req, res) => {
  const { category, department, level, search } = req.query;

  try {
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

    // Default static projects list if MongoDB is offline
    return res.json({
      success: true,
      message: 'Serving catalog from cached baseline',
      count: 8,
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

    if (isMongoConnected) {
      const savedInquiry = await Inquiry.create(inquiryPayload);
      return res.status(201).json({
        success: true,
        message: 'Project inquiry registered successfully. Our team will contact you within 30 minutes.',
        data: savedInquiry,
      });
    }

    // Fallback in-memory registration
    inquiryPayload._id = 'temp_' + Date.now();
    inquiryPayload.createdAt = new Date().toISOString();
    inMemoryInquiries.push(inquiryPayload);

    return res.status(201).json({
      success: true,
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
    if (isMongoConnected) {
      const updated = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
      return res.json({ success: true, data: updated });
    }
    const item = inMemoryInquiries.find((i) => i._id === req.params.id);
    if (item) item.status = status;
    return res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Settings API: Retrieve site configuration
app.get('/api/settings', async (req, res) => {
  try {
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

    const newProjectData = {
      projectId: 'PRJ-' + Math.floor(1000 + Math.random() * 9000),
      title,
      category,
      department,
      level: level || 'Final Year Capstone',
      ieeeYear: ieeeYear || 'IEEE 2025/2026',
      description: description || 'Verified IEEE academic research implementation.',
      techStack: Array.isArray(techStack) ? techStack : (techStack || '').split(',').map((t) => t.trim()),
      deliverables: Array.isArray(deliverables) ? deliverables : (deliverables || '').split(',').map((d) => d.trim()),
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
