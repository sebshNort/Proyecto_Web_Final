import { useState } from 'react';
import { ObtenerApuestas_por_categoria } from '../services/api_Apuestas';
import ApuestaCard from './ApuestaCard';

export default function CategoriaSeccion({ etiqueta, valor, onApostar }) {
  const [abierta, setAbierta] = useState(false);
  const [apuestas, setApuestas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const toggle = async () => {
    const abrir = !abierta;
    setAbierta(abrir);
    if (!abrir) return;

    // Se vuelve a pedir cada vez que se abre, para no mostrar apuestas ya cerradas
    setCargando(true);
    setError(null);
    try {
      setApuestas(await ObtenerApuestas_por_categoria(valor));
    } catch {
      setError('No se pudieron cargar las apuestas');
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="categoria">
      <button type="button" className="categoria-header" onClick={toggle} aria-expanded={abierta}>
        <span>{etiqueta}</span>
        <svg
          className={`chevron ${abierta ? 'abierto' : ''}`}
          width="20" height="20" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {abierta && (
        <div className="categoria-body">
          {cargando && <p>Cargando...</p>}
          {error && <p className="auth-error">{error}</p>}
          {!cargando && !error && apuestas.length === 0 && (
            <p>No hay apuestas disponibles en esta categoría.</p>
          )}
          {!cargando &&
            apuestas.map((a) => (
              <ApuestaCard key={a.id_apuesta} apuesta={a} onApostar={onApostar} />,
              <ApuestaCard key={a.id_apuesta} apuesta={a} onApostar={(ap) => onApostar(ap, valor)} />
            ))}

        </div>
        
      )}
    </section>
  );
}