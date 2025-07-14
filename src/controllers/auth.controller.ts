import { RequestHandler } from 'express';
import { PrismaClient } from '../generated/prisma';
import { generateToken, hashPassword, comparePasswords } from '../utils/auth';
import { sendVerificationEmail } from '../services/email.service';
import { generateVerificationCode } from '../utils/generators';
import { registerSchema, loginSchema } from '../utils/validacion';


const pendingRegistrations = new Map<string, any>();


export const checkEmail: RequestHandler = async (req, res) => {
  const prisma = new PrismaClient();
  const { email } = req.body;
  
  // Verificar si el email existe 
  const existingUser = await prisma.user.findUnique({ 
    where: { email },
    select: { id: true, verified: true }
  });

   res.json({ 
    exists: !!existingUser,
    isVerified: existingUser?.verified || false
  });return
};

export const register: RequestHandler = async (req, res) => {
  const prisma = new PrismaClient();
  try {
    const { email, name, password } = registerSchema.parse(req.body);
    
    const existingUser = await prisma.user.findUnique({ 
      where: { email },
      include: { verificationCodes: true }
    });

    if (existingUser) {
      if (!existingUser.verified) {
        await prisma.user.delete({ where: { id: existingUser.id } });
      } else {
        res.status(400).json({ 
          success: false, 
          message: 'Este email ya está registrado' 
        });return 
      }
    }

    // Generar código de verificación
    const verificationCode = generateVerificationCode();
    
    // Hashear la contraseña
    const hashedPassword = await hashPassword(password);

    // Guardar datos temporalmente
    pendingRegistrations.set(email, {
      email,
      name,
      password: hashedPassword,
      verificationCode,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 horas
    });

    // Enviar email de verificación
    await sendVerificationEmail(email, verificationCode);

    res.json({ 
      success: true,
      message: 'Código de verificación enviado a tu email',
      requiresVerification: true
    });return 
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el registro. Por favor intenta nuevamente.' 
    });return 
  }
};

export const verifyRegistration: RequestHandler = async (req, res) => {
  const prisma = new PrismaClient();
  try {
    const { email, code } = req.body;
    const pendingRegistration = pendingRegistrations.get(email);

    if (!pendingRegistration) {
      res.status(400).json({ 
        verified: false, 
        message: 'Registro no encontrado o expirado' 
      });return 
    }

    if (code !== pendingRegistration.verificationCode) {
      res.status(400).json({ 
        verified: false, 
        message: 'Código de verificación incorrecto' 
      });return 
    }

    if (Date.now() > pendingRegistration.expiresAt) {
      pendingRegistrations.delete(email);
      res.status(400).json({ 
        verified: false, 
        message: 'Código de verificación expirado' 
      });return 
    }

    // Crear usuario en la base de datos
    const user = await prisma.user.create({
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
    const token = generateToken(user.id, user.role);

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
    });return 

  } catch (error) {
    console.error('Error verifying registration:', error);
    res.status(500).json({ 
      verified: false,
      message: 'Error al verificar el registro' 
    });return 
  }
};

export const resendVerification: RequestHandler = async (req, res) => {
  try {
    const { email } = req.body;
    const pendingRegistration = pendingRegistrations.get(email);

    if (!pendingRegistration) {
      res.status(400).json({ 
        success: false,
        message: 'No hay registro pendiente para este email' 
      });return 
    }

    // Generar nuevo código
    const newCode = generateVerificationCode();
    
    // Actualizar el código en el registro pendiente
    pendingRegistrations.set(email, {
      ...pendingRegistration,
      verificationCode: newCode,
      // Resetear expiración
      expiresAt: Date.now() + 24 * 60 * 60 * 1000
    });

    // Reenviar email
    await sendVerificationEmail(email, newCode);

    res.json({ 
      success: true,
      message: 'Nuevo código de verificación enviado' 
    });return 

  } catch (error) {
    console.error('Error resending verification:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al reenviar el código de verificación' 
    });return 
  }
};

// LOGIN Y AUTENTICACIÓN
export const login: RequestHandler = async (req, res) => {
  const prisma = new PrismaClient();
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await comparePasswords(password, user.password))) {
      res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });return 
    }

    if (!user.verified) {
      res.status(403).json({
        success: false,
        message: 'Por favor verifica tu email antes de iniciar sesión'
      });return 
    }

    const token = generateToken(user.id, user.role);
    
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
    });return 

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el inicio de sesión' 
    });return 
  }
};

// USUARIO ACTUAL Y LOGOUT
export const getCurrentUser: RequestHandler = async (req, res) => {
  const prisma = new PrismaClient();
  if (!req.user) {
    res.status(401).json({ message: 'No autorizado' });
    return 
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: { purchasedGames: true }
  });

  if (!user) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return 
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    purchasedGames: user.purchasedGames.map((game: { id: number }) => game.id)
  });return 
};

export const logout: RequestHandler = (req, res) => {
  
  res.clearCookie('token');
  res.json({ message: 'Sesión cerrada correctamente' });
  return 
};

export const verifyEmail: RequestHandler = async (req, res) => {
  const prisma = new PrismaClient();
  try {
    const { email, code } = req.body;

    // 1. Buscar usuario no verificado
    const user = await prisma.user.findUnique({
      where: { email },
      include: { verificationCodes: true }
    });

    if (!user) {
      res.status(404).json({
        verified: false,
        message: 'Usuario no encontrado'
      });return 
    }

    if (user.verified) {
      res.status(400).json({
        verified: true,
        message: 'El usuario ya está verificado'
      });return 
    }

    // 2. Buscar código de verificación válido
    const verificationCode = await prisma.verificationCode.findFirst({
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
      });return 
    }

    // 3. Actualizar usuario a verificado
    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true }
    });

    // 4. Eliminar código usado
    await prisma.verificationCode.delete({
      where: { id: verificationCode.id }
    });

    // 5. Generar token de acceso
    const token = generateToken(user.id, user.role);

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
    });return 

  } catch (error) {
    console.error('Error en verifyEmail:', error);
    res.status(500).json({
      verified: false,
      message: 'Error al verificar el email'
    });return 
  }
};