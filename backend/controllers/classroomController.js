const { Classroom, Year, Division } = require('../database');

/**
 * Auto-generate sample classrooms for a year
 */
exports.autoGenerateClassrooms = async (req, res) => {
  try {
    const { yearId } = req.body;

    // Validate input
    if (!yearId) {
      return res.status(400).json({ message: 'Year ID is required' });
    }

    const year = await Year.findById(yearId);
    if (!year) {
      return res.status(404).json({ message: 'Year not found' });
    }

    // Get divisions for this year
    const divisions = await Division.find({ year: yearId });
    if (divisions.length === 0) {
      return res.status(400).json({ message: 'No divisions found for this year' });
    }

    // Check if classrooms already exist
    const existingClassrooms = await Classroom.find({ year: yearId });
    if (existingClassrooms.length > 0) {
      return res.status(400).json({ message: 'Classrooms already exist for this year' });
    }

    // Generate sample classrooms
    const classroomsToCreate = [];
    const buildings = ['Main Block', 'Block A', 'Block B'];
    const floorsPerBuilding = 3;
    const classroomsPerFloor = 3;

    for (const division of divisions) {
      for (let buildingIdx = 0; buildingIdx < buildings.length; buildingIdx++) {
        for (let floor = 1; floor <= floorsPerBuilding; floor++) {
          for (let room = 1; room <= classroomsPerFloor; room++) {
            const roomNumber = `${floor}${String(room).padStart(2, '0')}`;
            classroomsToCreate.push({
              name: `${division.name}-${roomNumber}`,
              capacity: 60,
              year: yearId,
              division: division._id,
              building: buildings[buildingIdx],
              floor: floor,
              facilities: ['Projector', 'Whiteboard', 'AC', 'WiFi']
            });
          }
        }
      }
    }

    const createdClassrooms = await Classroom.insertMany(classroomsToCreate);
    await Classroom.populate(createdClassrooms, { path: 'year division' });

    res.status(201).json({
      message: `Successfully created ${createdClassrooms.length} sample classrooms`,
      count: createdClassrooms.length,
      classrooms: createdClassrooms
    });
  } catch (error) {
    console.error('Error auto-generating classrooms:', error);
    res.status(500).json({
      message: 'Error generating classrooms',
      error: error.message
    });
  }
};

/**
 * Get all classrooms
 */
exports.getAllClassrooms = async (req, res) => {
  try {
    const { yearId } = req.query;
    const query = {};
    if (yearId) query.year = yearId;

    const classrooms = await Classroom.find(query).populate('year division');
    res.status(200).json({
      message: 'Classrooms retrieved successfully',
      classrooms
    });
  } catch (error) {
    console.error('Error retrieving classrooms:', error);
    res.status(500).json({
      message: 'Error retrieving classrooms',
      error: error.message
    });
  }
};

/**
 * Get a specific classroom
 */
exports.getClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    const classroom = await Classroom.findById(id).populate('year division');

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    res.status(200).json({
      message: 'Classroom retrieved successfully',
      classroom
    });
  } catch (error) {
    console.error('Error retrieving classroom:', error);
    res.status(500).json({
      message: 'Error retrieving classroom',
      error: error.message
    });
  }
};

/**
 * Create a new classroom
 */
exports.createClassroom = async (req, res) => {
  try {
    const { name, capacity, year, division, building, floor, facilities } = req.body;

    // Validate input
    if (!name || !capacity || !year) {
      return res.status(400).json({ message: 'Name, capacity, and year are required' });
    }

    const classroom = new Classroom({
      name,
      capacity,
      year,
      division: division || null,
      building: building || 'Main',
      floor: floor || 1,
      facilities: facilities || ['Projector', 'Whiteboard', 'AC', 'WiFi']
    });

    await classroom.save();
    await classroom.populate('year division');

    res.status(201).json({
      message: 'Classroom created successfully',
      classroom
    });
  } catch (error) {
    console.error('Error creating classroom:', error);
    res.status(500).json({
      message: 'Error creating classroom',
      error: error.message
    });
  }
};

/**
 * Update a classroom
 */
exports.updateClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity, division, building, floor, facilities, isActive } = req.body;

    const classroom = await Classroom.findByIdAndUpdate(
      id,
      {
        name: name || undefined,
        capacity: capacity || undefined,
        division: division || undefined,
        building: building || undefined,
        floor: floor !== undefined ? floor : undefined,
        facilities: facilities || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        updated_at: new Date()
      },
      { new: true }
    ).populate('year division');

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    res.status(200).json({
      message: 'Classroom updated successfully',
      classroom
    });
  } catch (error) {
    console.error('Error updating classroom:', error);
    res.status(500).json({
      message: 'Error updating classroom',
      error: error.message
    });
  }
};

/**
 * Delete a classroom
 */
exports.deleteClassroom = async (req, res) => {
  try {
    const { id } = req.params;
    const classroom = await Classroom.findByIdAndDelete(id);

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }

    res.status(200).json({
      message: 'Classroom deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting classroom:', error);
    res.status(500).json({
      message: 'Error deleting classroom',
      error: error.message
    });
  }
};
