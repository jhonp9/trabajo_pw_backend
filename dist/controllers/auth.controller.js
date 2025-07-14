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
exports.verifyEmail = exports.logout = exports.getCurrentUser = exports.login = exports.resendVerification = exports.verifyRegistration = exports.register = exports.checkEmail = void 0;
const prisma_1 = require("../generated/prisma");
const auth_1 = require("../utils/auth");
const email_service_1 = require("../services/email.service");
const generators_1 = require("../utils/generators");
const validacion_1 = require("../utils/validacion");
const pendingRegistrations = new Map();
const checkEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    const { email } = req.body;
    // Verificar si el email existe 
    const existingUser = yield prisma.user.findUnique({
        where: { email },
        select: { id: true, verified: true }
    });
    res.json({
        exists: !!existingUser,
        isVerified: (existingUser === null || existingUser === void 0 ? void 0 : existingUser.verified) || false
    });
    return;
});
exports.checkEmail = checkEmail;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    try {
        const { email, name, password } = validacion_1.registerSchema.parse(req.body);
        const existingUser = yield prisma.user.findUnique({
            where: { email },
            include: { verificationCodes: true }
        });
        if (existingUser) {
            if (!existingUser.verified) {
                yield prisma.user.delete({ where: { id: existingUser.id } });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: 'Este email ya está registrado'
                });
                return;
            }
        }
        // Generar código de verificación
        const verificationCode = (0, generators_1.generateVerificationCode)();
        // Hashear la contraseña
        const hashedPassword = yield (0, auth_1.hashPassword)(password);
        // Guardar datos temporalmente
        pendingRegistrations.set(email, {
            email,
            name,
            password: hashedPassword,
            verificationCode,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 horas
        });
        // Enviar email de verificación
        yield (0, email_service_1.sendVerificationEmail)(email, verificationCode);
        res.json({
            success: true,
            message: 'Código de verificación enviado a tu email',
            requiresVerification: true
        });
        return;
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el registro. Por favor intenta nuevamente.'
        });
        return;
    }
});
exports.register = register;
const verifyRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    try {
        const { email, code } = req.body;
        const pendingRegistration = pendingRegistrations.get(email);
        if (!pendingRegistration) {
            res.status(400).json({
                verified: false,
                message: 'Registro no encontrado o expirado'
            });
            return;
        }
        if (code !== pendingRegistration.verificationCode) {
            res.status(400).json({
                verified: false,
                message: 'Código de verificación incorrecto'
            });
            return;
        }
        if (Date.now() > pendingRegistration.expiresAt) {
            pendingRegistrations.delete(email);
            res.status(400).json({
                verified: false,
                message: 'Código de verificación expirado'
            });
            return;
        }
        // Crear usuario en la base de datos
        const user = yield prisma.user.create({
            data: {
                email: pendingRegistration.email,
                name: pendingRegistration.name,
                password: pendingRegistration.password,
                role: 'USER',
                verified: true
            }
        });
        // Eliminar registro pendiente
        pendingRegistrations.delete(email);
        // Generar token de autenticación
        const token = (0, auth_1.generateToken)(user.id, user.role);
        res.json({
            verified: true,
            message: 'Email verificado correctamente',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
        return;
    }
    catch (error) {
        console.error('Error verifying registration:', error);
        res.status(500).json({
            verified: false,
            message: 'Error al verificar el registro'
        });
        return;
    }
});
exports.verifyRegistration = verifyRegistration;
const resendVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const pendingRegistration = pendingRegistrations.get(email);
        if (!pendingRegistration) {
            res.status(400).json({
                success: false,
                message: 'No hay registro pendiente para este email'
            });
            return;
        }
        // Generar nuevo código
        const newCode = (0, generators_1.generateVerificationCode)();
        // Actualizar el código en el registro pendiente
        pendingRegistrations.set(email, Object.assign(Object.assign({}, pendingRegistration), { verificationCode: newCode, 
            // Resetear expiración
            expiresAt: Date.now() + 24 * 60 * 60 * 1000 }));
        // Reenviar email
        yield (0, email_service_1.sendVerificationEmail)(email, newCode);
        res.json({
            success: true,
            message: 'Nuevo código de verificación enviado'
        });
        return;
    }
    catch (error) {
        console.error('Error resending verification:', error);
        res.status(500).json({
            success: false,
            message: 'Error al reenviar el código de verificación'
        });
        return;
    }
});
exports.resendVerification = resendVerification;
// LOGIN Y AUTENTICACIÓN
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    try {
        const { email, password } = validacion_1.loginSchema.parse(req.body);
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user || !(yield (0, auth_1.comparePasswords)(password, user.password))) {
            res.status(401).json({
                success: false,
                message: 'Credenciales inválidas'
            });
            return;
        }
        if (!user.verified) {
            res.status(403).json({
                success: false,
                message: 'Por favor verifica tu email antes de iniciar sesión'
            });
            return;
        }
        const token = (0, auth_1.generateToken)(user.id, user.role);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400000 // 1 día
        });
        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
        return;
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el inicio de sesión'
        });
        return;
    }
});
exports.login = login;
// USUARIO ACTUAL Y LOGOUT
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    if (!req.user) {
        res.status(401).json({ message: 'No autorizado' });
        return;
    }
    const user = yield prisma.user.findUnique({
        where: { id: req.user.id },
        include: { purchasedGames: true }
    });
    if (!user) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
    }
    res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        purchasedGames: user.purchasedGames.map((game) => game.id)
    });
    return;
});
exports.getCurrentUser = getCurrentUser;
const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Sesión cerrada correctamente' });
    return;
};
exports.logout = logout;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prisma = new prisma_1.PrismaClient();
    try {
        const { email, code } = req.body;
        // 1. Buscar usuario no verificado
        const user = yield prisma.user.findUnique({
            where: { email },
            include: { verificationCodes: true }
        });
        if (!user) {
            res.status(404).json({
                verified: false,
                message: 'Usuario no encontrado'
            });
            return;
        }
        if (user.verified) {
            res.status(400).json({
                verified: true,
                message: 'El usuario ya está verificado'
            });
            return;
        }
        // 2. Buscar código de verificación válido
        const verificationCode = yield prisma.verificationCode.findFirst({
            where: {
                userId: user.id,
                code,
                expiresAt: { gt: new Date() }
            }
        });
        if (!verificationCode) {
            res.status(400).json({
                verified: false,
                message: 'Código inválido o expirado'
            });
            return;
        }
        // 3. Actualizar usuario a verificado
        yield prisma.user.update({
            where: { id: user.id },
            data: { verified: true }
        });
        // 4. Eliminar código usado
        yield prisma.verificationCode.delete({
            where: { id: verificationCode.id }
        });
        // 5. Generar token de acceso
        const token = (0, auth_1.generateToken)(user.id, user.role);
        res.json({
            verified: true,
            message: 'Email verificado exitosamente',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
        return;
    }
    catch (error) {
        console.error('Error en verifyEmail:', error);
        res.status(500).json({
            verified: false,
            message: 'Error al verificar el email'
        });
        return;
    }
});
exports.verifyEmail = verifyEmail;
