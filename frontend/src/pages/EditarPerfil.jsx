import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../EditarPerfil.css";

function EditarPerfil() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    fecha_nacimiento: "",
    nombre_usuario: "",
    contrasena: "",
    imagen_perfil: ""
  });

  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // 🔹 Cargar datos del usuario
  useEffect(() => {
    fetch("http://localhost/MIGRACION/backend/obtenerPerfil.php", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          navigate("/login");
        } else {
          setUser(data);
        }
      })
      .catch(err => console.error(err));
  }, [navigate]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    for (let key in user) {
      formData.append(key, user[key]);
    }

    if (imagen) {
      formData.append("imagen_perfil", imagen);
    }

    try {
      const response = await fetch(
        "http://localhost/MIGRACION/backend/actualizarPerfil.php",
        {
          method: "POST",
          body: formData,
          credentials: "include"
        }
      );

      const data = await response.json();

      if (data.success) {
        setMensaje("Perfil actualizado correctamente.");
      } else {
        setMensaje(data.message);
      }

    } catch (error) {
      setMensaje("Error al actualizar perfil.");
    }
  };

  return (
    <div className="divPerfil">
      <form
        onSubmit={handleSubmit}
        className="row col-8 border rounded mx-auto mt-5 p-3 shadow"
      >
        <div className="col-4">
          <img
            src={
              user.imagen_perfil
                ? `http://localhost/MIGRACION/backend/uploads/${user.imagen_perfil}`
                : "/User.jpg"
            }
            alt="Foto de perfil"
            className="img-fluid rounded"
          />

          <div className="mb-3 mt-3">
            <label>Elige una nueva foto:</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setImagen(e.target.files[0])}
            />
          </div>
        </div>

        <div className="col-8">

          {mensaje && (
            <div className="alert alert-info">
              {mensaje}
            </div>
          )}

          <table className="table table-striped">
            <tbody>
              <tr>
                <th>Nombre(s):</th>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={user.nombre}
                    onChange={handleChange}
                  />
                </td>
              </tr>

              <tr>
                <th>Apellidos:</th>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="apellidos"
                    value={user.apellidos}
                    onChange={handleChange}
                  />
                </td>
              </tr>

              <tr>
                <th>Correo:</th>
                <td>
                  <input
                    type="email"
                    className="form-control"
                    name="correo"
                    value={user.correo}
                    onChange={handleChange}
                  />
                </td>
              </tr>

              <tr>
                <th>Fecha nacimiento:</th>
                <td>
                  <input
                    type="date"
                    className="form-control"
                    name="fecha_nacimiento"
                    value={user.fecha_nacimiento}
                    onChange={handleChange}
                  />
                </td>
              </tr>

              <tr>
                <th>Usuario:</th>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre_usuario"
                    value={user.nombre_usuario}
                    onChange={handleChange}
                  />
                </td>
              </tr>

              <tr>
                <th>Contraseña:</th>
                <td>
                  <input
                    type="password"
                    className="form-control"
                    name="contrasena"
                    placeholder="Deja en blanco para no cambiarla"
                    onChange={handleChange}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="p-2">
            <button className="btn-custom" type="submit">
              Guardar cambios
            </button>

            <button
              type="button"
              className="btn-custom btn-volver"
              onClick={() => navigate("/perfil")}
            >
              Regresar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditarPerfil;