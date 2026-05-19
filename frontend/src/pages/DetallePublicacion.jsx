import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../assets/Navbar";
import "../DetallePublicacion.css";

function DetallePublicacion() {
  const { id } = useParams();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const [publicacion, setPublicacion] = useState(null);
  const [comentario, setComentario] = useState("");

  const getImageUrl = (ruta, fallback = "/User.jpg") => {
    if (!ruta) return fallback;
    if (ruta.startsWith("http")) return ruta;
    if (ruta.startsWith("/uploads")) return `http://localhost:5000${ruta}`;
    if (ruta.startsWith("uploads")) return `http://localhost:5000/${ruta}`;
    return `/${ruta}`;
  };

  const cargarPublicacion = async () => {
    const res = await fetch(`http://localhost:5000/api/publicaciones/${id}`);
    const data = await res.json();
    setPublicacion(data);
  };

  useEffect(() => {
    cargarPublicacion();
  }, [id]);

  const valorarPublicacion = async (valor) => {
    if (!usuario) {
      alert("Debes iniciar sesión para valorar.");
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/publicaciones/${id}/valorar`,
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

    if (data.success) {
      cargarPublicacion();
    }
  };

  const enviarComentario = async (e) => {
    e.preventDefault();

    if (!usuario) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }

    if (!comentario.trim()) {
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/publicaciones/${id}/comentar`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario: usuario._id,
          texto: comentario
        })
      }
    );

    const data = await res.json();

    if (data.success) {
      setComentario("");
      cargarPublicacion();
    }
  };

  if (!publicacion) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="detalle-page">
      <Navbar />

      <main className="detalle-main">
        <div className="detalle-card">
          <img
            className="detalle-poster"
            src={getImageUrl(publicacion.pelicula?.poster)}
            alt={publicacion.pelicula?.titulo}
          />

          <h1>{publicacion.titulo}</h1>
          <h2>{publicacion.pelicula?.titulo}</h2>

          <p className="categoria-pelicula">
            {publicacion.pelicula?.categoria}
          </p>

          <p>{publicacion.descripcion}</p>

          <p>
            Valoración de la película:{" "}
            <strong>{publicacion.calificacion}/10</strong>
          </p>

          <p>
            Promedio de la reseña:{" "}
            <strong>{publicacion.promedioDecimal.toFixed(1)}/10</strong>
          </p>

          <div className="stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => valorarPublicacion(star)}
              >
                ★
              </button>
            ))}
          </div>

          <small>{publicacion.totalValoraciones} valoraciones</small>
        </div>

        <div className="comentarios-card">
          <h2>Comentarios</h2>

            {usuario ? (
                <form onSubmit={enviarComentario} className="comentario-form">
                    <textarea
                        placeholder="Escribe un comentario..."
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                    />

                    <button type="submit">
                        Comentar
                    </button>
                </form>
            ) : (
                <div className="login-warning">
                    Debes iniciar sesión para comentar.
                </div>
            )}

            <div className="comentarios-lista">
                {publicacion.comentarios?.length > 0 ? (
                    publicacion.comentarios.map((com, index) => (
                        <div className="comentario" key={index}>
                            <div className="comentario-user">
                                <img
                                    src={getImageUrl(com.usuario?.imagen_perfil)}
                                    alt="Usuario"
                                />

                                <div>
                                    <strong>{com.usuario?.nombre_usuario}</strong>
                                    <span>{new Date(com.fecha).toLocaleString()}</span>
                                </div>
                            </div>
                            <p>{com.texto}</p>
                        </div>
                    ))
                ) : (
                    <p>No hay comentarios todavía.</p>
                )}
            </div>    
        </div>
      </main>
    </div>
  );
}

export default DetallePublicacion;