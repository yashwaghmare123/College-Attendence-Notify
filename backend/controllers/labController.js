const { Lab } = require('../database');

/**
 * Get all labs
 */
exports.getAllLabs = async (req, res) => {
  try {
    const labs = await Lab.find().sort({ name: 1 });
    res.status(200).json({
      message: 'Labs retrieved successfully',
      labs
    });
  } catch (error) {
    console.error('Error retrieving labs:', error);
    res.status(500).json({
      message: 'Error retrieving labs',
      error: error.message
    });
  }
};

/**
 * Get a specific lab
 */
exports.getLab = async (req, res) => {
  try {
    const { id } = req.params;
    const lab = await Lab.findById(id);

    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    res.status(200).json({
      message: 'Lab retrieved successfully',
      lab
    });
  } catch (error) {
    console.error('Error retrieving lab:', error);
    res.status(500).json({
      message: 'Error retrieving lab',
      error: error.message
    });
  }
};

/**
 * Create a new lab
 */
exports.createLab = async (req, res) => {
  try {
    const { name, code, capacity, type, systems, software, building, floor } = req.body;

    // Validate input
    if (!name || !code) {
      return res.status(400).json({ message: 'Name and code are required' });
    }

    const lab = new Lab({
      name,
      code,
      capacity: capacity || 30,
      type: type || 'Regular',
      systems: systems || 30,
      software: software || ['Python', 'Java', 'SQL'],
      building: building || 'Main',
      floor: floor || 2
    });

    await lab.save();

    res.status(201).json({
      message: 'Lab created successfully',
      lab
    });
  } catch (error) {
    console.error('Error creating lab:', error);
    res.status(500).json({
      message: 'Error creating lab',
      error: error.message
    });
  }
};

/**
 * Update a lab
 */
exports.updateLab = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, capacity, type, systems, software, building, floor, isActive } = req.body;

    const lab = await Lab.findByIdAndUpdate(
      id,
      {
        name: name || undefined,
        code: code || undefined,
        capacity: capacity || undefined,
        type: type || undefined,
        systems: systems || undefined,
        software: software || undefined,
        building: building || undefined,
        floor: floor !== undefined ? floor : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        updated_at: new Date()
      },
      { new: true }
    );

    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    res.status(200).json({
      message: 'Lab updated successfully',
      lab
    });
  } catch (error) {
    console.error('Error updating lab:', error);
    res.status(500).json({
      message: 'Error updating lab',
      error: error.message
    });
  }
};

/**
 * Delete a lab
 */
exports.deleteLab = async (req, res) => {
  try {
    const { id } = req.params;
    const lab = await Lab.findByIdAndDelete(id);

    if (!lab) {
      return res.status(404).json({ message: 'Lab not found' });
    }

    res.status(200).json({
      message: 'Lab deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting lab:', error);
    res.status(500).json({
      message: 'Error deleting lab',
      error: error.message
    });
  }
};
