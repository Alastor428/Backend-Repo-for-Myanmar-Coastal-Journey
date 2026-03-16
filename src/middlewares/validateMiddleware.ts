import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

type ValidationTarget = 'body' | 'query' | 'params';

export const validate = (schema: ZodSchema, target: ValidationTarget = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[target];
    const result = schema.safeParse(data);

    if (!result.success) {
      const error = result.error as ZodError;
      return res.status(422).json({
        success: false,
        status: 422,
        message: 'Validation failed',
        errors: error.flatten(),
      });
    }

    // Avoid assigning directly to properties like `req.query` which may be defined via getters.
    // Instead, merge validated data into the existing object when possible.
    if (target === 'body') {
      (req as any).body = result.data;
    } else {
      const current = (req as any)[target];
      if (current && typeof current === 'object') {
        Object.assign(current, result.data);
      } else {
        (req as any)[target] = result.data;
      }
    }
    next();
  };
};
