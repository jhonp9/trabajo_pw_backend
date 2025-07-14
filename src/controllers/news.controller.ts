import { Request, Response } from 'express';
import { RequestHandler } from 'express';
import { PrismaClient } from '../generated/prisma';

export const getNewsList = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las noticias' });
  }
};

export const getNewsItem : RequestHandler = async (req, res, next) => {
  const prisma = new PrismaClient();
  try {
    const newsItem = await prisma.news.findUnique({
      where: { id: req.params.id }
    });
    
    if (!newsItem){
        res.status(404).json({ message: 'Noticia no encontrada' });
        return;
    } 
    res.json(newsItem);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la noticia' });
  }
};

export const createNews = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  try {
    const { title, content, image } = req.body;
    const author = req.user?.name || 'Anónimo';
    
    const newsItem = await prisma.news.create({
      data: {
        title,
        content,
        image,
        author,
        date: new Date().toISOString()
      }
    });
    res.status(201).json(newsItem);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la noticia' });
  }
};

export const updateNews = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  try {
    const { title, content, image } = req.body;
    const newsItem = await prisma.news.update({
      where: { id: req.params.id },
      data: { title, content, image }
    });
    res.json(newsItem);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la noticia' });
  }
};

export const deleteNews = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  try {
    await prisma.news.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la noticia' });
  }
};