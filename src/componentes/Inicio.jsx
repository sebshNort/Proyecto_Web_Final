import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ObtenerApuestas_por_Nombre } from '../services/api_Apuestas';
import CategoriaSeccion from './CategoriaSeccion';
import ApuestaCard from './ApuestaCard';
import './Inicio.css';


// "valor" debe coincidir con lo que guardas en Categoria_apuesta en la BD
const CATEGORIAS = [
  { etiqueta: 'Fútbol', valor: 'Futbol' },
  { etiqueta: 'F1', valor: 'F1' },
  { etiqueta: 'Baseball', valor: 'Baseball' },
  { etiqueta: 'Tennis', valor: 'Tennis' },
];

const leerUsuario = () => {
  try {
    return JSON.parse(sessionStorage.getItem('usuario'));
  } catch {
    return null;
  }
};

export default function Inicio() {
   const navigate = useNavigate();          // ← aquí se llama el hook
  const [usuario] = useState(leerUsuario);
  const [busqueda, setBusqueda] = useState('');
  const [terminoActivo, setTerminoActivo] = useState('');
  const [resultados, setResultados] = useState(null); // null = no hay búsqueda activa
  const [buscando, setBuscando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState(null);

  // Si no hay sesión, de vuelta al login
  if (!usuario) return <Navigate to="/" replace />;

  const nombreUsuario = usuario.Nombre_usuario ?? usuario.nombre_usuario ?? 'Usuario';
  const idUsuario = usuario.id_usuario ?? usuario.id_Usuario ?? usuario.id_nusuario;  


  const handleBuscar = async (e) => {
    e.preventDefault();
    const termino = busqueda.trim();

    if (!termino) {
      limpiarBusqueda();
      return;
    }

    setBuscando(true);
    setErrorBusqueda(null);
    try {
      setResultados(await ObtenerApuestas_por_Nombre(termino));
      setTerminoActivo(termino);
    } catch {
      setErrorBusqueda('No se pudo realizar la búsqueda');
    } finally {
      setBuscando(false);
    }
  };

  const limpiarBusqueda = () => {
    setBusqueda('');
    setTerminoActivo('');
    setResultados(null);
    setErrorBusqueda(null);
  };

  const handleApostar = (apuesta, categoria) => {
   
    navigate(`/RealizarApuesta/${apuesta.id_apuesta}`, { state: { categoria }});
  
  };

  return (
    <div className="inicio">
      <header className="inicio-header">
        <h1 className="inicio-logo">
          Welcome
          <br />
          to RD-BET
        </h1>

        <form className="inicio-buscador" onSubmit={handleBuscar}>
          <input
            type="search"
            placeholder="Busco apuesta"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar apuesta por nombre"
          />
        </form>

        <Link to={`/gestionUsuario/${idUsuario}`} className="inicio-usuario">
          {nombreUsuario}
        </Link>
      </header>

      <main>
        {buscando && <p>Buscando...</p>}
        {errorBusqueda && <p className="auth-error">{errorBusqueda}</p>}

        {resultados !== null && !buscando && (
          <section className="resultados">
            <div className="resultados-titulo">
              <h2>Resultados para "{terminoActivo}"</h2>
              <button type="button" onClick={limpiarBusqueda}>Limpiar</button>
            </div>
            {resultados.length === 0 ? (
              <p>No se encontraron apuestas con ese nombre.</p>
            ) : (
              resultados.map((a) => (
                <ApuestaCard key={a.id_apuesta} apuesta={a} onApostar={handleApostar} />
              ))
            )}
          </section>
        )}

        <h2 className="inicio-subtitulo">Apuestas de todo tipo</h2>

        {CATEGORIAS.map((c) => (
          <CategoriaSeccion
            key={c.valor}
            etiqueta={c.etiqueta}
            valor={c.valor}
            onApostar={handleApostar}
          />
        ))}
      </main>
    </div>
  );
}