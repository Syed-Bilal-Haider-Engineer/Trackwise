const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/AuthController');
const validateRequest = require('../middleware/validation');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Register route
router.post('/register', [
  authLimiter,
  body('email').isEmail().normalizeEmail(),
  body('name').trim().isLength({ min: 2, max: 50 }),
  body('password').isLength({ min: 6 }),
  validateRequest
], AuthController.register);

// Login route
router.post('/login', [
  authLimiter,
  body('email').isEmail().normalizeEmail(),
  body('password').exists(),
  validateRequest
], AuthController.login);

module.exports = router;