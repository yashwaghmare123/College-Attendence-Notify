const express = require('express');
const router = express.Router();
const yearController = require('../controllers/yearController');

/**
 * @route GET /api/year
 * @desc Get all years
 */
router.get('/', yearController.getAllYears);

/**
 * @route GET /api/year/:id
 * @desc Get a specific year
 */
router.get('/:id', yearController.getYear);

/**
 * @route POST /api/year
 * @desc Create a new year
 */
router.post('/', yearController.createYear);

/**
 * @route PUT /api/year/:id
 * @desc Update a year
 */
router.put('/:id', yearController.updateYear);

/**
 * @route DELETE /api/year/:id
 * @desc Delete a year
 */
router.delete('/:id', yearController.deleteYear);

module.exports = router;
