import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(3, 'Nombre debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['ADMIN', 'USER']).optional()
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña es requerida')
});

export const gameSchema = z.object({
  title: z.string().min(3, 'Título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'Descripción debe tener al menos 10 caracteres'),
  price: z.number().positive('Precio debe ser positivo'),
  images: z.array(z.string().url('URL de imagen inválida')).min(1, 'Al menos una imagen es requerida'),
  genres: z.array(z.string()).min(1, 'Al menos un género es requerido'),
  platforms: z.array(z.string()).min(1, 'Al menos una plataforma es requerida'),
  requirements: z.object({
    minimum: z.array(z.string()).min(1, 'Requisitos mínimos son requeridos'),
    recommended: z.array(z.string()).min(1, 'Requisitos recomendados son requeridos')
  }),
  trailerUrl: z.string().url('URL de tráiler inválida'),
  oferta: z.string().optional()
});

export const reviewSchema = z.object({
  author: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  rating: z.number().min(1).max(5, 'Rating debe ser entre 1 y 5'),
  comment: z.string().min(10, 'Comentario debe tener al menos 10 caracteres')
});

export const newsSchema = z.object({
  title: z.string().min(5, 'Título debe tener al menos 5 caracteres'),
  content: z.string().min(20, 'Contenido debe tener al menos 20 caracteres'),
  image: z.string().url('URL de imagen inválida').optional()
});