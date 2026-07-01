const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');

/**
 * @route GET /api/subject
 * @desc Get all subjects
 */
router.get('/', subjectController.getAllSubjects);

/**
 * @route GET /api/subject/:id
 * @desc Get a specific subject
 */
router.get('/:id', subjectController.getSubject);

/**
 * @route POST /api/subject
 * @desc Create a new subject
 */
router.post('/', subjectController.createSubject);

/**
 * @route PUT /api/subject/:id
 * @desc Update a subject
 */
router.put('/:id', subjectController.updateSubject);

/**
 * @route POST /api/subject/:id/teacher
 * @desc Add teacher to subject
 */
router.post('/:id/teacher', subjectController.addTeacher);

/**
 * @route DELETE /api/subject/:id/teacher/:teacherId
 * @desc Remove teacher from subject
 */
router.delete('/:id/teacher/:teacherId', subjectController.removeTeacher);

/**
 * @route POST /api/subject/:id/division
 * @desc Add division to subject
 */
router.post('/:id/division', subjectController.addDivision);

/**
 * @route DELETE /api/subject/:id
 * @desc Delete a subject
 */
router.delete('/:id', subjectController.deleteSubject);

module.exports = router;
