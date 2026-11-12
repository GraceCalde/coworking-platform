
import { ZodError } from 'zod';

import { AppError } from '../factories/error.factory.js';
import { crearRespuesta } from '../factories/response.factory.js';
import { construirConsultaEspacios } from '../builders/espacio-query.builder.js';

import {
    obtenerEspacios,
    obtenerEspacioPorId,
    crearEspacio,
    actualizarEspacio,
    desactivarEspacio,
    asignarFacilidades,
    registrarImagenes
} from '../services/espacio.service.js';

function manejarErrorControlador(error, res, contexto) {
    if (error instanceof ZodError) {
        return crearRespuesta.error(
            res,
            'Los datos enviados no son válidos',
            400,
            error.issues.map((issue) => ({
                campo: issue.path.join('.'),
                mensaje: issue.message
            }))
        );
    }

    if (error instanceof AppError) {
        return crearRespuesta.error(
            res,
            error.message,
            error.statusCode
        );
    }

    console.error(contexto, error);

    return crearRespuesta.error(
        res,
        'Error interno del servidor',
        500
    );
}

export async function listarEspacios(req, res) {
    try {
        const { page, limit, skip, take } =
            construirConsultaEspacios(req.query);

        const resultado = await obtenerEspacios({ skip, take });

        const totalPaginas = Math.ceil(resultado.total / limit);

        return crearRespuesta.paginated(
            res,
            resultado.espacios,
            {
                paginaActual: page,
                elementosPorPagina: limit,
                totalElementos: resultado.total,
                totalPaginas
            },
            'Espacios consultados correctamente'
        );
    } catch (error) {
        return manejarErrorControlador(
            error, res, 'Error al consultar espacios:'
        );
    }
}
export async function registrarEspacio(req, res) {
    try {
        const espacio = await crearEspacio(req.body);

        return crearRespuesta.created(
            res,
            espacio,
            'Espacio creado correctamente'
        );
    } catch (error) {
        return manejarErrorControlador(
            error,
            res,
            'Error al crear espacio:'
        );
    }
}


export async function editarEspacio(req, res) {
    try {
        const espacio = await actualizarEspacio(
            req.params.id,
            req.body
        );

        return crearRespuesta.success(
            res,
            espacio,
            'Espacio actualizado correctamente'
        );
    } catch (error) {
        return manejarErrorControlador(
            error,
            res,
            'Error al actualizar espacio:'
        );
    }
}

export async function desactivarEspacioController(req, res) {
    try {
        const espacio = await desactivarEspacio(req.params.id);

        return crearRespuesta.success(
            res,
            espacio,
            'Espacio desactivado correctamente'
        );
    } catch (error) {
        return manejarErrorControlador(
            error,
            res,
            'Error al desactivar espacio:'
        );
    }
}

export async function consultarEspacio(req, res) {
    try {
        const espacio = await obtenerEspacioPorId(req.params.id);

        return crearRespuesta.success(
            res,
            espacio,
            'Espacio consultado correctamente'
        );
    } catch (error) {
        return manejarErrorControlador(
            error,
            res,
            'Error al consultar espacio:'
        );
    }
}

export async function asignarFacilidadesController(req, res) {
    try {
        const resultado = await asignarFacilidades(
            req.params.id,
            req.body
        );

        return crearRespuesta.success(
            res,
            resultado,
            'Facilidades asignadas correctamente',
            200,
            { total: resultado.length }
        );
    } catch (error) {
        return manejarErrorControlador(
            error,
            res,
            'Error al asignar facilidades:'
        );
    }
}

export async function subirImagenesController(req, res) {
    try {
        const resultado = await registrarImagenes(
            req.params.id,
            req.files
        );

        return crearRespuesta.created(
            res,
            resultado,
            'Imágenes registradas correctamente'
        );
    } catch (error) {
        return manejarErrorControlador(
            error,
            res,
            'Error al registrar imágenes:'
        );
    }
}