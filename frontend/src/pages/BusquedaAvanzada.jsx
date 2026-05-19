import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../assets/Navbar";
import "../Dashboard.css";
import "../BusquedaAvanzada.css";

function BusquedaAvanzada() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [publicaciones, setPublicaciones] = useState([]);
  const [search, setSearch] = useState(query);
  const [orden, setOrden] = useState("fechaReciente");
  const [categoria, setCategoria] = useState("Todas");
  const [usuarioFiltro, setUsuarioFiltro] = useState("Todos");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  useEffect(() => {
    setSearch(query);
  }, [query]);

  useEffect(() => {
    cargarPublicaciones();
  }, []);

  const cargarPublicaciones = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/publicaciones");
      const data = await res.json();
      setPublicaciones(data);
    } catch (error) {
      console.error("Error cargando publicaciones:", error);
    }
  };

  const usuarios = useMemo(() => {
    const mapa = new Map();

    publicaciones.forEach((pub) => {
      if (pub.usuario?._id) {
        mapa.set(pub.usuario._id, pub.usuario.nombre_usuario);
      }
    });

    return Array.from(mapa, ([id, nombre]) => ({ id, nombre }));
  }, [publicaciones]);

  const resultados = useMemo(() => {
    let filtradas = [...publicaciones];

    if (search.trim()) {
      const texto = search.toLowerCase();

      filtradas = filtradas.filter((pub) =>
        pub.titulo?.toLowerCase().includes(texto) ||
        pub.descripcion?.toLowerCase().includes(texto) ||
        pub.pelicula?.titulo?.toLowerCase().includes(texto) ||
        pub.usuario?.nombre_usuario?.toLowerCase().includes(texto)
      );
    }

    if (categoria !== "Todas") {
      filtradas = filtradas.filter(
        (pub) => pub.pelicula?.categoria === categoria
      );
    }

    if (usuarioFiltro !== "Todos") {
      filtradas = filtradas.filter(
        (pub) => pub.usuario?._id === usuarioFiltro
      );
    }

    if (startDate) {
      filtradas = filtradas.filter(
        (pub) => new Date(pub.fechaPublicacion) >= new Date(startDate)
      );
    }

    if (endDate) {
      const fechaFinal = new Date(endDate);
      fechaFinal.setHours(23, 59, 59, 999);

      filtradas = filtradas.filter(
        (pub) => new Date(pub.fechaPublicacion) <= fechaFinal
      );
    }

    filtradas.sort((a, b) => {
      if (orden === "resenaMayor") {
        return (b.promedioDecimal || 0) - (a.promedioDecimal || 0);
      }

      if (orden === "resenaMenor") {
        return (a.promedioDecimal || 0) - (b.promedioDecimal || 0);
      }

      if (orden === "peliculaMayor") {
        return (b.calificacion || 0) - (a.calificacion || 0);
      }

      if (orden === "peliculaMenor") {
        return (a.calificacion || 0) - (b.calificacion || 0);
      }

      if (orden === "fechaAntigua") {
        return new Date(a.fechaPublicacion) - new Date(b.fechaPublicacion);
      }

      return new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion);
    });

    return filtradas;
  }, [publicaciones, search, orden, categoria, usuarioFiltro, startDate, endDate]);

  return (
    <div className="busqueda-page">
      <Navbar />

      <main className="busqueda-main">
        <section className="search-container">
          <h1>Búsqueda Avanzada</h1>

          <div className="search-form">
            <input
              type="text"
              placeholder="Buscar por reseña, película o usuario"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select value={orden} onChange={(e) => setOrden(e.target.value)}>
              <option value="fechaReciente">Fecha: más reciente</option>
              <option value="fechaAntigua">Fecha: más antigua</option>
              <option value="resenaMayor">Calificación reseña: mayor a menor</option>
              <option value="resenaMenor">Calificación reseña: menor a mayor</option>
              <option value="peliculaMayor">Calificación película: mayor a menor</option>
              <option value="peliculaMenor">Calificación película: menor a mayor</option>
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

            <select
              value={usuarioFiltro}
              onChange={(e) => setUsuarioFiltro(e.target.value)}
            >
              <option value="Todos">Todos los usuarios</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </section>

        <section className="results-container">
          <h2>Resultados: {resultados.length}</h2>

          {resultados.length > 0 ? (
            <div className="review-box-container">
              {resultados.map((pub) => (
                <div className="review-box" key={pub._id}>
                  <div className="movie-poster">
                    <img
                      src={getImageUrl(pub.pelicula?.poster)}
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
                      Valoración película: <strong>{pub.calificacion}/10</strong>
                    </p>

                    <p>
                      Promedio reseña:{" "}
                      <strong>{(pub.promedioDecimal || 0).toFixed(1)}/10</strong>
                    </p>

                    <Link className="comment-button" to={`/publicacion/${pub._id}`}>
                      Ver comentarios
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No se encontraron publicaciones con esos filtros.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default BusquedaAvanzada;