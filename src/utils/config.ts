export const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-desarrollo';
export const DATABASE_URL = process.env.DATABASE_URL || 'postgres://usuario:contraseña@localhost:5432/basededatos';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
export const NODE_ENV = process.env.NODE_ENV || 'development';

if (!JWT_SECRET || JWT_SECRET === 'secret-key-desarrollo') {
  console.warn('ADVERTENCIA: Se está usando una clave JWT de desarrollo. Cambia esto en producción!');
}

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL no está definido en las variables de entorno');
  process.exit(1);
}