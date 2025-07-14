"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveGameKeys = void 0;
const prisma_1 = require("../generated/prisma");
const saveGameKeys = (gameKeys) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    try {
        yield prisma.gameKey.createMany({
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
    }
    catch (error) {
        console.error('Error saving game keys:', error);
        throw new Error('Failed to save game keys');
    }
});
exports.saveGameKeys = saveGameKeys;
