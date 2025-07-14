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
exports.deleteNews = exports.updateNews = exports.createNews = exports.getNewsItem = exports.getNewsList = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getNewsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const news = yield prisma_1.default.news.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(news);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener las noticias' });
    }
});
exports.getNewsList = getNewsList;
const getNewsItem = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newsItem = yield prisma_1.default.news.findUnique({
            where: { id: req.params.id }
        });
        if (!newsItem) {
            res.status(404).json({ message: 'Noticia no encontrada' });
            return;
        }
        res.json(newsItem);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener la noticia' });
    }
});
exports.getNewsItem = getNewsItem;
const createNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, content, image } = req.body;
        const author = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.name) || 'Anónimo';
        const newsItem = yield prisma_1.default.news.create({
            data: {
                title,
                content,
                image,
                author,
                date: new Date().toISOString()
            }
        });
        res.status(201).json(newsItem);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear la noticia' });
    }
});
exports.createNews = createNews;
const updateNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content, image } = req.body;
        const newsItem = yield prisma_1.default.news.update({
            where: { id: req.params.id },
            data: { title, content, image }
        });
        res.json(newsItem);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar la noticia' });
    }
});
exports.updateNews = updateNews;
const deleteNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.news.delete({ where: { id: req.params.id } });
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar la noticia' });
    }
});
exports.deleteNews = deleteNews;
