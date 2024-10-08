import { Suspense, lazy } from "react";
import { lazyLoad } from "../../utils/lazyLoad";
import Skeleton from "../../components/skeletons/Skeleton";
import SkeletonText from "../../components/skeletons/SkeletonText";
const GradualSpacing = lazy(
  () => import("../../components/shared/magic_ui/GradualSpacing.jsx")
);
const ProductosContenedor = lazyLoad(
  "../components/admin/productos/ProductosContenedor",
  "ProductosContenedor"
);

import "./stylepages.css";
export const Productos = () => {
  return (
    <section className="container-fluid">
      <div className="d-flex align-items-center justify-content-left gap-3  pt-2 pb-0 titulo-page">
        <div
          style={{ fontSize: "35px" }}
          className="d-flex align-items-center p-0 m-0 ms-2"
        >
          <i class="bi bi-boxes"></i>
        </div>
        <Suspense fallback={<h2>Agregar Productos</h2>}>
          <GradualSpacing text="Agregar Productos" className="m-0" type="h2" />
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
        <ProductosContenedor />
      </Suspense>
    </section>
  );
};
