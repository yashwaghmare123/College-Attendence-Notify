const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');

/**
 * @route POST /api/timetable/generate
 * @desc Generate a new timetable
 */
router.post('/generate', timetableController.generateTimetable);

/**
 * @route GET /api/timetable
 * @desc Get all timetables
 */
router.get('/', timetableController.getAllTimetables);

/**
 * @route GET /api/timetable/:id
 * @desc Get a specific timetable
 */
router.get('/:id', timetableController.getTimetable);

/**
 * @route PUT /api/timetable/:timetableId/entry/:entryIndex
 * @desc Update a timetable entry
 */
router.put('/:timetableId/entry/:entryIndex', timetableController.updateTimetableEntry);

/**
 * @route POST /api/timetable/:timetableId/entry
 * @desc Add a new entry to timetable
 */
router.post('/:timetableId/entry', timetableController.addTimetableEntry);

/**
 * @route DELETE /api/timetable/:timetableId/entry/:entryIndex
 * @desc Delete a timetable entry
 */
router.delete('/:timetableId/entry/:entryIndex', timetableController.deleteTimetableEntry);

/**
 * @route GET /api/timetable/:timetableId/division/:divisionId
 * @desc Get timetable for a specific division
 */
router.get('/:timetableId/division/:divisionId', timetableController.getDivisionTimetable);

/**
 * @route GET /api/timetable/:id/export
 * @desc Export timetable as PDF or CSV
 */
router.get('/:id/export', timetableController.exportTimetable);

/**
 * @route DELETE /api/timetable/:id
 * @desc Delete a timetable
 */
router.delete('/:id', timetableController.deleteTimetable);

module.exports = router;
