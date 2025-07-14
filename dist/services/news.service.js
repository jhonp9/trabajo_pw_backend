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
exports.deleteNews = exports.updateNews = exports.createNews = exports.getNewsById = exports.getAllNews = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getAllNews = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.news.findMany({
        orderBy: { createdAt: 'desc' }
    });
});
exports.getAllNews = getAllNews;
const getNewsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.news.findUnique({
        where: { id }
    });
});
exports.getNewsById = getNewsById;
const createNews = (newsData, author) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.news.create({
        data: Object.assign(Object.assign({}, newsData), { author, date: new Date().toISOString() })
    });
});
exports.createNews = createNews;
const updateNews = (id, newsData) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.news.update({
        where: { id },
        data: newsData
    });
});
exports.updateNews = updateNews;
const deleteNews = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.news.delete({
        where: { id }
    });
});
exports.deleteNews = deleteNews;
