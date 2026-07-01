const express = require('express');
const router = express.Router();
const labController = require('../controllers/labController');

/**
 * @route GET /api/lab
 * @desc Get all labs
 */
router.get('/', labController.getAllLabs);

/**
 * @route GET /api/lab/:id
 * @desc Get a specific lab
 */
router.get('/:id', labController.getLab);

/**
 * @route POST /api/lab
 * @desc Create a new lab
 */
router.post('/', labController.createLab);

/**
 * @route PUT /api/lab/:id
 * @desc Update a lab
 */
router.put('/:id', labController.updateLab);

/**
 * @route DELETE /api/lab/:id
 * @desc Delete a lab
 */
router.delete('/:id', labController.deleteLab);

module.exports = router;
