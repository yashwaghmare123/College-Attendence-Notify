const { Subject, Year } = require('../database');

/**
 * Get all subjects
 */
exports.getAllSubjects = async (req, res) => {
  try {
    const { yearId } = req.query;
    const query = {};
    if (yearId) query.year = yearId;

    const subjects = await Subject.find(query)
      .populate('year')
      .populate('teachers')
      .populate('divisions');

    res.status(200).json({
      message: 'Subjects retrieved successfully',
      subjects
    });
  } catch (error) {
    console.error('Error retrieving subjects:', error);
    res.status(500).json({
      message: 'Error retrieving subjects',
      error: error.message
    });
  }
};

/**
 * Get a specific subject
 */
exports.getSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id)
      .populate('year')
      .populate('teachers')
      .populate('divisions');

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json({
      message: 'Subject retrieved successfully',
      subject
    });
  } catch (error) {
    console.error('Error retrieving subject:', error);
    res.status(500).json({
      message: 'Error retrieving subject',
      error: error.message
    });
  }
};

/**
 * Create a new subject
 */
exports.createSubject = async (req, res) => {
  try {
    const { name, code, year, credits, lecturesPerWeek, practicalsPerWeek, requiresLab, labType, color, teachers, divisions } = req.body;

    // Validate input
    if (!name || !code || !year) {
      return res.status(400).json({ message: 'Name, code, and year are required' });
    }

    const subject = new Subject({
      name,
      code,
      year,
      credits: credits || 4,
      lecturesPerWeek: lecturesPerWeek || 3,
      practicalsPerWeek: practicalsPerWeek || 0,
      requiresLab: requiresLab || false,
      labType: labType || 'Regular',
      color: color || '#3B82F6',
      teachers: Array.isArray(teachers) && teachers.length > 0 ? teachers : [],
      divisions: Array.isArray(divisions) && divisions.length > 0 ? divisions : []
    });

    await subject.save();
    await subject.populate(['year', 'teachers', 'divisions']);

    res.status(201).json({
      message: 'Subject created successfully',
      subject
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({
      message: 'Error creating subject',
      error: error.message
    });
  }
};

/**
 * Update a subject
 */
exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, credits, lecturesPerWeek, practicalsPerWeek, requiresLab, labType, color, teachers, divisions } = req.body;

    const updateData = {
      updated_at: new Date()
    };
    
    if (name) updateData.name = name;
    if (credits !== undefined) updateData.credits = credits;
    if (lecturesPerWeek !== undefined) updateData.lecturesPerWeek = lecturesPerWeek;
    if (practicalsPerWeek !== undefined) updateData.practicalsPerWeek = practicalsPerWeek;
    if (requiresLab !== undefined) updateData.requiresLab = requiresLab;
    if (labType) updateData.labType = labType;
    if (color) updateData.color = color;
    if (Array.isArray(teachers)) updateData.teachers = teachers;
    if (Array.isArray(divisions)) updateData.divisions = divisions;

    const subject = await Subject.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate(['year', 'teachers', 'divisions']);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json({
      message: 'Subject updated successfully',
      subject
    });
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).json({
      message: 'Error updating subject',
      error: error.message
    });
  }
};

/**
 * Add teacher to subject
 */
exports.addTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacherId } = req.body;

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Add teacher if not already present
    if (!subject.teachers.includes(teacherId)) {
      subject.teachers.push(teacherId);
      await subject.save();
    }

    await subject.populate(['year', 'teachers', 'divisions']);

    res.status(200).json({
      message: 'Teacher added to subject',
      subject
    });
  } catch (error) {
    console.error('Error adding teacher:', error);
    res.status(500).json({
      message: 'Error adding teacher',
      error: error.message
    });
  }
};

/**
 * Remove teacher from subject
 */
exports.removeTeacher = async (req, res) => {
  try {
    const { id, teacherId } = req.params;

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    subject.teachers = subject.teachers.filter(t => t.toString() !== teacherId);
    await subject.save();

    await subject.populate(['year', 'teachers', 'divisions']);

    res.status(200).json({
      message: 'Teacher removed from subject',
      subject
    });
  } catch (error) {
    console.error('Error removing teacher:', error);
    res.status(500).json({
      message: 'Error removing teacher',
      error: error.message
    });
  }
};

/**
 * Add division to subject
 */
exports.addDivision = async (req, res) => {
  try {
    const { id } = req.params;
    const { divisionId } = req.body;

    const subject = await Subject.findById(id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    // Add division if not already present
    if (!subject.divisions.includes(divisionId)) {
      subject.divisions.push(divisionId);
      await subject.save();
    }

    await subject.populate(['year', 'teachers', 'divisions']);

    res.status(200).json({
      message: 'Division added to subject',
      subject
    });
  } catch (error) {
    console.error('Error adding division:', error);
    res.status(500).json({
      message: 'Error adding division',
      error: error.message
    });
  }
};

/**
 * Delete a subject
 */
exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndDelete(id);

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.status(200).json({
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({
      message: 'Error deleting subject',
      error: error.message
    });
  }
};
