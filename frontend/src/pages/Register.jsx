import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../services/auth.service';

export default function Register() {
    const navigate = useNavigate();

    const [formulario, setFormulario] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);
    const [mostrarPassword, setMostrarPassword] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setError('');
        setMensaje('');

        if (
            !formulario.nombre.trim() ||
            !formulario.apellido.trim() ||
            !formulario.email.trim() ||
            !formulario.password
        ) {
            setError('Completa todos los campos obligatorios.');
            return;
        }

        try {
            setCargando(true);

            await registrarUsuario(formulario);

            setMensaje(
                '¡Tu cuenta fue creada correctamente! Ahora puedes iniciar sesión.'
            );

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }

    return (
        <main className="login-page">
            <section className="login-card register-card">

                <Link to="/" className="login-brand">
                    <span className="brand-symbol">N</span>
                    <span className="brand-name">
                        NÓRDICA
                        <small>COWORKING SPACES</small>
                    </span>
                </Link>

                <div className="login-heading">
                    <span className="login-eyebrow">
                        ÚNETE A NUESTRA COMUNIDAD
                    </span>

                    <h1>Crea tu cuenta</h1>

                    <p>
                        Comienza a descubrir espacios diseñados
                        para tus grandes ideas.
                    </p>
                </div>

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                {mensaje && (
                    <div className="register-success">
                        {mensaje}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="register-fields">

                        <div className="form-group">
                            <label htmlFor="nombre">Nombre *</label>
                            <input
                                id="nombre"
                                type="text"
                                name="nombre"
                                value={formulario.nombre}
                                onChange={handleChange}
                                placeholder="Tu nombre"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="apellido">Apellido *</label>
                            <input
                                id="apellido"
                                type="text"
                                name="apellido"
                                value={formulario.apellido}
                                onChange={handleChange}
                                placeholder="Tu apellido"
                                required
                            />
                        </div>

                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico *</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formulario.email}
                            onChange={handleChange}
                            placeholder="correo@ejemplo.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefono">
                            Teléfono (opcional)
                        </label>
                        <input
                            id="telefono"
                            type="tel"
                            name="telefono"
                            value={formulario.telefono}
                            onChange={handleChange}
                            placeholder="Tu número de teléfono"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña *</label>

                        <div className="password-wrapper">
                            <input
                                id="password"
                                type={mostrarPassword ? 'text' : 'password'}
                                name="password"
                                value={formulario.password}
                                onChange={handleChange}
                                placeholder="Crea una contraseña"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setMostrarPassword(!mostrarPassword)
                                }
                            >
                                {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="login-submit"
                        disabled={cargando}
                    >
                        {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>

                </form>

                <div className="register-footer">
                    <span>¿Ya tienes una cuenta?</span>
                    <Link to="/login">Inicia sesión</Link>
                </div>

                <Link to="/" className="back-home-button">
                    Volver al inicio
                </Link>

            </section>
        </main>
    );
}
