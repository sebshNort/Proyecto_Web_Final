import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CrearUsuario } from '../services/api_Usuario';
import { mensajeError } from '../services/api';
import './Auth.css';

export default function Registro() {
  const [form, setForm] = useState({
    Nombre_usuario: '',
    password: '',
    Correo_usuario: '',
    Monto_usuario: '',
  });
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
  setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { Nombre_usuario, password,Correo_usuario,Monto_usuario } = form;

    if (!Nombre_usuario.trim() || !password || !Correo_usuario.trim() || Monto_usuario === '') {
      setError('Completa todos los campos');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(Correo_usuario)) {
      setError('El correo no es válido');
      return;
    }
    if (Number.isNaN(Number(Monto_usuario)) || Number(Monto_usuario) < 0) {
      setError('El monto debe ser un número positivo');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    console.log(password);

    setCargando(true);
    try {
      await CrearUsuario({
        Nombre_usuario: Nombre_usuario.trim(),
        password : password,
        Correo_usuario: Correo_usuario.trim(),
        Monto_usuario: Number(Monto_usuario),
      });

      setExito('Usuario creado con éxito. Redirigiendo...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(mensajeError(err));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-page">
      <h1 className="auth-title">Nuevo ingreso</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="Nombre_usuario">Nombre de usuario</label>
        <input id="Nombre_usuario" name="Nombre_usuario" value={form.Nombre_usuario} onChange={handleChange} />

        <label htmlFor="password">Contraseña</label>
        <input id="password" name="password" type="password" value={form.password} onChange={handleChange} autoComplete="new-password" />

        <label htmlFor="Monto_usuario">Cantidad de dinero</label>
        <input id="Monto_usuario" name="Monto_usuario" type="number" min="0" step="0.01" value={form.Monto_usuario} onChange={handleChange} />

        <label htmlFor="Correo_usuario">Correo</label>
        <input id="Correo_usuario" name="Correo_usuario" type="email" value={form.Correo_usuario} onChange={handleChange} />

        {error && <p className="auth-error">{error}</p>}
        {exito && <p className="auth-ok">{exito}</p>}

        <button type="submit" disabled={cargando}>
          {cargando ? 'Registrando...' : 'Registrarme'}
        </button>

        <Link to="/" className="auth-link">Volver a ingresar</Link>
      </form>
    </div>
  );
}