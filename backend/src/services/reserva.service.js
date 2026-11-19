import prisma from '../config/db.js';
import { z } from 'zod';

export const ESTADO_RESERVA = {
    PENDING: 1,
    CONFIRMED: 2,
    CANCELLED: 3
};
const fechaUtcSchema = z.string()
    .regex(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/,
        'La fecha debe estar en formato ISO 8601 UTC y terminar en Z'
    )
    .transform((valor) => new Date(valor))
    .refine(
        (fecha) => !Number.isNaN(fecha.getTime()),
        'La fecha proporcionada no es válida'
    );

const crearReservaSchema = z.object({
    id_espacio: z.string().uuid('El ID del espacio debe ser un UUID válido'),
    fecha_inicio: fechaUtcSchema,
    fecha_fin: fechaUtcSchema,
    modalidad: z.enum(['HORA', 'DIA']).default('HORA')
}).refine(
    (datos) => datos.fecha_fin > datos.fecha_inicio,
    {
        message: 'La fecha de fin debe ser posterior a la fecha de inicio',
        path: ['fecha_fin']
    }
);

function crearError(mensaje, statusCode) {
    const error = new Error(mensaje);
    error.statusCode = statusCode;
    return error;
}

export async function listarReservas(usuario) {
    const where = usuario.role === 2
        ? {}
        : { id_usuario: usuario.id_usuario };

    return prisma.reserva.findMany({
        where,
        include: {
            espacio: true,
            usuario: {
                select: {
                    id_usuario: true,
                    nombre: true,
                    apellido: true,
                    email: true
                }
            }
        },
        orderBy: {
            fecha_inicio: 'desc'
        }
    });
}

export async function consultarReserva(idReserva, usuario) {
    const reserva = await prisma.reserva.findUnique({
        where: { id_reserva: idReserva },
        include: {
            espacio: true,
            usuario: {
                select: {
                    id_usuario: true,
                    nombre: true,
                    apellido: true,
                    email: true
                }
            }
        }
    });

    if (!reserva) {
        throw crearError('La reserva no existe', 404);
    }

    if (
        usuario.role !== 2 &&
        reserva.id_usuario !== usuario.id_usuario
    ) {
        throw crearError(
            'No tienes permisos para consultar esta reserva',
            403
        );
    }

    return reserva;
}

export async function crearReserva(datos, usuario) {
    const datosValidados = crearReservaSchema.parse(datos);

    const inicio = datosValidados.fecha_inicio;
    const fin = datosValidados.fecha_fin;

    if (inicio <= new Date()) {
        throw crearError(
            'La fecha de inicio debe ser futura',
            400
        );
    }

    const horas = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);

    if (datosValidados.modalidad === 'HORA' && horas < 1) {
        throw crearError(
            'La reserva por hora debe durar al menos una hora',
            400
        );
    }

    if (datosValidados.modalidad === 'DIA' && horas < 24) {
        throw crearError(
            'La reserva por día debe durar al menos 24 horas',
            400
        );
    }

    try {
        // La consulta del espacio y la creación pertenecen
        // a la misma transacción.
        const reserva = await prisma.$transaction(async (tx) => {
            const espacio = await tx.espacio.findFirst({
                where: {
                    id_espacio: datosValidados.id_espacio,
                    estado: 1
                }
            });

            if (!espacio) {
                throw crearError(
                    'El espacio no existe o está inactivo',
                    404
                );
            }

            const precioBase = datosValidados.modalidad === 'HORA'
                ? espacio.precio_por_hora * horas
                : espacio.precio_por_dia * (horas / 24);

            return tx.reserva.create({
                data: {
                    id_usuario: usuario.id_usuario,
                    id_espacio: espacio.id_espacio,
                    fecha_inicio: inicio,
                    fecha_fin: fin,
                    precio_total: Number(precioBase.toFixed(2)),
                    estado: ESTADO_RESERVA.PENDING
                },
                include: {
                    espacio: true
                }
            });
        });

        return reserva;

} catch (error) {
    const detalleError = [
        error?.message,
        error?.meta?.database_error,
        error?.meta?.cause
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

    const esConflictoDeHorario =
        detalleError.includes('23p01') ||
        detalleError.includes('reservas_no_overlap');

    if (esConflictoDeHorario) {
        throw crearError(
            'El espacio ya está reservado en ese horario',
            409
        );
    }

    throw error;
}
}
