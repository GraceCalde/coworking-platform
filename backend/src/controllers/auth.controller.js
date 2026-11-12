
import {
    registrarUsuario,
    iniciarSesion
} from '../services/auth.service.js';
import { ZodError } from 'zod';

export async function registrar(req, res) {
    try {
        const usuario = await registrarUsuario(req.body);

        return res.status(201).json({
            success: true,
            message: 'Usuario registrado correctamente',
            data: usuario
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Los datos enviados no son válidos',
                errors: error.issues.map((issue) => ({
                    campo: issue.path.join('.'),
                    mensaje: issue.message
                }))
            });
        }

        if (error.statusCode === 409) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        if (error.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: 'El correo electrónico ya está registrado'
            });
        }

        console.error('Error al registrar usuario:', error);

        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
}


export async function login(req, res) {
    try {
        const resultado = await iniciarSesion(req.body);

        return res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            data: resultado
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Los datos enviados no son válidos',
                errors: error.issues.map((issue) => ({
                    campo: issue.path.join('.'),
                    mensaje: issue.message
                }))
            });
        }

        if (error.statusCode === 401) {
            return res.status(401).json({
                success: false,
                message: 'Correo electrónico o contraseña incorrectos'
            });
        }

        console.error('Error al iniciar sesión:', error);

        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
}
