export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  verified?: boolean;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}
export interface News {
  id: string;
  titulo: string;
  contenido: string;
  fecha: string;
  imagen?: string;
  autor: string;
}
export interface Game {
  id: number;
  title: string;
  description: string;
  price: number;
  sales: number;
  rating: number;
  images: string[];
  genres: string[];
  platforms: string[];
  oferta: string | null;
  requirements: {
    minimum: string[];
    recommended: string[];
  };
  trailerUrl: string;
  reviews: Review[];
}
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        name: string;
        role: string;
      };
    }
  }
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}