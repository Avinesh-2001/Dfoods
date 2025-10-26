import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const createDefaultAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dfoods');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@dfoods.com' });
    if (existingAdmin) {
      console.log('Default admin already exists');
      return;
    }

    // Create default admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = new Admin({
      name: 'Admin User',
      email: 'admin@dfoods.com',
      password: hashedPassword,
      role: 'super_admin'
    });

    await admin.save();
    console.log('Default admin created successfully');
    console.log('Email: admin@dfoods.com');
    console.log('Password: admin123');

  } catch (error) {
    console.error('Error creating default admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

createDefaultAdmin();




