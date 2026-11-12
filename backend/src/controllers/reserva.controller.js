
import { ZodError } from 'zod';

import {
    listarReservas,
    consultarReserva,
    crearReserva
} from '../services/reserva.service.js';

// GET: listar reservas según el rol del usuario
export async function listarReservasController(req, res) {
    try {
        const reservas = await listarReservas(req.user);

        return res.status(200).json({
            success: true,
            total: reservas.length,
            data: reservas
        });
    } catch (error) {
        console.error('Error al listar reservas:', error);

        return res.status(500).json({
            success: false,
            message: 'Error al consultar las reservas'
        });
    }
}

// GET: consultar una reserva por ID
export async function consultarReservaController(req, res) {
    try {
        const reserva = await consultarReserva(req.params.id, req.user);

        return res.status(200).json({
            success: true,
            data: reserva
        });
    } catch (error) {
        if (error.statusCode === 403 || error.statusCode === 404) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        console.error('Error al consultar reserva:', error);

        return res.status(500).json({
            success: false,
            message: 'Error al consultar la reserva'
        });
    }
}

// POST: crear una reserva
export async function registrarReservaController(req, res) {
    try {
        const reserva = await crearReserva(req.body, req.user);

        return res.status(201).json({
            success: true,
            message: 'Reserva creada correctamente',
            data: reserva
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: 'Los datos de la reserva no son válidos',
                errores: error.issues.map((issue) => ({
                    campo: issue.path.join('.'),
                    mensaje: issue.message
                }))
            });
        }

        if ([400, 404, 409].includes(error.statusCode)) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        console.error('Error al registrar reserva:', error);

        return res.status(500).json({
            success: false,
            message: 'Error interno al registrar la reserva'
        });
    }
}
