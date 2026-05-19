import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import BusquedaAvanzada from "./pages/BusquedaAvanzada";
import CrearPublicacion from "./pages/CrearPublicacion";
import EditarPerfil from "./pages/EditarPerfil";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import Registro from "./pages/Registro";
import DetallePublicacion from "./pages/DetallePublicacion";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/busqueda" element={<BusquedaAvanzada />} />
        <Route path="/crear" element={<CrearPublicacion />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/publicacion/:id" element={<DetallePublicacion />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;