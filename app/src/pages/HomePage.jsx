import { Link } from 'react-router-dom';
import { ApiExplorer } from '../components/ApiExplorer';
import { Navbar } from '../components/Navbar';

export const HomePage = () => {
  return (
    <div className="app-shell">
      <Navbar />

      <main>
        {/* Hero principal para explicar rapidamente el producto y llevar al registro. */}
        <section className="hero">
          <div className="hero-copy">
            <span className="hero-badge">Landing + PWA + API + Auth</span>
            <h1>Controla tus gastos con una experiencia mas ligera, clara y visual</h1>
            <p className="hero-text">
              Una app pensada para registrar, revisar y entender tus finanzas sin pantallas saturadas. Todo se siente mas limpio, mas rapido y mucho mas facil de usar.
            </p>
            <div className="hero-actions">
              <Link className="button primary" to="/auth">
                Crear cuenta
              </Link>
              <a className="button ghost" href="#api">
                Ver API
              </a>
            </div>
            <div className="hero-proof">
              <span>Registro y login</span>
              <span>PWA instalable</span>
              <span>CRUD de gastos</span>
              <span>Dashboard privado</span>
            </div>
          </div>

          <div className="hero-stage">
            <div className="hero-stage-panel">
              <div className="hero-stage-header">
                <span>Resumen del mes</span>
                <small>Actualizado al instante</small>
              </div>
              <strong>$1.280.000</strong>
              <p>Visualiza presupuesto, control de categorias y movimientos recientes en una sola vista.</p>
            </div>

            <div className="hero-stage-grid">
              <div className="stage-mini-card coral">
                <span>12</span>
                <small>Gastos del mes</small>
              </div>
              <div className="stage-mini-card ocean">
                <span>4</span>
                <small>Categorias activas</small>
              </div>
              <div className="stage-mini-card mint">
                <span>PWA</span>
                <small>Lista para instalar</small>
              </div>
              <div className="stage-mini-card slate">
                <span>API</span>
                <small>Busqueda con Axios</small>
              </div>
            </div>
          </div>
        </section>

        {/* Flujo resumido que explica el recorrido del usuario dentro de la app. */}
        <section className="home-flow" id="flujo">
          <article className="flow-card">
            <span className="flow-index">01</span>
            <h3>Registra</h3>
            <p>Crea tu cuenta y empieza a guardar movimientos con campos claros y validaciones simples.</p>
          </article>
          <article className="flow-card">
            <span className="flow-index">02</span>
            <h3>Organiza</h3>
            <p>Consulta el tablero, revisa totales y manten ordenadas tus categorias y montos.</p>
          </article>
          <article className="flow-card">
            <span className="flow-index">03</span>
            <h3>Explora</h3>
            <p>Prueba el apartado de API y combina tu CRUD privado con datos externos y paginacion.</p>
          </article>
        </section>

        {/* Bloque de beneficios para reforzar valor visual, tecnico y de experiencia. */}
        <section className="feature-grid" id="beneficios">
          <article className="panel">
            <p className="eyebrow">Minimalista</p>
            <h2>Menos ruido, mas foco</h2>
            <p>La interfaz prioriza lectura, espacios limpios y acciones visibles para que la experiencia sea mas comoda.</p>
          </article>
          <article className="panel" id="pwa">
            <p className="eyebrow">Movil</p>
            <h2>Rapida e instalable</h2>
            <p>La PWA queda lista para sentirse como app nativa en escritorio o celular.</p>
          </article>
          <article className="panel">
            <p className="eyebrow">Privada</p>
            <h2>Tus datos en un panel claro</h2>
            <p>Registro, login y CRUD protegidos para que toda la experiencia se sienta consistente de punta a punta.</p>
          </article>
        </section>

        {/* Explorador de API publica para demostrar consumo externo con Axios. */}
        <ApiExplorer />
      </main>
    </div>
  );
};
