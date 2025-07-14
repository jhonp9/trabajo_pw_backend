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
exports.validateUser = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const auth_1 = require("../utils/auth");
const prisma_1 = require("../generated/prisma");
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    const users = yield prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true
        }
    });
    return users.map(user => (Object.assign(Object.assign({}, user), { role: user.role })));
});
exports.getAllUsers = getAllUsers;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    const user = yield prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true
        }
    });
    return user
        ? Object.assign(Object.assign({}, user), { role: user.role }) : null;
});
exports.getUserById = getUserById;
const updateUser = (id, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    const updatedUser = yield prisma.user.update({
        where: { id },
        data: userData,
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true
        }
    });
    return Object.assign(Object.assign({}, updatedUser), { role: updatedUser.role });
});
exports.updateUser = updateUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    yield prisma.user.delete({
        where: { id }
    });
});
exports.deleteUser = deleteUser;
const validateUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    const user = yield prisma.user.findUnique({ where: { email } });
    if (!user)
        return null;
    const isValid = yield (0, auth_1.comparePasswords)(password, user.password);
    return isValid
        ? Object.assign(Object.assign({}, user), { role: user.role }) : null;
});
exports.validateUser = validateUser;
