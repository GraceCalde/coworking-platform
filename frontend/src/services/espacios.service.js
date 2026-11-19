const API_URL = 'http://localhost:3000/api/espacios';

// Consultar espacios con paginación
export async function listarEspacios(pagina = 1, limite = 6) {
    const respuesta = await fetch(
        `${API_URL}?page=${pagina}&limit=${limite}`
    );

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            resultado.message || 'No fue posible consultar los espacios'
        );
    }

    return resultado;
}

// Consultar un espacio por su ID
export async function obtenerEspacio(id) {
    const respuesta = await fetch(`${API_URL}/${id}`);

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
        throw new Error(
            resultado.message || 'No fue posible consultar el espacio'
        );
    }

    return resultado.data;
}