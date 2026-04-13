import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    // Barra superior publica con enlaces a secciones clave y acceso directo segun la sesion.
    <header className="topbar">
      <div className="topbar-brand">
        <Link to="/" className="brand">
          SIS-GASTOS
        </Link>
        <span className="topbar-tag">Finanzas personales</span>
      </div>

      <nav className="topbar-links topbar-nav">
        <a href="#beneficios">Beneficios</a>
        <a href="#api">API</a>
        <a href="#pwa">PWA</a>
        <a href="#flujo">Flujo</a>
      </nav>

      <div className="topbar-links">
        {isAuthenticated ? (
          <Link className="button ghost" to="/dashboard">
            Ir a mis gastos
          </Link>
        ) : (
          <Link className="button ghost" to="/auth">
            Ingresar
          </Link>
        )}
      </div>
    </header>
  );
};
