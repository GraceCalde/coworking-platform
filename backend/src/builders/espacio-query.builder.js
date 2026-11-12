const PAGINA_POR_DEFECTO = 1;
const LIMITE_POR_DEFECTO = 6;
const LIMITE_MAXIMO = 30;

export function construirConsultaEspacios(query = {}) {
    const paginaSolicitada = Number.parseInt(query.page, 10);
    const limiteSolicitado = Number.parseInt(query.limit, 10);

    const page =
        Number.isInteger(paginaSolicitada) && paginaSolicitada > 0
            ? paginaSolicitada
            : PAGINA_POR_DEFECTO;

    const limit =
        Number.isInteger(limiteSolicitado) && limiteSolicitado > 0
            ? Math.min(limiteSolicitado, LIMITE_MAXIMO)
            : LIMITE_POR_DEFECTO;

    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        skip,
        take: limit
    };
}