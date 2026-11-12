import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mostrarPassword, setMostrarPassword] = useState(false);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setCargando(true);

        try {
            await login({ email, password });
            navigate('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    }

    return (
        <main className="login-page">
            <Link to="/" className="login-brand">
                <span className="brand-symbol">N</span>
                <span className="brand-name">
                    NÓRDICA
                    <small>COWORKING</small>
                </span>
            </Link>

            <section className="login-card">
                <div className="login-heading">
                    <span className="login-eyebrow">
                        BIENVENIDO DE NUEVO
                    </span>

                    <h1>Tu espacio te espera.</h1>

                    <p>
                        Ingresa tus datos para continuar
                        con tu experiencia en NÓRDICA.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Correo electrónico</label>

                    <input
                        id="email"
                        type="email"
                        placeholder="ejemplo@correo.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <label htmlFor="password">Contraseña</label>

                    <div className="password-field">
                        <input
                            id="password"
                            type={mostrarPassword ? 'text' : 'password'}
                            placeholder="Ingresa tu contraseña"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setMostrarPassword(!mostrarPassword)}
                        >
                            {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                        </button>
                    </div>

                    {error && (
                        <p className="login-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="login-submit"
                        disabled={cargando}
                    >
                        {cargando ? 'Ingresando...' : 'Iniciar sesión'}
                    </button>
                </form>

                <p className="login-register">
                    ¿Todavía no tienes una cuenta?
                    {' '}
                    <Link to="/registro">Regístrate aquí</Link>
                </p>
            </section>

            <Link to="/" className="back-home-button">
                Volver al inicio
            </Link>
        </main>
    );
}

