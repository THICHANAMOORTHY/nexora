import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    heroTitleLine1: {
      type: String,
      default: 'From Ideas to',
    },
    heroTitleHighlight: {
      type: String,
      default: 'Innovation.',
    },
    heroSubtitle: {
      type: String,
      default: 'Empowering Students to Build, Create, and Succeed.',
    },
    heroEyebrow: {
      type: String,
      default: 'NEXORA TECHNOLOGIES',
    },
    phone: {
      type: String,
      default: '6374742431',
    },
    email: {
      type: String,
      default: 'thichu683@gmail.com',
    },
    address: {
      type: String,
      default: 'NH-47, Palakkad Main Road, Navakkarai (P.O), Coimbatore – 641105, Tamil Nadu, India',
    },
    whatsappNumber: {
      type: String,
      default: '916374742431',
    },
    servicesList: {
      type: [String],
      default: [
        'Academic Projects',
        'IEEE Research',
        'Project Documentation',
        'Resume Building',
        'Portfolio Development',
      ],
    },
  },
  { timestamps: true }
);

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
