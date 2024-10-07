import { Suspense, lazy } from "react";
import { lazyLoad } from "../../utils/lazyLoad.js";
import Skeleton from "../../components/skeletons/Skeleton.jsx";
import SkeletonText from "../../components/skeletons/SkeletonText.jsx";

const TablaUsuariosContenedor = lazyLoad(
  "../components/admin/usuarios/TablaUsuariosContenedor",
  "TablaUsuariosContenedor"
);

const GradualSpacing = lazy(() => import("../../components/shared/magic_ui/GradualSpacing.jsx"));

import "./stylepages.css";
export const Usuarios = () => {
  return (
    <section className="container-fluid">
      <div className="d-flex align-items-center justify-content-left gap-3  pt-1 pb-1 titulo-page">
        <Suspense fallback={<h2>Gestionar Usuarios</h2>}>
          <div
            style={{ fontSize: "35px" }}
            className="d-flex align-items-center p-0 m-0 ms-2"
          >
            <i class="bi bi-people-fill"></i>
          </div>
          <GradualSpacing text="Gestionar Usuarios" className="m-0" type="h2" />
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
        <TablaUsuariosContenedor />
      </Suspense>
    </section>
  );
};
