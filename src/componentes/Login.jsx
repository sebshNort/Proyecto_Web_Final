import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { obtenerUsuario_por_nombre } from '../services/api_Usuario';
import './Auth.css';

export default function Login() {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim()) {
      setError('Ingresa tu nombre de usuario');
      return;
    }

    setCargando(true);
    try {
      const usuarios = await obtenerUsuario_por_nombre(nombre.trim());

      if (!usuarios || usuarios.length === 0) {
        setError('Usuario no registrado. Usa "¿Nuevo ingreso?"');
        return;
      }

      // Guardamos el usuario para usarlo en el resto de la app
      sessionStorage.setItem('usuario', JSON.stringify(usuarios[0]));
      navigate('/inicio');
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Usuario no registrado ingrese uno ya registrado');
      } else {
        setError('No se pudo conectar con el servidor');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-page">
      <h1 className="auth-title">
        Welcome to
        <br />
        <br />
        RD-BET
      </h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre de usuario</label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          autoComplete="username"
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? 'Buscando...' : 'Ingresar'}
        </button>

        <Link to="/registro" className="auth-link">
          ¿Nuevo ingreso?
        </Link>
      </form>
    </div>
  );
}