import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarEspacios } from '../services/espacios.service';

export default function SpaceCatalog() {
    const [espacios, setEspacios] = useState([]);
    const [paginacion, setPaginacion] = useState(null);
    const [pagina, setPagina] = useState(1);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const limite = 6;

    useEffect(() => {
        async function cargarEspacios() {
            try {
                setCargando(true);
                setError('');

                const resultado = await listarEspacios(pagina, limite);

                setEspacios(resultado.data);
                setPaginacion(resultado.pagination);

            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        }

        cargarEspacios();
    }, [pagina]);

    function cambiarPagina(nuevaPagina) {
        setPagina(nuevaPagina);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    function obtenerImagen(espacio) {
        if (
            espacio.imagenes &&
            espacio.imagenes.length > 0
        ) {
            return `http://localhost:3000${espacio.imagenes[0].url}`;
        }

        return null;
    }

    if (cargando) {
        return (
            <section className="catalog-section">
                <div className="catalog-message">
                    Cargando espacios...
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="catalog-section">
                <div className="catalog-message catalog-error">
                    {error}
                </div>
            </section>
        );
    }

    return (
        <section
            id="espacios"
            className="catalog-section"
        >
            <div className="catalog-container">

                <div className="catalog-heading">
                    <span className="section-eyebrow">
                        NUESTROS ESPACIOS
                    </span>

                    <h2>
                        Encuentra el espacio ideal
                    </h2>

                    <p>
                        Descubre espacios preparados para trabajar,
                        crear y conectar.
                    </p>
                </div>

                {espacios.length === 0 ? (
                    <div className="catalog-message">
                        No hay espacios disponibles en este momento.
                    </div>
                ) : (
                    <div className="spaces-grid">

                        {espacios.map((espacio) => {

                            const imagen = obtenerImagen(espacio);

                            return (
                                <article
                                    className="space-card"
                                    key={espacio.id_espacio}
                                >

                                    <div className="space-image">

                                        {imagen ? (
                                            <img
                                                src={imagen}
                                                alt={espacio.nombre}
                                            />
                                        ) : (
                                            <div className="no-image">
                                                NÓRDICA
                                            </div>
                                        )}

                                    </div>

                                    <div className="space-content">

                                        <h3>
                                            {espacio.nombre}
                                        </h3>

                                        {espacio.descripcion && (
                                            <p className="space-description">
                                                {espacio.descripcion}
                                            </p>
                                        )}

                                        <div className="space-details">

                                            <span>
                                                Capacidad: {espacio.capacidad} personas
                                            </span>

                                            <span>
                                                Desde Q{espacio.precio_por_hora}
                                                /hora
                                            </span>

                                        </div>

                                        {espacio.facilidades &&
                                            espacio.facilidades.length > 0 && (
                                                <div className="space-facilities">
                                                    {espacio.facilidades.map(
                                                        (facilidad) => (
                                                            <span
                                                                key={
                                                                    facilidad.id_facilidad
                                                                }
                                                            >
                                                                {facilidad.nombre}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            )}

                                            <Link
    to={`/espacios/${espacio.id_espacio}`}
    className="space-reserve-button"
>
    Ver detalles y reservar →
</Link>

                                    </div>

                                </article>
                            );
                        })}

                    </div>
                )}

                {paginacion &&
                    paginacion.totalPaginas > 1 && (
                        <div className="pagination">

                            <button
                                onClick={() =>
                                    cambiarPagina(pagina - 1)
                                }
                                disabled={pagina === 1}
                            >
                                ← Anterior
                            </button>

                            <span>
                                Página {paginacion.paginaActual} de{' '}
                                {paginacion.totalPaginas}
                            </span>

                            <button
                                onClick={() =>
                                    cambiarPagina(pagina + 1)
                                }
                                disabled={
                                    pagina ===
                                    paginacion.totalPaginas
                                }
                            >
                                Siguiente →
                            </button>

                        </div>
                    )}

            </div>
        </section>
    );
}