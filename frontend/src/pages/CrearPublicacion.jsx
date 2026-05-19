import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CrearPublicacion.css";
import Navbar from "../assets/Navbar";

function CrearPublicacion() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const [titulo, setTitulo] = useState("");
  const [pelicula, setPelicula] = useState("");
  const [peliculas, setPeliculas] = useState([]);
  const [posterPreview, setPosterPreview] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [calificacion, setCalificacion] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevoTituloPelicula, setNuevoTituloPelicula] = useState("");
  const [nuevoPosterPelicula, setNuevoPosterPelicula] = useState("");
  const [archivoPoster, setArchivoPoster] = useState(null);
  const [nuevaCategoria, setNuevaCategoria] = useState("Animacion 2D");

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }

    cargarPeliculas();
  }, []);

  const cargarPeliculas = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/peliculas");
      const data = await res.json();
      setPeliculas(data);
    } catch (error) {
      console.error("Error cargando películas:", error);
    }
  };

  const seleccionarPelicula = (id) => {
    setPelicula(id);

    const peliSeleccionada = peliculas.find((p) => p._id === id);
    setPosterPreview(getImageUrl(peliSeleccionada?.poster));
  };

  const getImageUrl = (ruta, fallback = "") => {
    if (!ruta) return fallback;

    if (ruta.startsWith("blob:")) return ruta;

    if (ruta.startsWith("http")) return ruta;

    return `http://localhost:5000${ruta}`;
  };

  const guardarNuevaPelicula = async () => {
  if (!nuevoTituloPelicula) {
    alert("Escribe el título de la película.");
    return;
  }

  if (!archivoPoster) {
    alert("Selecciona un poster.");
    return;
  }

  try {

    const formData = new FormData();

    formData.append("titulo", nuevoTituloPelicula);
    formData.append("poster", archivoPoster);
    formData.append("usuario", usuario._id);
    formData.append("categoria", nuevaCategoria);

    const res = await fetch("http://localhost:5000/api/peliculas", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.success) {
      setPeliculas([...peliculas, data.pelicula]);

      setPelicula(data.pelicula._id);

      setPosterPreview(data.pelicula.poster);

      setNuevoTituloPelicula("");
      setNuevoPosterPelicula("");
      setArchivoPoster(null);

      setModalAbierto(false);

    } else {
      alert("No se pudo guardar la película.");
    }

  } catch (error) {
    console.error(error);
    alert("Error al guardar la película.");
  }
};

  const cancelarNuevaPelicula = () => {
    setNuevoTituloPelicula("");
    setNuevoPosterPelicula("");
    setModalAbierto(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !pelicula || !descripcion || calificacion === "") {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    const calificacionNumero = Number(calificacion);

    if (calificacionNumero < 0 || calificacionNumero > 10) {
      setMensaje("La valoración debe estar entre 0 y 10.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/publicaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          calificacion: calificacionNumero,
          usuario: usuario._id,
          pelicula,
          comentarios: []
        })
      });

      const data = await response.json();

      if (data.success) {
        navigate("/");
      } else {
        setMensaje(data.error || "No se pudo crear la publicación.");
      }

    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al publicar.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="crear-main">
        <div className="publi-container">
          <h1 className="form-title">Crear reseña</h1>

          {mensaje && <div className="alerta">{mensaje}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label>Título de la reseña:</label>
              <input
                type="text"
                placeholder="Ej. Excelente película"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label>Película:</label>

              <div className="movie-select-row">
                <select
                  value={pelicula}
                  onChange={(e) => seleccionarPelicula(e.target.value)}
                >
                  <option value="">-- Selecciona una película --</option>
                  {peliculas.map((peli) => (
                    <option key={peli._id} value={peli._id}>
                      {peli.titulo}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setModalAbierto(true)}
                >
                  Agregar nueva
                </button>
              </div>
            </div>

            {posterPreview && (
              <div className="poster-preview">
                <img src={posterPreview} alt="Poster seleccionado" />
              </div>
            )}

            <div className="field-group">
              <label>Descripción de la reseña:</label>
              <textarea
                placeholder="Escribe tu opinión aquí"
                rows="6"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            <div className="field-group">
              <label>Valoración de la película:</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="0 - 10"
                value={calificacion}
                onChange={(e) => setCalificacion(e.target.value)}
              />
            </div>

            <button className="publish-button" type="submit">
              Publicar
            </button>
          </form>
        </div>
      </main>

      {modalAbierto && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Agregar nueva película</h2>

            <label>Título:</label>
            <input
              type="text"
              placeholder="Título de la película"
              value={nuevoTituloPelicula}
              onChange={(e) => setNuevoTituloPelicula(e.target.value)}
            />

            <label>Poster:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];

                if (file) {
                  setArchivoPoster(file);

                  const preview = URL.createObjectURL(file);
                  setNuevoPosterPelicula(preview);
                }
              }}
            />

            {nuevoPosterPelicula && (
              <div className="poster-preview modal-preview">
                <img src={nuevoPosterPelicula} alt="Preview poster" />
              </div>
            )}

            <div className="field-group">
              <label>Categoría:</label>

              <select
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
              >
                <option value="Animacion 2D">Animación 2D</option>
                <option value="Animacion 3D">Animación 3D</option>
                <option value="Stop Motion">Stop Motion</option>
                <option value="Live Action">Live Action</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={cancelarNuevaPelicula}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="save-button"
                onClick={guardarNuevaPelicula}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CrearPublicacion;