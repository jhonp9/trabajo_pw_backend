import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/config';
import { RequestHandler } from 'express';
import { PrismaClient } from '../generated/prisma';

export const authenticate : RequestHandler = async (req, res, next)=> {
  const prisma = new PrismaClient();
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return ;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true }
    });

    if (!user) {
      res.status(401).json({ message: 'Invalid token' });
      return ;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error); // Pasa el error al siguiente middleware (errorHandler)
  }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Se requiere acceso de administrador' });
  }
  next();
};