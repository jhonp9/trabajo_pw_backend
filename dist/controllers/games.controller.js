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
exports.processPurchase = exports.purchaseGame = exports.addGameReview = exports.deleteGame = exports.updateGame = exports.createGame = exports.getGameDetails = exports.getGamesList = void 0;
const validacion_1 = require("../utils/validacion");
const prisma_1 = require("../generated/prisma");
const generators_1 = require("../utils/generators");
const gameKey_service_1 = require("../services/gameKey.service");
const email_service_1 = require("../services/email.service");
const getGamesList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    try {
        const games = yield prisma.game.findMany({
            include: { reviews: true }
        });
        res.json(games);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los juegos' });
    }
});
exports.getGamesList = getGamesList;
const getGameDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    try {
        const game = yield prisma.game.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { reviews: true }
        });
        if (!game) {
            res.status(404).json({ message: 'Game not found' });
            return;
        }
        res.json(game);
    }
    catch (error) {
        next(error);
    }
});
exports.getGameDetails = getGameDetails;
const createGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    try {
        const gameData = validacion_1.gameSchema.parse(req.body);
        const game = yield prisma.game.create({
            data: Object.assign(Object.assign({}, gameData), { sales: 0, rating: 0 })
        });
        res.status(201).json(game);
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Error al crear el juego'
        });
    }
});
exports.createGame = createGame;
const updateGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const prisma = new prisma_1.PrismaClient();
    try {
        // Convertir price a número y limpiar trailerUrl
        const rawData = req.body;
        const processedData = Object.assign(Object.assign({}, rawData), { price: typeof rawData.price === 'string' ? parseFloat(rawData.price) : rawData.price, trailerUrl: (_a = rawData.trailerUrl) === null || _a === void 0 ? void 0 : _a.replace(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/i, '$2') });
        // Validar con el schema
        const gameData = validacion_1.gameSchema.partial().parse(processedData);
        const game = yield prisma.game.update({
            where: { id: parseInt(req.params.id) },
            data: gameData
        });
        res.json(game);
    }
    catch (error) {
        console.error('Error detallado:', error);
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Error al actualizar el juego'
        });
    }
});
exports.updateGame = updateGame;
const deleteGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    try {
        yield prisma.game.delete({ where: { id: parseInt(req.params.id) } });
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar el juego' });
    }
});
exports.deleteGame = deleteGame;
const addGameReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const prisma = new prisma_1.PrismaClient();
    try {
        const { author, rating, comment } = req.body;
        const gameId = parseInt(req.params.gameId);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const review = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const newReview = yield tx.review.create({
                data: {
                    author,
                    rating,
                    comment,
                    date: new Date().toISOString(),
                    gameId,
                    userId
                }
            });
            const reviews = yield tx.review.findMany({ where: { gameId } });
            const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            yield tx.game.update({
                where: { id: gameId },
                data: { rating: parseFloat(avgRating.toFixed(1)) }
            });
            return newReview;
        }));
        res.status(201).json(review);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al agregar la reseña' });
    }
});
exports.addGameReview = addGameReview;
const purchaseGame = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const prisma = new prisma_1.PrismaClient();
    try {
        const { quantity = 1 } = req.body;
        const gameId = parseInt(req.params.gameId);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield tx.game.update({
                where: { id: gameId },
                data: { sales: { increment: quantity } }
            });
            yield tx.user.update({
                where: { id: userId },
                data: { purchasedGames: { connect: { id: gameId } } }
            });
        }));
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al procesar la compra' });
    }
});
exports.purchaseGame = purchaseGame;
// COMPRAS Y CLAVES DE JUEGO
const processPurchase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    try {
        const { userId, items } = req.body;
        // Verificar el usuario
        const user = yield prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
            return;
        }
        // Procesar cada item del carrito
        const purchaseResults = yield Promise.all(items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            const game = yield prisma.game.findUnique({ where: { id: item.id } });
            if (!game) {
                throw new Error(`Juego ${item.id} no encontrado`);
            }
            return Object.assign(Object.assign({}, item), { title: game.title, price: game.price });
        })));
        // Calcular total
        const total = purchaseResults.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        // Generar ID de transacción
        const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        // Generar claves de juego
        const gameKeys = purchaseResults.flatMap(item => Array.from({ length: item.quantity }, () => ({
            gameTitle: item.title,
            key: (0, generators_1.generateGameKey)(),
            transactionId,
            email: user.email
        })));
        // Guardar claves en la base de datos
        yield (0, gameKey_service_1.saveGameKeys)(gameKeys);
        // Enviar email con recibo
        yield (0, email_service_1.sendPurchaseReceipt)(user.email, purchaseResults.map(item => ({
            title: item.title,
            price: item.price,
            quantity: item.quantity
        })), total, transactionId);
        // Registrar la compra en la base de datos
        yield prisma.purchase.create({
            data: {
                userId,
                amount: total,
                transactionId,
                items: {
                    create: purchaseResults.map(item => ({
                        gameId: item.id,
                        quantity: item.quantity,
                        priceAtPurchase: item.price
                    }))
                }
            }
        });
        // Actualizar juegos comprados del usuario
        yield prisma.user.update({
            where: { id: userId },
            data: {
                purchasedGames: {
                    connect: purchaseResults.map(item => ({ id: item.id }))
                }
            }
        });
        res.json({
            success: true,
            message: 'Compra realizada con éxito',
            transactionId
        });
        return;
    }
    catch (error) {
        console.error('Purchase processing error:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar la compra'
        });
        return;
    }
});
exports.processPurchase = processPurchase;
