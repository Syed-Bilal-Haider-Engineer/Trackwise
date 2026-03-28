const express = require('express');
const { body, param, query } = require('express-validator');
const WorkEntryController = require('../controllers/WorkEntryController');
const validateRequest = require('../middleware/validation');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all work entries
router.get('/', WorkEntryController.getAll);

// Get work entry by ID
router.get('/:id', [
  param('id').isUUID(),
  validateRequest
], WorkEntryController.getById);

// Create work entry
router.post('/', [
  body('title').trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('startTime').isISO8601(),
  body('endTime').optional().isISO8601(),
  body('duration').optional().isInt({ min: 0 }),
  validateRequest
], WorkEntryController.create);

// Update work entry
router.put('/:id', [
  param('id').isUUID(),
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('startTime').optional().isISO8601(),
  body('endTime').optional().isISO8601(),
  body('duration').optional().isInt({ min: 0 }),
  validateRequest
], WorkEntryController.update);

// Delete work entry
router.delete('/:id', [
  param('id').isUUID(),
  validateRequest
], WorkEntryController.delete);

// Get summary
router.get('/summary', [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  validateRequest
], WorkEntryController.getSummary);

module.exports = router;