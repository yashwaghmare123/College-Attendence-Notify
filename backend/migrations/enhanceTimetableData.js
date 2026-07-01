/**
 * Migration: Enhance Timetable Data
 * Purpose: Update Year working days to Mon-Fri (no Saturday) and increase subject lectures
 */

const mongoose = require('mongoose');
const path = require('path');

// Import models directly
const Year = require('../models/Year');
const Subject = require('../models/Subject');

async function migrate() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/faculty_attendance';
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000
    });
    
    console.log('✅ Connected to MongoDB');

    console.log('\n🔄 Enhancing timetable data...');

    // Update Years to have Mon-Fri only
    const yearResult = await Year.updateMany(
      {},
      {
        $set: {
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }
      }
    );
    console.log(`✅ Updated ${yearResult.modifiedCount} years to use Mon-Fri working days`);

    // Increase lectures per week for all subjects
    const subjectResult = await Subject.updateMany(
      {},
      {
        $set: {
          lecturesPerWeek: 5,      // 5 lectures per week (1 per day)
          practicalsPerWeek: 1,    // 1 practical per week
          requiresLab: true        // Most subjects need lab
        }
      }
    );
    console.log(`✅ Updated ${subjectResult.modifiedCount} subjects to have 5 lectures + 1 practical per week`);

    // Get all subjects and show updates
    const subjects = await Subject.find().limit(10);
    console.log(`\n📚 Sample subjects updated:`);
    for (const subject of subjects) {
      console.log(`   • ${subject.code}: ${subject.lecturesPerWeek} lectures, ${subject.practicalsPerWeek} practicals`);
    }

    console.log('\n✅ Migration complete!');
    console.log('   Next step: Regenerate the timetable');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();

