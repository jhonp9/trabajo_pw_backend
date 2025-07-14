import { Request, Response } from 'express';
import { RequestHandler } from 'express';
import { PrismaClient } from '../generated/prisma';

export const getUsersList = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

export const getUserDetails : RequestHandler = async (req, res, next) => {
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        purchasedGames: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true
          }
        },
        createdAt: true
      }
    });
    
    if (!user){
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
    } 
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  try {
    const { name, email, role } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { name, email, role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};