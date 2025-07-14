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
exports.createGameReview = exports.getGameReviews = void 0;
const prisma_1 = require("../generated/prisma");
const getGameReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    try {
        const { gameId } = req.params;
        const reviews = yield prisma.review.findMany({
            where: { gameId: parseInt(gameId) },
            include: { user: { select: { name: true } } },
            orderBy: { date: 'desc' }, // Ordenar por fecha de reseña
        });
        res.status(200).json({
            success: true,
            data: reviews.map(review => {
                var _a;
                return ({
                    id: review.id,
                    author: ((_a = review.user) === null || _a === void 0 ? void 0 : _a.name) || review.author || 'Anónimo',
                    rating: review.rating,
                    comment: review.comment,
                    date: review.date,
                });
            }),
        });
    }
    catch (error) {
        console.error('Error getting game reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las reseñas',
        });
    }
});
exports.getGameReviews = getGameReviews;
const createGameReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const prisma = new prisma_1.PrismaClient();
    try {
        const { gameId } = req.params;
        const { rating, comment } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'No autorizado',
            });
            return;
        }
        // Verificar si el usuario ya ha reseñado este juego
        const existingReview = yield prisma.review.findFirst({
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
        const hasPurchased = yield prisma.purchase.findFirst({
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
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            select: { name: true },
        });
        // Crear la nueva reseña
        const newReview = yield prisma.review.create({
            data: {
                id: uuidv4(), // Generar un UUID
                author: (user === null || user === void 0 ? void 0 : user.name) || 'Anónimo',
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
        yield updateGameRating(parseInt(gameId));
        res.status(201).json({
            success: true,
            data: {
                id: newReview.id,
                author: ((_b = newReview.user) === null || _b === void 0 ? void 0 : _b.name) || newReview.author || 'Anónimo',
                rating: newReview.rating,
                comment: newReview.comment,
                date: newReview.date,
            },
        });
    }
    catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la reseña',
        });
    }
});
exports.createGameReview = createGameReview;
// Función para generar UUID 
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function updateGameRating(gameId) {
    return __awaiter(this, void 0, void 0, function* () {
        const prisma = new prisma_1.PrismaClient();
        const reviews = yield prisma.review.findMany({
            where: { gameId },
            select: { rating: true },
        });
        if (reviews.length === 0)
            return;
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        yield prisma.game.update({
            where: { id: gameId },
            data: { rating: averageRating },
        });
    });
}
