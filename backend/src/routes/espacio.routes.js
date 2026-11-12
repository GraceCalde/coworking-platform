
import { Router } from 'express';

import {
    listarEspacios,
    consultarEspacio,
    registrarEspacio,
    editarEspacio,
    desactivarEspacioController,
    asignarFacilidadesController,
    subirImagenesController
} from '../controllers/espacio.controller.js';

import { verificarToken } from '../middlewares/auth.middleware.js';
import { verificarRol } from '../middlewares/role.middleware.js';
import { subirImagenes } from '../middlewares/upload.middleware.js';

const router = Router();

// Ruta pública: consultar espacios activos
router.get('/', listarEspacios);
// Ruta pública: consultar un espacio activo por ID
router.get('/:id', consultarEspacio);


 // Ruta privada: crear espacios, solo para ADMIN
router.post(
    '/',
    verificarToken,
    verificarRol(2),
    registrarEspacio
);

// Ruta privada: asignar facilidades a un espacio, solo para ADMIN
router.post(
    '/:id/facilidades',
    verificarToken,
    verificarRol(2),
    asignarFacilidadesController
);

// Ruta privada: subir imágenes de un espacio, solo para ADMIN
router.post(
    '/:id/imagenes',
    verificarToken,
    verificarRol(2),
    subirImagenes.array('imagenes', 5),
    subirImagenesController
);


// Ruta privada: editar espacios, solo para ADMIN
router.put(
    '/:id',
    verificarToken,
    verificarRol(2),
    editarEspacio,
);

// Ruta privada: desactivar espacios, solo para ADMIN
router.patch(
    '/:id/desactivar',
    verificarToken,
    verificarRol(2),
    desactivarEspacioController
);

export default router;

