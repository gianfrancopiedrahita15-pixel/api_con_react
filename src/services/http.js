import axios from 'axios';

// Base URL centralizada para no repetir la ruta de la API en cada componente.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Cliente dedicado a autenticacion: login, register y perfil.
export const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
});

// Cliente dedicado al CRUD privado de gastos del usuario autenticado.
export const expenseApi = axios.create({
  baseURL: `${API_BASE_URL}/expenses`,
});

// Cliente para consumir la API publica del demo con busqueda y paginacion.
export const publicApi = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
});
