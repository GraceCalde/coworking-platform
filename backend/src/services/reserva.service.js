
import prisma from '../config/db.js';
import { z } from 'zod';

export const ESTADO_RESERVA = {
    PENDING: 1,
    CONFIRMED: 2,
    CANCELLED: 3
};

const crearReservaSchema = z.object({
    id_espacio: z.string().uuid('El ID del espacio debe ser un UUID válido'),
    fecha_inicio: z.coerce.date(),
    fecha_fin: z.coerce.date()
}).refine(
    (datos) => datos.fecha_fin > datos.fecha_inicio,
    {
        message: 'La fecha de fin debe ser posterior a la fecha de inicio',
        path: ['fecha_fin']
    }
);

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
        const error = new Error('La reserva no existe');
        error.statusCode = 404;
        throw error;
    }

    if (
        usuario.role !== 2 &&
        reserva.id_usuario !== usuario.id_usuario
    ) {
        const error = new Error('No tienes permisos para consultar esta reserva');
        error.statusCode = 403;
        throw error;
    }

    return reserva;
}


const crearReservaCompletaSchema = crearReservaSchema.extend({
    modalidad: z.enum(['HORA', 'DIA']).default('HORA')
});

export async function crearReserva(datos, usuario) {
    const datosValidados = crearReservaCompletaSchema.parse(datos);

    const inicio = datosValidados.fecha_inicio;
    const fin = datosValidados.fecha_fin;

    if (inicio <= new Date()) {
        const error = new Error('La fecha de inicio debe ser futura');
        error.statusCode = 400;
        throw error;
    }

    const espacio = await prisma.espacio.findFirst({
        where: {
            id_espacio: datosValidados.id_espacio,
            estado: 1
        }
    });

    if (!espacio) {
        const error = new Error('El espacio no existe o está inactivo');
        error.statusCode = 404;
        throw error;
    }

    const horas = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);

    if (datosValidados.modalidad === 'HORA' && horas < 1) {
        const error = new Error('La reserva por hora debe durar al menos una hora');
        error.statusCode = 400;
        throw error;
    }

    if (datosValidados.modalidad === 'DIA' && horas < 24) {
        const error = new Error('La reserva por día debe durar al menos 24 horas');
        error.statusCode = 400;
        throw error;
    }

    const reservaExistente = await prisma.reserva.findFirst({
        where: {
            id_espacio: espacio.id_espacio,
            estado: {
                in: [
                    ESTADO_RESERVA.PENDING,
                    ESTADO_RESERVA.CONFIRMED
                ]
            },
            fecha_inicio: { lt: fin },
            fecha_fin: { gt: inicio }
        }
    });

    if (reservaExistente) {
        const error = new Error('El espacio ya está reservado en ese horario');
        error.statusCode = 409;
        throw error;
    }

    const precioBase = datosValidados.modalidad === 'HORA'
        ? espacio.precio_por_hora * horas
        : espacio.precio_por_dia * (horas / 24);

    const reserva = await prisma.reserva.create({
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

    return reserva;
}
