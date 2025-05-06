import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { IError, ResponseProps } from './types/types';
import dotenv from 'dotenv';


export const loadConfig = () => {
  dotenv.config({ path: "./.env.dev" });
}

// Validation Error Handler
export const handleValidation = (req: Request) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return {
        status: false, 
        message: errors.array()[0].msg,
        error: errors.array().map((error) => ({
          field: (error as any)?.path,
          message: error.msg
      }))};
    }
  };

// Helper to send success responses
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string
): Response => {
  const response: ResponseProps<T> = {
    status: true,
    data,
    ...(message && { message }),
  };
  return res.status(200).json(response);
};

// Helper to send error responses
export const sendError = (
  res: Response,
  options: 
    | { message: string; statusCode?: number } 
    | { errors: IError[]; statusCode?: number; message?: string }
): Response => {
  const statusCode = options.statusCode || 400;
  
  if ('errors' in options) {
    const response: ResponseProps<never> = {
      status: false,
      ...(options.message && { message: options.message }),
      error: options.errors,
    };
    return res.status(statusCode).json(response);
  } else {
    const response: ResponseProps<never> = {
      status: false,
      message: options.message,
    };
    return res.status(statusCode).json(response);
  }
};

export const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Confirmation timeout'));
    }, ms);

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeout));
  });
};
