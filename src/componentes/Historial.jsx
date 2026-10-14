import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ObtenerHistorial_por_nombre } from '../services/api_Historial';
import { formatearFecha } from '../utils/fecha';
import './Historial.css';

const leerUsuario = () => {
  try {
    return JSON.parse(sessionStorage.getItem('usuario'));
  } catch {
    return null;
  }
};

const dinero = (n) => `$${Number(n ?? 0).toFixed(2)}`;
const fecha =formatearFecha;

// mssql devuelve los BIT como true/false (o null si está pendiente)
function estadoDe(resultado) {
  if (resultado > 0 ) return { texto: 'Victoria', clase: 'victoria' };
  else{return  { texto: 'Derrota', clase: 'derrota' }};

}

export default function Historial() {
  const navigate = useNavigate();
  const [sesion] = useState(leerUsuario);
  const nombre = sesion?.Nombre_usuario;

  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!nombre) return;
    let activo = true;

    ObtenerHistorial_por_nombre(nombre)
      .then((data) => activo && setRegistros(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (!activo) return;
      
        if (err.response?.status === 404) setRegistros([]);
        else setError('No se pudo cargar el historial');
      })
      .finally(() => activo && setCargando(false));

    return () => {
      activo = false;
    };
  }, [nombre]);

  if (!nombre) return <Navigate to="/" replace />;

  return (
    <div className="hi-page">
      <header className="hi-header">
        <h1>Historial usuario</h1>
        <button type="button" onClick={() => navigate(-1)}>Volver</button>
      </header>

      <p className="hi-usuario">Usuario: <b>{nombre}</b></p>

      {cargando && <p>Cargando historial...</p>}
      {error && <p className="auth-error">{error}</p>}
      {!cargando && !error && registros.length === 0 && (
        <p>Aún no has realizado apuestas.</p>
      )}

      {registros.length > 0 && (
        <div className="hi-tabla-wrap">
          <table className="hi-tabla">
            <thead>
              <tr>
                <th>Apuesta</th>
                <th>Fecha apuesta</th>
                <th>Fecha cierre</th>
                <th>Monto apostado</th>
                <th>Resultado</th>
                <th>Ganancias</th>
                <th>Monto actual</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r, i) => {
                const estado = estadoDe(r.Ganancias);
                return (
                  <tr key={`${r.id_apuesta}-${i}`}>
                    <td>{r.Nombre_apuesta ?? r.Descripcion_apuesta}</td>
                    <td>{fecha(r.Fecha_apuesta)}</td>
                    <td>{fecha(r.Fecha_cierre)}</td>
                    <td>{dinero(r.Monto_inicial)}</td>
                    <td className={`hi-${estado.clase}`}>{estado.texto}</td>
                    <td className={Number(r.Ganancias) < 0 ? 'hi-derrota' : ''}>
                      {dinero(r.Ganancias)}
                    </td>
                    <td>{dinero(r.Monto_actual)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}