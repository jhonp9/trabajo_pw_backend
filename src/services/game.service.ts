import { PrismaClient } from '../generated/prisma';
import { Game, Review } from '../types';
import { Prisma } from '@prisma/client';

export const getGames = async (): Promise<Game[]> => {
  const prisma = new PrismaClient();
  const games = await prisma.game.findMany({
    include: { reviews: true }
  });

  return games.map(game => ({
    ...game,
    requirements: typeof game.requirements === 'string'
      ? JSON.parse(game.requirements)
      : (game.requirements ?? { minimum: [], recommended: [] })
  }));
};

export const getGameById = async (id: number): Promise<Game | null> => {
  const prisma = new PrismaClient();
  const game = await prisma.game.findUnique({
    where: { id },
    include: { reviews: true }
  });

  if (!game) return null;

  return {
    ...game,
    requirements: typeof game.requirements === 'string'
      ? JSON.parse(game.requirements)
      : (game.requirements ?? { minimum: [], recommended: [] })
  };
};

export const createGame = async (gameData: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>): Promise<Game> => {
  const prisma = new PrismaClient();
  const { reviews, ...gameDataWithoutReviews } = gameData;
  const createdGame = await prisma.game.create({
    data: {
      ...gameDataWithoutReviews,
      sales: 0,
      rating: 0
      // Do not include 'reviews' here; reviews are managed separately
    }
  });

  return {
    ...createdGame,
    reviews: [],
    requirements: typeof createdGame.requirements === 'string'
      ? JSON.parse(createdGame.requirements)
      : (createdGame.requirements ?? { minimum: [], recommended: [] })
  };
};

export const updateGame = async (id: number, gameData: Partial<Game>): Promise<Game> => {
  const prisma = new PrismaClient();
  // Exclude 'id' and 'reviews' from gameData before updating
  const { id: _id, reviews: _reviews, ...gameDataWithoutIdAndReviews } = gameData;
  const updatedGame = await prisma.game.update({
    where: { id },
    data: gameDataWithoutIdAndReviews,
    include: { reviews: true }
  });

  return {
    ...updatedGame,
    requirements: typeof updatedGame.requirements === 'string'
      ? JSON.parse(updatedGame.requirements)
      : (updatedGame.requirements ?? { minimum: [], recommended: [] })
  };
};

export const deleteGame = async (id: number): Promise<void> => {
  const prisma = new PrismaClient();
  await prisma.game.delete({
    where: { id }
  });
};

export const addGameReview = async (gameId: number, review: Omit<Review, 'id' | 'gameId'>, userId: number): Promise<Review> => {
  const prisma = new PrismaClient();
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const newReview = await tx.review.create({
      data: {
        ...review,
        gameId,
        userId,
        date: new Date().toISOString()
      }
    });

    const reviews = await tx.review.findMany({ where: { gameId } });
    const avgRating = reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length;

    await tx.game.update({
      where: { id: gameId },
      data: { rating: parseFloat(avgRating.toFixed(1)) }
    });

    return newReview;
  });
};



