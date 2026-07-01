const { Batch, Division, Subject, Teacher, Lab } = require('../database');

/**
 * Get all batches
 */
exports.getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate('division')
      .populate('subject')
      .populate('teacher')
      .populate('labAssistant')
      .populate('assignedLab');

    res.status(200).json({
      message: 'Batches retrieved successfully',
      batches
    });
  } catch (error) {
    console.error('Error retrieving batches:', error);
    res.status(500).json({
      message: 'Error retrieving batches',
      error: error.message
    });
  }
};

/**
 * Get batches for a division
 */
exports.getBatchesByDivision = async (req, res) => {
  try {
    const { divisionId } = req.params;

    const batches = await Batch.find({ division: divisionId })
      .populate('division')
      .populate('subject')
      .populate('teacher')
      .populate('labAssistant')
      .populate('assignedLab');

    res.status(200).json({
      message: 'Batches retrieved successfully',
      batches
    });
  } catch (error) {
    console.error('Error retrieving batches:', error);
    res.status(500).json({
      message: 'Error retrieving batches',
      error: error.message
    });
  }
};

/**
 * Get a specific batch
 */
exports.getBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findById(id)
      .populate('division')
      .populate('subject')
      .populate('teacher')
      .populate('labAssistant')
      .populate('assignedLab');

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json({
      message: 'Batch retrieved successfully',
      batch
    });
  } catch (error) {
    console.error('Error retrieving batch:', error);
    res.status(500).json({
      message: 'Error retrieving batch',
      error: error.message
    });
  }
};

/**
 * Create a new batch
 */
exports.createBatch = async (req, res) => {
  try {
    const { division, subject, batchNumber, teacher, students, labAssistant, assignedLab, labType } = req.body;

    // Validate input
    if (!division || !subject || !batchNumber || !teacher) {
      return res.status(400).json({ message: 'Division, subject, batch number, and teacher are required' });
    }

    const batch = new Batch({
      name: `${batchNumber} - ${subject}`,
      division,
      subject,
      batchNumber,
      teacher,
      students: students || 15,
      labAssistant: labAssistant || null,
      assignedLab: assignedLab || null,
      labType: labType || 'Regular'
    });

    await batch.save();
    await batch.populate(['division', 'subject', 'teacher', 'labAssistant', 'assignedLab']);

    res.status(201).json({
      message: 'Batch created successfully',
      batch
    });
  } catch (error) {
    console.error('Error creating batch:', error);
    res.status(500).json({
      message: 'Error creating batch',
      error: error.message
    });
  }
};

/**
 * Update a batch
 */
exports.updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacher, students, labAssistant, assignedLab, labType, practicalDays } = req.body;

    const batch = await Batch.findByIdAndUpdate(
      id,
      {
        teacher: teacher || undefined,
        students: students || undefined,
        labAssistant: labAssistant || undefined,
        assignedLab: assignedLab || undefined,
        labType: labType || undefined,
        practicalDays: practicalDays || undefined,
        updated_at: new Date()
      },
      { new: true }
    ).populate(['division', 'subject', 'teacher', 'labAssistant', 'assignedLab']);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json({
      message: 'Batch updated successfully',
      batch
    });
  } catch (error) {
    console.error('Error updating batch:', error);
    res.status(500).json({
      message: 'Error updating batch',
      error: error.message
    });
  }
};

/**
 * Assign lab to batch
 */
exports.assignLab = async (req, res) => {
  try {
    const { id } = req.params;
    const { labId } = req.body;

    const batch = await Batch.findByIdAndUpdate(
      id,
      { assignedLab: labId, updated_at: new Date() },
      { new: true }
    ).populate(['division', 'subject', 'teacher', 'labAssistant', 'assignedLab']);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json({
      message: 'Lab assigned successfully',
      batch
    });
  } catch (error) {
    console.error('Error assigning lab:', error);
    res.status(500).json({
      message: 'Error assigning lab',
      error: error.message
    });
  }
};

/**
 * Delete a batch
 */
exports.deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByIdAndDelete(id);

    if (!batch) {
      return res.status(404).json({ message: 'Batch not found' });
    }

    res.status(200).json({
      message: 'Batch deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting batch:', error);
    res.status(500).json({
      message: 'Error deleting batch',
      error: error.message
    });
  }
};
