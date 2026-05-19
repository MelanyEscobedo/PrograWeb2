import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../assets/Navbar";
import "../Perfil.css";

function Perfil() {
  const navigate = useNavigate();
  const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));

  const [usuario, setUsuario] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [editando, setEditando] = useState(false);
  const [editandoPub, setEditandoPub] = useState(null);

  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [imagen, setImagen] = useState(null);

  const [tituloEdit, setTituloEdit] = useState("");
  const [descripcionEdit, setDescripcionEdit] = useState("");
  const [calificacionEdit, setCalificacionEdit] = useState("");

  const getImageUrl = (ruta, fallback = "/User.jpg") => {
    if (!ruta) return fallback;
    if (ruta.startsWith("http")) return ruta;
    if (ruta.startsWith("/uploads")) return `http://localhost:5000${ruta}`;
    if (ruta.startsWith("uploads")) return `http://localhost:5000/${ruta}`;
    return `/${ruta}`;
  };

  useEffect(() => {
    if (!usuarioLocal) {
      navigate("/login");
      return;
    }

    cargarDatos();
    cargarPublicaciones();
  }, []);

  const cargarDatos = async () => {
    const res = await fetch(`http://localhost:5000/api/usuarios/${usuarioLocal._id}`);
    const data = await res.json();

    setUsuario(data);
    setFechaNacimiento(data.fecha_nacimiento?.substring(0, 10) || "");
    setNombre(data.nombre || "");
    setApellidos(data.apellidos || "");
  };

  const cargarPublicaciones = async () => {
    const res = await fetch(`http://localhost:5000/api/publicaciones?user=${usuarioLocal._id}`);
    const data = await res.json();
    setPublicaciones(data);
  };

  const actualizarPerfil = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("nombre", nombre);
    formData.append("apellidos", apellidos);
    formData.append("fecha_nacimiento", fechaNacimiento);

    if (contrasena) {
      formData.append("contrasena", contrasena);
    }

    if (imagen) {
      formData.append("imagen_perfil", imagen);
    }

    const res = await fetch(`http://localhost:5000/api/usuarios/${usuarioLocal._id}`, {
      method: "PUT",
      body: formData
    });

    const data = await res.json();

      if (data.success) {
    localStorage.setItem("usuario", JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    setNombre(data.usuario.nombre || "");
    setApellidos(data.usuario.apellidos || "");
    setEditando(false);
    setContrasena("");
    setImagen(null);
  }
};

  const abrirEditarPublicacion = (pub) => {
    setEditandoPub(pub._id);
    setTituloEdit(pub.titulo);
    setDescripcionEdit(pub.descripcion);
    setCalificacionEdit(pub.calificacion);
  };

  const guardarPublicacion = async (id) => {
    const res = await fetch(`http://localhost:5000/api/publicaciones/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        titulo: tituloEdit,
        descripcion: descripcionEdit,
        calificacion: Number(calificacionEdit)
      })
    });

    const data = await res.json();

    if (data.success) {
      setEditandoPub(null);
      cargarPublicaciones();
    }
  };

  const eliminarPublicacion = async (id) => {
    const confirmar = confirm("¿Seguro que quieres eliminar esta reseña?");

    if (!confirmar) return;

    const res = await fetch(`http://localhost:5000/api/publicaciones/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();

    if (data.success) {
      cargarPublicaciones();
    }
  };

  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <div className="perfil-page">
      <Navbar />

      <main className="perfil-main">
        <section className="perfil-card">
          <img
            src={getImageUrl(usuario.imagen_perfil)}
            alt="Foto de perfil"
            className="perfil-img"
          />

          <h2>{usuario.nombre_usuario}</h2>

          <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellidos}</p>
          <p><strong>Correo:</strong> {usuario.correo_electronico}</p>
          <p><strong>Fecha nacimiento:</strong> {fechaNacimiento || "No disponible"}</p>

          {!editando ? (
            <button className="btn-editar" onClick={() => setEditando(true)}>
              Editar perfil
            </button>
          ) : (
            <form className="perfil-form" onSubmit={actualizarPerfil}>
              <label>Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />

              <label>Apellidos:</label>
              <input
                type="text"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
              />
              <label>Fecha de nacimiento:</label>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
              />

              <label>Foto de perfil:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImagen(e.target.files[0])}
              />

              <label>Nueva contraseña:</label>
              <input
                type="password"
                placeholder="Dejar vacío para no cambiar"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />

              <button type="submit" className="btn-editar">
                Guardar
              </button>

              <button
                type="button"
                className="btn-cancelar"
                onClick={() => setEditando(false)}
              >
                Cancelar
              </button>
            </form>
          )}
        </section>

        <section className="perfil-reviews">
          <h2>Mis reseñas</h2>

          {publicaciones.length > 0 ? (
            publicaciones.map((pub) => (
              <div className="perfil-review-card" key={pub._id}>
                <img
                  src={getImageUrl(pub.pelicula?.poster)}
                  alt={pub.pelicula?.titulo}
                />

                {editandoPub === pub._id ? (
                  <div className="edit-review-form">
                    <input
                      type="text"
                      value={tituloEdit}
                      onChange={(e) => setTituloEdit(e.target.value)}
                    />

                    <textarea
                      value={descripcionEdit}
                      onChange={(e) => setDescripcionEdit(e.target.value)}
                    />

                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={calificacionEdit}
                      onChange={(e) => setCalificacionEdit(e.target.value)}
                    />

                    <button onClick={() => guardarPublicacion(pub._id)}>
                      Guardar
                    </button>

                    <button onClick={() => setEditandoPub(null)}>
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="review-info">
                    <h3>{pub.titulo}</h3>
                    <h4>{pub.pelicula?.titulo}</h4>
                    <p>{pub.descripcion}</p>
                    <p><strong>Calificación película:</strong> {pub.calificacion}/10</p>

                    <div className="review-actions">
                      <button onClick={() => abrirEditarPublicacion(pub)}>
                        Editar
                      </button>

                      <button
                        className="btn-eliminar"
                        onClick={() => eliminarPublicacion(pub._id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No has publicado reseñas todavía.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default Perfil;