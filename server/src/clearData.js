import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Project } from './models/Project.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexora_tech';

async function clearData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB...');
    const result = await Project.deleteMany({});
    console.log(`✅ Cleared ${result.deletedCount} mock projects from MongoDB.`);
    process.exit(0);
  } catch (err) {
    console.error('Error clearing data:', err);
    process.exit(1);
  }
}

clearData();
