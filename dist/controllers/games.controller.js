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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.purchaseGame = exports.addGameReview = exports.deleteGame = exports.updateGame = exports.createGame = exports.getGameDetails = exports.getGamesList = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const validacion_1 = require("../utils/validacion");
const getGamesList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const games = yield prisma_1.default.game.findMany({
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
    try {
        const game = yield prisma_1.default.game.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { reviews: true }
        });
        if (!game) {
            res.status(404).json({ message: 'Game not found' });
            return; // <-- Importante: return después de enviar la respuesta
        }
        res.json(game); // <-- Esto es suficiente, no necesitas return
    }
    catch (error) {
        next(error); // <-- Pasa el error al middleware de errores
    }
});
exports.getGameDetails = getGameDetails;
const createGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameData = validacion_1.gameSchema.parse(req.body);
        const game = yield prisma_1.default.game.create({
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
    try {
        const gameData = validacion_1.gameSchema.partial().parse(req.body);
        const game = yield prisma_1.default.game.update({
            where: { id: parseInt(req.params.id) },
            data: gameData
        });
        res.json(game);
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Error al actualizar el juego'
        });
    }
});
exports.updateGame = updateGame;
const deleteGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.game.delete({ where: { id: parseInt(req.params.id) } });
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar el juego' });
    }
});
exports.deleteGame = deleteGame;
const addGameReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { author, rating, comment } = req.body;
        const gameId = parseInt(req.params.gameId);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const review = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
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
    try {
        const { quantity = 1 } = req.body;
        const gameId = parseInt(req.params.gameId);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'No autorizado' });
            return;
        }
        yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
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
