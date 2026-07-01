/**
 * Migration: Create batches for practicals
 * Creates A1, A2, A3, A4, B1, B2, B3, B4 batches for each TY subject and division
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/faculty_attendance';

// Import models
const Year = require('../models/Year');
const Division = require('../models/Division');
const Subject = require('../models/Subject');
const Teacher = require('../models/Teacher');
const Batch = require('../models/Batch');

async function runMigration() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find TY year
    const year = await Year.findOne({ name: 'TY' });
    if (!year) {
      console.error('❌ TY year not found!');
      process.exit(1);
    }

    // Get divisions
    const divisions = await Division.find({ year: year._id });
    console.log(`\n📚 Found ${divisions.length} divisions for TY`);

    // Get subjects
    const subjects = await Subject.find({ year: year._id });
    console.log(`📚 Found ${subjects.length} subjects for TY`);

    // Get teachers
    const teachers = await Teacher.find();
    if (teachers.length === 0) {
      console.error('❌ No teachers found! Run createTeachersAndClassrooms.js first');
      process.exit(1);
    }

    let created = 0;
    let skipped = 0;

    // Define batch mapping
    const batchMapping = {
      'A': ['A1', 'A2', 'A3', 'A4'],
      'B': ['B1', 'B2', 'B3', 'B4']
    };

    for (const subject of subjects) {
      console.log(`\n📖 ${subject.code}:`);

      for (const division of divisions) {
        const batchNumbers = batchMapping[division.name];

        for (const batchNumber of batchNumbers) {
          const existing = await Batch.findOne({
            subject: subject._id,
            division: division._id,
            batchNumber: batchNumber
          });

          if (existing) {
            console.log(`   ⏭️  ${division.name}-${batchNumber} already exists`);
            skipped++;
          } else {
            // Get a teacher for this batch (rotate through available teachers)
            const teacherIndex = (subject._id.toString().charCodeAt(0) + batchNumber.charCodeAt(0)) % teachers.length;
            const teacher = teachers[teacherIndex];

            const batch = await Batch.create({
              name: `${subject.code}-${division.name}-${batchNumber}`,
              batchNumber: batchNumber,
              division: division._id,
              subject: subject._id,
              teacher: teacher._id,
              students: 30,
              labType: subject.labType || 'Regular'
            });

            console.log(`   ✅ Created ${division.name}-${batchNumber}`);
            created++;
          }
        }
      }
    }

    console.log(`\n✨ MIGRATION COMPLETE:`);
    console.log(`   ✅ Created: ${created} batches`);
    console.log(`   ⏭️  Skipped: ${skipped} batches (already exist)`);
    console.log(`\n🎓 All batches ready for practical allocation!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
