import { Suspense, lazy } from "react";
import { lazyLoad } from "../../utils/lazyLoad";
import Skeleton from "../../components/skeletons/Skeleton";
import SkeletonText from "../../components/skeletons/SkeletonText";

const GradualSpacing = lazy(() => import("../../components/shared/magic_ui/GradualSpacing.jsx"));
const ListaSeccionesContenedor = lazyLoad("../components/admin/secciones/ListaSeccionesContenedor", "ListaSeccionesContenedor");

import "./stylepages.css";
export const Secciones = () => {
  return (
    <section className="container-fluid">
      <div className="d-flex align-items-center justify-content-left gap-3  pt-1 pb-1 titulo-page">
        <Suspense fallback={<h2>Secciones Registradas</h2>}>
          <div
            style={{ fontSize: "35px" }}
            className="d-flex align-items-center p-0 m-0 ms-2"
          >
            <i className="bi bi-layers-fill"></i>
          </div>
          <GradualSpacing
            text="Secciones Registradas"
            className="m-0"
            type="h2"
          />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <>
            <SkeletonText lines={2} gap="8px" />
            <Skeleton height="500px" width="100%" />
          </>
        }
      >
        <ListaSeccionesContenedor />
      </Suspense>
    </section>
  );
};
