
import prisma from '../config/db.js';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const registroSchema = z.object({
    nombre: z.string().trim().min(3, 'El nombre debe tener al menos 3 caracteres'),
    apellido: z.string().trim().min(3, 'El apellido debe tener al menos 3 caracteres'),
    email: z.string().trim().email('El correo electrónico no es válido').transform((email) => email.toLowerCase()),
    telefono: z.string().trim().optional(),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    fecha_nacimiento: z.iso.date().optional()
});

export async function registrarUsuario(datos) {
    const datosValidados = registroSchema.parse(datos);

    const usuarioExistente = await prisma.usuario.findUnique({
        where: {
            email: datosValidados.email
        }
    });

    if (usuarioExistente) {
        const error = new Error('El correo electrónico ya está registrado');
        error.statusCode = 409;
        throw error;
    }

const pepper = process.env.PASSWORD_PEPPER;

if (!pepper) {
    throw new Error('Falta configurar PASSWORD_PEPPER');
}

const passwordHash = await bcrypt.hash(
    `${datosValidados.password}${pepper}`,
    12
);

    const usuario = await prisma.usuario.create({
        data: {
            nombre: datosValidados.nombre,
            apellido: datosValidados.apellido,
            email: datosValidados.email,
            telefono: datosValidados.telefono || null,
            password: passwordHash,
            fecha_nacimiento: datosValidados.fecha_nacimiento
                ? new Date(`${datosValidados.fecha_nacimiento}T00:00:00.000Z`)
                : null,
            role: 1
        },
        select: {
            id_usuario: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
            fecha_nacimiento: true,
            role: true,
            createdAt: true
        }
    });

    return usuario;
}


export async function iniciarSesion(datos) {
    const loginSchema = z.object({
        email: z.string()
            .trim()
            .email('El correo electrónico no es válido')
            .transform((email) => email.toLowerCase()),
        password: z.string()
            .min(1, 'La contraseña es obligatoria')
    });

    const datosValidados = loginSchema.parse(datos);

    const usuario = await prisma.usuario.findUnique({
        where: {
            email: datosValidados.email
        }
    });

    if (!usuario) {
        const error = new Error('Credenciales incorrectas');
        error.statusCode = 401;
        throw error;
    }

    const pepper = process.env.PASSWORD_PEPPER;

    if (!pepper || !process.env.JWT_SECRET) {
        throw new Error('Falta configurar la seguridad de autenticación');
    }

    const passwordValida = await bcrypt.compare(
        `${datosValidados.password}${pepper}`,
        usuario.password
    );

    if (!passwordValida) {
        const error = new Error('Credenciales incorrectas');
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        {
            sub: usuario.id_usuario,
            role: usuario.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h'
        }
    );

    return {
        token,
        usuario: {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            role: usuario.role
        }
    };
}
