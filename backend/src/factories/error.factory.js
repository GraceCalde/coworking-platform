export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);

        this.name = 'AppError';
        this.statusCode = statusCode;

        Error.captureStackTrace?.(this, AppError);
    }
}

export const crearError = {
    badRequest(message = 'Los datos enviados no son válidos') {
        return new AppError(message, 400);
    },

    unauthorized(message = 'Se requiere autenticación') {
        return new AppError(message, 401);
    },

    forbidden(message = 'No tienes permisos para realizar esta acción') {
        return new AppError(message, 403);
    },

    notFound(message = 'El recurso solicitado no existe') {
        return new AppError(message, 404);
    },

    conflict(message = 'La operación genera un conflicto') {
        return new AppError(message, 409);
    },

    internal(message = 'Error interno del servidor') {
        return new AppError(message, 500);
    }
};