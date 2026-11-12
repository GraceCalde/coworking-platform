
import { ZodError } from 'zod';

import {
    obtenerFacilidades,
    crearFacilidad,
    actualizarFacilidad,
    eliminarFacilidad
} from '../services/facilidad.service.js';

export async function listarFacilidades(req, res) {
    try {
        const facilidades = await obtenerFacilidades();

        return res.status(200).json({
            success: true,
            total: facilidades.length,
            data: facilidades
        });
    } catch (error) {
        console.error('Error al consultar facilidades:', error);

        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
}

export async function registrarFacilidad(req, res) {
    try {
        const facilidad = await crearFacilidad(req.body);

        return res.status(201).json({
            success: true,
            message: 'Facilidad creada correctamente',
            data: facilidad
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

        // Prisma P2002 significa que se intentó duplicar un valor único.
        if (error.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: 'Ya existe una facilidad con ese nombre'
            });
        }

        console.error('Error al crear facilidad:', error);

        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
}


export async function editarFacilidad(req, res) {
    try {
        const facilidad = await actualizarFacilidad(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: 'Facilidad actualizada correctamente',
            data: facilidad
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

        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        if (error.code === 'P2002') {
            return res.status(409).json({
                success: false,
                message: 'Ya existe una facilidad con ese nombre'
            });
        }

        console.error('Error al actualizar facilidad:', error);

        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
}


export async function borrarFacilidad(req, res) {
    try {
        const facilidad = await eliminarFacilidad(req.params.id);

        return res.status(200).json({
            success: true,
            message: 'Facilidad eliminada correctamente',
            data: facilidad
        });
    } catch (error) {
        if (error.statusCode === 404) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        console.error('Error al eliminar facilidad:', error);

        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
}
