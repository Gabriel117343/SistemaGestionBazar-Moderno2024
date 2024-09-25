import { Carrito } from "../../components/admin/puntoVenta/Carrito";
import { PuntoVentaContainer } from "../..//components/admin/puntoVenta/PuntoVentaContainer";
import GradualSpacing from "../../components/shared/magic_ui/GradualSpacing";
import "./stylepages.css";
export const PuntoVenta = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-left gap-3 pt-2 titulo-page pb-2">
          <div
            style={{ fontSize: "30px" }}
            className="d-flex align-items-center p-0 m-0 ms-2"
          >
            <i className="bi bi-shop"></i>
          </div>
          <GradualSpacing text="Realizar Ventas" className="m-0" type="h2" />
        </div>
      </div>
      <section className="d-flex row contenedor-puntoventa">
        <Carrito />
        <PuntoVentaContainer />
      </section>
    </>
  );
};
