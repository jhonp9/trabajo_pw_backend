import { comparePasswords } from '../utils/auth';
import { User } from '../types';
import { PrismaClient } from '../generated/prisma';

export const getAllUsers = async (): Promise<User[]> => {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true
    }
  });
  return users.map(user => ({
    ...user,
    role: user.role as "user" | "admin"
  }));
};

export const getUserById = async (id: number): Promise<User | null> => {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true
    }
  });
  return user
    ? {
        ...user,
        role: user.role as "user" | "admin"
      }
    : null;
};

export const updateUser = async (id: number, userData: Partial<User>): Promise<User> => {
  const prisma = new PrismaClient();
  const updatedUser = await prisma.user.update({
    where: { id },
    data: userData,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true
    }
  });
  return {
    ...updatedUser,
    role: updatedUser.role as "user" | "admin"
  };
};

export const deleteUser = async (id: number): Promise<void> => {
  const prisma = new PrismaClient();
  await prisma.user.delete({
    where: { id }
  });
};

export const validateUser = async (email: string, password: string): Promise<User | null> => {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  
  const isValid = await comparePasswords(password, user.password);
  return isValid
    ? {
        ...user,
        role: user.role as "user" | "admin"
      }
    : null;
};