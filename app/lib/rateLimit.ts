// app/lib/rateLimit.ts
import pool from '@/app/lib/db';

const MAX_INTENTOS = 3;
const VENTANA_MINUTOS = 15;

export async function checkRateLimit(ip: string, correo: string) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO rate_limit_reset (ip, correo, intentos, ultima_solicitud)
       VALUES ($1, $2, 1, NOW())
       ON CONFLICT (ip, correo) DO UPDATE
       SET intentos = CASE
         WHEN rate_limit_reset.ultima_solicitud < NOW() - INTERVAL '${VENTANA_MINUTOS} minutes'
         THEN 1
         ELSE rate_limit_reset.intentos + 1
       END,
       ultima_solicitud = NOW()
       RETURNING intentos, ultima_solicitud`,
      [ip, correo.toLowerCase()]
    );

    const { intentos, ultima_solicitud } = result.rows[0];

    if (intentos > MAX_INTENTOS) {
      const segundosRestantes = Math.max(
        Math.ceil((new Date(ultima_solicitud).getTime() + VENTANA_MINUTOS * 60 * 1000 - Date.now()) / 1000),
        60
      );
      return { allowed: false, retryAfter: segundosRestantes };
    }

    return { allowed: true };
  } catch (err) {
    console.error('Rate limit error:', err);
    return { allowed: true }; // fail-open
  } finally {
    client.release();
  }
}