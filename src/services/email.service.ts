// src/services/email.service.ts
import nodemailer from 'nodemailer';


interface PurchaseReceiptParams {
  email: string;
  userName: string;
  purchase: any;
  gameKeys: any[];
}

// Configuración del transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true para el puerto 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production', // Solo validar certificados en producción
  },
});

// Verificar la conexión del transporter al iniciar
transporter.verify((error) => {
  if (error) {
    console.error('Error al configurar el servicio de email:', error);
  } else {
    console.log('Servicio de email configurado correctamente');
  }
});


// Genera un código de verificación de 6 dígitos

export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


// Envía un email con el código de verificación
 
export const sendVerificationEmail = async (email: string, code: string): Promise<void> => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_SENDER_NAME || 'Tienda de Videojuegos'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verificación de tu cuenta',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #2d3748;">Verificación de Email</h1>
          <p style="font-size: 16px;">Gracias por registrarte en nuestra tienda de videojuegos.</p>
          <p style="font-size: 16px;">Por favor ingresa el siguiente código para verificar tu cuenta:</p>
          
          <div style="background: #f7fafc; border: 1px dashed #cbd5e0; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h2 style="margin: 0; color: #4a5568; letter-spacing: 2px; font-size: 28px;">${code}</h2>
          </div>
          
          <p style="font-size: 14px; color: #718096;">
            Este código expirará en 24 horas.<br>
            Si no solicitaste este código, por favor ignora este mensaje.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #718096;">
            <p>Equipo de ${process.env.EMAIL_SENDER_NAME || 'Tienda de Videojuegos'}</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email de verificación enviado a ${email}`);
  } catch (error) {
    console.error('Error al enviar email de verificación:', error);
    throw new Error('No se pudo enviar el email de verificación');
  }
};


// Genera una clave de juego aleatoria

const generateGameKey = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Caracteres válidos, omitiendo 0, O, 1, I
  const segments = [4, 4, 4, 4]; // Formato: XXXX-XXXX-XXXX-XXXX
  let key = '';

  segments.forEach((segment, index) => {
    for (let i = 0; i < segment; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (index < segments.length - 1) {
      key += '-';
    }
  });

  return key;
};


// Envía un email con el recibo de compra y claves de juego
 
export const sendPurchaseReceipt = async (
  email: string,
  items: Array<{
    title: string;
    price: number;
    quantity: number;
  }>,
  total: number,
  transactionId: string
): Promise<void> => {
  try {
    // Generar claves para cada juego comprado
    const gameKeys = items.map(item => ({
      title: item.title,
      keys: Array.from({ length: item.quantity }, () => generateGameKey())
    }));

    // Crear HTML para los items
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${item.title}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">$${item.price.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    // Crear HTML para las claves
    const keysHtml = gameKeys.map(game => `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #2d3748; font-size: 16px; margin-bottom: 8px;">${game.title}</h3>
        ${game.keys.map(key => `
          <div style="background: #f7fafc; padding: 10px; border-radius: 4px; margin-bottom: 8px; font-family: monospace; font-size: 14px;">
            ${key}
          </div>
        `).join('')}
      </div>
    `).join('');

    const mailOptions = {
      from: `"${process.env.EMAIL_SENDER_NAME || 'Tienda de Videojuegos'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Recibo de compra #${transactionId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #2d3748;">¡Gracias por tu compra!</h1>
          <p style="font-size: 16px;">Aquí tienes los detalles de tu pedido:</p>
          
          <h2 style="color: #2d3748; font-size: 18px; margin-top: 24px;">Resumen de la compra</h2>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <thead>
              <tr style="background-color: #f7fafc; text-align: left;">
                <th style="padding: 8px; border-bottom: 1px solid #e2e8f0;">Juego</th>
                <th style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">Cantidad</th>
                <th style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">Precio Unitario</th>
                <th style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr>
                <td colspan="3" style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">$${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <h2 style="color: #2d3748; font-size: 18px; margin-top: 24px;">Tus claves de activación</h2>
          <div style="margin: 16px 0;">
            ${keysHtml}
          </div>
          
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #718096;">
            <p><strong>Número de transacción:</strong> ${transactionId}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p>Si tienes algún problema con tu compra, por favor contáctanos respondiendo a este email.</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #718096;">
            <p>Equipo de ${process.env.EMAIL_SENDER_NAME || 'Tienda de Videojuegos'}</p>
          </div>
        </div>
      `,
    };

    // Enviar email
    await transporter.sendMail(mailOptions);
    console.log(`Email de recibo enviado a ${email}`);
    
  } catch (error) {
    console.error('Error al enviar recibo de compra:', error);
    throw new Error('No se pudo enviar el recibo de compra');
  }
};


// Envía un email para restablecer contraseña

export const sendPasswordResetEmail = async (email: string, token: string): Promise<void> => {
  try {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: `"${process.env.EMAIL_SENDER_NAME || 'Tienda de Videojuegos'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Restablecer tu contraseña',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h1 style="color: #2d3748;">Restablecer contraseña</h1>
          <p style="font-size: 16px;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
          
          <div style="margin: 20px 0; text-align: center;">
            <a href="${resetLink}" style="background-color: #4299e1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Restablecer contraseña
            </a>
          </div>
          
          <p style="font-size: 14px; color: #718096;">
            Este enlace expirará en 1 hora.<br>
            Si no solicitaste restablecer tu contraseña, por favor ignora este mensaje.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email de restablecimiento enviado a ${email}`);
  } catch (error) {
    console.error('Error al enviar email de restablecimiento:', error);
    throw new Error('No se pudo enviar el email de restablecimiento');
  }
};