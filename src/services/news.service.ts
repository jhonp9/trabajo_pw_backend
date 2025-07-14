import { PrismaClient } from '../generated/prisma';
import { News } from '../types';

export const getAllNews = async (): Promise<News[]> => {
  const prisma = new PrismaClient();
  const news = await prisma.news.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return news.map(n => ({
    id: n.id,
    titulo: n.title,
    contenido: n.content,
    fecha: n.date,
    imagen: n.image ?? undefined,
    autor: n.author
  }));
};

export const getNewsById = async (id: string): Promise<News | null> => {
  const prisma = new PrismaClient();
  const n = await prisma.news.findUnique({
    where: { id }
  });
    if (!n) return null;
    return {
      id: n.id,
      titulo: n.title,
      contenido: n.content,
      fecha: n.date,
      imagen: n.image ?? undefined,
      autor: n.author
    };
  }

export const createNews = async (newsData: Omit<News, 'id' | 'createdAt'>, author: string): Promise<News> => {
  const prisma = new PrismaClient();
  const created = await prisma.news.create({
    data: {
      title: newsData.titulo,
      content: newsData.contenido,
      image: newsData.imagen ?? null,
      author,
      date: new Date().toISOString()
    }
  });
  return {
    id: created.id,
    titulo: created.title,
    contenido: created.content,
    fecha: created.date,
    imagen: created.image ?? undefined,
    autor: created.author
  };
};

export const updateNews = async (id: string, newsData: Partial<News>): Promise<News> => {
  const prisma = new PrismaClient();
  const updated = await prisma.news.update({
    where: { id },
    data: {
      title: newsData.titulo,
      content: newsData.contenido,
      image: newsData.imagen ?? null,
      author: newsData.autor,
      date: newsData.fecha
    }
  });
  return {
    id: updated.id,
    titulo: updated.title,
    contenido: updated.content,
    fecha: updated.date,
    imagen: updated.image ?? undefined,
    autor: updated.author
  };
};

export const deleteNews = async (id: string): Promise<void> => {
  const prisma = new PrismaClient();
  await prisma.news.delete({
    where: { id }
  });
};