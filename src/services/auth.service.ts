import { hashPassword, comparePasswords } from '../utils/auth';
import { User } from '../types';
import { PrismaClient } from '../generated/prisma';

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const prisma = new PrismaClient();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  return {
    ...user,
    role: user.role.toLowerCase() === 'admin' ? 'admin' : 'user'
  } as User;
};

export const createUser = async (userData: {
  
  email: string;
  name: string;
  password: string;
  role?: 'ADMIN' | 'USER';
}): Promise<User> => {
  const prisma = new PrismaClient();
  const hashedPassword = await hashPassword(userData.password);
  const createdUser = await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      password: hashedPassword,
      role: userData.role || 'USER'
    }
  });

  return {
    ...createdUser,
    role: createdUser.role.toLowerCase() === 'admin' ? 'admin' : 'user'
  } as User;
};

export const validateUser = async (email: string, password: string): Promise<User | null> => {
  const user = await findUserByEmail(email);
  if (!user || !user.password) return null;
  
  const isValid = await comparePasswords(password, user.password);
  return isValid ? user : null;
};