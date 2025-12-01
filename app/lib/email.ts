// app/lib/email.ts → Versión ROSA OFICIAL (las dos funciones) 💕
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Paleta rosa oficial de Solvbet
const rosa = '#ec4899';
const rosaClaro = '#fdf2f8';
const rosaFuerte = '#db2777';
const rosaSuave = '#fce7f3';

export async function sendResetLink(correo: string, enlace: string) {
  const mailOptions = {
    from: `"Brenns Recuperación" <${process.env.EMAIL_USER}>`,
    to: correo,
    subject: 'Recupera tu contraseña · Expira en 15 min',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 30px; background: linear-gradient(135deg, ${rosaClaro} 0%, ${rosaSuave} 100%); border-radius: 20px; box-shadow: 0 10px 30px rgba(236,72,153,0.2); text-align: center;">
        <h1 style="color: ${rosa}; font-size: 28px; margin: 0 0 20px;">Recuperar contraseña</h1>
        <p style="color: #6b7280; font-size: 17px; line-height: 1.6;">
          Solicitaste cambiar tu contraseña.<br>
          Este enlace <strong style="color: ${rosaFuerte}">expira en 15 minutos</strong>.
        </p>
        <div style="margin: 40px 0;">
          <a href="${enlace}" style="background: ${rosa}; color: white; padding: 16px 48px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px; display: inline-block; box-shadow: 0 8px 25px rgba(236,72,153,0.4);">
            Cambiar contraseña
          </a>
        </div>
        <p style="color: #9ca3af; font-size: 13px;">
        Si no solicitaste este cambio, puedes ignorar este mensaje con total tranquilidad.
        </p>
        <hr style="border: none; border-top: 2px dashed #fdb8d8; margin: 40px 0 20px;">
        <p style="color: ${rosa}; font-size: 13px;">💜 Brenns · Tu seguridad es lo primero</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email de recuperación ROSA enviado →', info.messageId);
  return info;
}

export async function sendMagicLink(correo: string, enlace: string) {
  const mailOptions = {
    from: `"Brenns Acceso" <${process.env.EMAIL_USER}>`,
    to: correo,
    subject: '✨ Acceso mágico · Expira en 15 min',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 40px auto; padding: 30px; background: linear-gradient(135deg, ${rosaClaro} 0%, ${rosaSuave} 100%); border-radius: 20px; box-shadow: 0 10px 30px rgba(236,72,153,0.2); text-align: center;">
        <h1 style="color: ${rosa}; font-size: 28px; margin: 0 0 20px;">¡Hola de nuevo!</h1>
        <p style="color: #6b7280; font-size: 17px; line-height: 1.6;">
          Haz clic para entrar a Brenns sin contraseña.<br>
          Este enlace mágico <strong style="color: ${rosaFuerte}">expira en 15 minutos</strong>.
        </p>
        <div style="margin: 40px 0;">
          <a href="${enlace}" style="background: ${rosa}; color: white; padding: 16px 48px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 18px; display: inline-block; box-shadow: 0 8px 25px rgba(236,72,153,0.4);">
            Entrar ahora
          </a>
        </div>
        <p style="color: #9ca3af; font-size: 13px;">
          Si no solicitaste este acceso, puedes ignorar este mensaje con total tranquilidad.
        </p>
        <hr style="border: none; border-top: 2px dashed #fdb8d8; margin: 40px 0 20px;">
        <p style="color: ${rosa}; font-size: 13px;">💜 Brenns · Acceso fácil y seguro</p>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Email mágico ROSA enviado →', info.messageId);
  return info;
}