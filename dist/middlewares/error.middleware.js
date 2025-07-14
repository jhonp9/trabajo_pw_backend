"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const library_1 = require("@prisma/client/runtime/library");
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    // Manejo de errores de validación con Zod
    if (err instanceof zod_1.ZodError) {
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
    if (err instanceof library_1.PrismaClientKnownRequestError) {
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
exports.errorHandler = errorHandler;
