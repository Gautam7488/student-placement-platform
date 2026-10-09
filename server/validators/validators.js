const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }
  next();
};

const studentRegistrationRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must contain at least 6 characters'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Phone must be 10 digits'),
  body('enrollmentNumber').trim().notEmpty().withMessage('Enrollment number is required'),
  body('college').trim().notEmpty().withMessage('College is required'),
  body('branch').trim().notEmpty().withMessage('Branch is required'),
  body('semester').trim().notEmpty().withMessage('Semester is required'),
  body('location').trim().notEmpty().withMessage('Location is required')
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

module.exports = { handleValidationErrors, studentRegistrationRules, loginRules };
