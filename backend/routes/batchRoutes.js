const express = require('express');
const router = express.Router();
const batchController = require('../controllers/batchController');

/**
 * @route GET /api/batch
 * @desc Get all batches
 */
router.get('/', batchController.getAllBatches);

/**
 * @route GET /api/batch/division/:divisionId
 * @desc Get batches for a division
 */
router.get('/division/:divisionId', batchController.getBatchesByDivision);

/**
 * @route GET /api/batch/:id
 * @desc Get a specific batch
 */
router.get('/:id', batchController.getBatch);

/**
 * @route POST /api/batch
 * @desc Create a new batch
 */
router.post('/', batchController.createBatch);

/**
 * @route PUT /api/batch/:id
 * @desc Update a batch
 */
router.put('/:id', batchController.updateBatch);

/**
 * @route POST /api/batch/:id/lab
 * @desc Assign lab to batch
 */
router.post('/:id/lab', batchController.assignLab);

/**
 * @route DELETE /api/batch/:id
 * @desc Delete a batch
 */
router.delete('/:id', batchController.deleteBatch);

module.exports = router;
