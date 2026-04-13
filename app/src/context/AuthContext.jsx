/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useEffectEvent, useState } from 'react';
import { authApi } from '../services/http';

const AuthContext = createContext(null);
const STORAGE_KEY = 'gastos-auth';

export const AuthProvider = ({ children }) => {
  // Carga la sesion guardada para mantener al usuario autenticado entre recargas.
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { token: '', user: null };
  });
  const [loading, setLoading] = useState(Boolean(auth.token));

  // Sincroniza el estado actual con localStorage cada vez que cambia la sesion.
  useEffect(() => {
    if (auth.token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  // Consulta el perfil actual para validar que el token almacenado siga siendo valido.
  const syncProfile = useEffectEvent(async () => {
    if (!auth.token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await authApi.get('/me', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setAuth((current) => ({ ...current, user: data.user }));
    } catch {
      setAuth({ token: '', user: null });
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    syncProfile();
  }, [auth.token]);

  // Guarda en memoria el token y los datos basicos del usuario autenticado.
  const saveAuth = (payload) => {
    setAuth({ token: payload.token, user: payload.user });
  };

  // Limpia toda la sesion local para cerrar acceso al panel privado.
  const logout = () => {
    setAuth({ token: '', user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, loading, saveAuth, logout, isAuthenticated: Boolean(auth.token) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
