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
exports.validateUser = exports.createUser = exports.findUserByEmail = void 0;
const auth_1 = require("../utils/auth");
const prisma_1 = require("../generated/prisma");
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    const user = yield prisma.user.findUnique({ where: { email } });
    if (!user)
        return null;
    return Object.assign(Object.assign({}, user), { role: user.role.toLowerCase() === 'admin' ? 'admin' : 'user' });
});
exports.findUserByEmail = findUserByEmail;
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    const hashedPassword = yield (0, auth_1.hashPassword)(userData.password);
    const createdUser = yield prisma.user.create({
        data: {
            email: userData.email,
            name: userData.name,
            password: hashedPassword,
            role: userData.role || 'USER'
        }
    });
    return Object.assign(Object.assign({}, createdUser), { role: createdUser.role.toLowerCase() === 'admin' ? 'admin' : 'user' });
});
exports.createUser = createUser;
const validateUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.findUserByEmail)(email);
    if (!user || !user.password)
        return null;
    const isValid = yield (0, auth_1.comparePasswords)(password, user.password);
    return isValid ? user : null;
});
exports.validateUser = validateUser;
