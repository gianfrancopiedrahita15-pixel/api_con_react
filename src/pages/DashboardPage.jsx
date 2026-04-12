import { Link } from 'react-router-dom';
import { ApiExplorer } from '../components/ApiExplorer';
import { ExpensesManager } from '../components/ExpensesManager';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {
  const { auth, logout } = useAuth();

  return (
    <div className="app-shell dashboard-page">
      {/* Appbar privada con identidad del usuario, navegacion interna y cierre de sesion. */}
      <header className="dashboard-appbar">
        <div className="dashboard-appbar-brand">
          <Link className="brand" to="/">
            SIS-GASTOS
          </Link>
          <div className="dashboard-appbar-copy">
            <span>Panel privado</span>
            <strong>{auth.user?.name || 'Usuario'}</strong>
          </div>
        </div>

        <nav className="dashboard-appbar-nav">
          <a href="#resumen">Resumen</a>
          <a href="#mis-gastos">Mis gastos</a>
          <a href="#api-dashboard">API</a>
        </nav>

        <div className="dashboard-top-actions">
          <Link className="button ghost" to="/">
            Inicio
          </Link>
          <button className="button danger" type="button" onClick={logout}>
            Cerrar sesion
          </button>
        </div>
      </header>

      {/* Modulo central con resumen y CRUD de gastos del usuario autenticado. */}
      <ExpensesManager />

      {/* Seccion extra para mezclar el dashboard privado con consumo de API externa. */}
      <div className="dashboard-api-wrapper">
        <ApiExplorer />
      </div>
    </div>
  );
};
