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
exports.deleteUser = exports.updateUser = exports.getUserDetails = exports.getUsersList = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const getUsersList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.default.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
});
exports.getUsersList = getUsersList;
const getUserDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id: parseInt(req.params.id) },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                purchasedGames: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        images: true
                    }
                },
                createdAt: true
            }
        });
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
});
exports.getUserDetails = getUserDetails;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, role } = req.body;
        const user = yield prisma_1.default.user.update({
            where: { id: parseInt(req.params.id) },
            data: { name, email, role },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.default.user.delete({ where: { id: parseInt(req.params.id) } });
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
});
exports.deleteUser = deleteUser;
