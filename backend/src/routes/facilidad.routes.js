
import { Router } from 'express';

import {
    listarFacilidades,
    registrarFacilidad,
    editarFacilidad,
    borrarFacilidad
} from '../controllers/facilidad.controller.js';

import { verificarToken } from '../middlewares/auth.middleware.js';
import { verificarRol } from '../middlewares/role.middleware.js';

const router = Router();

// Ruta pública: consultar las facilidades disponibles
router.get('/', listarFacilidades);
// Ruta privada: crear facilidades, solo para ADMIN
router.post(
    '/',
    verificarToken,
    verificarRol(2),
    registrarFacilidad
);

// Ruta privada: actualizar facilidades, solo para ADMIN
router.put(
    '/:id',
    verificarToken,
    verificarRol(2),
    editarFacilidad
);

// Ruta privada: eliminar facilidades, solo para ADMIN
router.delete(
    '/:id',
    verificarToken,
    verificarRol(2),
    borrarFacilidad
);

export default router;
