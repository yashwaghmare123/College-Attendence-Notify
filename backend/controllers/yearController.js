const { Year } = require('../database');

/**
 * Get all years
 */
exports.getAllYears = async (req, res) => {
  try {
    const years = await Year.find().sort({ yearNumber: 1 });
    res.status(200).json({
      message: 'Years retrieved successfully',
      years
    });
  } catch (error) {
    console.error('Error retrieving years:', error);
    res.status(500).json({
      message: 'Error retrieving years',
      error: error.message
    });
  }
};

/**
 * Get a specific year
 */
exports.getYear = async (req, res) => {
  try {
    const { id } = req.params;
    const year = await Year.findById(id);

    if (!year) {
      return res.status(404).json({ message: 'Year not found' });
    }

    res.status(200).json({
      message: 'Year retrieved successfully',
      year
    });
  } catch (error) {
    console.error('Error retrieving year:', error);
    res.status(500).json({
      message: 'Error retrieving year',
      error: error.message
    });
  }
};

/**
 * Create a new year
 */
exports.createYear = async (req, res) => {
  try {
    const { name, yearNumber, startTime, endTime, breakStartTime, breakEndTime, workingDays } = req.body;

    // Validate input
    if (!name || !yearNumber) {
      return res.status(400).json({ message: 'Name and year number are required' });
    }

    const year = new Year({
      name,
      yearNumber,
      displayName: name,
      startTime: startTime || '09:00',
      endTime: endTime || '16:00',
      breakStartTime: breakStartTime || '12:00',
      breakEndTime: breakEndTime || '13:00',
      workingDays: workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    });

    await year.save();

    res.status(201).json({
      message: 'Year created successfully',
      year
    });
  } catch (error) {
    console.error('Error creating year:', error);
    res.status(500).json({
      message: 'Error creating year',
      error: error.message
    });
  }
};

/**
 * Update a year
 */
exports.updateYear = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, breakStartTime, breakEndTime, workingDays } = req.body;

    const year = await Year.findByIdAndUpdate(
      id,
      {
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        breakStartTime: breakStartTime || undefined,
        breakEndTime: breakEndTime || undefined,
        workingDays: workingDays || undefined,
        updated_at: new Date()
      },
      { new: true }
    );

    if (!year) {
      return res.status(404).json({ message: 'Year not found' });
    }

    res.status(200).json({
      message: 'Year updated successfully',
      year
    });
  } catch (error) {
    console.error('Error updating year:', error);
    res.status(500).json({
      message: 'Error updating year',
      error: error.message
    });
  }
};

/**
 * Delete a year
 */
exports.deleteYear = async (req, res) => {
  try {
    const { id } = req.params;
    const year = await Year.findByIdAndDelete(id);

    if (!year) {
      return res.status(404).json({ message: 'Year not found' });
    }

    res.status(200).json({
      message: 'Year deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting year:', error);
    res.status(500).json({
      message: 'Error deleting year',
      error: error.message
    });
  }
};
