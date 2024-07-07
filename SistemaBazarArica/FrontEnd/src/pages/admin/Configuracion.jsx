import { FormConfiguracionCuenta } from "../../components/admin/configuracion/FormConfiguracionCuenta";
import "./stylepages.css";
import GradualSpacing from "../../components/shared/magic_ui/GradualSpacing";
export const Configuracion = () => {
  return (
    <section className="container-fluid">
      <div className="d-flex align-items-center justify-content-left gap-3  pt-2 titulo-page pb-2">
        <div
          style={{ fontSize: "35px" }}
          className="d-flex align-items-center p-0 m-0 ms-2"
        >
          <i class="bi bi-person-bounding-box"></i>
        </div>
        <GradualSpacing
          text="Configuracion de la Cuenta"
          className="m-0"
          type="h2"
        />
      </div>
      <FormConfiguracionCuenta />
    </section>
  );
};
