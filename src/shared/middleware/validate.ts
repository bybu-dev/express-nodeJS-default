import { RequestHandler } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

type ValidationTarget = 'body' | 'query' | 'params';

const createValidator = <T extends object>(
  dtoClass: ClassConstructor<T>,
  target: ValidationTarget
): RequestHandler => {
  return async (req, res, next): Promise<void> => {
    const data = req[target];
    const dto = plainToInstance(dtoClass, data);

    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const formattedErrors = errors.map(error => ({
        field: error.property,
        message: Object.values(error.constraints || {})[0] || 'Invalid field',
      }));

      console.error("Validation error:", formattedErrors);

      res.status(400).json({
        status: false,
        message: 'Validation failed',
        error: formattedErrors,
      });

      return; // ensures the function returns void
    }

    req[target] = Object.assign({}, dto);
    next();
  };
};

export const validateBody = <T extends object>(dtoClass: ClassConstructor<T>) =>
  createValidator(dtoClass, 'body');

export const validateQuery = <T extends object>(dtoClass: ClassConstructor<T>) =>
  createValidator(dtoClass, 'query');

export const validateParams = <T extends object>(dtoClass: ClassConstructor<T>) =>
  createValidator(dtoClass, 'params');
