// validators/auth.validator.js
import { body,param } from 'express-validator';

// Custom password validation function
const isStrongPassword = (password) => {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return strongPasswordRegex.test(password);
};

export const validateSignup = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .custom(value => {
      if (!isStrongPassword(value)) {
        throw new Error('Password must be at least 8 characters long, include uppercase, lowercase, numbers, and special characters.');
      }
      return true;
    }),
  
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name must not exceed 50 characters')
    .isAlpha('en-US', { ignore: ' ' }) 
    .withMessage('Name can only contain letters and spaces.'),
  
  body('recaptchaToken')
    .notEmpty()
    .withMessage('ReCAPTCHA token is required')
    .isLength({ min: 20 })
    .withMessage('ReCAPTCHA token must be at least 20 characters long'),
];


export const validateLogin = [
    body('email')
      .isEmail()
      .withMessage('Must be a valid email address.') // Validation message
      .normalizeEmail(),
  
    body('password')
      .notEmpty()
      .withMessage('Password is required.') // Validation message
      .isLength({ min: 8 }) // Ensure password has at least 8 characters
      .withMessage('Password must be at least 8 characters long.') // Validation message
      .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/) // Ensure password has at least one uppercase, lowercase, number, and special character
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'),
  ];

 export const validateForgotPassword = [
    body('email')
      .isEmail()
      .withMessage('Must be a valid email address.') // Validation message
      .normalizeEmail(),
  ];

  export const validateResetPassword = [
    param('token')
      .notEmpty().withMessage('Reset token is required.'), // Check for empty token
    body('password')
      .notEmpty().withMessage('Password is required.') // Check for empty password
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.') // Ensure password has at least 8 characters
      .matches(/(?=.*[!@#$%^&*(),.?":{}|<>])/) // Ensure password has at least one special character
      .withMessage('Password must contain at least one special character.'), // Validation message
  ];