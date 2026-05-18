import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Registro.css";

function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    fecha_nacimiento: "",
    correo_electronico: "",
    nombre_usuario: "",
    contrasena: "",
    confirmar_contrasena: ""
  });

  const [imagen, setImagen] = useState(null);
  const [mensajeError, setMensajeError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensajeError("");

    if (form.contrasena !== form.confirmar_contrasena) {
      setMensajeError("Las contraseñas no coinciden.");
      return;
    }

    const formData = new FormData();

    for (let key in form) {
      formData.append(key, form[key]);
    }

    if (imagen) {
      formData.append("imagen_perfil", imagen);
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/usuarios/registro",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (data.success) {
        navigate("/login");
      } else {
        setMensajeError(data.message);
      }

    } catch (error) {
      setMensajeError("Error al registrar usuario.");
    }
  };

  const hoy = new Date().toISOString().split("T")[0];

  return (
    <>
      <h1 className="bienvenido">Bienvenido</h1>

      {mensajeError && (
        <div className="alerta error">
          {mensajeError}
        </div>
      )}

      <div className="container">
        <div className="registro">
          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="nombre"
              placeholder="Nombre(s)"
              required
              pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
              value={form.nombre}
              onChange={handleChange}
            />

            <input
              type="text"
              name="apellidos"
              placeholder="Apellidos"
              required
              pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
              value={form.apellidos}
              onChange={handleChange}
            />

            <input
              type="date"
              name="fecha_nacimiento"
              required
              max={hoy}
              value={form.fecha_nacimiento}
              onChange={handleChange}
            />

            <input
              type="email"
              name="correo_electronico"
              placeholder="Correo electrónico"
              required
              value={form.correo_electronico}
              onChange={handleChange}
            />

            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => {
                const archivo = e.target.files[0];

                if (archivo) {
                  setImagen(archivo);
                }
              }}
            />

            {imagen && (
              <div className="preview-imagen">
                <img
                  src={URL.createObjectURL(imagen)}
                  alt="Previsualización"
                />
              </div>
            )}

            <input
              type="text"
              name="nombre_usuario"
              placeholder="Nombre de usuario"
              required
              value={form.nombre_usuario}
              onChange={handleChange}
            />

            <input
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              required
              pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}"
              title="Mínimo 8 caracteres, con mayúscula, minúscula, número y símbolo."
              value={form.contrasena}
              onChange={handleChange}
            />

            <input
              type="password"
              name="confirmar_contrasena"
              placeholder="Confirmar contraseña"
              required
              value={form.confirmar_contrasena}
              onChange={handleChange}
            />

            <button type="submit">
              Crear Usuario
            </button>
          </form>
        </div>

        <div className="imagen">
          <img src="/Icono.png" alt="Logo" />
        </div>
      </div>

      <div className="login">
        <p>
          ¿Ya posees cuenta?{" "}
          <span
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </span>
        </p>
      </div>

      <footer>
        © 2025 AnimaReview. Desarrollo Felix Dauajare Ramirez
      </footer>
    </>
  );
}

export default Registro;