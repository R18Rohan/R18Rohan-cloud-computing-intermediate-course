import { Request, Response, NextFunction } from 'express';
import { CustomError } from './errorHandler';

export function validateUserBody(req: Request, res: Response, next: NextFunction) {
  const { name, email, age } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    const error: CustomError = new Error("Validation Error: 'name' is required and must be a non-empty string");
    error.statusCode = 400;
    return next(error);
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    const error: CustomError = new Error("Validation Error: 'email' is required and must be a valid email structure containing @");
    error.statusCode = 400;
    return next(error);
  }

  if (age === undefined || typeof age !== 'number' || age < 18) {
    const error: CustomError = new Error("Validation Error: 'age' is required, must be a number, and must be at least 18");
    error.statusCode = 400;
    return next(error);
  }

  next();
}
