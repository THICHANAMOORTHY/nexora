import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    serviceType: {
      type: String,
      required: true,
      enum: ['Project Reports', 'IEEE Reports', 'Resume Building', 'Portfolio Development'],
      index: true,
    },
    student: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
      college: { type: String, trim: true, default: '' },
      department: { type: String, trim: true, default: '' },
      degree: { type: String, trim: true, default: '' },
      academicYear: { type: String, trim: true, default: '' },
      location: { type: String, trim: true, default: '' },
    },
    // Contains all service-specific structured answers
    requirements: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      default: {},
    },
    // Uploaded reference documents, diagrams, PDFs, etc.
    attachments: [
      {
        filename: { type: String, required: true },
        originalName: { type: String, required: true },
        mimetype: { type: String },
        size: { type: Number },
        path: { type: String },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ['Pending', 'Reviewing', 'In Progress', 'Completed', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    priority: {
      type: String,
      enum: ['Normal', 'High', 'Urgent'],
      default: 'Normal',
    },
    adminNotes: [
      {
        note: { type: String, required: true },
        author: { type: String, default: 'Admin' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    consentGiven: {
      type: Boolean,
      default: true,
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
