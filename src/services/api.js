import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
});

// Extrae el mensaje de error que manda el backend (mssg / message / problema)
export function mensajeError(error) {
  const data = error.response?.data;
  return data?.mssg || data?.message || data?.problema || error.message;
}

export default api;