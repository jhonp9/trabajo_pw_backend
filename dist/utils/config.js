"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_ENV = exports.PORT = exports.FRONTEND_URL = exports.DATABASE_URL = exports.JWT_SECRET = void 0;
exports.JWT_SECRET = process.env.JWT_SECRET || 'secret-key-desarrollo';
exports.DATABASE_URL = process.env.DATABASE_URL || 'postgres://usuario:contraseña@localhost:5432/basededatos';
exports.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
exports.PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
exports.NODE_ENV = process.env.NODE_ENV || 'development';
if (!exports.JWT_SECRET || exports.JWT_SECRET === 'secret-key-desarrollo') {
    console.warn('ADVERTENCIA: Se está usando una clave JWT de desarrollo. Cambia esto en producción!');
}
if (!exports.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL no está definido en las variables de entorno');
    process.exit(1);
}
