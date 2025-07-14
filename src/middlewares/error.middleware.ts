import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Manejo de errores de validación con Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Error de validación',
      errors: err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
    return;
  }
  // Manejo de errores de Prisma
  if (err instanceof PrismaClientKnownRequestError) {
    res.status(400).json({
      message: 'Error de base de datos',
      code: err.code,
      meta: err.meta
    });
    return;
  }

  // Manejo de otros errores
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message || 'Error interno del servidor',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
  return;
};