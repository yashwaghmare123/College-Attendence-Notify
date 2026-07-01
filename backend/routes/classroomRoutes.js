const express = require('express');
const router = express.Router();
const classroomController = require('../controllers/classroomController');

/**
 * @route POST /api/classroom/auto-generate
 * @desc Auto-generate sample classrooms for a year
 */
router.post('/auto-generate', classroomController.autoGenerateClassrooms);

/**
 * @route GET /api/classroom
 * @desc Get all classrooms
 */
router.get('/', classroomController.getAllClassrooms);

/**
 * @route GET /api/classroom/:id
 * @desc Get a specific classroom
 */
router.get('/:id', classroomController.getClassroom);

/**
 * @route POST /api/classroom
 * @desc Create a new classroom
 */
router.post('/', classroomController.createClassroom);

/**
 * @route PUT /api/classroom/:id
 * @desc Update a classroom
 */
router.put('/:id', classroomController.updateClassroom);

/**
 * @route DELETE /api/classroom/:id
 * @desc Delete a classroom
 */
router.delete('/:id', classroomController.deleteClassroom);

module.exports = router;
