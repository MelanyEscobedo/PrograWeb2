import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const buscar = (e) => {
    e.preventDefault();

    if (!busqueda.trim()) {
      navigate("/busqueda");
      return;
    }

    navigate(`/busqueda?query=${encodeURIComponent(busqueda)}`);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <header>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo">
            <img src="../public/icono.png" alt="Logo" className="logo-icon" />
          </Link>

          <div className="search-box">
            <form onSubmit={buscar}>
              <input
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              <button type="submit">Buscar</button>
            </form>
          </div>

          <ul className="nav-links">
            <li><Link to="/">Inicio</Link></li>

            {!usuario ? (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/registro">Registro</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/perfil">Perfil</Link></li>
                <li><Link to="/crear">Publicar</Link></li>
                <li>
                  <button className="btn-logout" onClick={cerrarSesion}>
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;