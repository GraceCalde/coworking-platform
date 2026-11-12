
import { Router } from 'express';

import {
    listarReservasController,
    consultarReservaController,
    registrarReservaController
} from '../controllers/reserva.controller.js';

import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Ruta privada: listar las reservas propias o todas si es ADMIN
router.get(
    '/',
    verificarToken,
    listarReservasController
);

// Ruta privada: consultar una reserva por ID
router.get(
    '/:id',
    verificarToken,
    consultarReservaController
);

// Ruta privada: crear una reserva para el usuario autenticado
router.post(
    '/',
    verificarToken,
    registrarReservaController
);

export default router;
