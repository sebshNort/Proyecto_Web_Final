import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ActualizarUsuario_password, ActualizarUsuario_monto, EliminarUsuario } from '../services/api_Usuario';
import { mensajeError } from '../services/api';
import './GestionUsuario.css';

const leerUsuario = () => {
  try {
    return JSON.parse(sessionStorage.getItem('usuario'));
  } catch {
    return null;
  }
};

// Para estos endpoints tu backend manda el detalle real en "problema"
const textoError = (err) => err.response?.data?.problema ?? mensajeError(err);

export default function GestionUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sesion] = useState(leerUsuario);

  // Formulario de contraseña
  const [pw, setPw] = useState({ vieja: '', nueva: '' });
  const [pwError, setPwError] = useState(null);
  const [pwOk, setPwOk] = useState(null);
  const [pwCargando, setPwCargando] = useState(false);

  // Formulario de monto
  const [mt, setMt] = useState({ password: '', monto: '' });
  const [mtError, setMtError] = useState(null);
  const [mtOk, setMtOk] = useState(null);
  const [mtCargando, setMtCargando] = useState(false);
  
  // Formulario de eliminar
  const [delPassword, setDelPassword] = useState('');
  const [delError, setDelError] = useState(null);
  const [delCargando, setDelCargando] = useState(false);

  
  const idSesion = sesion?.id_usuario ?? sesion?.id_Usuario ?? sesion?.id_nusuario;

  // Sin sesión, o intentando entrar al id de otro usuario se mandaro a home page
  if (!sesion || String(idSesion) !== String(id)) return <Navigate to="/" replace />;

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    setPwError(null);
    setPwOk(null);

    if (!pw.vieja || !pw.nueva) {
      setPwError('Completa ambas contraseñas');
      return;
    }
    if (pw.nueva.length < 8) {
      setPwError('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (pw.vieja === pw.nueva) {
      setPwError('La nueva contraseña debe ser distinta a la anterior');
      return;
    }

    setPwCargando(true);
    try {
      await ActualizarUsuario_password(id, {
        vieja_password: pw.vieja,
        nueva_password: pw.nueva,
      });
      setPwOk('Contraseña actualizada con éxito');
      setPw({ vieja: '', nueva: '' });
    } catch (err) {
      setPwError(textoError(err));
    } finally {
      setPwCargando(false);
    }
  };

  const handleCambiarMonto = async (e) => {
    e.preventDefault();
    setMtError(null);
    setMtOk(null);

    const montoNum = Number(mt.monto);
    if (!mt.password || mt.monto === '') {
      setMtError('Completa la contraseña y el monto');
      return;
    }
    if (Number.isNaN(montoNum) || montoNum <= 0) {
      setMtError('El monto debe ser mayor que cero');
      return;
    }

    setMtCargando(true);
    try {
      await ActualizarUsuario_monto(id, {
        password: mt.password,
        monto_usuario: montoNum,
      });
      setMtOk('Monto actualizado con éxito');
      setMt({ password: '', monto: '' });
    } catch (err) {
      setMtError(textoError(err));
    } finally {
      setMtCargando(false);
    }
  };

  const handleEliminar = async (e) => {
    e.preventDefault();
    setDelError(null);

    if (!delPassword) {
      setDelError('Ingresa tu contraseña para confirmar');
      return;
    }
    if (!window.confirm('¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
     return;
    }

   setDelCargando(true);
   try {
     await EliminarUsuario(id, { password: delPassword });
     sessionStorage.removeItem('usuario'); // cierra la sesión
     navigate('/', { replace: true });
   } catch (err) {
     setDelError(textoError(err));
     setDelCargando(false);
   }
 };

  return (
    <div className="gu-page">
      <h1 className="gu-titulo">Gestión usuario</h1>
      <br>
      </br>
      <h2 className="gu-subtitulo">Centro de ayuda</h2>
      <button type="button" className="gu-historial" onClick={() => navigate('/historial')}> Ver mi historial de apuestas</button>
      <form className="gu-seccion" onSubmit={handleCambiarPassword}>
        <h3>Actualizar contraseña</h3>

        <label htmlFor="vieja">Antigua password</label>
        <input
          id="vieja"
          type="password"
          value={pw.vieja}
          onChange={(e) => setPw((p) => ({ ...p, vieja: e.target.value }))}
          autoComplete="current-password"
        />

        <label htmlFor="nueva">Nueva password</label>
        <input
          id="nueva"
          type="password"
          value={pw.nueva}
          onChange={(e) => setPw((p) => ({ ...p, nueva: e.target.value }))}
          autoComplete="new-password"
        />

        {pwError && <p className="auth-error">{pwError}</p>}
        {pwOk && <p className="auth-ok">{pwOk}</p>}

        <div className="gu-botones">
          <button type="submit" disabled={pwCargando}>
            {pwCargando ? 'Actualizando...' : 'Actualizar'}
          </button>
          <button type="button" onClick={() => navigate('/inicio')} disabled={pwCargando}>
            Cancelar
          </button>
        </div>
      </form>

      <form className="gu-seccion" onSubmit={handleCambiarMonto}>
        <h3>¿No tienes dinero? ¡Añadamos más!</h3>

        <label htmlFor="pw-monto">Password</label>
        <input
          id="pw-monto"
          type="password"
          value={mt.password}
          onChange={(e) => setMt((m) => ({ ...m, password: e.target.value }))}
          autoComplete="current-password"
        />

        <label htmlFor="monto">Monto</label>
        <input
          id="monto"
          type="number"
          min="0"
          step="0.01"
          value={mt.monto}
          onChange={(e) => setMt((m) => ({ ...m, monto: e.target.value }))}
        />

        {mtError && <p className="auth-error">{mtError}</p>}
        {mtOk && <p className="auth-ok">{mtOk}</p>}

        <div className="gu-botones">
          <button type="submit" disabled={mtCargando}>
            {mtCargando ? 'Actualizando...' : 'Actualizar'}
          </button>
          <button type="button" onClick={() => navigate('/inicio')} disabled={mtCargando}>
            Cancelar
          </button>
        </div>
      </form>

    <form className="gu-seccion gu-peligro" onSubmit={handleEliminar}>
  <h3>¿Quieres irte? Agradecemos tu estancia</h3>

  <label htmlFor="pw-eliminar">Password</label>
  <input
    id="pw-eliminar"
    type="password"
    value={delPassword}
    onChange={(e) => setDelPassword(e.target.value)}
    autoComplete="current-password"
  />

  {delError && <p className="auth-error">{delError}</p>}

  <div className="gu-botones">
    <button type="submit" className="gu-eliminar" disabled={delCargando}>
      {delCargando ? 'Eliminando...' : 'Eliminar cuenta'}
    </button>
    <button type="button" onClick={() => navigate('/inicio')} disabled={delCargando}>
      Cancelar
    </button>
  </div>
</form>
    </div>
  );
}