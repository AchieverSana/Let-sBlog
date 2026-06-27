import { body, validationResult } from 'express-validator';

// Runs after the validation chains below and turns any failures into a
// clean 400 response instead of letting bad data reach the controllers/DB.
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

export const signupValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email').trim().isEmail().withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const signinValidation = [
  body('email').trim().isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const createPostValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Title must be between 3 and 150 characters'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
];

export const createCommentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Comment must be between 1 and 200 characters'),
  body('postId').notEmpty().withMessage('postId is required'),
  body('userId').notEmpty().withMessage('userId is required'),
];
