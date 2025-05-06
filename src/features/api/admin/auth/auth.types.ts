import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Shared validators (reusable)
const emailValidator = body('email_address')
  .trim()
  .notEmpty().withMessage('Email is required')
  .isEmail().withMessage('Invalid email format')
  .normalizeEmail();

const passwordValidator = body('password')
  .trim()
  .notEmpty().withMessage('Password is required')
  // .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  // .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
  // .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/).withMessage('Password must contain at least one number');

// SignIn Validator
export const validateLogin = [
  emailValidator,
  passwordValidator,
];

// SignUp Validator
export const validateRegister = [
  body('first_name')
    .trim()
    .notEmpty().withMessage('First name is required')
    .isLength({ max: 50 }).withMessage('First name too long'),

  body('second_name')
    .trim()
    .optional()
    .isLength({ max: 50 }).withMessage('Second name too long'),

  emailValidator,
  passwordValidator,
];