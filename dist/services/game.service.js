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
exports.addGameReview = exports.deleteGame = exports.updateGame = exports.createGame = exports.getGameById = exports.getGames = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getGames = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.game.findMany({
        include: { reviews: true }
    });
});
exports.getGames = getGames;
const getGameById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.game.findUnique({
        where: { id },
        include: { reviews: true }
    });
});
exports.getGameById = getGameById;
const createGame = (gameData) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.game.create({
        data: Object.assign(Object.assign({}, gameData), { sales: 0, rating: 0 })
    });
});
exports.createGame = createGame;
const updateGame = (id, gameData) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.game.update({
        where: { id },
        data: gameData
    });
});
exports.updateGame = updateGame;
const deleteGame = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.game.delete({
        where: { id }
    });
});
exports.deleteGame = deleteGame;
const addGameReview = (gameId, review, userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const newReview = yield tx.review.create({
            data: Object.assign(Object.assign({}, review), { gameId,
                userId, date: new Date().toISOString() })
        });
        const reviews = yield tx.review.findMany({ where: { gameId } });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        yield tx.game.update({
            where: { id: gameId },
            data: { rating: parseFloat(avgRating.toFixed(1)) }
        });
        return newReview;
    }));
});
exports.addGameReview = addGameReview;
