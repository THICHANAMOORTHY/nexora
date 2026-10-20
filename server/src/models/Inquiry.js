import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['student', 'college'],
      default: 'student',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    college: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      default: 'CSE/IT',
    },
    level: {
      type: String,
      default: 'Final Year Capstone',
    },
    domain: {
      type: String,
      default: 'AI/ML & Data Science',
    },
    topic: {
      type: String,
      trim: true,
    },
    deadline: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    serviceType: {
      type: String,
      default: 'Academic Projects',
    },
    serviceDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Synopsis Sent', 'Enrolled', 'Delivered', 'Cancelled'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
