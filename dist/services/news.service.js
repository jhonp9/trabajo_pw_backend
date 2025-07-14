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
exports.deleteNews = exports.updateNews = exports.createNews = exports.getNewsById = exports.getAllNews = void 0;
const prisma_1 = require("../generated/prisma");
const getAllNews = () => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    const news = yield prisma.news.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return news.map(n => {
        var _a;
        return ({
            id: n.id,
            titulo: n.title,
            contenido: n.content,
            fecha: n.date,
            imagen: (_a = n.image) !== null && _a !== void 0 ? _a : undefined,
            autor: n.author
        });
    });
});
exports.getAllNews = getAllNews;
const getNewsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const prisma = new prisma_1.PrismaClient();
    const n = yield prisma.news.findUnique({
        where: { id }
    });
    if (!n)
        return null;
    return {
        id: n.id,
        titulo: n.title,
        contenido: n.content,
        fecha: n.date,
        imagen: (_a = n.image) !== null && _a !== void 0 ? _a : undefined,
        autor: n.author
    };
});
exports.getNewsById = getNewsById;
const createNews = (newsData, author) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const prisma = new prisma_1.PrismaClient();
    const created = yield prisma.news.create({
        data: {
            title: newsData.titulo,
            content: newsData.contenido,
            image: (_a = newsData.imagen) !== null && _a !== void 0 ? _a : null,
            author,
            date: new Date().toISOString()
        }
    });
    return {
        id: created.id,
        titulo: created.title,
        contenido: created.content,
        fecha: created.date,
        imagen: (_b = created.image) !== null && _b !== void 0 ? _b : undefined,
        autor: created.author
    };
});
exports.createNews = createNews;
const updateNews = (id, newsData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const prisma = new prisma_1.PrismaClient();
    const updated = yield prisma.news.update({
        where: { id },
        data: {
            title: newsData.titulo,
            content: newsData.contenido,
            image: (_a = newsData.imagen) !== null && _a !== void 0 ? _a : null,
            author: newsData.autor,
            date: newsData.fecha
        }
    });
    return {
        id: updated.id,
        titulo: updated.title,
        contenido: updated.content,
        fecha: updated.date,
        imagen: (_b = updated.image) !== null && _b !== void 0 ? _b : undefined,
        autor: updated.author
    };
});
exports.updateNews = updateNews;
const deleteNews = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    yield prisma.news.delete({
        where: { id }
    });
});
exports.deleteNews = deleteNews;
