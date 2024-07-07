import { useState, useId, useContext, useRef } from "react";
import "./loginPage.css";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../context/LoginContext";
import { CargaDePagina } from "../views/CargaDePagina";
import Swal from "sweetalert2";
import LOGIN_ERRORS from "../context/error_messages/LOGIN_ERRORS"

export const Login = () => {
  const { iniciarSesion } = useContext(LoginContext);
  const [btnisDisabled, setBtnisDisabled] = useState(false);
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const idFormLogin = useId(); // id para el form de login

  const formLoginRef = useRef(); // referencia al form de login
  const [isLoading, setIsLoading] = useState(false); // estado de carga de la pagina

  const navigate = useNavigate();

  const limpiarFormularioYReactivarBoton = () => {
    formLoginRef.current.reset();
    setBtnisDisabled(false);
  };
  const mostrarError = (tipo, mensaje) => {
    // Se muestra un mensaje de error dependiendo del tipo de error
    Swal.fire({
      icon: LOGIN_ERRORS[tipo]?.icono,
      title: LOGIN_ERRORS[tipo]?.titulo,
      text: mensaje ?? LOGIN_ERRORS.defaultErrorMessage,
      confirmButtonText: "Ok",
      confirmButtonColor: "#3085d6",
    });
  }
  const enviarFormLogin = async (event) => {
    event.preventDefault();
    setBtnisDisabled(true);
    const usuario = Object.fromEntries(new FormData(event.target));
    toast.loading("Cargando...", { id: "loading" });

    const { success, message, tipo, rol } = await iniciarSesion(usuario);

    if (success) {
      setIsLoading(true);
      setBtnisDisabled(false);
      toast.success(message, { id: "loading" });
      setTimeout(() => {
        if (rol === "administrador") {
          navigate("/admin/dashboard");
        } else if (rol === "vendedor") {
          navigate("/vendedor");
        }
        setIsLoading(false);
      }, 1500);
    } else  {
      toast.dismiss("loading");
      limpiarFormularioYReactivarBoton();
      mostrarError(tipo, message);
    }
  };

  // Activa o desactivar la visualizacion de la contraseña atravez del estado anterior
  const estadoContraseña = () => {
    setMostrarContraseña((prevState) => !prevState);
  };
  if (isLoading) {
    return <CargaDePagina />;
  } 

  return (
    <section className="gradient-custom">
      <div className="container py-5" style={{ height: "110vh" }}>
        <div className="row d-flex justify-content-center align-items-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card bg-dark text-white efecto-login"
              style={{ borderRadius: "1rem" }}
            >
              <div className="card-body px-4 pb-4 text-center">
                <div>
                  <h2 className="fw-bold mb-2 text-uppercase">Login</h2>

                  <div className="mb-3">
                    <img
                      style={{ width: "100%" }}
                      src="../public/images/login-imagen.png"
                      alt=""
                    />
                  </div>
                  <p className="text-white-50 pt-2">Porfavor inicia sesion!</p>

                  <form
                    onSubmit={enviarFormLogin}
                    id={idFormLogin}
                    ref={formLoginRef}
                  >
                    <div className="form-outline form-white mb-4">
                      <input
                        type="email"
                        id={`${idFormLogin}-email`}
                        className="form-control form-control-lg"
                        placeholder="Email"
                        name="email"
                      />
                    </div>
                    <div className="form form-white mb-4 contraseña-container">
                      <input
                        id={`${idFormLogin}-password`}
                        className="form-control form-control-lg"
                        placeholder="Password"
                        name="password"
                        type={mostrarContraseña ? "text" : "password"}
                      />
                      <span className="icon">
                        <FontAwesomeIcon
                          style={{ width: "25px", height: "25px" }}
                          icon={mostrarContraseña ? faEyeSlash : faEye}
                          onClick={estadoContraseña}
                        />
                      </span>
                    </div>
                    <p className="small mb-3 pb-lg-2">
                      <Link to="/form-envio-correo" className="text-white-50">
                        Olvidaste tu contraseña?
                      </Link>
                    </p>

                    <button
                      type="submit"
                      className="btn form-control btn-outline-light btn-lg px-5 mb-3"
                      disabled={btnisDisabled}
                    >
                      Login
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
