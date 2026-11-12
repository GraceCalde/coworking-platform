
import coworkingHero from '../assets/coworking-hero.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SpaceCatalog from '../components/SpaceCatalog';

export default function Home() {
    const { usuario, autenticado, logout } = useAuth();
    const navigate = useNavigate();

    const esAdmin = usuario?.role === 2;

    function handleLogout() {
        logout();
        navigate('/');
    }

    return (
        <div className="home-page">

            <header className="navbar">
                <Link to="/" className="brand">
                    <span className="brand-symbol">N</span>
                    <span className="brand-name">
                        NÓRDICA
                        <small>COWORKING SPACES</small>
                    </span>
                </Link>

                <nav className="nav-links">
                    <a href="#inicio">Inicio</a>
                    <a href="#beneficios">Nosotros</a>
                    <a href="#como-funciona">Cómo funciona</a>
                </nav>

                {autenticado && usuario ? (
                    <div className="nav-user">
                        <div className="user-information">
                            <span className="user-greeting">
                                Bienvenido, {usuario.nombre}
                            </span>
                            <span className="user-role">
                                {esAdmin ? 'Administrador' : 'Cliente'}
                            </span>
                        </div>

                        {esAdmin && (
                            <span className="admin-badge">ADMIN</span>
                        )}

                        <button
                            className="nav-logout"
                            onClick={handleLogout}
                        >
                            Cerrar sesión
                        </button>
                    </div>
                ) : (
                    <Link to="/login" className="nav-login">
                        <svg
                            className="profile-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            width="19"
                            height="19"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <circle cx="12" cy="8" r="4" />
                            <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                        </svg>
                        <span>Iniciar sesión</span>
                        <span className="login-arrow">↗</span>
                    </Link>
                )}
            </header>

            <main>
                <section className="hero-section" id="inicio">
                    <div className="hero-content">
                        <span className="eyebrow">
                            <span className="eyebrow-line"></span>
                            ESPACIOS QUE INSPIRAN
                        </span>

                        <h1>
                            Tu próximo lugar
                            <br />
                            para <em>crear</em> grandes
                            <br />
                            ideas.
                        </h1>

                        <p className="hero-description">
                            Encuentra espacios de coworking diseñados
                            para trabajar, conectar y llevar tus proyectos
                            al siguiente nivel.
                        </p>

                        <div className="hero-actions">
                            <a href="#beneficios" className="btn-primary">
                                Descubre Nórdica <span>→</span>
                            </a>
                            <a href="#como-funciona" className="btn-secondary">
                                Conoce cómo funciona
                            </a>
                        </div>

                        <div className="hero-note">
                            <span className="note-icon">✦</span>
                            <span>Un espacio para cada forma de trabajar.</span>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <img
                            src={coworkingHero}
                            alt="Espacio de coworking moderno y luminoso"
                            className="hero-image"
                        />

                        <div className="image-label">
                            <span className="label-dot"></span>
                            <div>
                                <strong>Tu espacio, tu ritmo.</strong>
                                <small>Trabaja con comodidad e inspiración.</small>
                            </div>
                        </div>

                        <div className="image-decoration">N.</div>
                    </div>
                </section>

                <section className="intro-section" id="beneficios">
                    <div className="intro-heading">
                        <span className="eyebrow">MÁS QUE UN ESCRITORIO</span>
                        <h2>
                            El ambiente adecuado
                            <br />
                            <em>hace la diferencia.</em>
                        </h2>
                    </div>

                    <p className="intro-text">
                        Cada proyecto necesita su propio espacio.
                        En Nórdica queremos ayudarte a encontrar
                        el entorno ideal para concentrarte,
                        colaborar y crecer.
                    </p>
                </section>

                <SpaceCatalog />

                <section className="features-section" id="como-funciona">
                    <article className="feature-card">
                        <span className="feature-number">01</span>
                        <div className="feature-icon">⌂</div>
                        <h3>Espacios para ti</h3>
                        <p>
                            Encuentra ambientes pensados para tus
                            necesidades de trabajo.
                        </p>
                    </article>

                    <article className="feature-card feature-highlight">
                        <span className="feature-number">02</span>
                        <div className="feature-icon">✧</div>
                        <h3>Trabaja a tu manera</h3>
                        <p>
                            Elige el espacio que mejor acompañe
                            tu ritmo y tus proyectos.
                        </p>
                    </article>

                    <article className="feature-card">
                        <span className="feature-number">03</span>
                        <div className="feature-icon">◷</div>
                        <h3>Reserva con facilidad</h3>
                        <p>
                            Una experiencia sencilla para organizar
                            tu próximo día de trabajo.
                        </p>
                    </article>
                </section>

                <section className="closing-section">
                    <div>
                        <span className="eyebrow">
                            TU PRÓXIMO CAPÍTULO COMIENZA AQUÍ
                        </span>
                        <h2>Encuentra tu lugar.</h2>
                        <p>Las buenas ideas merecen un buen espacio.</p>
                    </div>
                    <a href="#inicio" className="closing-link">
                        Volver al inicio ↑
                    </a>
                </section>
            </main>

            <footer className="footer">
                <Link to="/" className="footer-brand">NÓRDICA.</Link>
                <span>Espacios para trabajar, conectar y crecer.</span>
                <span>© 2026 Nórdica Coworking</span>
            </footer>
        </div>
    );
}
