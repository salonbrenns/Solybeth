// app/api/registro/route.ts
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import bcrypt from 'bcryptjs';  

export async function POST(request: Request) {
  try {
    const { correo, password } = await request.json();

    // Validaiones

    if (!correo || !password) {
      return NextResponse.json(
        { success: false, message: 'Faltan datos' },
        { status: 400 }
      );
    }

    if (!correo.includes('@') || !correo.includes('.')) {
      return NextResponse.json(
        { success: false, message: 'Correo inválido' },
        { status: 400 }
      );
    }
     // Reglas obligatorias con regex 
     const regexMayuscula = /[A-Z]/;
     const regexMinuscula = /[a-z]/;
     const regexNumero = /[0-9]/;
     const regexEspecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/]/;

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      );
    }
    if (!regexMayuscula.test(password)) {
      return NextResponse.json(
        {
          success: false,
          message: 'La contraseña debe incluir al menos una letra mayúscula.',
        },
        { status: 400 }
      );
    }

    if (!regexMinuscula.test(password)) {
      return NextResponse.json(
        {
          success: false,
          message: 'La contraseña debe incluir al menos una letra minúscula.',
        },
        { status: 400 }
      );
    }

    if (!regexNumero.test(password)) {
      return NextResponse.json(
        {
          success: false,
          message: 'La contraseña debe incluir al menos un número.',
        },
        { status: 400 }
      );
    }

    if (!regexEspecial.test(password)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'La contraseña debe incluir al menos un carácter especial (!@#$%, etc.).',
        },
        { status: 400 }
      );
    }

    // Verificar si ya existe
    const check = await pool.query(
      'SELECT 1 FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (check.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Este correo ya está registrado' },
        { status: 409 }
      );
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    await pool.query(
      'INSERT INTO usuarios (correo, password, fecha_registro) VALUES ($1, $2, NOW())',
      [correo, hashedPassword]
    );

    return NextResponse.json({
      success: true,
      message: '¡Registro exitoso! Ahora puedes iniciar sesión.',
    });

  } catch (error: any) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { success: false, message: 'Error del servidor' },
      { status: 500 }
    );
  }
}