import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login.css";

function Login() {
  const navigate = useNavigate();

  const [nombre_usuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre_usuario || !contrasena) {
      setMensaje("Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/usuarios/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nombre_usuario,
            contrasena
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        navigate("/");
      } else {
        setMensaje(data.message);
      }

    } catch (error) {
      setMensaje("Error al conectar con el servidor.");
    }
  };

  return (
  <div className="login-page">
    <div className="login-container">
      <div id="divLogin">
        <form id="formLogin" onSubmit={handleSubmit}>
          <h1>
            <span className="anima">Anima</span>
            <span className="review">Review</span>
          </h1>

          <h2>Inicio de sesión</h2>

          {mensaje && (
            <p style={{ color: "red" }}>
              {mensaje}
            </p>
          )}

          <div className="input-box">
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={nombre_usuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn">
            Ingresar
          </button>

          <div className="link-registro">
            <p>
              ¿No tienes cuenta?{" "}
              <span
                style={{ cursor: "pointer", color: "#00f" }}
                onClick={() => navigate("/registro")}
              >
                Regístrate
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>

    <footer>
      © 2025 AnimaReview. Desarrollo Felix Dauajare Ramirez
    </footer>
  </div>
);
}

export default Login;