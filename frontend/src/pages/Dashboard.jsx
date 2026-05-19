import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../Dashboard.css";
import Navbar from "../assets/Navbar";

function Dashboard() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const [publicaciones, setPublicaciones] = useState([]);
  const [orden, setOrden] = useState("recientes");
  const [categoria, setCategoria] = useState("Todas");
  const [paginaActual, setPaginaActual] = useState(1);

  const publicacionesPorPagina = 6;

  const categorias = [
    "Todas",
    "Animacion 2D",
    "Animacion 3D",
    "Stop Motion",
    "Live Action",
    "Otro"
  ];

  const getImageUrl = (ruta, fallback = "/User.jpg") => {
    if (!ruta) return fallback;
    if (ruta.startsWith("http")) return ruta;
    if (ruta.startsWith("/uploads")) return `http://localhost:5000${ruta}`;
    if (ruta.startsWith("uploads")) return `http://localhost:5000/${ruta}`;
    return `/${ruta}`;
  };

  const cargarPublicaciones = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/publicaciones?orden=${orden}`
      );

      const data = await res.json();
      setPublicaciones(data);
    } catch (error) {
      console.error("Error cargando publicaciones:", error);
    }
  };

  useEffect(() => {
    cargarPublicaciones();
  }, [orden]);

  useEffect(() => {
    setPaginaActual(1);
  }, [categoria, orden]);

  const publicacionesFiltradas =
    categoria === "Todas"
      ? publicaciones
      : publicaciones.filter(
          (pub) => pub.pelicula?.categoria === categoria
        );

  const totalPaginas = Math.ceil(
    publicacionesFiltradas.length / publicacionesPorPagina
  );

  const indiceInicio = (paginaActual - 1) * publicacionesPorPagina;
  const indiceFinal = indiceInicio + publicacionesPorPagina;

  const publicacionesPagina = publicacionesFiltradas.slice(
    indiceInicio,
    indiceFinal
  );

  const valorarPublicacion = async (idPublicacion, valor) => {
    if (!usuario) {
      alert("Debes iniciar sesión para valorar.");
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/publicaciones/${idPublicacion}/valorar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario: usuario._id,
          valor
        })
      }
    );

    const data = await res.json();

    if (!data.success) {
      alert(data.message || "No se pudo valorar.");
      return;
    }

    cargarPublicaciones();
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        <section id="reviews">
          <div className="reviews-h">
            <h1>Reviews</h1>
            <span>Las opiniones más recientes de nuestros usuarios</span>

            <div className="filters">
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
              >
                <option value="recientes">Más recientes</option>
                <option value="mejorValoradas">Mejor valoradas</option>
              </select>

              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="review-box-container">
            {publicacionesPagina.length > 0 ? (
              publicacionesPagina.map((pub) => (
                <div className="review-box" key={pub._id}>
                  <div className="movie-poster">
                    <img
                      src={getImageUrl(pub.pelicula?.poster, "/User.jpg")}
                      alt={pub.pelicula?.titulo}
                    />
                  </div>

                  <div className="user">
                    <div className="user-data">
                      <div className="user-img">
                        <img
                          src={getImageUrl(pub.usuario?.imagen_perfil)}
                          alt="Autor"
                        />
                      </div>

                      <div className="name-user">
                        <strong>{pub.usuario?.nombre_usuario}</strong>
                        <span>
                          {new Date(pub.fechaPublicacion).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="user-review">
                    <h2>{pub.titulo}</h2>
                    <h3>{pub.pelicula?.titulo}</h3>

                    <p className="categoria-pelicula">
                      {pub.pelicula?.categoria || "Sin categoría"}
                    </p>

                    <p>{pub.descripcion}</p>

                    <p>
                      Valoración de la película:{" "}
                      <strong>{pub.calificacion}/10</strong>
                    </p>

                    <p>
                      Promedio de la reseña:{" "}
                      <strong>{pub.promedioDecimal.toFixed(1)}/10</strong>
                    </p>

                    <div className="stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => valorarPublicacion(pub._id, star)}
                        >
                          ★
                        </button>
                      ))}
                    </div>

                    <Link className="comment-button" to={`/publicacion/${pub._id}`}>
                      Comentar
                    </Link>

                    <small>{pub.totalValoraciones} valoraciones</small>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay publicaciones en esta categoría.</p>
            )}
          </div>

          {totalPaginas > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPaginas }, (_, index) => (
                <button
                  key={index + 1}
                  className={
                    paginaActual === index + 1
                      ? "page-link active"
                      : "page-link"
                  }
                  onClick={() => setPaginaActual(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="dashboard-footer">
      <div className="container">
        <p>© 2025 AnimaReview.</p>
        <p>
          Desarrollado por Felix Dauajare Ramirez, Melany Paola Escobedo
          Castillo y Juan Diego Torres Martinez
        </p>
      </div>
    </footer>
    </div>
  );
}

export default Dashboard;