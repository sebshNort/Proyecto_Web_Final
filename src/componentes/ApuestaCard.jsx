import { formatearFecha } from '../utils/fecha';

export default function ApuestaCard({ apuesta, onApostar }) {
  const descripcion = apuesta.Descripcion_apuesta ?? apuesta.descripcion_apuesta;
  const cierre = apuesta.Fecha_cierre ? formatearFecha(apuesta.Fecha_cierre) : 'Sin fecha';

  return (
    <div className="apuesta-card">
      <div className="apuesta-info">
        <h3>{apuesta.Nombre_apuesta}</h3>
        <p>{descripcion}</p>
      </div>
      <button type="button" onClick={() => onApostar(apuesta)}>
        Apostar
      </button>
    </div>
  );
}