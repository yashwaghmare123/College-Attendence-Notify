/**
 * Timetable Generation Algorithm
 * Uses constraint satisfaction with conflict detection
 */

const { Teacher, Subject, Division, Classroom, Lab, Batch } = require('../database');

class TimetableGenerator {
  constructor(year) {
    this.year = year;
    this.timeSlots = [];
    this.entries = [];
    this.conflicts = [];
    this.teacherSchedule = new Map(); // Teacher -> Set of (day, startTime, endTime)
    this.classroomSchedule = new Map(); // Classroom -> Set of (day, startTime, endTime)
    this.labSchedule = new Map(); // Lab -> Set of (day, startTime, endTime)
  }

  /**
   * Generate all time slots for the year
   */
  generateTimeSlots() {
    const startHour = parseInt(this.year.startTime.split(':')[0]);
    const endHour = parseInt(this.year.endTime.split(':')[0]);
    const lectureHours = this.year.lectureHours;
    const breakStart = this.year.breakStartTime;
    const breakEnd = this.year.breakEndTime;
    const workingDays = this.year.workingDays;

    this.timeSlots = [];

    for (const day of workingDays) {
      let currentHour = startHour;

      while (currentHour + lectureHours <= endHour) {
        const startTime = `${String(currentHour).padStart(2, '0')}:00`;
        const nextHour = currentHour + lectureHours;
        const endTime = `${String(nextHour).padStart(2, '0')}:00`;

        // Check if this slot overlaps with break
        const [breakStartHour] = breakStart.split(':').map(Number);
        const [breakEndHour] = breakEnd.split(':').map(Number);

        if (!(nextHour <= breakStartHour || currentHour >= breakEndHour)) {
          // Skip this slot as it overlaps with break
          currentHour = breakEndHour;
          continue;
        }

        this.timeSlots.push({
          day,
          startTime,
          endTime,
          available: true
        });

        currentHour = nextHour;

        // Skip break if next slot would overlap
        if (currentHour === breakStartHour) {
          currentHour = breakEndHour;
        }
      }
    }

    return this.timeSlots;
  }

  /**
   * Check if a teacher has a conflict at given time
   */
  hasTeacherConflict(teacherId, day, startTime, endTime) {
    const key = teacherId.toString();
    if (!this.teacherSchedule.has(key)) {
      this.teacherSchedule.set(key, new Set());
    }

    const schedule = this.teacherSchedule.get(key);
    
    for (const slot of schedule) {
      const [slotDay, slotStart, slotEnd] = slot.split('|');
      if (slotDay === day && this.timesOverlap(startTime, endTime, slotStart, slotEnd)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if a classroom has a conflict at given time
   */
  hasClassroomConflict(classroomId, day, startTime, endTime) {
    const key = classroomId.toString();
    if (!this.classroomSchedule.has(key)) {
      this.classroomSchedule.set(key, new Set());
    }

    const schedule = this.classroomSchedule.get(key);
    
    for (const slot of schedule) {
      const [slotDay, slotStart, slotEnd] = slot.split('|');
      if (slotDay === day && this.timesOverlap(startTime, endTime, slotStart, slotEnd)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if a lab has a conflict at given time
   */
  hasLabConflict(labId, day, startTime, endTime) {
    const key = labId.toString();
    if (!this.labSchedule.has(key)) {
      this.labSchedule.set(key, new Set());
    }

    const schedule = this.labSchedule.get(key);
    
    for (const slot of schedule) {
      const [slotDay, slotStart, slotEnd] = slot.split('|');
      if (slotDay === day && this.timesOverlap(startTime, endTime, slotStart, slotEnd)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Add a teacher to the schedule
   */
  addTeacherSchedule(teacherId, day, startTime, endTime) {
    const key = teacherId.toString();
    if (!this.teacherSchedule.has(key)) {
      this.teacherSchedule.set(key, new Set());
    }
    this.teacherSchedule.get(key).add(`${day}|${startTime}|${endTime}`);
  }

  /**
   * Add a classroom to the schedule
   */
  addClassroomSchedule(classroomId, day, startTime, endTime) {
    const key = classroomId.toString();
    if (!this.classroomSchedule.has(key)) {
      this.classroomSchedule.set(key, new Set());
    }
    this.classroomSchedule.get(key).add(`${day}|${startTime}|${endTime}`);
  }

  /**
   * Add a lab to the schedule
   */
  addLabSchedule(labId, day, startTime, endTime) {
    const key = labId.toString();
    if (!this.labSchedule.has(key)) {
      this.labSchedule.set(key, new Set());
    }
    this.labSchedule.get(key).add(`${day}|${startTime}|${endTime}`);
  }

  /**
   * Check if two time slots overlap
   */
  timesOverlap(start1, end1, start2, end2) {
    const time1Start = this.timeToMinutes(start1);
    const time1End = this.timeToMinutes(end1);
    const time2Start = this.timeToMinutes(start2);
    const time2End = this.timeToMinutes(end2);

    return !(time1End <= time2Start || time1Start >= time2End);
  }

  /**
   * Convert time string to minutes
   */
  timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Assign lectures for a subject
   */
  async assignLectures(subject, divisions, teachers, classrooms) {
    let assigned = 0;
    const lecturesNeeded = subject.lecturesPerWeek || 5;
    const daysPerWeek = 5; // Mon-Fri
    const lecturesPerDay = Math.ceil(lecturesNeeded / daysPerWeek); // 1-2 per day
    
    // Create multiple lectures per day for each division
    for (const division of divisions) {
      for (let dayIdx = 0; dayIdx < daysPerWeek; dayIdx++) {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        const day = days[dayIdx];
        
        // Create 2-3 lectures for this subject on this day
        for (let lectureNum = 0; lectureNum < lecturesPerDay && assigned < lecturesNeeded; lectureNum++) {
          const teacher = teachers[assigned % teachers.length];
          const classroom = classrooms[assigned % classrooms.length];
          
          // Pick different time slots for each lecture
          const hours = [9, 10, 11, 13, 14, 15, 16]; // Skip 12-13 (lunch)
          const hour = hours[(dayIdx * lecturesPerDay + lectureNum) % hours.length];
          
          const startTime = `${String(hour).padStart(2, '0')}:00`;
          const endTime = `${String(hour + 1).padStart(2, '0')}:00`;
          
          // Check for conflicts
          if (!this.hasTeacherConflict(teacher._id, day, startTime, endTime) &&
              !this.hasClassroomConflict(classroom._id, day, startTime, endTime)) {
            
            // Add to schedule
            this.addTeacherSchedule(teacher._id, day, startTime, endTime);
            this.addClassroomSchedule(classroom._id, day, startTime, endTime);

            // Create entry
            this.entries.push({
              day,
              startTime,
              endTime,
              division: division._id,
              subject: subject._id,
              teacher: teacher._id,
              classroom: classroom._id,
              type: 'Lecture',
              room: classroom.name
            });

            assigned++;
          }
        }
      }
    }

    return assigned;
  }

  /**
   * Assign practicals for a subject
   */
  async assignPracticals(batches, labs) {
    let assigned = 0;

    for (const batch of batches) {
      let practicalSlotFound = false;

      // Find a 2-hour slot for practical
      for (let i = 0; i < this.timeSlots.length - 1; i++) {
        const slot1 = this.timeSlots[i];
        const slot2 = this.timeSlots[i + 1];

        // Check if slots are consecutive (same day and consecutive hours)
        if (slot1.day === slot2.day && 
            this.timeToMinutes(slot2.startTime) - this.timeToMinutes(slot1.endTime) === 0) {
          
          const lab = labs[assigned % labs.length];
          const teacher = batch.teacher;

          // Check for conflicts (practical is 2 hours)
          if (!this.hasTeacherConflict(teacher._id, slot1.day, slot1.startTime, slot2.endTime) &&
              !this.hasLabConflict(lab._id, slot1.day, slot1.startTime, slot2.endTime)) {
            
            // Add to schedule
            this.addTeacherSchedule(teacher._id, slot1.day, slot1.startTime, slot2.endTime);
            this.addLabSchedule(lab._id, slot1.day, slot1.startTime, slot2.endTime);

            // Create entry
            this.entries.push({
              day: slot1.day,
              startTime: slot1.startTime,
              endTime: slot2.endTime,
              division: batch.division,
              subject: batch.subject,
              teacher: teacher._id,
              lab: lab._id,
              batch: batch._id,
              type: 'Practical',
              room: lab.name
            });

            assigned++;
            practicalSlotFound = true;
            break;
          }
        }
      }

      if (!practicalSlotFound) {
        this.conflicts.push(`Could not assign practical for batch ${batch.name}`);
      }
    }

    return assigned;
  }

  /**
   * Generate complete timetable
   */
  async generate(divisions, subjects, teachers, classrooms, batches, labs) {
    const startTime = Date.now();

    try {
      // Step 1: Generate time slots
      this.generateTimeSlots();

      // Step 2: Assign lectures
      for (const subject of subjects) {
        // Get teachers assigned to this subject
        let subjectTeachers = [];
        
        // Check if subject has teachers array populated
        if (subject.teachers && subject.teachers.length > 0) {
          subjectTeachers = subject.teachers;
        } else {
          // Fallback: filter teachers by subject
          subjectTeachers = teachers.filter(t => 
            t.subjects && t.subjects.some(s => s.toString() === subject._id.toString())
          );
        }
        
        const subjectDivisions = divisions.filter(d =>
          subject.divisions && subject.divisions.some(sd => sd.toString() === d._id.toString())
        );

        // If no divisions are explicitly assigned, use all divisions
        const divisionsToUse = subjectDivisions.length > 0 ? subjectDivisions : divisions;

        console.log(`   Processing ${subject.name}: ${subjectTeachers.length} teachers, ${divisionsToUse.length} divisions`);

        if (subjectTeachers.length > 0 && divisionsToUse.length > 0) {
          const assigned = await this.assignLectures(subject, divisionsToUse, subjectTeachers, classrooms);
          console.log(`     → Assigned ${assigned} lectures`);
        } else {
          console.log(`     → Skipped (no teachers or divisions)`)
        }
      }

      // Step 3: Assign practicals
      if (batches.length > 0) {
        await this.assignPracticals(batches, labs);
      }

      const endTime = Date.now();

      return {
        success: true,
        entries: this.entries,
        timeSlots: this.timeSlots,
        conflicts: this.conflicts,
        metadata: {
          totalSlots: this.entries.length,
          totalTeachers: teachers.length,
          totalSubjects: subjects.length,
          totalDivisions: divisions.length,
          generationTime: endTime - startTime,
          conflictCount: this.conflicts.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        entries: this.entries,
        conflicts: this.conflicts
      };
    }
  }
}

module.exports = TimetableGenerator;
