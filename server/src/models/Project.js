import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['AI/ML', 'Full-Stack', 'IoT/Embedded', 'Cybersecurity', 'Cloud/DevOps', 'Blockchain'],
    },
    department: {
      type: String,
      required: true,
      enum: ['CSE/IT', 'ECE', 'EEE', 'MCA/BCA', 'Mech'],
    },
    level: {
      type: String,
      required: true,
      enum: ['Final Year Capstone', 'Mini Project', 'M.Tech / Thesis'],
    },
    ieeeYear: {
      type: String,
      default: 'IEEE 2025/2026',
    },
    techStack: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    deliverables: [
      {
        type: String,
      },
    ],
    trending: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model('Project', projectSchema);
