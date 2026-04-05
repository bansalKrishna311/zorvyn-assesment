const { body, validationResult } = require('express-validator');

exports.registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['viewer', 'analyst', 'admin'])
    .withMessage('Invalid role'),
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

exports.createRecordValidator = [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('type').isIn(['income', 'expense']).withMessage('Invalid type'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('date').isISO8601().withMessage('Date must be a valid ISO date'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
];

exports.updateRecordValidator = [
  body('amount').optional().isNumeric().withMessage('Amount must be a number'),
  body('type').optional().isIn(['income', 'expense']).withMessage('Invalid type'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('date').optional().isISO8601().withMessage('Date must be a valid ISO date'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
];

exports.createUserValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .isIn(['viewer', 'analyst', 'admin'])
    .withMessage('Role must be viewer, analyst, or admin'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
];

exports.updateUserValidator = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['viewer', 'analyst', 'admin'])
    .withMessage('Invalid role'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};