import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Project } from './models/Project.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexora_tech';

const initialProjects = [
  {
    projectId: 'nx-01',
    title: 'Multimodal Deep Learning for Real-Time Medical Imaging Diagnostics & Report Generation',
    category: 'AI/ML',
    department: 'CSE/IT',
    level: 'Final Year Capstone',
    ieeeYear: 'IEEE 2025/2026',
    techStack: ['Python', 'PyTorch', 'Vision Transformer (ViT)', 'FastAPI', 'React', 'MongoDB'],
    description: 'An automated clinical assistance system using Vision Transformers to analyze X-ray and MRI scans, generating natural language diagnostic summaries with explainable heatmaps (Grad-CAM).',
    deliverables: ['Working Model Code', 'IEEE Base Paper', 'Turnitin Plagiarism Report', 'PowerPoint Deck', 'Viva Voce Q&A Bank', 'Remote Setup'],
    trending: true,
    featured: true,
  },
  {
    projectId: 'nx-02',
    title: 'Microservices-Based Decentralized Credential Verification System on Ethereum Blockchain',
    category: 'Blockchain',
    department: 'CSE/IT',
    level: 'Final Year Capstone',
    ieeeYear: 'IEEE 2025',
    techStack: ['Solidity', 'Hardhat', 'Node.js', 'Express', 'React', 'IPFS', 'MetaMask'],
    description: 'Tamper-proof degree certificate issuance and instant verification portal for universities utilizing smart contracts, IPFS distributed storage, and zero-knowledge proofs.',
    deliverables: ['Full Smart Contracts', 'React DApp Frontend', 'SRS & Architecture Diagrams', 'Synopsis & Review PPT', 'Viva Coaching'],
    trending: true,
    featured: true,
  },
  {
    projectId: 'nx-03',
    title: 'Autonomous Smart Agriculture System with Edge AI & LoRaWAN Multi-Sensor Mesh',
    category: 'IoT/Embedded',
    department: 'ECE',
    level: 'Final Year Capstone',
    ieeeYear: 'IEEE 2025',
    techStack: ['ESP32', 'LoRa SX1278', 'TensorFlow Lite Edge', 'MQTT', 'Node.js', 'Tailwind CSS'],
    description: 'Long-range precision farming station featuring edge inference for crop disease identification, soil moisture forecasting, automated valve control, and solar battery monitoring.',
    deliverables: ['Firmware C++ Code', 'Circuit Schematics (Eagle/Proteus)', 'Backend API Server', 'Hardware Demonstration Video', 'Project Report'],
    trending: true,
    featured: true,
  },
  {
    projectId: 'nx-04',
    title: 'Real-Time Cyber Threat Intelligence & Zero-Day Ransomware Detection Platform',
    category: 'Cybersecurity',
    department: 'CSE/IT',
    level: 'Final Year Capstone',
    ieeeYear: 'IEEE 2025/2026',
    techStack: ['Python', 'Scikit-learn', 'Kafka', 'Elasticsearch', 'Docker', 'React Dashboard'],
    description: 'Enterprise security information system analyzing system kernel calls and network packet flows in real time to isolate polymorphic ransomware behaviors with high confidence.',
    deliverables: ['ML Detection Pipeline', 'Synthetic Attack Datasets', 'UML & Data Flow Diagrams', 'Final Hardbound Report', 'Mock Viva Voce'],
    trending: false,
    featured: true,
  },
  {
    projectId: 'nx-05',
    title: 'Kubernetes Cloud Cost Optimizer & Multi-Cloud Auto-Healing Infrastructure Monitor',
    category: 'Cloud/DevOps',
    department: 'CSE/IT',
    level: 'M.Tech / Thesis',
    ieeeYear: 'IEEE 2025',
    techStack: ['Go / Golang', 'Kubernetes Operator', 'Prometheus', 'Grafana', 'TypeScript', 'Express'],
    description: 'Autonomous cluster management controller forecasting pod utilization spikes using LSTM models and dynamically rightsizing spot instances to reduce AWS/GCP bills by up to 40%.',
    deliverables: ['Go Controller Code', 'Helm Charts & Manifests', 'Benchmark Performance Graphs', 'Research Thesis Draft', 'Online Deployment Guide'],
    trending: false,
    featured: true,
  },
  {
    projectId: 'nx-06',
    title: 'Enterprise AI Agent Workflow Builder with Role-Based RAG & Vector Database',
    category: 'AI/ML',
    department: 'CSE/IT',
    level: 'Final Year Capstone',
    ieeeYear: 'IEEE 2026',
    techStack: ['Python', 'LangChain', 'ChromaDB', 'Next.js', 'FastAPI', 'Tailwind CSS'],
    description: 'A visual canvas allowing non-technical enterprise staff to chain LLM agents together, connecting proprietary PDF manuals with hybrid keyword and vector semantic retrieval.',
    deliverables: ['Agent Orchestration Engine', 'Modern Web Canvas UI', 'Plagiarism Report < 8%', 'Review 1, 2, 3 Slides', '1-on-1 Code Walkthrough'],
    trending: true,
    featured: true,
  },
  {
    projectId: 'nx-07',
    title: 'Smart EV Charging Station Load Balancer with Grid Stability Predictor',
    category: 'IoT/Embedded',
    department: 'EEE',
    level: 'Final Year Capstone',
    ieeeYear: 'IEEE 2025',
    techStack: ['MATLAB / Simulink', 'Arduino Mega', 'Current Sensors', 'Node.js Dashboard', 'MQTT'],
    description: 'Intelligent power distribution algorithm preventing transformer overloads during peak EV charging hours by coordinating vehicle demand with solar microgrid generation.',
    deliverables: ['Simulink Model & Hardware Code', 'Circuit PCB Layouts', 'Power Flow Analysis Charts', 'Complete Academic Thesis', 'Viva Prep Guide'],
    trending: false,
    featured: false,
  },
  {
    projectId: 'nx-08',
    title: 'Full-Stack Tele-Health Telemedicine Portal with WebRTC Video & AI Symptom Checker',
    category: 'Full-Stack',
    department: 'MCA/BCA',
    level: 'Final Year Capstone',
    ieeeYear: 'IEEE 2024/2025',
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'WebRTC', 'Socket.io', 'Tailwind'],
    description: 'End-to-end medical teleconsultation platform with doctor appointment scheduling, encrypted real-time video calls, digital prescriptions, and automated preliminary symptom triaging.',
    deliverables: ['Full MERN Source Code', 'Database Seed Scripts', 'Complete SRS & Documentation', 'PowerPoint Presentation', '100% Viva Ready Video'],
    trending: true,
    featured: false,
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');
    await Project.deleteMany({});
    const inserted = await Project.insertMany(initialProjects);
    console.log(`✅ Seeded ${inserted.length} academic projects into MongoDB successfully.`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
