const {
  Timetable,
  Year,
  Division,
  Subject,
  Teacher,
  Classroom,
  Lab,
  Batch
} = require('../database');
const ProfessionalTimetableGenerator = require('../utils/professionalTimetableGenerator');

/**
 * Generate a new timetable
 */
exports.generateTimetable = async (req, res) => {
  try {
    const { yearId, semester = 1, name } = req.body;

    // Validate input
    if (!yearId) {
      return res.status(400).json({ message: 'Year ID is required' });
    }

    // Fetch year and related data
    const year = await Year.findById(yearId);
    if (!year) {
      return res.status(404).json({ message: 'Year not found' });
    }

    let divisions = await Division.find({ year: yearId });
    
    // Auto-create divisions if missing
    if (divisions.length === 0) {
      const divisionsToCreate = [
        { name: 'A', year: yearId, displayName: 'A Division', capacity: 60 },
        { name: 'B', year: yearId, displayName: 'B Division', capacity: 60 }
      ];
      divisions = await Division.insertMany(divisionsToCreate);
    }

    const subjects = await Subject.find({ year: yearId }).populate('teachers divisions');
    const teachers = await Teacher.find().populate('subjects divisions');
    const classrooms = await Classroom.find({ year: yearId });
    const batches = await Batch.find().populate('division subject teacher');
    const labs = await Lab.find();

    console.log(`\n📊 TIMETABLE GENERATION DEBUG:`)
    console.log(`   Year: ${year.displayName}`)
    console.log(`   Divisions: ${divisions.length}`)
    console.log(`   Total Subjects: ${subjects.length}`)
    console.log(`   Total Teachers: ${teachers.length}`)
    console.log(`   Total Classrooms: ${classrooms.length}`)
    console.log(`   Total Labs: ${labs.length}`)
    
    // Log subjects with teachers
    console.log(`\n📚 SUBJECTS WITH TEACHERS:`)
    for (const subject of subjects) {
      console.log(`   - ${subject.name}: ${subject.teachers?.length || 0} teachers`)
    }
    console.log('')

    // Check if sufficient resources
    if (classrooms.length === 0) {
      return res.status(400).json({ 
        message: 'No classrooms available for this year. Please create classrooms first.',
        hint: 'Go to Timetable > Classrooms and create classroom entries for this academic year',
        suggestAutoCreate: true
      });
    }
    if (subjects.length === 0) {
      return res.status(400).json({ message: 'No subjects found for this year' });
    }
    if (teachers.length === 0) {
      return res.status(400).json({ message: 'No teachers found in the system' });
    }

    // Generate timetable using professional academic format
    const generator = new ProfessionalTimetableGenerator(year);
    const result = await generator.generate(divisions, subjects, teachers, classrooms, batches, labs);

    if (!result.success) {
      return res.status(500).json({
        message: 'Failed to generate timetable',
        error: result.error,
        conflicts: result.conflicts
      });
    }

    // Save timetable to database
    const timetable = new Timetable({
      name: name || `${year.name} Semester ${semester} Timetable`,
      year: yearId,
      semester,
      entries: result.entries,
      metadata: result.metadata,
      conflictLog: result.conflicts.map(c => ({
        type: c,
        date: new Date()
      }))
    });

    await timetable.save();

    res.status(201).json({
      message: 'Timetable generated successfully',
      timetable,
      conflicts: result.conflicts,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('Error generating timetable:', error);
    res.status(500).json({
      message: 'Error generating timetable',
      error: error.message
    });
  }
};

/**
 * Get all timetables
 */
exports.getAllTimetables = async (req, res) => {
  try {
    const { yearId } = req.query;

    const query = {};
    if (yearId) {
      query.year = yearId;
    }

    const timetables = await Timetable.find(query)
      .populate('year')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Timetables retrieved successfully',
      timetables
    });
  } catch (error) {
    console.error('Error retrieving timetables:', error);
    res.status(500).json({
      message: 'Error retrieving timetables',
      error: error.message
    });
  }
};

/**
 * Get a specific timetable
 */
exports.getTimetable = async (req, res) => {
  try {
    const { id } = req.params;

    const timetable = await Timetable.findById(id)
      .populate('year')
      .populate('entries.division')
      .populate('entries.subject')
      .populate('entries.teacher')
      .populate('entries.classroom')
      .populate('entries.lab')
      .populate('entries.batch');

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.status(200).json({
      message: 'Timetable retrieved successfully',
      timetable
    });
  } catch (error) {
    console.error('Error retrieving timetable:', error);
    res.status(500).json({
      message: 'Error retrieving timetable',
      error: error.message
    });
  }
};

/**
 * Update a timetable entry
 */
exports.updateTimetableEntry = async (req, res) => {
  try {
    const { timetableId, entryIndex } = req.params;
    const { day, startTime, endTime, subjectId, teacherId, classroomId, labId } = req.body;

    const timetable = await Timetable.findById(timetableId);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    if (entryIndex < 0 || entryIndex >= timetable.entries.length) {
      return res.status(400).json({ message: 'Invalid entry index' });
    }

    // Update entry
    const entry = timetable.entries[entryIndex];
    if (day) entry.day = day;
    if (startTime) entry.startTime = startTime;
    if (endTime) entry.endTime = endTime;
    if (subjectId) entry.subject = subjectId;
    if (teacherId) entry.teacher = teacherId;
    if (classroomId) entry.classroom = classroomId;
    if (labId) entry.lab = labId;

    timetable.updatedAt = new Date();
    await timetable.save();

    res.status(200).json({
      message: 'Timetable entry updated successfully',
      timetable
    });
  } catch (error) {
    console.error('Error updating timetable entry:', error);
    res.status(500).json({
      message: 'Error updating timetable entry',
      error: error.message
    });
  }
};

/**
 * Add a new entry to timetable
 */
exports.addTimetableEntry = async (req, res) => {
  try {
    const { timetableId } = req.params;
    const { day, startTime, endTime, division, subject, teacher, classroom, lab, type } = req.body;

    const timetable = await Timetable.findById(timetableId);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    // Add new entry
    timetable.entries.push({
      day,
      startTime,
      endTime,
      division,
      subject,
      teacher,
      classroom,
      lab,
      type: type || 'Lecture'
    });

    timetable.updatedAt = new Date();
    await timetable.save();

    res.status(201).json({
      message: 'Timetable entry added successfully',
      timetable
    });
  } catch (error) {
    console.error('Error adding timetable entry:', error);
    res.status(500).json({
      message: 'Error adding timetable entry',
      error: error.message
    });
  }
};

/**
 * Delete a timetable entry
 */
exports.deleteTimetableEntry = async (req, res) => {
  try {
    const { timetableId, entryIndex } = req.params;

    const timetable = await Timetable.findById(timetableId);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    if (entryIndex < 0 || entryIndex >= timetable.entries.length) {
      return res.status(400).json({ message: 'Invalid entry index' });
    }

    // Remove entry
    timetable.entries.splice(entryIndex, 1);
    timetable.updatedAt = new Date();
    await timetable.save();

    res.status(200).json({
      message: 'Timetable entry deleted successfully',
      timetable
    });
  } catch (error) {
    console.error('Error deleting timetable entry:', error);
    res.status(500).json({
      message: 'Error deleting timetable entry',
      error: error.message
    });
  }
};

/**
 * Delete a timetable
 */
exports.deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params;

    const timetable = await Timetable.findByIdAndDelete(id);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.status(200).json({
      message: 'Timetable deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting timetable:', error);
    res.status(500).json({
      message: 'Error deleting timetable',
      error: error.message
    });
  }
};

/**
 * Get timetable for a specific division
 */
exports.getDivisionTimetable = async (req, res) => {
  try {
    const { timetableId, divisionId } = req.params;

    const timetable = await Timetable.findById(timetableId);
    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    // Filter entries for specific division
    const divisionEntries = timetable.entries.filter(
      entry => entry.division.toString() === divisionId
    );

    res.status(200).json({
      message: 'Division timetable retrieved successfully',
      entries: divisionEntries,
      divisionId
    });
  } catch (error) {
    console.error('Error retrieving division timetable:', error);
    res.status(500).json({
      message: 'Error retrieving division timetable',
      error: error.message
    });
  }
};

/**
 * Export timetable as PDF or CSV
 */
exports.exportTimetable = async (req, res) => {
  try {
    const { id } = req.params;
    const { format = 'json', divisionId } = req.query;

    const timetable = await Timetable.findById(id)
      .populate('year')
      .populate('entries.division')
      .populate('entries.subject')
      .populate('entries.teacher')
      .populate('entries.classroom')
      .populate('entries.lab');

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    let entries = timetable.entries;
    if (divisionId) {
      entries = entries.filter(e => e.division._id.toString() === divisionId);
    }

    if (format === 'csv') {
      // Convert to CSV format
      let csv = 'Day,Start Time,End Time,Subject,Teacher,Room,Type\n';
      entries.forEach(entry => {
        csv += `${entry.day},${entry.startTime},${entry.endTime},${entry.subject?.name || 'N/A'},${entry.teacher?.name || 'N/A'},${entry.room || 'N/A'},${entry.type}\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="timetable.csv"');
      res.send(csv);
    } else {
      res.status(200).json({
        message: 'Timetable exported successfully',
        data: {
          name: timetable.name,
          year: timetable.year.name,
          semester: timetable.semester,
          entries
        }
      });
    }
  } catch (error) {
    console.error('Error exporting timetable:', error);
    res.status(500).json({
      message: 'Error exporting timetable',
      error: error.message
    });
  }
};
