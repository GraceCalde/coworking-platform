
import jwt from 'jsonwebtoken';

export function verificarToken(req, res, next) {
    const encabezado = req.headers.authorization;

    if (!encabezado || !encabezado.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Se requiere un token de autenticación'
        });
    }

    const token = encabezado.split(' ')[1];

    try {
        const datosToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id_usuario: datosToken.sub,
            role: datosToken.role
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'El token es inválido o ha expirado'
        });
    }
}
