import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

export const getGameReviews = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  try {
    const { gameId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { gameId: parseInt(gameId) },
      include: { user: { select: { name: true } } },
      orderBy: { date: 'desc' }, // Ordenar por fecha de reseña
    });

    res.status(200).json({
      success: true,
      data: reviews.map(review => ({
        id: review.id,
        author: review.user?.name || review.author || 'Anónimo', 
        rating: review.rating,
        comment: review.comment,
        date: review.date, 
      })),
    });
  } catch (error) {
    console.error('Error getting game reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las reseñas',
    });
  }
};

export const createGameReview = async (req: Request, res: Response) => {
  const prisma = new PrismaClient();
  try {
    const { gameId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        res.status(401).json({
        success: false,
        message: 'No autorizado',
      });
      return;
    }

    // Verificar si el usuario ya ha reseñado este juego
    const existingReview = await prisma.review.findFirst({
      where: {
        gameId: parseInt(gameId),
        userId,
      },
    });

    if (existingReview) {
        res.status(400).json({
        success: false,
        message: 'Ya has reseñado este juego',
      });
      return;
    }

    // Verificar si el usuario ha comprado el juego
    const hasPurchased = await prisma.purchase.findFirst({
      where: {
        userId,
        items: {
          some: {
            gameId: parseInt(gameId),
          },
        },
      },
    });

    if (!hasPurchased) {
        res.status(403).json({
        success: false,
        message: 'Debes comprar el juego antes de reseñarlo',
      });
      return;
    }

    // Obtener el nombre del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    // Crear la nueva reseña
    const newReview = await prisma.review.create({
      data: {
        id: uuidv4(), // Generar un UUID
        author: user?.name || 'Anónimo',
        rating: parseInt(rating),
        comment,
        date: new Date().toISOString(), // Fecha actual en formato ISO
        game: { connect: { id: parseInt(gameId) } },
        user: { connect: { id: userId } },
      },
      include: {
        user: { select: { name: true } },
      },
    });

    // Actualizar el rating promedio del juego
    await updateGameRating(parseInt(gameId));

    res.status(201).json({
      success: true,
      data: {
        id: newReview.id,
        author: newReview.user?.name || newReview.author || 'Anónimo',
        rating: newReview.rating,
        comment: newReview.comment,
        date: newReview.date,
      },
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la reseña',
    });
  }
};

// Función para generar UUID 
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function updateGameRating(gameId: number) {
  const prisma = new PrismaClient();
  const reviews = await prisma.review.findMany({
    where: { gameId },
    select: { rating: true },
  });

  if (reviews.length === 0) return;

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  await prisma.game.update({
    where: { id: gameId },
    data: { rating: averageRating },
  });
}