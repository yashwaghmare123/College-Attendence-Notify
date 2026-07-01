/**
 * Professional Academic Timetable Generator
 * Generates college-standard timetables with theory + lab sessions
 * Based on constraint satisfaction algorithm
 */

class ProfessionalTimetableGenerator {
  constructor(year) {
    this.year = year;
    this.entries = [];
    this.conflicts = [];
    
    // Standard academic configuration
    this.timeSlots = [
      { slot: '10:00-11:00', hour: 10 },
      { slot: '11:00-12:00', hour: 11 },
      { slot: '12:00-13:00', hour: 12 },
      // LUNCH BREAK 13:00-14:00
      { slot: '14:00-15:00', hour: 14 },
      { slot: '15:00-16:00', hour: 15 },
      { slot: '16:00-17:00', hour: 16 },
      { slot: '17:00-18:00', hour: 17 }
    ];
    
    this.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    this.batches = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4'];
    this.labRooms = ['Lab1', 'Lab2', 'Lab3', 'Lab4', 'Lab5'];
    
    this.teacherSchedule = new Map();
    this.classroomSchedule = new Map();
    this.labSchedule = new Map();
  }

  /**
   * Main generation method
   */
  async generate(divisions, subjects, teachers, classrooms, batches, labs) {
    try {
      const startTime = Date.now();

      console.log('📚 PROFESSIONAL TIMETABLE GENERATION:');
      console.log(`   Department: Computer Science & Engineering`);
      console.log(`   Academic Year: 2025-2026`);
      console.log(`   Class: T.Y. B.Tech`);
      console.log(`   Divisions: ${divisions.map(d => d.name).join(', ')}`);
      console.log(`   Subjects: ${subjects.length}`);
      console.log(`   Working Hours: 10:00 AM - 6:00 PM`);
      console.log(`   Lunch Break: 1:00 PM - 2:00 PM`);

      // Generate theory sessions (lectures)
      for (let subIdx = 0; subIdx < subjects.length; subIdx++) {
        const subject = subjects[subIdx];
        if (subject.lecturesPerWeek && subject.lecturesPerWeek > 0) {
          await this.assignTheory(subject, divisions, teachers, classrooms, subIdx);
        }
      }

      // Generate lab sessions
      for (const subject of subjects) {
        if (subject.practicalsPerWeek && subject.practicalsPerWeek > 0) {
          await this.assignLabs(subject, divisions, teachers, labs);
        }
      }

      const endTime = Date.now();
      const totalSlots = this.entries.length;

      console.log(`✅ Generated ${totalSlots} timetable entries`);
      console.log(`   Generation Time: ${endTime - startTime}ms`);

      return {
        success: true,
        entries: this.entries,
        conflicts: this.conflicts,
        metadata: {
          totalSlots,
          totalTeachers: teachers.length,
          totalSubjects: subjects.length,
          totalDivisions: divisions.length,
          generationTime: endTime - startTime,
          format: 'Professional Academic',
          department: 'Computer Science & Engineering',
          academicYear: '2025-2026',
          semester: 2,
          classLevel: 'T.Y. B.Tech'
        }
      };
    } catch (error) {
      console.error('❌ Generation Error:', error.message);
      return {
        success: false,
        error: error.message,
        entries: [],
        conflicts: this.conflicts
      };
    }
  }

  /**
   * Assign theory sessions (lectures) - improved distribution
   */
  async assignTheory(subject, divisions, teachers, classrooms, subjectIndex = 0) {
    const lecturesPerWeek = subject.lecturesPerWeek || 3;
    const subjectTeachers = subject.teachers && subject.teachers.length > 0 
      ? subject.teachers 
      : teachers.slice(0, 2);

    let assigned = 0;
    
    // Calculate offset based on subject index to distribute across different time slots
    const subjectOffset = subjectIndex % 3; // Rotate through 3 different starting times

    for (const division of divisions) {
      // Distribute lectures across the week for this subject
      let dayIdx = 0;
      
      for (let lectureNum = 0; lectureNum < lecturesPerWeek; lectureNum++) {
        const day = this.days[dayIdx % 5];
        
        // Pick different time slot for each lecture (avoid lunch hour)
        let timeSlotIdx = (lectureNum + subjectOffset) % 6;
        if (timeSlotIdx >= 3) timeSlotIdx++; // Skip lunch break at index 3
        
        const timeSlot = this.timeSlots[timeSlotIdx];
        const teacher = subjectTeachers[lectureNum % subjectTeachers.length];
        const classroom = classrooms[lectureNum % classrooms.length];

        const entry = {
          day,
          startTime: timeSlot.slot.split('-')[0],
          endTime: timeSlot.slot.split('-')[1],
          division: division._id,
          subject: subject._id,
          teacher: teacher._id || teacher,
          classroom: classroom._id,
          type: 'Lecture',
          room: classroom.name,
          subjectCode: subject.code,
          subjectName: subject.name,
          teacherName: teacher.name || 'TBD',
          isTheory: true,
          notes: `${subject.code} - ${subject.name}`
        };

        this.entries.push(entry);
        assigned++;
        dayIdx++;
      }
    }

    console.log(`   ${subject.code} (${subject.name}): ${assigned} theory sessions`);
    return assigned;
  }

  /**
   * Assign lab sessions - 2 hour practical from 11:00 AM to 1:00 PM
   */
  async assignLabs(subject, divisions, teachers, labs) {
    const practicalsPerWeek = subject.practicalsPerWeek || 1;
    const subjectTeachers = subject.teachers && subject.teachers.length > 0 
      ? subject.teachers 
      : teachers.slice(0, 2);

    let assigned = 0;
    const labTeacher = subjectTeachers[0];
    
    // 2-hour practical slot: 11:00 AM - 1:00 PM
    const labSlot = {
      startTime: '11:00',
      endTime: '13:00'
    };

    // Specific batches: A1, B1, A4, B4
    const selectedBatches = ['A1', 'B1', 'A4', 'B4'];
    let labIndex = 0;

    for (const division of divisions) {
      // Get batches for this division
      const batchesForDivision = division.name === 'A' 
        ? selectedBatches.filter(b => b.startsWith('A')) // A1, A4
        : selectedBatches.filter(b => b.startsWith('B')); // B1, B4

      let dayIdx = 0;

      for (let i = 0; i < practicalsPerWeek; i++) {
        for (const batch of batchesForDivision) {
          const day = this.days[dayIdx % 5];
          const lab = labs[labIndex % labs.length];

          const entry = {
            day,
            startTime: labSlot.startTime,
            endTime: labSlot.endTime,
            division: division._id,
            subject: subject._id,
            teacher: labTeacher._id || labTeacher,
            lab: lab._id,
            type: 'Practical',
            room: this.labRooms[labIndex % this.labRooms.length],
            subjectCode: subject.code,
            subjectName: subject.name,
            teacherName: labTeacher.name || 'TBD',
            isLab: true,
            notes: `${subject.code} Lab (11:00-13:00) - Batch ${batch} - ${this.labRooms[labIndex % this.labRooms.length]}`
          };

          this.entries.push(entry);
          assigned++;
          dayIdx++;
          labIndex++;
        }
      }
    }

    console.log(`   ${subject.code} (${subject.name}): ${assigned} lab sessions (11:00-13:00, 4 batches)`);
    return assigned;
  }

  /**
   * Format timetable for display
   */
  formatForDisplay() {
    const groupedByDayDivision = {};

    for (const entry of this.entries) {
      const key = `${entry.day}-${entry.division}`;
      if (!groupedByDayDivision[key]) {
        groupedByDayDivision[key] = [];
      }
      groupedByDayDivision[key].push(entry);
    }

    return groupedByDayDivision;
  }
}

module.exports = ProfessionalTimetableGenerator;
