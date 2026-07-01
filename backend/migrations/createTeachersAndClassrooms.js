/**
 * Migration: Create teachers and classrooms for TY year
 * Assigns teachers to subjects and creates classrooms for timetable generation
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/faculty_attendance';

// Import models
const Year = require('../models/Year');
const Subject = require('../models/Subject');
const Teacher = require('../models/Teacher');
const Division = require('../models/Division');
const Classroom = require('../models/Classroom');

async function runMigration() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find TY year
    const year = await Year.findOne({ name: 'TY' });
    if (!year) {
      console.error('❌ TY year not found! Run createRequiredSubjects.js first');
      process.exit(1);
    }

    // Get all subjects for TY
    const subjects = await Subject.find({ year: year._id });
    console.log(`\n📚 Found ${subjects.length} subjects for TY`);

    // Define teachers
    const teacherData = [
      { name: 'Prof. Rajesh Kumar', email: 'rajesh@sggs.ac.in', department: 'CSE' },
      { name: 'Prof. Priya Sharma', email: 'priya@sggs.ac.in', department: 'CSE' },
      { name: 'Prof. Amit Patel', email: 'amit@sggs.ac.in', department: 'CSE' },
      { name: 'Prof. Sneha Singh', email: 'sneha@sggs.ac.in', department: 'CSE' },
      { name: 'Prof. Vikram Gupta', email: 'vikram@sggs.ac.in', department: 'CSE' },
      { name: 'Prof. Anjali Verma', email: 'anjali@sggs.ac.in', department: 'CSE' }
    ];

    let teachersCreated = 0;
    const teachers = [];

    for (const data of teacherData) {
      const existing = await Teacher.findOne({ email: data.email });
      if (existing) {
        teachers.push(existing);
      } else {
        const teacher = await Teacher.create(data);
        teachers.push(teacher);
        teachersCreated++;
      }
    }

    console.log(`✅ Teachers ready: ${teachersCreated} created, ${teacherData.length - teachersCreated} already exist`);

    // Assign teachers to subjects
    console.log(`\n📖 Assigning teachers to subjects...`);
    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];
      const teacher = teachers[i % teachers.length];
      
      // Add teacher to subject if not already there
      if (!subject.teachers.includes(teacher._id)) {
        subject.teachers.push(teacher._id);
        await subject.save();
        console.log(`   ✅ ${subject.code}: ${teacher.name}`);
      }
    }

    // Create classrooms for divisions
    const divisions = await Division.find({ year: year._id });
    if (divisions.length === 0) {
      console.log('\n📝 Creating divisions...');
      const newDivisions = await Division.insertMany([
        { name: 'A', year: year._id, displayName: 'A Division', capacity: 60 },
        { name: 'B', year: year._id, displayName: 'B Division', capacity: 60 }
      ]);
      divisions.push(...newDivisions);
    }

    // Create classrooms
    console.log(`\n🏫 Creating classrooms...`);
    const classroomData = [
      { name: 'Room 101', year: year._id, capacity: 60, type: 'Lecture Hall' },
      { name: 'Room 102', year: year._id, capacity: 60, type: 'Lecture Hall' },
      { name: 'Room 103', year: year._id, capacity: 60, type: 'Lecture Hall' },
      { name: 'Room 104', year: year._id, capacity: 60, type: 'Lecture Hall' },
      { name: 'Room 105', year: year._id, capacity: 60, type: 'Lecture Hall' }
    ];

    let classroomsCreated = 0;
    for (const data of classroomData) {
      const existing = await Classroom.findOne({ name: data.name, year: year._id });
      if (!existing) {
        await Classroom.create(data);
        classroomsCreated++;
        console.log(`   ✅ Created ${data.name}`);
      } else {
        console.log(`   ⏭️  ${data.name} already exists`);
      }
    }

    console.log(`\n✨ MIGRATION COMPLETE:`);
    console.log(`   ✅ Teachers: Ready (${teachers.length} teachers)`);
    console.log(`   ✅ Subjects: Assigned teachers (${subjects.length} subjects)`);
    console.log(`   ✅ Divisions: Ready (${divisions.length} divisions)`);
    console.log(`   ✅ Classrooms: Created (${classroomsCreated} new classrooms)`);
    console.log(`\n🎓 System ready for timetable generation!`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
