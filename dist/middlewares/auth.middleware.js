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
exports.authorizeAdmin = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const config_1 = require("../utils/config");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = req.cookies.token || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
        if (!token) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        const user = yield prisma_1.default.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, name: true, role: true }
        });
        if (!user) {
            res.status(401).json({ message: 'Invalid token' });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(error); // Pasa el error al siguiente middleware (errorHandler)
    }
});
exports.authenticate = authenticate;
const authorizeAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'ADMIN') {
        return res.status(403).json({ message: 'Se requiere acceso de administrador' });
    }
    next();
};
exports.authorizeAdmin = authorizeAdmin;
