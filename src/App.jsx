import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './componentes/Login';
import Registro from './componentes/Registro';
import Inicio from './componentes/Inicio';
import RealizarApuesta from './componentes/RealizarApuesta';
import GestionUsuario from './componentes/GestionUsuario';
import Historial from './componentes/Historial';





export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/gestionUsuario/:id" element={<GestionUsuario />} />
        <Route path="/RealizarApuesta/:id" element={<RealizarApuesta />} />
        <Route path="/historial" element={<Historial />} />
      </Routes>
    </BrowserRouter>
  );
}