
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { obtenerEspacio } from '../services/espacios.service';
import { crearReserva } from '../services/reservas.service';
import { useAuth } from '../context/AuthContext';

function obtenerFechaLocal() {
    const ahora = new Date();
    const anio = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');
    const dia = String(ahora.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
}

export default function SpaceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, autenticado } = useAuth();

    const [espacio, setEspacio] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    const [fechaInicio, setFechaInicio] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [modalidad, setModalidad] = useState('HORA');

    const [reservando, setReservando] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [errorReserva, setErrorReserva] = useState('');

    useEffect(() => {
        async function cargarEspacio() {
            try {
                setCargando(true);
                setError('');

                const resultado = await obtenerEspacio(id);
                setEspacio(resultado);
            } catch (err) {
                setError(err.message);
            } finally {
                setCargando(false);
            }
        }

        cargarEspacio();
    }, [id]);

    function obtenerImagen() {
        if (espacio?.imagenes?.length > 0) {
            return `http://localhost:3000${espacio.imagenes[0].url}`;
        }

        return null;
    }

    function obtenerFechas() {
        if (!fechaInicio || !horaInicio || !fechaFin || !horaFin) {
            return null;
        }

        const inicio = new Date(`${fechaInicio}T${horaInicio}:00`);
        const fin = new Date(`${fechaFin}T${horaFin}:00`);

        return { inicio, fin };
    }

    function calcularHoras() {
        const fechas = obtenerFechas();

        if (!fechas) return 0;

        const diferencia =
            fechas.fin.getTime() - fechas.inicio.getTime();

        if (diferencia <= 0) return 0;

        return diferencia / (1000 * 60 * 60);
    }

    function calcularPrecio() {
        if (!espacio) return 0;

        const horas = calcularHoras();

        if (horas <= 0) return 0;

        const precio = modalidad === 'DIA'
            ? espacio.precio_por_dia * (horas / 24)
            : espacio.precio_por_hora * horas;

        return Number(precio.toFixed(2));
    }

    function cambiarModalidad(nuevaModalidad) {
        setModalidad(nuevaModalidad);
        setErrorReserva('');
        setMensaje('');
    }

    function limpiarMensajes() {
        setErrorReserva('');
        setMensaje('');
    }

    async function manejarReserva(evento) {
        evento.preventDefault();

        limpiarMensajes();

        if (!autenticado || !token) {
            navigate('/login');
            return;
        }

        if (!fechaInicio || !horaInicio || !fechaFin || !horaFin) {
            setErrorReserva(
                'Completa las fechas y horas de inicio y finalización.'
            );
            return;
        }

        const fechas = obtenerFechas();

        if (fechas.inicio <= new Date()) {
            setErrorReserva(
                'La fecha y hora de inicio deben ser futuras.'
            );
            return;
        }

        const horas = calcularHoras();

        if (horas <= 0) {
            setErrorReserva(
                'La fecha y hora de finalización deben ser posteriores al inicio.'
            );
            return;
        }

        if (modalidad === 'HORA' && horas < 1) {
            setErrorReserva(
                'La reserva por hora debe durar al menos una hora.'
            );
            return;
        }

        if (modalidad === 'DIA' && horas < 24) {
            setErrorReserva(
                'La reserva por día debe durar al menos 24 horas.'
            );
            return;
        }

        try {
            setReservando(true);

            const datos = {
                id_espacio: espacio.id_espacio,
                fecha_inicio: fechas.inicio.toISOString(),
                fecha_fin: fechas.fin.toISOString(),
                modalidad
            };

            await crearReserva(datos, token);

            setMensaje(
                'Reserva creada correctamente. El horario ha sido registrado.'
            );

            setFechaInicio('');
            setHoraInicio('');
            setFechaFin('');
            setHoraFin('');
            setModalidad('HORA');

        } catch (err) {
            if (err.status === 409) {
                setErrorReserva(
                    'El espacio ya está reservado en ese horario. Selecciona otro horario.'
                );
            } else {
                setErrorReserva(err.message);
            }
        } finally {
            setReservando(false);
        }
    }

    if (cargando) {
        return (
            <main className="space-detail-page">
                <div className="detail-message">
                    Cargando espacio...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="space-detail-page">
                <div className="detail-message detail-error">
                    {error}
                </div>

                <Link to="/" className="detail-back-link">
                    ← Volver al catálogo
                </Link>
            </main>
        );
    }

    const imagen = obtenerImagen();
    const horas = calcularHoras();
    const precio = calcularPrecio();
    const dias = horas / 24;

    return (
        <main className="space-detail-page">
            <div className="space-detail-container">

                <Link to="/" className="detail-back-link">
                    ← Volver al catálogo
                </Link>

                <div className="space-detail-card">

                    <div className="detail-image">
                        {imagen ? (
                            <img src={imagen} alt={espacio.nombre} />
                        ) : (
                            <div className="detail-no-image">
                                NÓRDICA
                            </div>
                        )}
                    </div>

                    <div className="detail-content">

                        <span className="section-eyebrow">
                            ESPACIO NÓRDICA
                        </span>

                        <h1>{espacio.nombre}</h1>

                        {espacio.descripcion && (
                            <p className="detail-description">
                                {espacio.descripcion}
                            </p>
                        )}

                        <div className="detail-information">

                            <div className="detail-item">
                                <span>Capacidad</span>
                                <strong>{espacio.capacidad} personas</strong>
                            </div>

                            <div className="detail-item">
                                <span>Precio por hora</span>
                                <strong>Q{espacio.precio_por_hora}</strong>
                            </div>

                            <div className="detail-item">
                                <span>Precio por día</span>
                                <strong>Q{espacio.precio_por_dia}</strong>
                            </div>

                        </div>

                        {espacio.facilidades?.length > 0 && (
                            <div className="detail-facilities">
                                <h3>Facilidades</h3>

                                <div className="space-facilities">
                                    {espacio.facilidades.map((facilidad) => (
                                        <span key={facilidad.id_facilidad}>
                                            {facilidad.nombre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="reservation-box">

                            <div className="reservation-heading">
                                <span className="section-eyebrow">
                                    RESERVACIÓN
                                </span>

                                <h2>Reserva este espacio</h2>

                                <p>
                                    Selecciona las fechas y horarios
                                    para consultar el precio de tu reserva.
                                </p>
                            </div>

                            {!autenticado && (
                                <div className="login-reservation-notice">
                                    <span>
                                        Debes iniciar sesión para realizar
                                        una reserva.
                                    </span>

                                    <Link to="/login">
                                        Iniciar sesión →
                                    </Link>
                                </div>
                            )}

                            {autenticado && (
                                <form
                                    className="reservation-form"
                                    onSubmit={manejarReserva}
                                >

                                    <div className="reservation-field">
                                        <label htmlFor="fechaInicio">
                                            Fecha de inicio
                                        </label>

                                        <input
                                            id="fechaInicio"
                                            type="date"
                                            min={obtenerFechaLocal()}
                                            value={fechaInicio}
                                            onChange={(event) => {
                                                const nuevaFecha = event.target.value;

                                                setFechaInicio(nuevaFecha);

                                                if (fechaFin && fechaFin < nuevaFecha) {
                                                    setFechaFin('');
                                                }

                                                limpiarMensajes();
                                            }}
                                            required
                                        />
                                    </div>

                                    <div className="reservation-field">
                                        <label htmlFor="horaInicio">
                                            Hora de inicio
                                        </label>

                                        <input
                                            id="horaInicio"
                                            type="time"
                                            value={horaInicio}
                                            onChange={(event) => {
                                                setHoraInicio(event.target.value);
                                                limpiarMensajes();
                                            }}
                                            required
                                        />
                                    </div>

                                    <div className="reservation-field">
                                        <label htmlFor="fechaFin">
                                            Fecha de finalización
                                        </label>

                                        <input
                                            id="fechaFin"
                                            type="date"
                                            min={fechaInicio || obtenerFechaLocal()}
                                            value={fechaFin}
                                            onChange={(event) => {
                                                setFechaFin(event.target.value);
                                                limpiarMensajes();
                                            }}
                                            required
                                        />
                                    </div>

                                    <div className="reservation-field">
                                        <label htmlFor="horaFin">
                                            Hora de finalización
                                        </label>

                                        <input
                                            id="horaFin"
                                            type="time"
                                            value={horaFin}
                                            onChange={(event) => {
                                                setHoraFin(event.target.value);
                                                limpiarMensajes();
                                            }}
                                            required
                                        />
                                    </div>

                                    <div className="reservation-field">
                                        <label>Modalidad</label>

                                        <div className="modality-options">

                                            <button
                                                type="button"
                                                className={
                                                    modalidad === 'HORA'
                                                        ? 'modality-option active'
                                                        : 'modality-option'
                                                }
                                                onClick={() => cambiarModalidad('HORA')}
                                            >
                                                <strong>Por hora</strong>
                                                <span>
                                                    Q{espacio.precio_por_hora}/hora
                                                </span>
                                            </button>

                                            <button
                                                type="button"
                                                className={
                                                    modalidad === 'DIA'
                                                        ? 'modality-option active'
                                                        : 'modality-option'
                                                }
                                                onClick={() => cambiarModalidad('DIA')}
                                            >
                                                <strong>Por día</strong>
                                                <span>
                                                    Q{espacio.precio_por_dia}/día
                                                </span>
                                            </button>

                                        </div>
                                    </div>

                                    <div className="reservation-summary">

                                        <div>
                                            <span>Duración</span>

                                            <strong>
                                                {horas > 0
                                                    ? modalidad === 'DIA'
                                                        ? `${dias.toFixed(2)} días`
                                                        : `${horas.toFixed(2)} horas`
                                                    : '--'}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>Total estimado</span>

                                            <strong className="reservation-price">
                                                Q{precio.toFixed(2)}
                                            </strong>
                                        </div>

                                    </div>

                                    {errorReserva && (
                                        <div className="reservation-error">
                                            {errorReserva}
                                        </div>
                                    )}

                                    {mensaje && (
                                        <div className="reservation-success">
                                            {mensaje}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="reservation-submit"
                                        disabled={reservando}
                                    >
                                        {reservando
                                            ? 'Creando reserva...'
                                            : 'Confirmar reserva →'}
                                    </button>

                                </form>
                            )}

                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
