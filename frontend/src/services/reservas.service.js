const API_URL = 'http://localhost:3000/api/reservas';

export async function crearReserva(datos, token) {
    const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(datos)
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
        const error = new Error(
            resultado.message || 'No fue posible crear la reserva'
        );

        error.status = respuesta.status;

        throw error;
    }

    return resultado.data;
}