import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  _: Request,
  res: Response,
  __: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: message,
    ...(config.app.nodeEnv === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (
  _: Request,
  res: Response,
  __: NextFunction
): void => {
  res.status(404).json({ error: 'Route not found' });
};
