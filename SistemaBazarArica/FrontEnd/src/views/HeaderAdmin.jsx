import { useContext } from "react";
import { toast } from "react-hot-toast";
import { LoginContext } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";
import "./views.css";
export const HeaderAdmin = () => {
  const {
    cerrarSesion
  } = useContext(LoginContext);
  const navigate = useNavigate();

  const cerrarSesionActual = async () => {
    const { success, message } = await cerrarSesion();

    if (success) {
      toast.success(message);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } else {
      // haún si hay un error, redirige al login para evitar que el usuario quede en un estado no deseado
      navigate("/login");
      toast.error(message ?? "Ha ocurrido un error inesperado al cerrar sesión actual ");
    }
  };
  return (
    <header className="tamaño-header">
      <nav className="navbar fixed-top nav" style={{ width: "100%" }}>
        <div className="container-fluid ps-3 align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2 text-nav">
            <i className="bi bi-grid-3x3-gap-fill"></i>
            <h3 className="m-0 ps-2">Panel de Administrador</h3>
          </div>
          <div className="d-flex">
            <div className="d-flex align-items-center text-sesion">
              <i className="bi bi-box-arrow-left"></i>
              <button onClick={cerrarSesionActual} className="btn link ">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
