import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CrearPublicacion.css";

function CrearPublicacion() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // Cargar categorías desde backend
  useEffect(() => {
    fetch("http://localhost/MIGRACION/backend/categorias.php")
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(err => console.error("Error cargando categorías:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !contenido || !categoria) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/MIGRACION/backend/crearPublicacion.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo,
            contenido,
            id_categoria: categoria
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        navigate("/dashboard");
      } else {
        setMensaje(data.message);
      }

    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al publicar.");
    }
  };

  return (
    <div className="publi-container">
      <div className="user-review">

        {mensaje && <div className="alerta">{mensaje}</div>}

        <form onSubmit={handleSubmit}>

          <div className="field-group">
            <label>Título de la publicación:</label>
            <input
              type="text"
              placeholder="Escribe el título de tu reseña"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <textarea
            placeholder="Escribe tu opinión aquí"
            rows="6"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
          ></textarea>

          <div className="category-select">
            <label>Elige una categoría:</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">-- Selecciona una categoría --</option>
              {categorias.map(cat => (
                <option key={cat.ID_categorias} value={cat.ID_categorias}>
                  {cat.nombre_categoria}
                </option>
              ))}
            </select>
          </div>

          <button className="publish-button" type="submit">
            Publicar
          </button>

        </form>
      </div>
    </div>
  );
}

export default CrearPublicacion;