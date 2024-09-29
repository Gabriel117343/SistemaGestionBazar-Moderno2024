import { useContext, useState } from "react";
import { LoginContext } from "../context/LoginContext";
export const HerramientaDesarrollo = () => {
  const {
    stateLogin: { isAuth, usuario },
  } = useContext(LoginContext);
  const [hidde, setHidde] = useState(false);

  const hiddeTol = () => {
    console.log('hidde')
    setHidde(prev => !prev);
  }
  const clase = hidde ? "d-none" : "d-block";
  return (
    <footer className="container">

      <section className={`d-flex justify-content-center ${clase}`} onClick={hiddeTol}>
        {usuario && isAuth ? (
          <section
            style={{
              width: "min-content",
              padding: "0 10px 0 10px",
              margin: "0 auto",
              borderRadius: "30px",
              maxHeight: "30px",
            }}
            className="d-flex gap-2 text-white justify-content-center aligns-items-center bg-success fixed-bottom"
          >
            <strong className="text-">Nombre:</strong>
            <p>{usuario.nombre}</p>

            <strong>Rol:</strong>
            <p>{usuario.rol}</p>
            <strong>Jornada:</strong>
            <p>{usuario.jornada}</p>
            <strong>Logeado:</strong>
            <p>{isAuth.toString()}</p>
          </section>
        ) : (
          <section
            style={{
              width: "50%",
              margin: "0 auto",
              borderRadius: "30px",
              maxHeight: "30px",
            }}
            className="container bg-warning fixed-bottom"
          >
            <div className="text-center">
              <strong className="text-danger">No hay usuario logeado</strong>
            </div>
          </section>
        )}
      </section>
    </footer>
  );
};
