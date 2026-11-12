
export const crearRespuesta = {
    success(
        res,
        data = null,
        message = 'Operación realizada correctamente',
        statusCode = 200,
        extra = {}
    ) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            ...extra
        });
    },

    created(
        res,
        data = null,
        message = 'Recurso creado correctamente',
        extra = {}
    ) {
        return res.status(201).json({
            success: true,
            message,
            data,
            ...extra
        });
    },

    paginated(
        res,
        data,
        pagination,
        message = 'Consulta realizada correctamente'
    ) {
        return res.status(200).json({
            success: true,
            message,
            data,
            pagination
        });
    },

    error(
        res,
        message = 'Error interno del servidor',
        statusCode = 500,
        errors = null
    ) {
        return res.status(statusCode).json({
            success: false,
            message,
            ...(errors && { errors })
        });
    }
};
