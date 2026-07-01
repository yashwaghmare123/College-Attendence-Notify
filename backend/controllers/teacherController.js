const { Teacher, Subject, Division } = require('../database');

/**
 * Get all teachers
 */
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate('subjects')
      .populate('divisions')
      .populate('assignedLabs');

    res.status(200).json({
      message: 'Teachers retrieved successfully',
      teachers
    });
  } catch (error) {
    console.error('Error retrieving teachers:', error);
    res.status(500).json({
      message: 'Error retrieving teachers',
      error: error.message
    });
  }
};

/**
 * Get a specific teacher
 */
exports.getTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findById(id)
      .populate('subjects')
      .populate('divisions')
      .populate('assignedLabs');

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json({
      message: 'Teacher retrieved successfully',
      teacher
    });
  } catch (error) {
    console.error('Error retrieving teacher:', error);
    res.status(500).json({
      message: 'Error retrieving teacher',
      error: error.message
    });
  }
};

/**
 * Create a new teacher
 */
exports.createTeacher = async (req, res) => {
  try {
    const { name, email, phoneNumber, department, subjects, divisions, isLabAssistant } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const teacher = new Teacher({
      name,
      email,
      phoneNumber: phoneNumber || '',
      department: department || 'Computer Science',
      subjects: subjects || [],
      divisions: divisions || [],
      isLabAssistant: isLabAssistant || false
    });

    await teacher.save();
    await teacher.populate(['subjects', 'divisions']);

    res.status(201).json({
      message: 'Teacher created successfully',
      teacher
    });
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({
      message: 'Error creating teacher',
      error: error.message
    });
  }
};

/**
 * Update a teacher
 */
exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber, department, subjects, divisions, maxHoursPerWeek, isLabAssistant } = req.body;

    const teacher = await Teacher.findByIdAndUpdate(
      id,
      {
        name: name || "HOD CSE DEPT",
        email: email || undefined,
        phoneNumber: phoneNumber !== undefined ? phoneNumber : undefined,
        department: department || undefined,
        subjects: subjects || undefined,
        divisions: divisions || undefined,
        maxHoursPerWeek: maxHoursPerWeek || undefined,
        isLabAssistant: isLabAssistant !== undefined ? isLabAssistant : undefined,
        updatedAt: new Date()
      },
      { new: true }
    ).populate(['subjects', 'divisions']);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json({
      message: 'Teacher updated successfully',
      teacher
    });
  } catch (error) {
    console.error('Error updating teacher:', error);
    res.status(500).json({
      message: 'Error updating teacher',
      error: error.message
    });
  }
};

/**
 * Add subject to teacher
 */
exports.addSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectId } = req.body;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Add subject if not already present
    if (!teacher.subjects.includes(subjectId)) {
      teacher.subjects.push(subjectId);
      await teacher.save();
    }

    await teacher.populate(['subjects', 'divisions']);

    res.status(200).json({
      message: 'Subject added to teacher',
      teacher
    });
  } catch (error) {
    console.error('Error adding subject:', error);
    res.status(500).json({
      message: 'Error adding subject',
      error: error.message
    });
  }
};

/**
 * Remove subject from teacher
 */
exports.removeSubject = async (req, res) => {
  try {
    const { id, subjectId } = req.params;

    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    teacher.subjects = teacher.subjects.filter(s => s.toString() !== subjectId);
    await teacher.save();

    await teacher.populate(['subjects', 'divisions']);

    res.status(200).json({
      message: 'Subject removed from teacher',
      teacher
    });
  } catch (error) {
    console.error('Error removing subject:', error);
    res.status(500).json({
      message: 'Error removing subject',
      error: error.message
    });
  }
};

/**
 * Delete a teacher
 */
exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByIdAndDelete(id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    res.status(200).json({
      message: 'Teacher deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting teacher:', error);
    res.status(500).json({
      message: 'Error deleting teacher',
      error: error.message
    });
  }
};
