import multer from 'multer';

import { AppError } from '../factories/error.factory.js';
import { crearRespuesta } from '../factories/response.factory.js';

export function manejarErrores(error, req, res, next) {
    console.error('Error en la aplicación:', error);

    if (res.headersSent) {
        return next(error);
    }

    if (error instanceof AppError) {
        return crearRespuesta.error(
            res,
            error.message,
            error.statusCode
        );
    }

    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return crearRespuesta.error(
                res,
                'La imagen supera el límite permitido de 5 MB',
                413
            );
        }

        if (
            error.code === 'LIMIT_FILE_COUNT' ||
            error.code === 'LIMIT_UNEXPECTED_FILE'
        ) {
            return crearRespuesta.error(
                res,
                'Se permite subir un máximo de 5 imágenes',
                400
            );
        }

        return crearRespuesta.error(
            res,
            'Error al procesar los archivos enviados',
            400
        );
    }

    if (
        error.message ===
        'Solo se permiten imágenes JPG, PNG o WEBP'
    ) {
        return crearRespuesta.error(
            res,
            error.message,
            400
        );
    }

    return crearRespuesta.error(
        res,
        'Error interno del servidor',
        500
    );
}
