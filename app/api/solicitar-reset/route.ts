// app/api/solicitar-reset/route.ts
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { encrypt } from '@/app/lib/encryption';
import { sendResetLink } from '@/app/lib/email';
import { checkRateLimit } from '@/app/lib/rateLimit';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { correo } = await request.json();

    if (!correo || !correo.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Correo inválido' },
        { status: 400 }
      );
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // 3. Rate limit por IP + correo
    const { allowed, retryAfter } = await checkRateLimit(ip, correo);
    if (!allowed) {
      return NextResponse.json(
        { success: false, message: 'Demasiados intentos. Intenta más tarde.' },
        { status: 429, headers: { 'Retry-After': retryAfter!.toString() } }
      );
    }

    // Buscar usuario (pero NUNCA revelar si existe)
    const userResult = await pool.query(
      'SELECT id FROM usuarios WHERE correo = $1',
      [correo.toLowerCase()]
    );

    if (userResult.rows.length > 0) {
      const usuario_id = userResult.rows[0].id;

      // Borrar cualquier enlace anterior de reset para este usuario
      await pool.query(
        "DELETE FROM enlaces_temporales WHERE usuario_id = $1 AND tipo = 'reset'",
        [usuario_id]
      );

    
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenEncriptado = encrypt(rawToken);

      await pool.query(
        `INSERT INTO enlaces_temporales 
         (usuario_id, token, expiracion, usado, tipo, fecha_creacion)
         VALUES ($1, $2, NOW() + INTERVAL '15 minutes', false, 'reset', NOW())`,
        [usuario_id, tokenEncriptado]
      );

      const enlace = `${process.env.NEXT_PUBLIC_URL}/pin-reset?token=${encodeURIComponent(tokenEncriptado)}`;
      await sendResetLink(correo, enlace);
    }

    return NextResponse.json({
      success: true,
      message: 'Si el correo exite, recibirás un enlace de recuperación en breve.'
    });

  } catch (error: any) {
    console.error('Error solicitar-reset:', error);
    return NextResponse.json(
      { success: false, message: 'Error del servidor' },
      { status: 500 }
    );
  }
}