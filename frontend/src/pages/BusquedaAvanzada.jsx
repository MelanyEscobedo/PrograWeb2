import { useState } from "react";
import "../Dashboard.css";
import "../BusquedaAvanzada.css";
import { Link } from "react-router-dom";

function BusquedaAvanzada() {
  const idUsuarioSesion = 1; // Simulación usuario logueado

  // Simulación categorías
  const categorias = ["Anime", "Manga", "Videojuegos"];

  // Simulación usuarios
  const usuarios = [
    { ID_usuario: 1, nombre_usuario: "Melani" },
    { ID_usuario: 2, nombre_usuario: "Carlos" }
  ];

  // Estados de filtros
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [user, setUser] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Publicaciones simuladas
  const publicaciones = [
    {
      ID_publicacion: 1,
      ID_usuario: 1,
      nombre_usuario: "Melani",
      imagen_perfil: "User.jpg",
      fecha_publicacion: "2025-06-01 14:30:00",
      nombre_categoria: "Anime",
      contenido: "Me encantó esta serie."
    },
    {
      ID_publicacion: 2,
      ID_usuario: 2,
      nombre_usuario: "Carlos",
      imagen_perfil: "User.jpg",
      fecha_publicacion: "2025-06-05 18:10:00",
      nombre_categoria: "Manga",
      contenido: "El final fue inesperado."
    }
  ];

  // Filtro en frontend (temporal)
  const resultados = publicaciones.filter((pub) => {
    return (
      (search === "" ||
        pub.contenido.toLowerCase().includes(search.toLowerCase())) &&
      (category === "" || pub.nombre_categoria === category) &&
      (user === 0 || pub.ID_usuario === Number(user))
    );
  });

  return (
    <>
      <header>
        <nav className="navbar">
          <div className="container">
            <a href="#" className="logo">
              <img src="/Icono.png" alt="Logo" className="logo-icon" />
            </a>

            <div className="search-box">
              <form>
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit">Buscar</button>
              </form>
            </div>

            <ul className="nav-links">
              <li><Link to="/busqueda">Busqueda Avanzada</Link></li>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/perfil">Perfil</Link></li>
              <li><Link to="/publicar">Publicar</Link></li>
            </ul>
          </div>
        </nav>
      </header>

      <main>
        <div className="search-container">
          <div className="search-form-container">
            <h2 className="google-style">Búsqueda Avanzada</h2>

            <div className="search-form">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Texto de búsqueda"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Usuario:</label>
                <select
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                >
                  <option value="0">Todos los usuarios</option>
                  {usuarios.map((u) => (
                    <option key={u.ID_usuario} value={u.ID_usuario}>
                      {u.nombre_usuario}
                    </option>
                  ))}
                </select>
              </div>

              <div className="date-range">
                <label>Fecha inicial:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />

                <label>Fecha final:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="results-container">
            <h3>Resultados</h3>

            {resultados.length > 0 ? (
              <div className="review-box-container">
                {resultados.map((pub) => (
                  <div className="review-box" key={pub.ID_publicacion}>
                    <div className="user">
                      <div className="user-img">
                        <img src={`/${pub.imagen_perfil}`} alt="Autor" />
                      </div>

                      <div className="name-user">
                        <strong>{pub.nombre_usuario}</strong>
                        <span>
                          Fecha:{" "}
                          {new Date(pub.fecha_publicacion).toLocaleString()}
                        </span>
                        <span>Categoría: {pub.nombre_categoria}</span>
                      </div>

                      {idUsuarioSesion === pub.ID_usuario && (
                        <div className="post-actions">
                          <button className="btn-accion editar">
                            Editar
                          </button>
                          <button className="btn-accion eliminar">
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="user-review">
                      <p>{pub.contenido}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No se encontraron publicaciones con esos filtros.</p>
            )}
          </div>
        </div>
      </main>

      <footer>
        <div className="container">
          <p>© 2025 AnimaReview.</p>
          <p>Desarrollado por Felix Dauajare Ramirez</p>
        </div>
      </footer>
    </>
  );
}

export default BusquedaAvanzada;