/**
 * AI-Powered Timetable Generator using Google Gemini
 * Uses constraint-based scheduling with intelligent distribution
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

class AITimetableGenerator {
  constructor(year) {
    this.year = year;
    this.apiKey = process.env.GEMINI_API_KEY;
    
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in .env');
    }
    
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    this.entries = [];
    this.conflicts = [];
  }

  /**
   * Generate timetable using Gemini AI
   */
  async generate(divisions, subjects, teachers, classrooms, batches, labs) {
    try {
      const startTime = Date.now();

      // Prepare data for AI
      const subjectsData = subjects.map(s => ({
        id: s._id.toString(),
        code: s.code,
        name: s.name,
        lecturesPerWeek: s.lecturesPerWeek,
        practicalsPerWeek: s.practicalsPerWeek,
        teachers: s.teachers.map(t => t.toString()),
        divisions: s.divisions.length > 0 ? s.divisions.map(d => d.toString()) : divisions.map(d => d._id.toString())
      }));

      const teachersData = teachers.map(t => ({
        id: t._id.toString(),
        name: t.name,
        subjects: t.subjects.map(s => s.toString())
      }));

      const divisionsData = divisions.map(d => ({
        id: d._id.toString(),
        name: d.name,
        capacity: d.capacity || 60
      }));

      const classroomsData = classrooms.map(c => ({
        id: c._id.toString(),
        name: c.name,
        capacity: c.capacity || 60
      }));

      const prompt = this.buildPrompt(
        subjectsData,
        teachersData,
        divisionsData,
        classroomsData,
        this.year
      );

      console.log('🤖 Sending request to Gemini AI...');
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('✅ Received response from Gemini');

      // Parse the AI response
      const timetableData = this.parseAIResponse(text);

      if (!timetableData || timetableData.length === 0) {
        throw new Error('AI generated invalid timetable format');
      }

      // Validate and convert to entries
      this.entries = timetableData.map(entry => ({
        day: entry.day,
        startTime: this.formatTime(entry.startTime),
        endTime: this.formatTime(entry.endTime),
        division: entry.divisionId,
        subject: entry.subjectId,
        teacher: entry.teacherId,
        classroom: entry.classroomId || classrooms[0]._id,
        type: entry.type || 'Lecture',
        room: entry.room || classrooms[0].name
      }));

      const endTime = Date.now();

      console.log(`📊 Generated ${this.entries.length} timetable entries`);

      return {
        success: true,
        entries: this.entries,
        conflicts: this.conflicts,
        metadata: {
          totalSlots: this.entries.length,
          totalTeachers: teachers.length,
          totalSubjects: subjects.length,
          totalDivisions: divisions.length,
          generationTime: endTime - startTime,
          conflictCount: this.conflicts.length,
          generatedBy: 'Gemini AI'
        }
      };
    } catch (error) {
      console.error('❌ AI Timetable Generation Error:', error.message);
      return {
        success: false,
        error: error.message,
        entries: [],
        conflicts: this.conflicts
      };
    }
  }

  /**
   * Build the prompt for Gemini AI
   */
  buildPrompt(subjects, teachers, divisions, classrooms, year) {
    const workingDays = year.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const startHour = parseInt(year.startTime.split(':')[0]);
    const endHour = parseInt(year.endTime.split(':')[0]);

    return `You are a professional timetable scheduling AI. Generate an optimal class timetable based on these constraints:

SCHEDULE CONSTRAINTS:
- Working Days: ${workingDays.join(', ')}
- Working Hours: ${startHour}:00 AM to ${endHour}:00 PM (9 AM to 5 PM)
- Lecture Duration: 1 hour
- Break Time: 12:00 PM to 1:00 PM (No classes)
- Each classroom can have only 1 class at a time
- Each teacher can teach only 1 class at a time

SUBJECTS (need to schedule lectures):
${subjects.map(s => `- ${s.code} (${s.name}): ${s.lecturesPerWeek} lectures/week, Teachers: ${s.teachers.length}, Divisions: ${s.divisions.length || 'All'}`).join('\n')}

TEACHERS:
${teachers.map(t => `- ${t.name} (ID: ${t.id})`).join('\n')}

DIVISIONS:
${divisions.map(d => `- ${d.name} (Capacity: ${d.capacity})`).join('\n')}

CLASSROOMS:
${classrooms.map(c => `- ${c.name} (Capacity: ${c.capacity})`).join('\n')}

REQUIREMENTS:
1. Distribute lectures evenly across all 5 days
2. Avoid scheduling same subject/teacher multiple times on same day for same division
3. Each subject must get exactly its required lectures per week
4. Balance teacher workload evenly
5. Use available classrooms optimally
6. Start from 9:00 AM, skip 12:00-1:00 PM break, end at 5:00 PM

RESPONSE FORMAT:
Generate a JSON array with these exact fields for each class (NO OTHER TEXT):
[
  {
    "day": "Monday",
    "startTime": "09:00",
    "endTime": "10:00",
    "subjectId": "subject_id",
    "subjectCode": "CODE",
    "teacherId": "teacher_id",
    "teacherName": "Teacher Name",
    "divisionId": "division_id",
    "divisionName": "A",
    "classroomId": "classroom_id",
    "room": "CS1",
    "type": "Lecture"
  }
]

Generate ONLY valid JSON, no other text.`;
  }

  /**
   * Parse AI response and extract timetable
   */
  parseAIResponse(text) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      if (!Array.isArray(parsed)) {
        throw new Error('Response is not an array');
      }

      return parsed;
    } catch (error) {
      console.error('Error parsing AI response:', error.message);
      throw new Error(`Failed to parse AI timetable: ${error.message}`);
    }
  }

  /**
   * Format time string to HH:MM format
   */
  formatTime(time) {
    if (typeof time === 'string' && time.includes(':')) {
      return time;
    }
    const hour = parseInt(time);
    return `${String(hour).padStart(2, '0')}:00`;
  }
}

module.exports = AITimetableGenerator;
