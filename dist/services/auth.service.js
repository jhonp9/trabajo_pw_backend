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
exports.validateUser = exports.createUser = exports.findUserByEmail = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../utils/auth");
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.default.user.findUnique({ where: { email } });
});
exports.findUserByEmail = findUserByEmail;
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield (0, auth_1.hashPassword)(userData.password);
    return prisma_1.default.user.create({
        data: {
            email: userData.email,
            name: userData.name,
            password: hashedPassword,
            role: userData.role || 'USER'
        }
    });
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
