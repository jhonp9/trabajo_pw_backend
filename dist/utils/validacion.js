"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newsSchema = exports.reviewSchema = exports.gameSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    name: zod_1.z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
    password: zod_1.z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
    role: zod_1.z.enum(['ADMIN', 'USER']).optional()
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Email inválido'),
    password: zod_1.z.string().min(1, 'Contraseña es requerida')
});
exports.gameSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Título debe tener al menos 3 caracteres'),
    description: zod_1.z.string().min(10, 'Descripción debe tener al menos 10 caracteres'),
    price: zod_1.z.number().positive('Precio debe ser positivo'),
    images: zod_1.z.array(zod_1.z.string().url('URL de imagen inválida')).min(1, 'Al menos una imagen es requerida'),
    genres: zod_1.z.array(zod_1.z.string()).min(1, 'Al menos un género es requerido'),
    platforms: zod_1.z.array(zod_1.z.string()).min(1, 'Al menos una plataforma es requerida'),
    requirements: zod_1.z.object({
        minimum: zod_1.z.array(zod_1.z.string()).min(1, 'Requisitos mínimos son requeridos'),
        recommended: zod_1.z.array(zod_1.z.string()).min(1, 'Requisitos recomendados son requeridos')
    }),
    trailerUrl: zod_1.z.string().url('URL de tráiler inválida'),
    oferta: zod_1.z.string().optional()
});
exports.reviewSchema = zod_1.z.object({
    author: zod_1.z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
    rating: zod_1.z.number().min(1).max(5, 'Rating debe ser entre 1 y 5'),
    comment: zod_1.z.string().min(10, 'Comentario debe tener al menos 10 caracteres')
});
exports.newsSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, 'Título debe tener al menos 5 caracteres'),
    content: zod_1.z.string().min(20, 'Contenido debe tener al menos 20 caracteres'),
    image: zod_1.z.string().url('URL de imagen inválida').optional()
});
