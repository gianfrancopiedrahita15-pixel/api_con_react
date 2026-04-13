import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import './styles.css';

// Registra el service worker para habilitar la PWA cuando el navegador lo permita.
registerSW({ immediate: true });

// Monta React en el DOM y envuelve toda la app con el contexto global de autenticacion.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
