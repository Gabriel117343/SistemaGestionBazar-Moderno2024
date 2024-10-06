import { Suspense, lazy } from "react";
import { lazyLoad } from "../../utils/lazyLoad.js";
import LoadingOverlay from "../../views/LoadingOverlay.jsx";

const Carrito = lazyLoad("../components/admin/puntoVenta/Carrito", "Carrito");
const PuntoVentaContainer = lazyLoad(
  "../components/admin/puntoVenta/PuntoVentaContainer.jsx",
  "PuntoVentaContainer"
);

const GradualSpacing = lazy(() => import("../../components/shared/magic_ui/GradualSpacing.jsx"));

import "./stylepages.css";

export const PuntoVenta = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-left gap-3 pt-2 titulo-page pb-2">

          { /* Mientras se carga el icon y el GradualSpacing se mostrar el h2 */}
          <Suspense fallback={<h2>Realizar Ventas</h2>}>
            <div
              style={{ fontSize: "30px" }}
              className="d-flex align-items-center p-0 m-0 ms-2"
            >
              <i className="bi bi-shop"></i>
            </div>
            <GradualSpacing text="Realizar Ventas" className="m-0" type="h2" />
          </Suspense>
        
        </div>
      </div>
      <section className="d-flex row contenedor-puntoventa">
        <Suspense fallback={<LoadingOverlay />}>
          <Carrito />
          <PuntoVentaContainer />
        </Suspense>
      </section>
      x
    </>
  );
};
