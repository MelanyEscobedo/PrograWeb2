import { useState } from "react";
import "../Dashboard.css";

function Dashboard() {
  // Simulación de usuario logueado
  const idUsuarioSesion = 1;

  // Simulación de publicaciones (luego vendrán del backend)
  const [publicaciones] = useState([
    {
      ID_publicacion: 1,
      ID_usuario: 1,
      nombre_usuario: "Melani",
      imagen_perfil: "User.jpg",
      fecha_publicacion: "2025-06-01 14:30:00",
      nombre_categoria: "Anime",
      contenido: "Me encantó esta serie, totalmente recomendada."
    },
    {
      ID_publicacion: 2,
      ID_usuario: 2,
      nombre_usuario: "Carlos",
      imagen_perfil: "User.jpg",
      fecha_publicacion: "2025-06-02 18:10:00",
      nombre_categoria: "Manga",
      contenido: "El final fue inesperado 😭"
    }
  ]);

  return (
    <>
      <header>
        <nav className="navbar fixed-top">
          <div className="container">
            <a href="#" className="logo">
              <img src="/Icono.png" alt="Logo" className="logo-icon" />
            </a>

            <div className="search-box">
              <form>
                <input type="text" placeholder="Buscar..." />
                <button type="submit">Buscar</button>
              </form>
            </div>

            <ul className="nav-links">
              <li><a href="#">Busqueda Avanzada</a></li>
              <li><a href="#">Inicio</a></li>
              <li><a href="#">Login</a></li>
              <li><a href="#">Perfil</a></li>
              <li><a href="#">Publicar</a></li>
            </ul>
          </div>
        </nav>
      </header>

      <main style={{ marginTop: "100px" }}>
        <section id="reviews">
          <div className="reviews-h">
            <h1>Reviews</h1>
            <span>Las opiniones más recientes de nuestros usuarios</span>
          </div>

          <div className="review-box-container">
            {publicaciones.length > 0 ? (
              publicaciones.map((pub) => (
                <div className="review-box" key={pub.ID_publicacion}>
                  <div className="user">
                    <div className="user-data">
                      <div className="user-img">
                        <img src={`/${pub.imagen_perfil}`} alt="Autor" />
                      </div>

                      <div className="name-user">
                        <strong>{pub.nombre_usuario}</strong>

                        <span>
                          Fecha de publicación:{" "}
                          {new Date(pub.fecha_publicacion).toLocaleString()}
                        </span>

                        <span>
                          Categoría: {pub.nombre_categoria}
                        </span>
                      </div>
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
              ))
            ) : (
              <p>No hay publicaciones todavía.</p>
            )}
          </div>
        </section>
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

export default Dashboard;