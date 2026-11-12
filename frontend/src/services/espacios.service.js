
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
