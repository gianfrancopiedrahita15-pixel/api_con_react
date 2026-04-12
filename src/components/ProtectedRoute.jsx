import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mientras se valida la sesion, evita renderizar contenido privado.
  if (loading) {
    return <div className="screen-center">Verificando sesion...</div>;
  }

  // Solo permite entrar si existe sesion valida; de lo contrario redirige al login.
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};
