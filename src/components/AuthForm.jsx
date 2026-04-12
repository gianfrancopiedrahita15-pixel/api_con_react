import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL, authApi } from '../services/http';

const initialState = { name: '', email: '', password: '' };

export const AuthForm = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const { saveAuth } = useAuth();

  // Cambia el texto del boton segun el modo actual y el estado del envio.
  const submitLabel = useMemo(() => {
    if (sending) {
      return 'Procesando...';
    }

    return mode === 'login' ? 'Entrar al panel' : 'Crear cuenta';
  }, [mode, sending]);

  // Actualiza el formulario controlado mientras el usuario escribe.
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  // Centraliza el manejo de errores para mostrar mensaje en pantalla y en alerta.
  const showAlertError = (message) => {
    setError(message);
    window.alert(message);
  };

  // Valida el formulario y envia la peticion al endpoint correcto: login o register.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSending(true);
    setError('');
    setSuccess('');

    if (mode === 'register' && form.name.trim().length < 3) {
      showAlertError('Escribe un nombre de al menos 3 caracteres.');
      setSending(false);
      return;
    }

    if (form.password.length < 6) {
      showAlertError('La contrasena debe tener minimo 6 caracteres.');
      setSending(false);
      return;
    }

    try {
      const endpoint = mode === 'login' ? '/login' : '/register';
      const payload =
        mode === 'login'
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password };

      const { data } = await authApi.post(endpoint, payload);
      saveAuth(data);
      setSuccess(mode === 'login' ? 'Sesion iniciada. Redirigiendo...' : 'Cuenta creada. Redirigiendo...');
      navigate('/dashboard');
    } catch (err) {
      if (!err.response) {
        showAlertError(`No pudimos conectar con el servidor. Verifica que el backend responda en ${API_BASE_URL}.`);
      } else {
        showAlertError(err.response?.data?.message || 'Ocurrio un error al procesar la solicitud.');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    // Tarjeta principal de autenticacion con cambio entre inicio de sesion y registro.
    <section className="auth-card">
      <div className="auth-card-header">
        <div>
          <p className="eyebrow">Acceso a la cuenta</p>
          <h2>{mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</h2>
        </div>
        <span className="auth-step">{mode === 'login' ? 'Paso 1' : 'Paso 1'}</span>
      </div>

      <div className="auth-toggle">
        <button className={mode === 'login' ? 'active' : ''} type="button" onClick={() => setMode('login')}>
          Login
        </button>
        <button className={mode === 'register' ? 'active' : ''} type="button" onClick={() => setMode('register')}>
          Register
        </button>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <p className="muted auth-form-copy">
          {mode === 'login'
            ? 'Ingresa con tu cuenta para ver el dashboard, el resumen y tus gastos guardados.'
            : 'Registra tu cuenta para empezar a guardar gastos, categorias y movimientos.'}
        </p>

        {mode === 'register' ? (
          <label className="field">
            <span>Nombre completo</span>
            <input
              className="input"
              name="name"
              placeholder="Ej. Gian Franco"
              value={form.name}
              onChange={handleChange}
              minLength={3}
              required
            />
            <small className="field-help">Minimo 3 caracteres.</small>
          </label>
        ) : null}

        <label className="field">
          <span>Correo electronico</span>
          <input
            className="input"
            name="email"
            type="email"
            placeholder="tu-correo@gmail.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span>Contrasena</span>
          <input
            className="input"
            name="password"
            type="password"
            placeholder="Minimo 6 caracteres"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />
          <small className="field-help">Minimo 6 caracteres.</small>
        </label>

        {error ? <p className="error-text">{error}</p> : null}
        {success ? <p className="success-text">{success}</p> : null}

        <div className="auth-meta">
          <span>{mode === 'login' ? 'Acceso seguro con JWT' : 'Tu cuenta se guarda en MongoDB Atlas'}</span>
          <span>{mode === 'login' ? 'Panel y CRUD protegidos' : 'Listo para iniciar sesion al instante'}</span>
        </div>

        <button className="button primary auth-submit" type="submit" disabled={sending}>
          {submitLabel}
        </button>
      </form>
    </section>
  );
};
