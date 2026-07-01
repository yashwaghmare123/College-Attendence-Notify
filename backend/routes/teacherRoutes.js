const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

/**
 * @route GET /api/teacher
 * @desc Get all teachers
 */
router.get('/', teacherController.getAllTeachers);

/**
 * @route GET /api/teacher/:id
 * @desc Get a specific teacher
 */
router.get('/:id', teacherController.getTeacher);

/**
 * @route POST /api/teacher
 * @desc Create a new teacher
 */
router.post('/', teacherController.createTeacher);

/**
 * @route PUT /api/teacher/:id
 * @desc Update a teacher
 */
router.put('/:id', teacherController.updateTeacher);

/**
 * @route POST /api/teacher/:id/subject
 * @desc Add subject to teacher
 */
router.post('/:id/subject', teacherController.addSubject);

/**
 * @route DELETE /api/teacher/:id/subject/:subjectId
 * @desc Remove subject from teacher
 */
router.delete('/:id/subject/:subjectId', teacherController.removeSubject);

/**
 * @route DELETE /api/teacher/:id
 * @desc Delete a teacher
 */
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;
