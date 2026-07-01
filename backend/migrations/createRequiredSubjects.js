/**
 * Migration: Create all required CS subjects for TY (Third Year)
 * Subjects: DCN, FCS, FIP + 3 others
 * All with lectures and practicals enabled
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/faculty_attendance';

// Import models
const Year = require('../models/Year');
const Subject = require('../models/Subject');

async function runMigration() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find or create TY year
    let year = await Year.findOne({ name: 'TY' });
    if (!year) {
      year = await Year.create({
        name: 'TY',
        displayName: 'Third Year',
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        lecturesPerWeek: 5,
        practicalsPerWeek: 1
      });
      console.log('📅 Created TY year');
    }

    // Define 6 required subjects
    const subjects = [
      {
        name: 'Data Communication and Networks',
        code: 'DCN',
        year: year._id,
        credits: 4,
        lecturesPerWeek: 5,
        practicalsPerWeek: 1,
        requiresLab: true,
        labType: 'Regular',
        color: '#3B82F6'
      },
      {
        name: 'Formal Languages and Compiler Design',
        code: 'FCS',
        year: year._id,
        credits: 4,
        lecturesPerWeek: 5,
        practicalsPerWeek: 1,
        requiresLab: true,
        labType: 'Regular',
        color: '#8B5CF6'
      },
      {
        name: 'Foundation of Information Preservation',
        code: 'FIP',
        year: year._id,
        credits: 4,
        lecturesPerWeek: 5,
        practicalsPerWeek: 1,
        requiresLab: true,
        labType: 'Regular',
        color: '#EC4899'
      },
      {
        name: 'Artificial Intelligence and Machine Learning',
        code: 'AIML',
        year: year._id,
        credits: 4,
        lecturesPerWeek: 5,
        practicalsPerWeek: 1,
        requiresLab: true,
        labType: 'ML Lab',
        color: '#10B981'
      },
      {
        name: 'Cloud Computing and DevOps',
        code: 'CCDO',
        year: year._id,
        credits: 4,
        lecturesPerWeek: 5,
        practicalsPerWeek: 1,
        requiresLab: true,
        labType: 'Regular',
        color: '#F59E0B'
      },
      {
        name: 'Cybersecurity and Cryptography',
        code: 'CC',
        year: year._id,
        credits: 4,
        lecturesPerWeek: 5,
        practicalsPerWeek: 1,
        requiresLab: true,
        labType: 'Regular',
        color: '#EF4444'
      }
    ];

    let created = 0;
    let skipped = 0;

    for (const subjectData of subjects) {
      // Check if subject already exists
      const existing = await Subject.findOne({
        code: subjectData.code,
        year: year._id
      });

      if (existing) {
        console.log(`⏭️  Skipped ${subjectData.code} (already exists)`);
        skipped++;
      } else {
        const subject = await Subject.create(subjectData);
        console.log(`✅ Created ${subjectData.code}: ${subjectData.name}`);
        created++;
      }
    }

    console.log(`\n📊 MIGRATION COMPLETE:`);
    console.log(`   ✅ Created: ${created} subjects`);
    console.log(`   ⏭️  Skipped: ${skipped} subjects (already exist)`);
    console.log(`   📚 Total subjects in TY: ${created + skipped}`);
    console.log(`\n✨ All required subjects are now available for timetable generation!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
