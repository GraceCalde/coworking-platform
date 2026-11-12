import { Router } from 'express';
import {
    registrar,
    login
} from '../controllers/auth.controller.js';
import { verificarRol } from '../middlewares/role.middleware.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', registrar);
router.post('/login', login);
router.get('/profile', verificarToken, (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Usuario autenticado correctamente',
        data: {
            id_usuario: req.user.id_usuario,
            role: req.user.role
        }
    });
});

router.get(
    '/admin-test',
    verificarToken,
    verificarRol(2),
    (req, res) => {
        return res.status(200).json({
            success: true,
            message: 'Acceso administrativo autorizado'
        });
    }
);

export default router;

