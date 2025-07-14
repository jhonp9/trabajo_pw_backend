import { PrismaClient } from '../generated/prisma';

interface GameKey {
  gameTitle: string;
  key: string;
  transactionId: string;
  email: string;
}

export const saveGameKeys = async (gameKeys: GameKey[]) => {
    const prisma = new PrismaClient();
  try {
    await prisma.gameKey.createMany({
      data: gameKeys.map(key => ({
        gameTitle: key.gameTitle,
        key: key.key,
        transactionId: key.transactionId,
        email: key.email,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 año de expiración
      })),
      skipDuplicates: true
    });
  } catch (error) {
    console.error('Error saving game keys:', error);
    throw new Error('Failed to save game keys');
  }
};