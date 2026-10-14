import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ObtenerApuestas } from '../services/api_Apuestas';
import { obtenerUsuario_por_nombre } from '../services/api_Usuario';
import { InsertarHistorial } from '../services/api_Historial';
import { mensajeError } from '../services/api';
import { formatearFecha } from '../utils/fecha';
import './RealizarApuesta.css';


// Toma todas las imágenes de src/assets y las elige por nombre de archivo
// (futbol.jpg, f1.png, baseball.webp, tenis.jpg...)
const imagenes = import.meta.glob('../assets/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

const normalizar = (s) =>
  String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

function imagenDeCategoria(categoria) {
  const key = normalizar(categoria);
  if (!key) return null;
  const ruta = Object.keys(imagenes).find((r) =>
    normalizar(r.split('/').pop()).startsWith(key)
  );
  return ruta ? imagenes[ruta] : null;
}

const leerUsuario = () => {
  try {
    return JSON.parse(sessionStorage.getItem('usuario'));
  } catch {
    return null;
  }
};

export default function RealizarApuesta() {
  const { id } = useParams();
  const { state } = useLocation(); // viene { categoria } desde Inicio
  const navigate = useNavigate();

  const [sesion] = useState(leerUsuario);
  const nombreSesion = sesion?.Nombre_usuario;

  const [apuesta, setApuesta] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const [monto, setMonto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(null);
  const [exito, setExito] = useState(null);

  useEffect(() => {
    if (!nombreSesion) return;
    let activo = true;

    (async () => {
      try {
        const [apuestas, usuarios] = await Promise.all([
          ObtenerApuestas(),
          obtenerUsuario_por_nombre(nombreSesion),
        ]);
        if (!activo) return;
        setApuesta(apuestas.find((a) => String(a.id_apuesta) === String(id)) ?? null);
        setUsuario(Array.isArray(usuarios) ? usuarios[0] ?? null : usuarios);
      } catch {
        if (activo) setErrorCarga('No se pudo cargar la información');
      } finally {
        if (activo) setCargando(false);
      }
    })();

    return () => {
      activo = false;
    };
  }, [id, nombreSesion]);

  if (!nombreSesion) return <Navigate to="/" replace />;
  if (cargando) return <p className="ra-msg">Cargando...</p>;
  if (errorCarga) return <p className="ra-msg auth-error">{errorCarga}</p>;
  if (!apuesta || !usuario) {
    return (
      <div className="ra-msg">
        <p>Esta apuesta ya no está disponible.</p>
        <button type="button" onClick={() => navigate('/inicio')}>Volver</button>
      </div>
    );
  }

  const categoria = apuesta.Categoria_apuesta ?? state?.categoria;
  const imagen = imagenDeCategoria(categoria);
  const descripcion = apuesta.Descripcion_apuesta ?? apuesta.descripcion_apuesta;
  const fechaCierre = apuesta.Fecha_cierre ? new Date(apuesta.Fecha_cierre) : null;
  const cerrada = fechaCierre ? fechaCierre <= new Date() : false;

  const saldo = Number(usuario.Monto_usuario ?? 0);
  const montoNum = Number(monto);
  const idUsuario = usuario.id_usuario ?? usuario.id_Usuario ?? usuario.id_nusuario;

  let aviso = null;
  if (saldo <= 0) {
    aviso = 'No está permitido apostar por falta de dinero.';
  } else if (monto !== '' && montoNum > saldo) {
    aviso = `No está permitido: la cantidad supera tu dinero disponible ($${saldo.toFixed(2)}).`;
  }

  const puedeApostar =
    !aviso && !cerrada && !enviando && monto !== '' && montoNum > 0 && !exito;

  const handleApostar = async () => {
    setErrorEnvio(null);
    setEnviando(true);
    try {
      await InsertarHistorial({
        Id_usuario: idUsuario,
        Id_apuesta: apuesta.id_apuesta,
        Monto: montoNum,
      });
      setExito('Apuesta realizada con éxito. Redirigiendo...');
      setTimeout(() => navigate('/inicio'), 1500);
    } catch (err) {
      setErrorEnvio(mensajeError(err));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="ra-page">
      <div className="ra-imagen">
        {imagen ? (
          <img src={imagen} alt={`Categoría ${categoria}`} />
        ) : (
          <span>{categoria ?? 'Sin imagen'}</span>
        )}
      </div>

      <h2 className="ra-nombre">{apuesta.Nombre_apuesta}</h2>
      <p className="ra-descripcion">{descripcion}</p>
     <p className="ra-fecha">
      Fecha cierre: {formatearFecha(apuesta.Fecha_cierre)}
      </p>
      {cerrada && <p className="auth-error">Esta apuesta ya cerró.</p>}

      <label htmlFor="monto" className="ra-label">Cantidad a apostar</label>
      <input
        id="monto"
        type="number"
        min="0"
        step="0.01"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        disabled={saldo <= 0}
      />
      <small className="ra-saldo">Dinero disponible: ${saldo.toFixed(2)}</small>

      {aviso && <p className="auth-error">{aviso}</p>}
      {errorEnvio && <p className="auth-error">{errorEnvio}</p>}
      {exito && <p className="auth-ok">{exito}</p>}

      <div className="ra-botones">
        <button type="button" onClick={handleApostar} disabled={!puedeApostar}>
          {enviando ? 'Apostando...' : 'Apostar'}
        </button>
        <button type="button" onClick={() => navigate('/inicio')} disabled={enviando}>
          Cancelar
        </button>
      </div>
    </div>
  );
}