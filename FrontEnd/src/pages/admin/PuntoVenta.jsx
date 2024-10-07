import { Suspense, lazy } from "react";
import { lazyLoad } from "../../utils/lazyLoad.js";

import Skeleton from "../../components/skeletons/Skeleton.jsx";
import SkeletonText from "../../components/skeletons/SkeletonText.jsx";

const Carrito = lazyLoad("../components/admin/puntoVenta/Carrito", "Carrito");
const PuntoVentaContainer = lazyLoad(
  "../components/admin/puntoVenta/PuntoVentaContainer.jsx",
  "PuntoVentaContainer"
);

const GradualSpacing = lazy(
  () => import("../../components/shared/magic_ui/GradualSpacing.jsx")
);

import "./stylepages.css";
import SkeletonCircle from "../../components/skeletons/SkeletonCircle.jsx";

export const PuntoVenta = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-left gap-3 pt-2 titulo-page pb-2">
          {/* Mientras se carga el icon y el GradualSpacing se mostrar el h2 */}
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
        {/* Si un componente carga antes se mostrara inmediatamente */}

        <div className="col-md-4">
          <Suspense fallback={<><Skeleton height="200px" width="100%" /><SkeletonCircle size="50px"/></>}>
            <Carrito />
          </Suspense>
        </div>
        <div className="col-md-8">
          <Suspense
            fallback={
              <>
                <SkeletonText lines={2} gap="8px" />
                <Skeleton height="400px" width="100%" />
              </>
            }
          >
            <PuntoVentaContainer />
          </Suspense>
        </div>
      </section>
    </>
  );
};
