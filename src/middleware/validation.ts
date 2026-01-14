import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate =
  <R extends Request<any, any, any, any>>(
    schema: ZodSchema,
    source: 'query' | 'params' | 'body' = 'query'
  ) =>
  (req: R, res: Response, next: NextFunction): void => {
    try {
      const data =
        source === 'query'
          ? req.query
          : source === 'params'
            ? req.params
            : req.body;
      const parsed = schema.parse(data);

      if (source === 'query') {
        Object.assign(req.query, parsed);
      } else if (source === 'params') {
        Object.assign(req.params, parsed);
      } else {
        Object.assign(req.body, parsed);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
