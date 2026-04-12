import { Link } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';

export const AuthPage = () => {
  return (
    <div className="auth-page">
      <section className="auth-copy auth-showcase">
        <div className="auth-showcase-top">
          <Link className="back-link" to="/">
            Volver al inicio
          </Link>
          <span className="status-badge">Acceso seguro</span>
        </div>

        <p className="eyebrow">Autenticacion funcional</p>
        <h1>Organiza tus finanzas con una experiencia mas clara, moderna y confiable</h1>
        <p className="auth-lead">
          Entra a tu panel privado para registrar gastos, consultar movimientos y controlar tu presupuesto sin perderte entre pantallas frias o mensajes confusos.
        </p>

        <div className="auth-feature-grid">
          <article className="auth-feature-card">
            <strong>Panel privado</strong>
            <span>Login y registro conectados con tu backend y acceso directo a Mis gastos.</span>
          </article>
          <article className="auth-feature-card">
            <strong>Seguimiento simple</strong>
            <span>CRUD de gastos, resumen visual y datos listos para seguir creciendo.</span>
          </article>
          <article className="auth-feature-card">
            <strong>Estado claro</strong>
            <span>Errores mas utiles para distinguir si falla Atlas, el backend o tus credenciales.</span>
          </article>
        </div>

        <div className="auth-highlight-card">
          <div>
            <p className="eyebrow">Incluye</p>
            <h2>Todo en un solo flujo</h2>
          </div>
          <div className="auth-checklist">
            <span>Landing comercial</span>
            <span>PWA instalable</span>
            <span>API con Axios</span>
            <span>Mis gastos CRUD</span>
          </div>
        </div>
      </section>
      <AuthForm />
    </div>
  );
};
