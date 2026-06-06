require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ctms';

// Inline the User schema to avoid circular issues during seeding
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, lowercase: true, unique: true },
    password: String,
    role: String,
    flatNumber: { type: String, default: '' },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);

const seedAll = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB');

    const hashedPassword = await bcrypt.hash('Password123', 12);

    const usersToSeed = [
      {
        name: 'Super Admin',
        email: 'admin@ctms.com',
        password: hashedPassword,
        role: 'Admin',
        flatNumber: '',
      },
      {
        name: 'Property Manager',
        email: 'manager@ctms.com',
        password: hashedPassword,
        role: 'Manager',
        flatNumber: '',
      },
      {
        name: 'Flat Resident',
        email: 'member@ctms.com',
        password: hashedPassword,
        role: 'Member',
        flatNumber: 'A-101',
      }
    ];

    for (const userData of usersToSeed) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`ℹ️  User already exists: ${userData.email}`);
      } else {
        await User.create(userData);
        console.log(`✅ Account created: ${userData.email} (${userData.role})`);
      }
    }

    console.log('\n🎉 Seed complete! You can now log in using any of the above emails with password: Password123');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  }
};

seedAll();
