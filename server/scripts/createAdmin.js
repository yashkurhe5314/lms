const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

// Get command line arguments
const args = process.argv.slice(2);
const email = args[0] || 'admin@lms.com';
const password = args[1] || 'admin123';
const name = args[2] || 'Admin User';

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            console.log('Admin user already exists with this email');
            process.exit(0);
        }

        // Create admin user
        const adminUser = new User({
            name,
            email,
            password, // This will be hashed by the pre-save middleware
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully');
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Password:', password);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdminUser(); 