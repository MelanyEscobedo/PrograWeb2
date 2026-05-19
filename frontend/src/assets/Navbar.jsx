import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  return (
    <header>
      <nav className="navbar fixed-top">
        <div className="container">
          <Link to="/" className="logo">
            <img src="../public/icono.png" alt="Logo" className="logo-icon" />
          </Link>

          <div className="search-box">
            <form>
              <input type="text" placeholder="Buscar..." />
              <button type="submit">Buscar</button>
            </form>
          </div>

          <ul className="nav-links">
            <li><Link to="/busqueda">Búsqueda Avanzada</Link></li>
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