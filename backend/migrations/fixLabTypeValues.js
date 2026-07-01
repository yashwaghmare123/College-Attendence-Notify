/**
 * Migration: Fix invalid labType values in existing subjects
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/faculty_attendance';

// Import models
const Subject = require('../models/Subject');

async function runMigration() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find all subjects with invalid labType
    const subjects = await Subject.find({});
    console.log(`\n📚 Found ${subjects.length} total subjects`);

    let fixed = 0;
    for (const subject of subjects) {
      const validLabTypes = ['Regular', 'ML Lab', 'Other'];
      if (subject.labType && !validLabTypes.includes(subject.labType)) {
        subject.labType = 'Regular';
        await subject.save();
        console.log(`   ✅ Fixed ${subject.code}: labType → Regular`);
        fixed++;
      }
    }

    console.log(`\n✨ FIXED: ${fixed} subjects with invalid labType`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
