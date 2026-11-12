
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import espacioRoutes from './routes/espacio.routes.js';
import facilidadRoutes from './routes/facilidad.routes.js';
import reservaRoutes from './routes/reserva.routes.js';

import { manejarErrores } from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ruta de comprobación
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API funcionando correctamente'
    });
});

// Rutas principales
app.use('/api/auth', authRoutes);
app.use('/api/espacios', espacioRoutes);
app.use('/api/facilidades', facilidadRoutes);
app.use('/api/reservas', reservaRoutes);

// Middleware global de errores (siempre después de las rutas)
app.use(manejarErrores);

export default app;
