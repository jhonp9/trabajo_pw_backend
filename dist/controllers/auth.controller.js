"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.logout = exports.getCurrentUser = exports.register = exports.login = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../utils/auth");
const validacion_1 = require("../utils/validacion");
const userService = __importStar(require("../services/user.service"));
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = validacion_1.loginSchema.parse(req.body);
        const user = yield userService.validateUser(email, password);
        if (!user) {
            res.status(401).json({ message: 'Credenciales inválidas' });
            return;
        }
        const token = (0, auth_1.generateToken)(user.id, user.role);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400000
        });
        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        });
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Error en el login'
        });
    }
});
exports.login = login;
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, password } = validacion_1.registerSchema.parse(req.body);
        const existingUser = yield prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'El usuario ya existe' });
            return;
        }
        const hashedPassword = yield (0, auth_1.hashPassword)(password);
        const user = yield prisma_1.default.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: 'USER'
            }
        });
        res.status(201).json({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
        });
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Error en el registro'
        });
    }
});
exports.register = register;
const getCurrentUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ message: 'No autorizado' });
        return;
    }
    res.json({
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role
    });
});
exports.getCurrentUser = getCurrentUser;
const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Sesión cerrada correctamente' });
};
exports.logout = logout;
