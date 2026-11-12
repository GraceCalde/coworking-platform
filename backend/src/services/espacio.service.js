import prisma from '../config/db.js';
import { z } from 'zod';
import { crearError } from '../factories/error.factory.js';
import { construirConsultaEspacios } from '../builders/espacio-query.builder.js';

const crearEspacioSchema = z.object({
    nombre: z.string()
        .trim()
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(50, 'El nombre no puede superar 50 caracteres'),

    descripcion: z.string()
        .trim()
        .max(1000, 'La descripción no puede superar 1000 caracteres')
        .optional(),

    capacidad: z.number()
        .int('La capacidad debe ser un número entero')
        .positive('La capacidad debe ser mayor que cero'),

    precio_por_hora: z.number()
        .positive('El precio por hora debe ser mayor que cero'),

    precio_por_dia: z.number()
        .positive('El precio por día debe ser mayor que cero')
});

const actualizarEspacioSchema = crearEspacioSchema
    .partial()
    .refine(
        (datos) => Object.keys(datos).length > 0,
        'Debes enviar al menos un campo para actualizar'
    );

export async function crearEspacio(datos) {
    const datosValidados = crearEspacioSchema.parse(datos);

    const espacio = await prisma.espacio.create({
        data: {
            nombre: datosValidados.nombre,
            descripcion: datosValidados.descripcion || null,
            capacidad: datosValidados.capacidad,
            precio_por_hora: datosValidados.precio_por_hora,
            precio_por_dia: datosValidados.precio_por_dia,
            estado: 1
        }
    });

    return espacio;
}

export async function actualizarEspacio(id, datos) {
    const datosValidados = actualizarEspacioSchema.parse(datos);

    const espacioExistente = await prisma.espacio.findUnique({
        where: {
            id_espacio: id
        }
    });

    if (!espacioExistente) {
        throw crearError.notFound('El espacio no existe');
    }

    const espacioActualizado = await prisma.espacio.update({
        where: {
            id_espacio: id
        },
        data: datosValidados
    });

    return espacioActualizado;
}

export async function desactivarEspacio(id) {
    const espacioExistente = await prisma.espacio.findUnique({
        where: {
            id_espacio: id
        }
    });

    if (!espacioExistente) {
        throw crearError.notFound('El espacio no existe');
    }

    if (espacioExistente.estado === 0) {
        throw crearError.conflict('El espacio ya está desactivado');
    }

    return prisma.espacio.update({
        where: {
            id_espacio: id
        },
        data: {
            estado: 0
        }
    });
}

export async function obtenerEspacios({ skip, take }) {
    const [espacios, total] = await prisma.$transaction([
        prisma.espacio.findMany({
            where: {
                estado: 1
            },
            skip,
            take,
            include: {
                imagenes: true,
                espacioFacilidades: {
                    include: {
                        facilidad: true
                    }
                }
            },
            orderBy: {
                nombre: 'asc'
            }
        }),

        prisma.espacio.count({
            where: {
                estado: 1
            }
        })
    ]);

    return {
        espacios,
        total
    };
}

export async function obtenerEspacioPorId(id) {
    const espacio = await prisma.espacio.findFirst({
        where: {
            id_espacio: id,
            estado: 1
        },
        include: {
            imagenes: true,
            espacioFacilidades: {
                include: {
                    facilidad: true
                }
            }
        }
    });

    if (!espacio) {
        throw crearError.notFound(
            'El espacio no existe o está desactivado'
        );
    }

    return espacio;
}

const asignarFacilidadesSchema = z.object({
    facilidadesIds: z.array(
        z.string().uuid('Cada ID de facilidad debe ser un UUID válido')
    ).min(1, 'Debes seleccionar al menos una facilidad')
});

export async function asignarFacilidades(idEspacio, datos) {
    const datosValidados = asignarFacilidadesSchema.parse(datos);

    const espacio = await prisma.espacio.findFirst({
        where: {
            id_espacio: idEspacio,
            estado: 1
        }
    });

    if (!espacio) {
        throw crearError.notFound(
            'El espacio no existe o está desactivado'
        );
    }

    const idsUnicos = [...new Set(datosValidados.facilidadesIds)];

    const facilidadesExistentes = await prisma.facilidad.findMany({
        where: {
            id_facilidad: {
                in: idsUnicos
            }
        },
        select: {
            id_facilidad: true
        }
    });

    if (facilidadesExistentes.length !== idsUnicos.length) {
        throw crearError.badRequest(
            'Una o más facilidades no existen'
        );
    }

    return prisma.$transaction(
        idsUnicos.map((idFacilidad) =>
            prisma.espacioFacilidad.upsert({
                where: {
                    id_espacio_id_facilidad: {
                        id_espacio: idEspacio,
                        id_facilidad: idFacilidad
                    }
                },
                update: {},
                create: {
                    id_espacio: idEspacio,
                    id_facilidad: idFacilidad
                }
            })
        )
    );
}

export async function registrarImagenes(idEspacio, archivos) {
    const espacio = await prisma.espacio.findFirst({
        where: {
            id_espacio: idEspacio,
            estado: 1
        }
    });

    if (!espacio) {
        throw crearError.notFound(
            'El espacio no existe o está desactivado'
        );
    }

    if (!archivos || archivos.length === 0) {
        throw crearError.badRequest(
            'Debes seleccionar al menos una imagen'
        );
    }

    const imagenes = await prisma.imagen.createMany({
        data: archivos.map((archivo) => ({
            id_espacio: idEspacio,
            url: `/uploads/${archivo.filename}`
        }))
    });

    return {
        total: imagenes.count,
        id_espacio: idEspacio
    };
}