import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Perfil.css";

function Perfil() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [edad, setEdad] = useState(null);

  useEffect(() => {
    fetch("http://localhost/MIGRACION/backend/obtenerPerfil.php", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          navigate("/login");
        } else {
          setUsuario(data);

          // Calcular edad si hay fecha
          if (data.fecha_nacimiento) {
            const nacimiento = new Date(data.fecha_nacimiento);
            const hoy = new Date();
            let años = hoy.getFullYear() - nacimiento.getFullYear();
            const m = hoy.getMonth() - nacimiento.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
              años--;
            }
            setEdad(años);
          }
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  const cerrarSesion = async () => {
    await fetch("http://localhost/MIGRACION/backend/Logout.php", {
      credentials: "include"
    });
    navigate("/login");
  };

  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <div className="divPerfil">
      <div className="row col-8 border rounded mx-auto mt-5 p-3 shadow">
        
        <div className="col-4 text-center">
          <img
            src={
              usuario.imagen_perfil
                ? `http://localhost/MIGRACION/backend/uploads/${usuario.imagen_perfil}`
                : "/User.jpg"
            }
            alt="Foto de perfil"
            className="img-fluid rounded"
          />

          <button
            className="mx-auto m-2 btn-editar"
            onClick={() => navigate("/editar-perfil")}
          >
            Editar
          </button>

          <button
            className="mx-auto m-2 btn btn-sm btn-danger"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>
        </div>

        <div className="col-8">
          <table className="table table-striped">
            <tbody>
              <tr>
                <th>Nombre(s):</th>
                <td>{usuario.nombre}</td>
              </tr>
              <tr>
                <th>Apellidos:</th>
                <td>{usuario.apellidos}</td>
              </tr>
              <tr>
                <th>Correo electrónico:</th>
                <td>{usuario.correo_electronico}</td>
              </tr>
              <tr>
                <th>Fecha de nacimiento:</th>
                <td>{usuario.fecha_nacimiento}</td>
              </tr>
              <tr>
                <th>Edad:</th>
                <td>{edad !== null ? `${edad} años` : "No disponible"}</td>
              </tr>
              <tr>
                <th>Nombre de usuario:</th>
                <td>{usuario.nombre_usuario}</td>
              </tr>
              <tr>
                <th>Contraseña:</th>
                <td>***********</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default Perfil;