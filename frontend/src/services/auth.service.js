
const API_URL = 'http://localhost:3000/api/auth';

// Iniciar sesión
export async function iniciarSesion(datos) {
    const respuesta = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            resultado.message || 'No fue posible iniciar sesión'
        );
    }

    return resultado.data;
}

// Registrar un nuevo usuario
export async function registrarUsuario(datos) {
    const respuesta = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            resultado.message || 'No fue posible registrar el usuario'
        );
    }

    return resultado.data;
}
