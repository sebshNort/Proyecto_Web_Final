import { useEffect, useState } from 'react';
import { obtenerUsuarios, obtenerUsuario_por_nombre,
    CrearUsuario,
    ActualizarUsuario_password,
    ActualizarUsuario_monto,
    EliminarUsuario} from './services/api_Usuario.js';
import { mensajeError } from './services/api.js';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    //const controller = new AbortController();

    obtenerUsuario_por_nombre('NOVA').then(setUsuarios).catch((err) => {
        if (err.name !== 'CanceledError') setError(mensajeError(err));
      }).finally(() => setCargando(false));  }, []);

  if (cargando) return <p>Cargando usuarios...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (usuarios.length === 0) return <p>No hay usuarios registrados.</p>;

  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Fecha</th>
          <th>Monto</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((u) => (
          <tr key={u.Nombre_usuario}>
            <td>{u.Nombre_usuario}</td>
            <td>{u.Fecha_ingreso}</td>
            <td>${Number(u.Monto_usuario).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}