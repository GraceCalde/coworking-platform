
import 'dotenv/config';
import prisma from './db.js';

try {
    await prisma.$connect();

    const resultado = await prisma.$queryRaw`SELECT NOW() AS fecha_servidor`;

    console.log('Conexión a PostgreSQL exitosa');
    console.log('Fecha del servidor:', resultado[0].fecha_servidor);
} catch (error) {
    console.error('Error al conectar con PostgreSQL:', error.message);
    process.exitCode = 1;
} finally {
    await prisma.$disconnect();
}
