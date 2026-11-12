
import prisma from '../config/db.js';

import { z } from 'zod';

export async function obtenerFacilidades() {
    return prisma.facilidad.findMany({
        orderBy: {
            nombre: 'asc'
        }
    });
}


const crearFacilidadSchema = z.object({
    nombre: z.string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede superar 100 caracteres'),

    icon: z.string()
        .trim()
        .max(100, 'El icono no puede superar 100 caracteres')
        .optional()
});

export async function crearFacilidad(datos) {
    const datosValidados = crearFacilidadSchema.parse(datos);

    return prisma.facilidad.create({
        data: {
            nombre: datosValidados.nombre,
            icon: datosValidados.icon || null
        }
    });
}


const actualizarFacilidadSchema = crearFacilidadSchema
    .partial()
    .refine(
        (datos) => Object.keys(datos).length > 0,
        'Debes enviar al menos un campo para actualizar'
    );

export async function actualizarFacilidad(id, datos) {
    const datosValidados = actualizarFacilidadSchema.parse(datos);

    const facilidadExistente = await prisma.facilidad.findUnique({
        where: {
            id_facilidad: id
        }
    });

    if (!facilidadExistente) {
        const error = new Error('La facilidad no existe');
        error.statusCode = 404;
        throw error;
    }

    return prisma.facilidad.update({
        where: {
            id_facilidad: id
        },
        data: datosValidados
    });
}


export async function eliminarFacilidad(id) {
    const facilidadExistente = await prisma.facilidad.findUnique({
        where: {
            id_facilidad: id
        }
    });

    if (!facilidadExistente) {
        const error = new Error('La facilidad no existe');
        error.statusCode = 404;
        throw error;
    }

    await prisma.facilidad.delete({
        where: {
            id_facilidad: id
        }
    });

    return facilidadExistente;
}
